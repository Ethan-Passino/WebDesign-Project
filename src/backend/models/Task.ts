import mongoose, { Document, Schema } from 'mongoose';

interface Subtask {
    title: string;
    completed: boolean;
}

export interface ITask extends Document {
    name: string;
    creatorId: string;
    parentPanel: Schema.Types.ObjectId;
    completed: boolean;
    dueBy: Date;

    description?: string;
    subtasks?: Subtask[]; // Array of subtasks
}



const taskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    creatorId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    parentPanel: { type: Schema.Types.ObjectId, ref: 'Panel' },
    dueBy: { type: Date },
    description: { type: String },
    subtasks: [
        {
            title: { type: String, required: true },
            completed: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });


// this is if we want to use an ID value for client-facing purposes but use
// mongodb's _id internally

// taskSchema.set('toJSON', {
//     transform: (doc, ret) => {
//         ret.id = ret._id.toString();
//         delete ret._id;
//         delete ret.__v;
//     }
// })

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;

