const BookedActivity = require('../models/Booking/BookedActivitie');
const BookedItinerary = require('../models/Booking/BookedItinerary');
const BookedTransportation = require('../models/Booking/BookedTransportation');
const BookedHotel = require('../models/Booking/BookedHotel');
const BookedFlight = require('../models/Booking/BookedFlight');
const errorHandler = require('../Util/ErrorHandler/errorSender');
const cron = require('node-cron');
// update the status of booked (any) to 'Completed' if the scheduled date has passed
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Checking for deadlines for booked events');
        const currentDate = new Date();
        console.log("currentDate",currentDate);
       const m = await BookedActivity.updateMany(
            {
                isActive: true,
                status: 'Pending',
                date: { $lt: currentDate }
            },
            { $set: { status: 'Completed' } }
        );
       console.log("act",m);
        await BookedItinerary.updateMany(
            {
                isActive: true,
                status: 'Pending',
                date: { $lt: currentDate }
            },
            { $set: { status: 'Completed' } }
        );
        await BookedTransportation.updateMany(
            {
                isActive: true,
                status: 'Pending',
                date: { $lt: currentDate }
            },
            { $set: { status: 'Completed' } }
        );
        await BookedHotel.updateMany(
            {
                isActive: true,
                status: 'Pending',
                checkOutDate: { $lt: currentDate }
            },
            { $set: { status: 'Completed' } }
        );
        await BookedFlight.updateMany(
            {
                isActive: true,
                status: 'Pending',
                arrivalDate: { $lt: currentDate }
            },
            { $set: { status: 'Completed' } }
        );
        console.log('Deadlines checked and updated!');
    } catch (err) {
        errorHandler.SendError(res, err);
    }
});