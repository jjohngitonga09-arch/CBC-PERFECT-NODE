
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/mpesaController");
const { authenticate: requireAuth } = require("../middleware/authenticate");

router.post("/pay",      requireAuth, ctrl.stkPush);
router.post("/callback", ctrl.callback);           // public — Safaricom calls this
router.get("/status/:checkoutId", requireAuth, ctrl.checkStatus);

module.exports = router;
