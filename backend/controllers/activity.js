const Activity = require('../models/Activity/Activity');
const mongoose = require('mongoose')
const errorHandler = require('../Util/ErrorHandler/errorSender');

exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({isActive: true})
            .populate('category')
            .populate('tags');
        if (activities.length === 0) {
            return res.status(404).json({message: 'No Activities found'});
        }
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getActivity = async (req, res, next) => {
    try {
        const {id} = req.params;
        const activity = await Activity.findOne({_id: id, isActive: true})
            .populate('category')
            .populate('tags');
        if (!activity) {
            return res.status(404).json({message: 'Activity not found or Inactive'});
        }
        res.status(200).json(activity);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getMyActivities = async (req, res, next) => {
    try {
        // req.user = { _id: '66f59e1617ed32dc57a4ca2f' };
        const createdBy = req.user._id;
        const activities = await Activity.find({createdBy})
            .populate('category')
            .populate('tags');
        if (activities.length === 0) {
            return res.status(404).json({message: 'No Activities found'});
        }
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.getUpcomingActivities = async (req, res, next) => {
    try {
        const today = new Date();
        const activities = await Activity.find(
            {
                date: {$gte: today},
                isActive: true
            })
            .populate('category')
            .populate('tags');
        if (activities.length === 0) {
            return res.status(404).json({message: 'No upcoming Activities found'});
        }
        res.status(200).json(activities);
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}

exports.createActivity = async (req, res, next) => {
    try {
        // req.user = {_id: '66f92ee0e8036e924a7dec87'};
        //
        // const createdBy = req.user._id;
        // req.body.createdBy = createdBy;
        const activity = await Activity.create(req.body);
        res.status(201).json({message: 'Activity created successfully', activity});
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};


exports.updateActivity = async (req, res, next) => {
    try {
        const {id} = req.params;

        const updates = req.body;


        const updatedActivity = await Activity.findByIdAndUpdate(
            id,
            updates,
            {new: true, runValidators: true, overwrite: false} // Options: return the updated document and run validators
        );

        if (!updatedActivity) {
            return res.status(404).json({message: 'Activity not found or inactive'});
        }

        res.status(200).json({
            message: 'Activity updated successfully',
            data: updatedActivity,
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.deleteActivity = async (req, res, next) => {
    try {
        const {id} = req.params;

        const activity = await Activity.findById(id);
        if (!activity) {
            return res.status(404).json({message: 'Activity not found'});
        }

        await Activity.findByIdAndDelete(id);
        res.status(200).json({
            message: 'Activity deleted successfully',
            data: activity
        });
    } catch (err) {
        errorHandler.SendError(res, err);
    }
};

exports.flagInappropriate = async (req, res) => {
    try {
        const id = req.params.id ;
        if (!mongoose.Types.objectId.isValid(id)){
            return res.status(400).json({message:"invalid object id "}) ;
        }
        const activity = await Activity.findByIdAndUpdate(id , {isActive: false} , {new:true});
        if (!activity){
            return res.status(404).json({message:"activity not found"}) ;
        }
        return res.status(200).json({message:"activity flagged inappropriate successfully"}) ;
    } catch (err) {
        errorHandler.SendError(res, err);
    }
}