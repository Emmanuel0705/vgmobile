const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "fullname is required"],
        trim: true,
    },
    wallet: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    sponsorId: {
        type: String,
        required: true,
        trim: true,
        default: "DSS70P2",
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    paid: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: [true, "email already exits"],
    },
    gender: {
        type: String,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
        minlength: [8, "password must not less than 8 characters"],
    },
    referralId: {},
    passwordChangedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

UserSchema.pre("save", async function (next) {
    //check if modified
    if (!this.isModified("password")) {
        return next();
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
    next();
});

UserSchema.methods.changePasswordAfter = function (jwtTime) {
    if (this.passwordChangedAt) {
        const passwordTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return jwtTime < passwordTimeStamp;
    }
    return false;
};

module.exports = User = mongoose.model("user", UserSchema);
