// models/Dashboard.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDashboard extends Document {
    name: string;
    description?: string;
    creatorId: string;
    invitedUsers?: string[];
    tasks?: Schema.Types.ObjectId[];
}

const dashboardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    creatorId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of invited users
});

const Dashboard = mongoose.model<IDashboard>('Dashboard', dashboardSchema);
export default Dashboard;
