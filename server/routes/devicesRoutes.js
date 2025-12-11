//routes/devicesRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllDevices,
  createDevice,
  testDevice,
  getDeviceTests,
  deleteDevice
} = require("../controllers/devicesController");

router.get("/", getAllDevices);
router.post("/", createDevice);
router.post("/:id/test", testDevice);
router.get("/:id/tests", getDeviceTests);

router.post("/:id/delete", deleteDevice);



module.exports = router;
