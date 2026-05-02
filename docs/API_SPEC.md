# API Reference

Base URL: `https://api.yourdomain.com`
Auth: `Authorization: Bearer <JWT>`

## Auth
| Method | Path | Body |
|--------|------|------|
| POST | /auth/register | role, nationalId?, name, email?, phone?, password, grade? |
| POST | /auth/login | emailOrPhone, password |
| POST | /auth/forgot | emailOrPhone |
| POST | /auth/reset | otp, newPassword |
| POST | /auth/link-guardian | guardianId, childNationalId |
| POST | /auth/approve/:userId | — |
| POST | /auth/lock/:userId | — |
| POST | /auth/unlock/:userId | — |

## Dashboard
| GET | /dashboard/admin/kpis | — |
| GET | /dashboard/teacher/kpis/:teacherId | — |
| GET | /dashboard/student/kpis/:studentId | — |
| GET | /dashboard/parent/kpis/:studentId | — |

## Cards
| POST | /cards | grade, subject, skillId, title, ... |
| GET  | /cards | ?grade=&subject=&tag= |
| GET  | /cards/:id | ?variant=lite|full |

## Telemetry
POST /telemetry/cardEvent
```json
{
  "cardId": "card_123",
  "userId": "user_456",
  "eventType": "card_view",
  "eventData": { "timeOnCard": 12 },
  "timestamp": "2026-04-29T00:00:00Z"
}
```
