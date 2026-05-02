const { query } = require('../config/db');

// POST /parent-student/link — student sends a link REQUEST (pending until parent accepts)
exports.linkParent = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { parent_national_id } = req.body;
    if (!parent_national_id)
      return res.status(400).json({ error: 'parent_national_id required' });

    const { rows } = await query(
      `SELECT id, name, role FROM users WHERE national_id=$1 AND status='active'`,
      [parent_national_id.trim()]
    );
    if (!rows.length)
      return res.status(404).json({ error: 'No active user found with that ID number' });
    const parent = rows[0];
    if (parent.role !== 'guardian')
      return res.status(400).json({ error: 'That ID belongs to a non-guardian account' });

    // Get student name for notification
    const { rows: sRows } = await query('SELECT name FROM users WHERE id=$1', [studentId]);
    const studentName = sRows[0]?.name || 'A student';

    // Set pending link on student record
    await query(`UPDATE users SET pending_linked_parent_id=$1 WHERE id=$2`, [parent.id, studentId]);

    // Send link_request notification to parent with metadata
    await query(
      `INSERT INTO notifications(user_id, sender_id, title, message, type, metadata, read, pinned, reactions)
       VALUES($1,$2,$3,$4,'link_request',$5,false,false,'{}')`,
      [
        parent.id,
        studentId,
        'Student Link Request',
        studentName + ' wants to link you as their parent. Accept to view their progress, assignments and payments.',
        JSON.stringify({ student_id: studentId, student_name: studentName })
      ]
    );

    res.json({ success: true, message: 'Link request sent — waiting for parent to accept' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /parent-student/accept/:notifId — parent accepts
exports.acceptLink = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { notifId } = req.params;

    // Get notification + metadata
    const { rows: nRows } = await query(
      `SELECT * FROM notifications WHERE id=$1 AND user_id=$2 AND type='link_request'`,
      [notifId, parentId]
    );
    if (!nRows.length) return res.status(404).json({ error: 'Request not found' });
    const notif = nRows[0];
    if (notif.action_taken) return res.status(400).json({ error: 'Already responded to this request' });

    const { student_id, student_name } = notif.metadata || {};
    if (!student_id) return res.status(400).json({ error: 'Invalid request data' });

    // Verify student still has this pending request
    const { rows: sRows } = await query(
      `SELECT id FROM users WHERE id=$1 AND pending_linked_parent_id=$2`,
      [student_id, parentId]
    );
    if (!sRows.length) return res.status(400).json({ error: 'Request expired or already handled' });

    // Confirm the link
    await query(
      `UPDATE users SET linked_parent_id=$1, pending_linked_parent_id=NULL WHERE id=$2`,
      [parentId, student_id]
    );

    // Mark notification as actioned
    await query(`UPDATE notifications SET action_taken=true, read=true WHERE id=$1`, [notifId]);

    // Notify student
    await query(
      `INSERT INTO notifications(user_id, sender_id, title, message, type, read, pinned, reactions)
       VALUES($1,$2,'Parent Link Accepted',
       'Your parent account has been linked. They can now view your progress, assignments and payments.','system',false,false,'{}')`,
      [student_id, parentId]
    );

    res.json({ success: true, message: 'Link accepted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /parent-student/decline/:notifId — parent declines
exports.declineLink = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { notifId } = req.params;

    const { rows: nRows } = await query(
      `SELECT * FROM notifications WHERE id=$1 AND user_id=$2 AND type='link_request'`,
      [notifId, parentId]
    );
    if (!nRows.length) return res.status(404).json({ error: 'Request not found' });
    const notif = nRows[0];
    if (notif.action_taken) return res.status(400).json({ error: 'Already responded to this request' });

    const { student_id } = notif.metadata || {};

    // Clear pending link
    if (student_id) {
      await query(`UPDATE users SET pending_linked_parent_id=NULL WHERE id=$1`, [student_id]);
      // Notify student of rejection
      await query(
        `INSERT INTO notifications(user_id, sender_id, title, message, type, read, pinned, reactions)
         VALUES($1,$2,'Parent Link Declined',
         'Your parent link request was declined. Please check the ID number and try again.','system',false,false,'{}')`,
        [student_id, parentId]
      );
    }

    await query(`UPDATE notifications SET action_taken=true, read=true WHERE id=$1`, [notifId]);
    res.json({ success: true, message: 'Link declined' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// DELETE /parent-student/link — student unlinks
exports.unlinkParent = async (req, res) => {
  try {
    await query(`UPDATE users SET linked_parent_id=NULL WHERE id=$1`, [req.user.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /parent-student/my-parent
exports.getMyParent = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT u2.id, u2.name, u2.email, u2.phone
       FROM users u1 JOIN users u2 ON u2.id = u1.linked_parent_id
       WHERE u1.id=$1`,
      [req.user.id]
    );
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /parent-student/my-children
exports.getMyChildren = async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, name, email, phone, grade, class_id, status, language_pref,
              last_online, created_at, avatar_url, username, national_id
       FROM users WHERE linked_parent_id=$1 AND role='student'`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /parent-student/child-kpis/:childId
exports.getChildKpis = async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user.id;
    const { rows: check } = await query(
      `SELECT id FROM users WHERE id=$1 AND linked_parent_id=$2`,
      [childId, parentId]
    );
    if (!check.length) return res.status(403).json({ error: 'Not authorised' });
    const { rows: assignments } = await query(
      `SELECT a.id, a.title, a.due_date,
              CASE WHEN s.id IS NOT NULL THEN true ELSE false END as submitted,
              s.stars, s.feedback
       FROM assignments a
       LEFT JOIN submissions s ON s.assignment_id=a.id AND s.student_id=$1
       WHERE jsonb_array_length(a.assigned_to)=0
         OR EXISTS(SELECT 1 FROM jsonb_array_elements_text(a.assigned_to) v WHERE v=$1::text)
       ORDER BY a.due_date ASC NULLS LAST LIMIT 10`,
      [childId]
    );
    const pending   = assignments.filter(a => !a.submitted).length;
    const submitted = assignments.filter(a => a.submitted).length;
    const avgStars  = assignments.filter(a => a.stars).reduce((acc,a,_,arr)=>acc+a.stars/arr.length,0);
    res.json({ assignments, pending, submitted, avg_stars: avgStars.toFixed(1) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
