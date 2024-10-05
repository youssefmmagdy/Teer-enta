import {TActivity} from "../Activity/Activity";
import {TTourist} from "../Users/Tourist";

export type TBookedActivity = {
    _id: string;
    activity: TActivity; // ObjectId referencing 'Activity'
    createdBy: TTourist; // ObjectId referencing 'User'
    status: 'Pending' | 'Completed' | 'Cancelled';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};