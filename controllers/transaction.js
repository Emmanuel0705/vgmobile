const { validationResult } = require("express-validator");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const User = require("../model/User");
const axios = require("axios");
const cryto = require("crypto");
const Transaction = require("../model/Transaction");
let PayStack = require("paystack-node");

const A = "sk_test_8ed3719c6cee6490deb2dd640887932a8b42b2a8";

const paystack = new PayStack(process.env.PAYSTACK_SEC_KEY || A, "development");

//filter req object
const filterObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getTx = catchAsync(async (req, res, next) => {
    const tx = await Transaction.find({ user: req.user.id });
    res.json(tx);
});

exports.fundWallet = catchAsync(async (req, res, next) => {
    const ref = req.body.ref;
    const transactionVerified = await Transaction.findOne({ ref });
    if (transactionVerified) {
        return res.json({
            status: "error",
            message: "payment has already been verified",
        });
    }
    console.log(process.env.PAYSTACK_SEC_KEY);

    const promise = await paystack.verifyTransaction({
        reference: req.body.ref,
    });
    console.log(promise.body.status);
    const { body } = promise;
    if (body.status === true) {
        if (body.data) {
            const transactionData = {
                user: req.user.id,
                type: "Wallet Funding",
                amount: body.data.amount,
                status: body.data.status,
                ref: body.data.reference,
            };
            if (body.data.status === "success") {
                const user = await User.findById(req.user.id);
                user.wallet =
                    parseInt(user.wallet) + parseInt(transactionData.amount);
                user.paid = true;
                const transaction = new Transaction(transactionData);

                //save data

                await transaction.save();
                await user.save();
                //update referall
                const ref = await User.findOne({ referralId: user.sponsorId });
                if (ref) {
                    const refEarning = parseInt(transactionData.amount) * 0.1;
                    ref.wallet = parseInt(user.wallet) + refEarning;
                    const transactionData2 = {
                        user: ref._id,
                        amount: refEarning,
                        status: "success",
                        type: "Referral bonus",
                        ref: Date.now(),
                    };
                    const transaction2 = new Transaction(transactionData2);
                    await ref.save();
                    await transaction2.save();
                }

                return res.json({
                    status: "success",
                    message: "Payment Made Successfully",
                });
            }
            return res.json({
                status: "fail",
                message:
                    "Payment Failed! Kindly contact our customer care if you have any complain ",
            });
        }
    }
});
