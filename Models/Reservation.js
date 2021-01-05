const { Resturant } = require('./Resturant');
const { User } = require('./user');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose');
const { number, required } = require('joi');

const reservationSchema = new mongoose.Schema({
    user: new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 120,
        },
        userPhone: {
            type: Number,
            required: true,
            minlength: 3,
            maxlength: 120,
        }
    }),
    resturant: new mongoose.Schema({
        resturantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        resturantName: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 120,
        },
        resturantPhone: {
            type: Number,
            required: true,
            minlength: 3,
            maxlength: 120,
        }
    }),
    noOfPersons:
    {
        type: Number, required: true,
        minlength: 1
    },
    dateOfReservation:
    {
        type: Date,
        required: true
    },
    // timeOfReservation:
    // {
    //     type: Date,
    //     required: true
    // },//This is time confirmm this  type for time
    comment: {
        type: String,
        minlength: 0,
        max: 200
    },
    order:
        [{
            // type: new mongoose.Schema({
            //     _id: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            // quantity: { type: Number, required: true }
        }],
    reservationStatus: {
        type: String,
        minlength: 0,
        default: "placed",  //placed confermied preparing your meal
    },
    userEasyPaisaName: {
        type: String,
        minlength: 0,
        required: true,
    },
    userEasyPaisaPhoneNo:
    {
        type: Number,
        required: true,
        // minlength: 1
    },
    paymentBeforeReservation:
    {
        type: String,
        minlength: 0,
        required: true,
    },
    totalBill: {
        type: Number,
        required: true,

    },
    newCustomer: {
        type: String,
        required: true
    },
    rejectionReason: {
        type: String,
        required: true,
        default: "default"

    }


    //  required: true,


    //    { type: new mongoose.Schema({
    //        // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    //         name: { type: String, required: true },
    //         price:{type: String, required: true }
    //     }),
    //     required: true
    // }
    /* {
         type: Array,
         required: true,
         minlength: 1,
     },
     /*[
         _id
       /*  {
             name: { type: String, required: true },
             price: { type: Number, required: true }
         } 
     ]*/
})
const Reservation = mongoose.model('Reservation', reservationSchema)

function reservationValidation(reservation) {
    const joiReservationSchema = Joi.object({
        userId: Joi.objectId().required(),
        resturantId: Joi.objectId().required(),
        noOfPersons: Joi.number().required().min(1),
        dateOfReservation: Joi.date().required(),//date cant be less then the current date
        // timeOfReservation: Joi.date().required(),
        order: Joi.array().required().min(1),
        userEasyPaisaName: Joi.string().required(),
        userEasyPaisaPhoneNo: Joi.number().required(),
        paymentBeforeReservation: Joi.number().required(),
        totalBill: Joi.number().required()
    })
    return result = joiReservationSchema.validate(reservation);
}

module.exports.reservationValidation = reservationValidation;
module.exports.Reservation = Reservation;
//stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]