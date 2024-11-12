import mongoose, {Document, Schema} from 'mongoose';


//add to this as necessary
export interface ITask extends Document{
    name: string;
    id: string;
    creatorId: string;
    parentPanel: Schema.Types.ObjectId;
    completed: boolean;
    dueBy: Date;
    createdAt: Date;
    updatedAt: Date[];


    description?: string;
    subtasks?: [this];
}


const taskSchema = new Schema<ITask>({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    creatorId: {type: String, required: true },
    completed: { type: Boolean, default: false },
    parentPanel: { type: Schema.Types.ObjectId, ref: 'Panel' },
    dueBy: { type: Date },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: {type: [Date], default: [], required: true },
    description: { type: String },
    subtasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
});

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;

