const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activity");

router.get("/", activityController.getActivities);

router.get("/:id", activityController.getActivity);

router.get("/my", activityController.getMyActivities);

router.get("/upcoming", activityController.getUpcomingActivities);

router.post("/create", activityController.createActivity);

router.put("/update/:id", activityController.updateActivity);

router.delete("/delete/:id", activityController.deleteActivity);


module.exports = router;