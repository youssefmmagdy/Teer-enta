const Transportation = require('../models/Transportation')
const BookedTransportation = require('../models/Booking/BookedTransportation')
const errorHandler = require("../Util/ErrorHandler/errorSender");
const Tourist = require('../models/Users/Tourist');
const PromoCodes = require("../models/PromoCodes");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
exports.getAllTransportations = async (req, res) => {
    try{
        const transportations = await Transportation
            .find({isActive:true})
            .populate('createdBy');
        if(transportations.length === 0){
            return res.status(404).json({message: 'No Transportation found'});
        }
        res.status(200).json(transportations);
    }catch(err){
        errorHandler.SendError(res, err);
    }
}
exports.getTransportation = async (req, res) => {
    try{
        const {id} = req.params;
        const transportation = await Transportation
            .findOne({_id:id,isActive:true})
            .populate('createdBy');
        if(!transportation){
            return res.status(404).json({message: 'Transportation not found or Inactive'});
        }
        res.status(200).json(transportation);
    }catch(err){
        errorHandler.SendError(res, err);
    }
}

exports.createTransportation = async (req, res) => {
    try{
        const transportation = await Transportation.create(req.body);
        res.status(201).json({message: 'Transportation created successfully', transportation});
    }catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.bookTransportation = async (req, res) => {
    try {
        const { id } = req.params;
        const { payments } = req.body;  // Assuming payments are passed in the request body
        const paymentMethod = payments?.paymentMethod || 'wallet'; // Default to wallet if not specified
        const userId = req.user._id;
        const promoCode = req.body.promoCode;

        console.log(id);
        const tourist = await Tourist.findById(req.user._id);
        const today = new Date();
        const birthDate = new Date(tourist.dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear() -
            (today.getMonth() < birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()));
        if (age < 18) {
            return res.status(400).json({message: "You must be at least 18 years old to book an transportation"});
        }

        const transportation = await Transportation.findOne({ _id: id, isActive: true });
        if (!transportation) {
            return res.status(404).json({ message: 'Transportation not found or Inactive' });
        }

        let existingPromoCode ;
        if(promoCode ){
            existingPromoCode = await PromoCodes.findOne({
                code: promoCode,
                expiryDate: { $gt: Date.now() } // Ensure the expiry date is in the future
            });
            if (!existingPromoCode) {
                return res.status(400).json({ message: "Invalid or expired Promo Code" });
            }
            if (existingPromoCode.usageLimit <= 0) {
                return res.status(400).json({ message: "Promo Code usage limit exceeded" });
            }
        }
        // Check for existing pending bookings for the same transportation and date
        const existingBooking = await BookedTransportation.findOne({
            transportation: id,
            isActive: true,
            status: 'Pending',
            createdBy: userId
        }).populate('transportation');

        if (existingBooking && existingBooking.date.toISOString().split('T')[0] === transportation.date.toISOString().split('T')[0]) {
            return res.status(400).json({ message: "You have already a Pending booking on this Transportation on the same date" });
        }

        let totalPrice = transportation.price; // Assuming you have a price field in the Transportation model
        totalPrice = promoCode ? totalPrice * (1 - existingPromoCode.discount / 100):totalPrice;
        // console.log(totalPrice);
        if(promoCode){
            existingPromoCode.usageLimit -= 1;
            await existingPromoCode.save();
        }
        // const tourist = await Tourist.findById(userId);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found.' });
        }

        // Payment handling based on the selected method
        if (paymentMethod === 'wallet') {
            // Wallet payment: Check if the tourist has enough balance
            if (tourist.wallet < totalPrice) {
                return res.status(400).json({ message: 'Insufficient wallet balance.' });
            }
            // Deduct the amount from the wallet
            tourist.wallet -= totalPrice;
            await tourist.save();
        } else if (paymentMethod === 'Card') {
            await stripe.paymentIntents.create({
                amount: Math.round(totalPrice* 100),
                currency: 'EGP',
                payment_method_types: ['card'],
            });
        } else {
            return res.status(400).json({ message: 'Invalid payment method selected.' });
        }

        await BookedTransportation.create({
            transportation: id,
            createdBy: userId,
            // status: paymentMethod === 'cash_on_delivery' ? 'Pending' : 'Completed',
            status: 'Pending',
            date: transportation.date ,
            price: totalPrice
        });

        return res.status(200).json({ message: 'Transportation booked successfully' });

    } catch (err) {
        console.log(err);
        errorHandler.SendError(res, err);
    }
};

exports.getBookedTransportations = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookedTransportations = await BookedTransportation
            .find({ createdBy: userId, isActive: true })
            .populate('transportation').populate('createdBy');
        res.status(200).json(bookedTransportations);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}