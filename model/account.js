const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User Id is required"],
    },
    bankCode: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true,
    },
    accountName: {
        type: String,
        required: true,
        trim: true,
        default: 0,
    },
    bankName: {
        type: String,
        required: true,
    },
    wallet: {
        type: String,
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

module.exports = Transaction = mongoose.model("account", AccountSchema);
