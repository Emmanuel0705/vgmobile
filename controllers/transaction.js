
const {validationResult} = require("express-validator")
const catchAsync = require("../util/catchAsync")
const AppError = require("../util/appError")
const User = require("../model/User")
const axios = require("axios");
const cryto = require("crypto")
const Transaction = require('../model/Transaction')

//filter req object
const filterObj = (obj, ...allowFields) => {
    const newObj = {}
     Object.keys(obj).forEach(el => {
        if(allowFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

exports.buyAirtime = catchAsync(async (req,res,next) => {
  const order_id = cryto.randomBytes(12).toString("hex")
  const {phone,amount,network} = req.body
  if(!phone || !amount || !network){
    return next(new AppError("Incorrect Details"))
  }
  const val = await axios(`https://www.nellobytesystems.com/APIAirtimeV1.asp?UserID=${process.env
  .USER_ID}&APIKey=${process.env
    .API_KEY}&MobileNetwork=${network}&Amount=${amount}&MobileNumber=${phone}&orderID=${order_id}`)

  res.json(val.data)
   
  
})
exports.fundWallet = catchAsync(async (req,res,next) => {
  const ref = req.body.ref
  const transactionVerified = await Transaction.findOne({ref})
  if(transactionVerified){
    return res.json({status:"error",message:"payment has already been verified"})
  }
  const key = process.env.PAYSTACK_KEY
  paystack(key).transaction.verify(ref, async (error, body) => {
    if(error) return res.json({status:"error",message:error.message})
    // if(body.data.domain != 'test') console.log(body.data.amount)
    if(body.data) {
      const transactionData = {
        user:req.user.id,
        type:"Wallet Funding",
        amount: String(body.data.amount).slice(0,-2),
        status: body.data.status,
        ref:body.data.reference
      }
      if(body.data.status === 'success'){
        const transaction = new Transaction(transactionData)
        await transaction.save()
        const user= await User.findById(req.user.id)
        const newWallet = parseInt(user.wallet) + parseInt(transactionData.amount)
        const updateWallet = await User.findOneAndUpdate(
         {_id:req.user.id},{ $set:{wallet: newWallet}},{returnNewDocument:true})
        return res.json({status:'success',message:"Payment Made Successfully"})
      }
       return res.json({status:"fail",message:"Payment Failed! Kindly contact our customer care if you have any complain "})
    }

  });
})

exports.buyData = catchAsync(async (req,res,next) => {
  const order_id = cryto.randomBytes(12).toString("hex")
  
  const {phone,amount,network} = req.body
  if(!phone || !amount || !network){
    return next(new AppError("Incorrect Details"))
  }
  const val = await axios(`https://www.nellobytesystems.com/APIDatabundleV1.asp?UserID=${process.env
  .USER_ID}&APIKey=${process.env
    .API_KEY}&MobileNetwork=${network}&DataPlan=${amount}&MobileNumber=${phone}&orderID=${order_id}`)

  res.json(val.data)
   
  
})
exports.cableTV = catchAsync(async (req,res,next) => {
  const order_id = cryto.randomBytes(12).toString("hex")
  const {phone,amount,network} = req.body
  if(!phone || !amount || !network){
    return next(new AppError("Incorrect Details"))
  }
  const val = await axios(`https://www.nellobytesystems.com/APICableTVV1.asp?UserID=${process.env
  .USER_ID}&APIKey=${process.env
    .API_KEY}&MobileNetwork=${network}&DataPlan=${amount}&MobileNumber=${phone}&orderID=${order_id}`)

  res.json(val.data)
   
  
})
