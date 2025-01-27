const router = require('express').Router();
const  flightsController = require('../controllers/flights');
const isAuth = require('../middlewares/isAuth');

router.get('/getAirports', flightsController.getAirports);
router.get('/getFlightOffers', flightsController.getFlightOffers);
router.get('/booked', isAuth, flightsController.getFlightBookings);
router.post('/bookFlight', isAuth, flightsController.bookFlight);

module.exports = router;