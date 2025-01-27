const User = require('../models/Users/User');
const Tourist = require('../models/Users/Tourist');
const TourGuide = require('../models/Users/TourGuide');
const Advertiser = require('../models/Users/Advertiser');
const Seller = require('../models/Users/Seller');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const TokenHandler = require('../Util/TokenHandler/tokenGenerator');
const errorHandler = require("../Util/ErrorHandler/errorSender");
const BrevoService = require("../Util/mailsHandler/brevo/brevoService");
const brevoConfig = require("../Util/mailsHandler/brevo/brevoConfig");
const brevoService = new BrevoService(brevoConfig);
const ResetPasswordTemplate = require("../Util/mailsHandler/mailTemplets/4ResetPasswordTemplate");
const AccountDeletionRequest = require('../models/AccountDeletionRequest');
const FCMTokens = require('../models/Notifications/FCMToken');


exports.signup = async (req, res) => {
    try {
        const userRole = req.body.userRole;
        if (!userRole) {
            return res.status(400).send({message: 'User role is required.'});
        }
        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) {
            return res.status(400).send({message: 'Email already exists.'});
        }
        const usernameExists = await User.findOne({username: req.body.username});
        if (usernameExists) {
            return res.status(400).send({message: 'Username already exists.'});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        switch (userRole) {
            case 'Tourist':
                const tourist = new Tourist({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    mobileNumber: req.body.mobileNumber,
                    nationality: req.body.nationality,
                    dateOfBirth: req.body.dateOfBirth,
                    occupation: req.body.occupation,
                    preferences: {
                        preferenceTags: req.body.preferenceTags,
                        activityCategories: req.body.activityCategories
                    },
                    hasProfile: true,
                });
                await tourist.save();
                return res.status(201).send({message: 'Tourist created successfully.'});
            case 'TourGuide':
                console.log("in auth: " + req.body.idCardUrl);
                console.log("in auth: " + req.body);
                for (const key in req.body) {
                    if (req.body.hasOwnProperty(key)) {
                        console.log(`${key}: ${req.body[key]}`);
                    }
                }
                const tourGuide = new TourGuide({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    idCardUrl: req.body.idCardUrl,
                    certificates: req.body.certificates
                });
                await tourGuide.save();
                return res.status(201).send({message: 'TourGuide created successfully.'});
            case 'Advertiser' :
                const advertiser = new Advertiser({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    idCardUrl: req.body.idCardUrl,
                    taxationCardUrl: req.body.taxationCardUrl
                });
                await advertiser.save();
                return res.status(201).send({message: 'Advertiser created successfully.'});
            case 'Seller' :
                const seller = new Seller({
                    email: req.body.email,
                    username: req.body.username,
                    password: hashedPassword,
                    userRole: userRole,
                    idCardUrl: req.body.idCardUrl,
                    taxationCardUrl: req.body.taxationCardUrl
                });
                await seller.save();
                return res.status(201).send({message: 'Seller created successfully.'});
        }

    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user) return res.status(404).json({message: 'User not found'});

        const IsRequestPending = await AccountDeletionRequest.findOne({username: user, status: 'pending'});
        if (IsRequestPending) return res.status(401).json({message: "Your account deletion request is still pending"});

        const IsRequestAccepted = await AccountDeletionRequest.findOne({username: user, status: 'approved'});
        if (IsRequestAccepted) return res.status(401).json({message: "Your account deletion request is accepted by the admin"});

        const doMatch = await bcrypt.compare(password, user.password);
        if (!doMatch) return res.status(401).json({message: "Wrong Password"});

        const status = user.isAccepted;
        if (status === "Pending") {
            return res.status(401).json({message: "Your request is still pending"});
        }
        if (status === "Rejected") {
            return res.status(403).json({message: "Your request is rejected"});
        }
        if (user.userRole === "Tourist") {
            let newLevel = user.level;
            if (user.loyalityPoints > 500000 && user.level !== 'LEVEL3') {
                newLevel = 'LEVEL3';
            } else if (user.loyalityPoints > 100000 && user.loyalityPoints <= 500000 && user.level === 'LEVEL1') {
                newLevel = 'LEVEL2';
            } else if (user.loyalityPoints <= 100000 && user.level === "LEVEL1") {
                newLevel = 'LEVEL1';
            }
            user.level = newLevel;
            await user.save();
        }
        // Generate tokens after level check
        const {token: accessToken, expiresIn: accessExpiresIn} = await TokenHandler.generateAccessToken(user);
        const {token: refreshToken, expiresIn: refreshExpiresIn} = await TokenHandler.generateRefreshToken(user);

        res.status(200).json({
            accessToken,
            accessExpiresIn,
            refreshToken,
            refreshExpiresIn,
            user: user,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const doMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        console.log(doMatch);
        if (!doMatch) return res.status(401).json({message: "Wrong old Password"});
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
        const updatedUser = await User.findByIdAndUpdate(req.user._id, {password: hashedPassword}, {new: true});
        res.status(200).json({message: 'Password changed successfully.'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.toggleFirstLoginAndUpdatePrefrences = async (req, res) => {
    try {
        const preferences = req.body;
        const user = await Tourist.findById(req.user._id);
        const updated = await Tourist.findByIdAndUpdate(req.user._id, {firstLogin: false, preferences:preferences}, {new: true});
        res.status(200).json({message: 'First login status changed successfully.'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.changeAllpasswords = async (req, res) => {
    try {
        const password = '.';
        const hashedPassword = await bcrypt.hash(password, 12);
        const Users = await User.updateMany({}, {password: hashedPassword});
        return res.status(200).json({message: 'All passwords changed successfully.'});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}


exports.forgotPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const otp = crypto.randomInt(100000, 999999).toString(); // Generate OTP
        const otpExpiry = Date.now() + 15 * 60 * 1000; // OTP expires in 15 minutes

        const token = jwt.sign(
            {userId: user._id}, // Payload - identify the user
            process.env.JWT_SECRET_RESET, // Secret key for signing the token
            {expiresIn: '15m'} // Token expires in 15 minutes
        );

        user.resetOtp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        const template = new ResetPasswordTemplate(otp, user.username);
        await brevoService.send(template, email);

        res.status(200).json({message: 'OTP sent to email', token});
    } catch (error) {

        errorHandler.SendError(res, error);
    }
};

exports.resetPassword = async (req, res) => {
    const {otp, newPassword, token} = req.body;
    try {
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_RESET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        if (user.resetOtp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({message: 'Invalid or expired OTP'});
        }
        console.log(newPassword)
        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetOtp = undefined; // Clear OTP
        user.otpExpiry = undefined; // Clear expiry
        await user.save();

        res.status(200).json({message: 'Password successfully reset'});
    } catch (error) {
        errorHandler.SendError(res, error);
    }
};

