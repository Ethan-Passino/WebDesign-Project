// models/Dashboard.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDashboard extends Document {
    name: string;
    description?: string;
    creatorId: string;
    invitedUsers?: string[];
    tasks?: string[];
}

const dashboardSchema = new Schema<IDashboard>({
    name: { type: String, required: true },
    description: { type: String },
    creatorId: { type: String, required: true },
    invitedUsers: [{ type: String }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const Dashboard = mongoose.model<IDashboard>('Dashboard', dashboardSchema);
export default Dashboard;
