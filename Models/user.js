
const { boolean } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');


function userValidation(user) {
    const joiUserSchema = Joi.object({
        name: Joi.string().required().min(3).max(120),
        phone: Joi.number().min(11).required(),//may be 2 numbers update with array of number resturant add 2 or mre number
        email: Joi.string().email().required().min(3).max(120),
        password: Joi.string().min(6).max(30).required(),
        address: Joi.string()/*.required()*/.min(3).max(120),//we will select this from map in update 


        /*
            likes:Joi.number().min(0),
            reviews:Joi.string().min(0),
        */
    })
    return result = joiUserSchema.validate(user);
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 120,


    },
    phone:
    {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 11,
        unique: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true

    },
    password:
    {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1040
    },
    address:
    {
        type: String,
        /*required:true,*/
        minlength: 3
    },
    reservationId: {
        type: Array,
        minlength: 0,
    },
    deliveryId: {
        type: Array,
        minlength: 0,
    },
    onlineStatus: {
        type: Boolean,
    }
})
/*like*/  //we will ad this property in update
/*   reservation:
  {
      type:new mongoose.Schema
      ({
          resturantId:{type:mongoose.Schema.Types.ObjectId,required:true},
          noOfPersons:{type:Number,required:true,minlength:1},
          dateOfReservation:{type:Date,required:true},
          timeOfReservation:{type:Date,required:true},
          order:new mongoose.Schema
          ([{
              name:{type:String,required:true,minlength:3,maxlength:120},
              price:{type:Number,required:true,minlength:1}
          }])
      })
  }*/


const User = mongoose.model('User', userSchema);
module.exports.User = User;
module.exports.userValidation = userValidation;
