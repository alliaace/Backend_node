const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { adminValidation, Admin } = require('../Models/admin');
const { Delivery } = require('../Models/delivery');
const { Reservation } = require('../Models/Reservation');
const { Resturant } = require('../Models/Resturant');
const { User } = require('../Models/user');


router.post('/SignUp', async (req, res) => {
    const result = adminValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    const newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        designation: req.body.designation,
    })

    try {
        const adminSaved = await newAdmin.save();
        // console.log("working")
        return res.send(adminSaved);

    }
    catch (err) {
        res.status(500).send((err.message));
    }

})



//------------Admin LogIn------------//
router.post('/login', async (req, res) => {
    const result = logInValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    try {
        const getAdmin = await Admin.findOne({ email: req.body.email, password: req.body.password })
        if (!getAdmin) {
            //console.log(getUser);
            return res.status(400).send("user or password incorrect....");
            //   return res.status(404).send("name or password incorrect");
        }
        else
            res.send(getAdmin);
    }
    catch (error) {

        res.json({
            error: "server is down"
        });

        // res.send(json({ error: 'Internal server error' }));
    }

})
//---get All resturants---//
router.get('/getAllResturants', async (req, res) => {
    const getResturant = await Resturant.find(
        {
            approvedByAdmin: true,
            "menu.0": { "$exists": true }
        });
    //.select({ name: 1 });
    res.send(getResturant)
})

//---get All Users---//
router.get('/getAllUsers', async (req, res) => {
    const getUsers = await User.find(
        {

        });

    res.send(getUsers)
})

//---get All Completed Reservations---//
router.get('/getAllCompletedReservations', async (req, res) => {
    const getAllCompletedReservations = await Reservation.find(
        {
            reservationStatus: "complete",
        });

    res.send(getAllCompletedReservations)
})

router.get('/getAllCompletedDeliveries', async (req, res) => {
    const getAllCompletedDeliveries = await Delivery.find(
        {
            deliveryStatus: "Completed",
        }).select({ totalBill: 1 });

    res.send(getAllCompletedDeliveries)
})







///get resturant ho apply for resgistration

router.get('/newRegister', async (req, res) => {
    const getResturant = await Resturant.find({ approvedByAdmin: false });
    //.select({ name: 1 });
    res.send(getResturant)
})
router.get('/newRegister/:id', async (req, res) => {
    const getResturant = await Resturant.find({
        _id: req.params.id,
        approvedByAdmin: false
    })
        .select({ name: 1 })
    res.send(getResturant)
})


//////approve resturant easypaisa  account //////////
router.put('/approveEasyPaisa/:id', async (req, res) => {
    try {
        const getResturant = await Resturant.findOneAndUpdate({
            "easyPaisaAccount._id": req.params.id
        },
            {
                "easyPaisaAccount.varified": true
            });

        res.send(getResturant);
    }
    catch (err) {
        res.send(err.message);
    }
})
router.put('/approveResturant/:id', async (req, res) => {
    try {
        const getResturant = await Resturant.findOneAndUpdate({
            _id: req.params.id
        },
            {
                approvedByAdmin: true
            });

        res.send(getResturant);
    }
    catch (err) {
        res.send(err.message);
    }
})

function logInValidation(admin) {
    const adminSchema = Joi.object({
        email: Joi.string().email().required().min(3).max(120),
        password: Joi.string().min(6).max(30).required(),
    })
    return adminSchema.validate(admin)
}
module.exports = router;
