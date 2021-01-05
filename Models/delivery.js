const { Resturant } = require('./Resturant');
const { User } = require('./user');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');
const { number, required, boolean } = require('joi');

const deliverySchema = new mongoose.Schema({
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
    dateOfReservation:
    {

        type: Date,
        default: Date.now,
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
    deliveryStatus: {
        type: String,
        minlength: 0,
        default: "placed",  //placed confermied preparing your meal
    },
    totalBill: {
        type: Number,
        required: true,

    },
    // newCustomer: {
    //     type: Boolean,
    //     required: true
    // },
    address: {
        type: String,
        minlength: 1,
        required: true
    },
    rejectionReason: {
        type: String,

    }

})
const Delivery = mongoose.model('Delivery', deliverySchema)

function deliveryValidation(delivery) {
    const joiDeliverySchema = Joi.object({
        userId: Joi.objectId().required(),
        resturantId: Joi.objectId().required(),
        //  dateOfdelivery: Joi.date().required(),//date cant be less then the current date
        // timeOfdelivery: Joi.date().required(),
        order: Joi.array().required().min(1),
        totalBill: Joi.number().required(),
        address: Joi.string().required().min(1),
    })
    return result = joiDeliverySchema.validate(delivery);
}

module.exports.deliveryValidation = deliveryValidation;
module.exports.Delivery = Delivery;
//stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]