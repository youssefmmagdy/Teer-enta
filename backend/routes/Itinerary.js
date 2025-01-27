const express = require("express");

const router = express.Router();

const itineraryController = require("../controllers/Itinerary");

const isAuth = require("../middlewares/isAuth");


router.get("/", itineraryController.getItineraries);
router.get("/one/:id", itineraryController.getItinerary);
router.get("/my", isAuth, itineraryController.getMyItineraries);
router.get("/upcoming", itineraryController.getUpcomingItineraries);
router.get("/upcoming/paid", isAuth, itineraryController.getUpcomingPaidItineraries);  //MS3 64
router.get("/flagged", itineraryController.getFlaggedItineraries);
router.get("/:id/comments", itineraryController.getCommentsForItinerary);
router.get("/:id/ratings", itineraryController.getRatingsForItinerary);
router.get("/booked", isAuth, itineraryController.getBookedItineraries);
router.get("/pendingBookings", isAuth, itineraryController.pendingBookings);
router.get("/completedBookings", isAuth, itineraryController.completedBookings);
router.get("/unActive",isAuth, itineraryController.getUnActiveItinerary);
router.post("/create", isAuth, itineraryController.createItinerary);
router.post("/book/:id", isAuth, itineraryController.bookItinerary);
router.post('/activate/:id',isAuth, itineraryController.activateItinerary);
router.post('/deactivated/:id', itineraryController.deactivateItinerary);
router.post('/:id/comment', isAuth, itineraryController.addCommentToItinerary);
router.post('/:id/rating', isAuth, itineraryController.rateItinerary);
router.post('/makeAllActivitesAppropriate', itineraryController.makeAllItineraryAppropriate);
router.put("/update/:id", isAuth, itineraryController.updateItinerary);
router.patch("/flagInappropriate/:id", isAuth, itineraryController.flagInappropriate)
router.patch("/UnFlagInappropriate/:id",isAuth, itineraryController.UnFlagInappropriate);
router.patch("/cancel/book/:id", isAuth, itineraryController.cancelItineraryBooking);
router.delete("/delete/:id", isAuth, itineraryController.deleteItinerary);


module.exports = router;