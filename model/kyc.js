const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User Id is required"],
    },
    type: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
        trim: true,
    },
    front: {
        type: String,
        required: true,
        trim: true,
        default: 0,
    },
    back: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = Transaction = mongoose.model("kyc", kycSchema);
