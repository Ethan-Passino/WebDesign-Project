import mongoose, {Document, Schema} from 'mongoose';

export interface IPanel extends Document {
    name: string;
    creatorId: string;
    id: string;

    parentDash: Schema.Types.ObjectId;
    childTasks?: Schema.Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date[];

}

const panelSchema = new Schema<IPanel>({
    name: { type: String, required: true },
    creatorId: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    parentDash: { type: Schema.Types.ObjectId, ref: 'Panel', required: true },
    childTasks: { type: [Schema.Types.ObjectId], default: [], ref: 'Task' },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: [Date], default: [], required: true },
});

const PanelSchema = mongoose.model<IPanel>('PanelSchema', panelSchema);
export default PanelSchema;