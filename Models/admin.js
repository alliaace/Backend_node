
const Joi = require('joi');
const mongoose = require('mongoose');

function adminValidation(admin) {
    const joiAdminSchema = Joi.object({
        name: Joi.string().required().min(3).max(120),
        phone: Joi.number().min(11).required(),//may be 2 numbers update with array of number resturant add 2 or mre number
        email: Joi.string().email().required().min(3).max(120),
        password: Joi.string().min(6).max(30).required(),
        designation: Joi.string().min(4).max(30).required(),

    })
    return result = joiAdminSchema.validate(admin);
}


const adminSchema = new mongoose.Schema({
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

    designation:
    {
        type: String,
        required: true,
    },
})
const Admin = mongoose.model('Admin', adminSchema);
module.exports.Admin = Admin;
module.exports.adminValidation = adminValidation;
