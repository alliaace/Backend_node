
const { required } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');


function resturantValidation(resturant) {
    const resturantSchema = Joi.object({
        url: Joi.string(),
        name: Joi.string().required().min(3).max(120),
        email: Joi.string().email().required().min(3).max(120),
        phone: Joi.number().min(5).required(),//may be 2 numbers update with array of number resturant add 2 or mre number
        password: Joi.string().min(2).max(30).required(),
        location: Joi.string().required().min(3).max(120),//we will select this from map in update    
        services: Joi.array().required().min(1),
        typeOfResturant: Joi.string().required().min(0),
        averagePriceInMenu: Joi.number().required(),
        //  eventDecoration: Joi.string().required(),
        // menu: Joi.array()
        menu: Joi.array().min(0),
        // {
        //     data: Joi.array()
        //         .items({
        //             name: Joi.string()
        //                 .required(),
        //             price: Joi.string()
        //                 .required(),
        //             discription: Joi.string()
        //                 .required(),
        //             categie: Joi.string()
        //                 .required(),

        //         }),
        // },
        menucategies: Joi.array().min(0),
        //  {
        //     data: Joi.array().items({
        //         name: Joi.string().required(),
        //     }),
        // },

        easyPaisaPhoneNo: Joi.number().required(),
        easyPaisaName: Joi.string().required().min(3),
        reservationId: Joi.array().min(0),
        reviews: {
            data: Joi.array().items({
                name: Joi.string().required(),
            }),
        },
        //we can display proper review with username Or just display count taht 15 person review this resturant 
        likes: Joi.array().min(1),
        sittingCapacity: Joi.number(),

    })

    return result = resturantSchema.validate(resturant);
}

const mongooseresturantSchema = new mongoose.Schema({
    url: {
        type: String,
        minlength: 1,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 120,
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    phone:
    {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 11
    },
    password:
    {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1040
    },
    location:
    {
        type: String,
        required: true,
        minlength: 3
    },
    services: {             //Type of services resturant provide (takeaway,dineIn,delivery)
        type: Array,
        required: true,
        minlength: 1
    },
    typeOfResturant: {      //Type of resturant (StreetFood,FastFood,Chinees,Italinan,Mixed)
        type: String,
        required: true,

    },
    averagePriceInMenu: {
        type: Number,
        required: true,
    },

    menu: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            discription: { type: String, required: true },
            categie: { type: String, required: true },
        }
    ],
    menucategies:
        [
            {
                name: { type: String, required: true },
            }
        ],
    reservationId: {
        type: Array,

    },
    deliveryId: {
        type: Array,

    },
    sittingCapacity: {
        type: Number,
        // required: true,
    },
    reviews:
        [{
            userId: { type: mongoose.Schema.Types.ObjectId, required: true },
            userName: { type: String, required: true },
            reviewDate: { type: Date, default: Date.now(), required: true },
            review: { type: String, required: true }

        }]
    ,
    likes:
        [{
            userId: { type: mongoose.Schema.Types.ObjectId, required: true }
        }],
    dateOfRegisteration:
    {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now()
    },
    approvedByAdmin: {   //if admin approve then shoe in resturants list
        type: Boolean,
        default: false,
    },
    approvalDate: { //date when resturant approve resturant
        type: Date,
    },
    profileVisits: {
        type: Number,
        minlength: 0,
        default: 0

    },

    easyPaisaName: {
        type: String,
        required: true,
        rrequired: true,
    },
    easyPaisaPhoneNo: {
        type: Number,
        required: true,
        maxlength: 11,

    },
    easyPaisavarified: {
        type: Boolean,
        default: false,

    },
    blocked: {
        type: Boolean,
        default: false,

    }

})
const Resturant = mongoose.model('Resturant', mongooseresturantSchema);
module.exports.Resturant = Resturant;
module.exports.resturantValidation = resturantValidation;


/* reservation:{
        type:new mongoose.Schema(
            {
                userId:{type:mongoose.Schema.Types.ObjectId,required:true},
                noOfPersons:{type:Number,required:true,minlength:1},
                dateOfReservation:{type:Date,required:true},
                timeOfReservation:{type:Date,required:true},//This is time confirmm this  type for time
                order:new mongoose.Schema
                ([{
                    name:{type:String,required:true,minlength:3,maxlength:120},
                    price:{type:Number,required:true,minlength:1}
                }])
            }
        )
    },*/
