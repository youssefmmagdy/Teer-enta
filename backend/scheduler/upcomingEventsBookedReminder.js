const cron = require('node-cron');
const moment = require('moment');
const BookedActivity = require('../models/Booking/BookedActivitie');  // Your BookedActivity model
const User = require('../models/Users/User');
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const UpcomingEventTemplate = require("../Util/mailsHandler/mailTemplets/5UpcomingEventsBookedTemplate");
const getFCMToken = require('../Util/Notification/FCMTokenGetter');
const sendNotification = require('../Util/Notification/NotificationSender');
// Receive notifications reminding me of upcoming events that I booked/ paid for via email and push notification
// TODO: Not tested yet
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Checking for reminders for upcoming Booked events 5 days ahead');

        const currentDate = moment().startOf('day');

        const bookedActivities = await BookedActivity.find({
            isActive: true,
            status: 'Pending'
        }).populate('activity').populate('createdBy');

        if (bookedActivities.length === 0) {
            console.log('No bookings found for reminder today.');
        }

        for (let booking of bookedActivities) {
            const user = booking.createdBy;

            const activityDate = moment(booking.date);
            const daysDifference = activityDate.diff(currentDate, 'days');
            console.log(`Days difference between ${activityDate.format('MMMM Do YYYY')} and ${currentDate.format('MMMM Do YYYY')} is ${daysDifference}`);

            if (daysDifference < 10) {
                if (user && user.email) {
                    const emailParams = {
                        name: booking.activity.name,
                        userName: user.username,
                        date: moment(booking.date).format('MMMM Do YYYY'),
                    };

                    const emailTemplate = new UpcomingEventTemplate(
                        emailParams.name,
                        emailParams.userName,
                        emailParams.date,
                        `${process.env.FRONTEND_HOST}/itinerary/activityDetails/${booking.activity._id}`
                    );
                    await brevoService.send(emailTemplate, user.email);
                    const fcmToken = await getFCMToken(user._id);
                    if (fcmToken) {
                        await sendNotification({
                            title: 'Upcoming Event Reminder',
                            body:`Don't forget about your upcoming event ${emailParams.name} on ${emailParams.date}`,
                            tokens: [fcmToken],
                        })
                    }
                    console.log(`Reminder sent to ${user.email} for activity ${emailParams.name}`);
                }
            }
        }

        console.log('Checked all bookings for reminders!');
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
});
