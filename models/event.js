import mongoose from "mongoose";

const schema = mongoose.Schema;

const eventSchema = new schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    creator: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
})

export const Event =  mongoose.model('Event', eventSchema)