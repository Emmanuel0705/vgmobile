const { validationResult } = require("express-validator");
const catchAsync = require("../util/catchAsync");
const AppError = require("../util/appError");
const Kyc = require("../model/kyc");
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
exports.getKyc = catchAsync(async (req, res) => {
    const kyc = await Kyc.findOne({ user: req.user.id });
    res.json(kyc);
});

exports.updateKyc = catchAsync(async (req, res) => {
    const Obj = filterObj(req.body, "type", "number", "front", "back");

    let kyc = await Kyc.findOneAndUpdate(
        { user: req.user.id },
        { $set: Obj },
        { returnNewDocument: true }
    );

    res.json(kyc);
});

exports.createKyc = catchAsync(async (req, res, next) => {
    const Obj = filterObj(req.body, "type", "number", "front", "back");
    let kyc = await Kyc.findOne({ user: req.user.id });
    if (kyc) {
        kyc = await Kyc.findOneAndUpdate(
            { user: req.user.id },
            { $set: Obj },
            { returnNewDocument: true }
        );
        return res.json(kyc);
    }
    kyc = new Kyc(Obj);
    kyc.user = req.user.id;
    await kyc.save();
    return res.json(kyc);
});
