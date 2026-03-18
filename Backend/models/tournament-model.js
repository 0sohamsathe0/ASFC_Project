import mongoose from "mongoose";
const tournamentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    startingDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    locationState: {
        type: String,
        required: true,
    },
    locationCity: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        enum: ["District", "State", "National", "International"],
        required: true,
    },
    ageCategory: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;