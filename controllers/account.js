const { validationResult } = require("express-validator");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Account = require("../model/account");
const { generateReferralId } = require("../util/refId");

//filter req object
const filterObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

//description => Login
exports.getAccount = catchAsync(async (req, res) => {
    const account = await Account.findOne({ user: req.user.id });
    res.json(account);
});

exports.updateAccount = catchAsync(async (req, res) => {
    const Obj = filterObj(
        req.body,
        "bankCode",
        "accountNumber",
        "bankName",
        "accountName"
    );
    let account = await Account.findOneAndUpdate(
        { user: req.user.id },
        { $set: Obj },
        { returnNewDocument: true }
    );
    res.json(account);
});

exports.createAccount = catchAsync(async (req, res, next) => {
    const Obj = filterObj(
        req.body,
        "bankCode",
        "accountNumber",
        "bankName",
        "accountName",
        "wallet"
    );
    let account = await Account.findOne({ user: req.user.id });
    if (account) {
        account = await Account.findOneAndUpdate(
            { user: req.user.id },
            { $set: Obj },
            { returnNewDocument: trues }
        );
        return res.json(account);
    }
    account = new Account(Obj);
    account.user = req.user.id;
    await account.save();
    return res.json(account);
});
