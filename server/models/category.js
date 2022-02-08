import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
        },
        slug: {
            type: String,
            lowercase: true,
            unique: true,
            index: true,
        },
        image: {
            url: String,
            key: String,
        },
        content: {
            type: {},
            min: 20,
            max: 2000000,
        },
        postedBy: {
            type: ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
