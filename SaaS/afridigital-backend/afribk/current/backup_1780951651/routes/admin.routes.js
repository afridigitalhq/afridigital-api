const router = require("express").Router();

const {
  status,
  preview
} = require("../admin/control-plane/controllers/controlPlane.controller");

router.get("/system/status", status);
router.post("/system/preview", preview);

module.exports = router;
