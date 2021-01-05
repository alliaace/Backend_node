const { json } = require('express');
const express = require('express');
const { compile } = require('joi');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const { get } = require('mongoose');
const { Delivery } = require('../Models/delivery');
const { Reservation } = require('../Models/Reservation');

const { resturantValidation, Resturant } = require('../Models/Resturant');

//-----RESTURANT SIGNIN-----//

router.post('/signup', async (req, res) => {
    const result = resturantValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    try {
        const newResturant = new Resturant
            ({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                location: req.body.location,
                services: req.body.services,
                typeOfResturant: req.body.typeOfResturant,
                averagePriceInMenu: req.body.averagePriceInMenu,
                easyPaisaName: req.body.easyPaisaName,
                easyPaisaPhoneNo: req.body.easyPaisaPhoneNo,
                // menu: req.body.menu,
                // menucategies: req.body.menucategies



            })
        const addResturant = await newResturant.save();
        return res.send(addResturant);
    }
    catch (err) {
        res.send(err)
    }
})

//------------Resturant LogIn------------//

router.post('/login', async (req, res) => {
    const result =
        (req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    try {
        const getResturant = await Resturant.findOne({ email: req.body.email, password: req.body.password })
        if (!getResturant) {
            return res.status(400).send("email or password incorrect");
        }
        else
            res.send(getResturant);
    }
    catch (err) {
        res.send(err);
    }
})

//------------Update Resturant basic information----------------//

router.put('/:id', async (req, res) => {

    const getUpdatedResturant = await Resturant.findOneAndUpdate({ _id: req.params.id },
        {
            name: req.body.name,
            phone: req.body.phone,
            location: req.body.location,
            password: req.body.password,
        }, { new: true }
    );
    res.send(getUpdatedResturant);
})


//------------Get All Dine In Resturant ----------------//

router.get('/', async (req, res) => {
    try {
        const getAllResturant = await Resturant.find(
            {
                services: { $all: ["DineIn"] },
                "menu.0": { "$exists": true }
            }
        )
        res.send(getAllResturant);
    }
    catch (err) {
        res.send(console.log(err));

    }
})

////=------Count Total Resturants-------//// 

router.get('/deliveryResturantCOunt', async (req, res) => {
    try {
        var getAllResturant = await Resturant.countDocuments(
            {
                services: { $all: ["Delivery"] },
                "menu.0": { "$exists": true }
            });
        // var a = getAllResturant;
        // res.send(getAllResturant)
        console.log(getAllResturant);

        res.send({
            "count": getAllResturant
        });
    }
    catch (err) {
        res.send(err.message);
    }
})

//------------Get All Delivery Resturant whos menu is greayter then 0 product  ----------------//

router.get('/delivery', async (req, res) => {
    try {
        const getAllResturant = await Resturant.find(
            {
                services: { $all: ["Delivery"] },

                "menu.0": { "$exists": true }
            });
        res.send(getAllResturant);
    }
    catch (err) {
        res.send(console.log(err));

    }
})


router.get('/menucategies/:id', async (req, res) => {
    const result = await Resturant.findOne({ _id: req.params.id });
    res.send(result.menucategies)
})


router.post('/addMenucategies/:id', async (req, res) => {
    try {
        const getResturant = await Resturant.findOneAndUpdate({ _id: req.params.id },
            {
                $push:
                {
                    menucategies:
                    {
                        name: req.body.name,
                    }
                }
            }, { new: true });
        res.send(getResturant);
    }
    catch (err) {
        res.send(err.message);
    }
})


//------for geting menu detail in reservation------//(11/11/2020)

router.get('/menu/:id', async (req, res) => {
    const getMenu = await Resturant.findOne({ _id: req.params.id });
    res.send(getMenu.menu)
})

//---------add menu----------//
router.post('/addMenu/:id', async (req, res) => {
    try {
        // // menuName = req.body.name,
        // //     menuPrice = req.body.price,
        // menudiscription = req.body.discription,
        //     menucategie = req.body.categie
        const getResturant = await Resturant.findOneAndUpdate({ _id: req.params.id },
            {
                $push:
                {
                    menu:
                    {
                        name: req.body.name,
                        price: req.body.price,
                        discription: req.body.discription,
                        categie: req.body.categie
                    }
                }
            }, { new: true });
        res.send(getResturant);
    }
    catch (err) {
        res.send(err.message)
    }
})

////-------------Update Menu--------//////

router.put('/menuupdate/:id', async (req, res) => {
    const updated = await Resturant.findOneAndUpdate({
        //  "_id": req.params.id,
        "menu._id": req.params.id //get from resturnt menu
    }, {
        "$set": {
            "menu.$.name": req.body.name,
            "menu.$.discription": req.body.discription,
            "menu.$.price": req.body.price,
            "menu.$.menucategie": req.body.menucategie,
            //    "menu.$.name": req.body.name,
        }
    }, { new: true });
    res.send(updated.menu);
})


////-----------Get All Reviews  SPecific Resturnat---------//////

router.get('/review/:id', async (req, res) => {
    const getResturant = await Resturant.findOne({ _id: req.params.id });
    res.send(getResturant.reviews)
})


/////---------------popularReservationRseturants-------------///////

router.get('/popularReservationRseturants', async (req, res) => {/////resturant which is click more time
    try {
        const result = await Resturant.find(
            {
                "menu.0": { "$exists": true },
                "services.0": "DineIn",
                "approvedByAdmin": true
            }

        ).limit(4)
            .sort({ profileVisits: -1 })
        // .select({ profileVisits: 1 })
        res.send(result);
    }
    catch (err) {
        res.send(err.message)
    }
})


/////-----------popularDeliveryRseturants----------------///////

router.get('/popularDeliveryRseturants', async (req, res) => {/////resturant which is click more time
    try {
        const result = await Resturant.find(
            {
                "menu.0": { "$exists": true },
                "services.0": "Delivery",
                "approvedByAdmin": true
            }

        )
            .sort({ profileVisits: -1 })
        // .select({ profileVisits: 1 })
        res.send(result);
    }
    catch (err) {
        res.send(err.message)
    }
})

/////----------------Search Resturant By Type-------------//////////

router.get('/searchByType/:typeOfResturant', async (req, res) => {
    var name = req.params.typeOfResturant
    const result = await Resturant.find()
        .or([{
            name: { $regex: "^" + req.params.typeOfResturant, $options: 'i' },

            "menu.0": { "$exists": true },
            "services.0": "DineIn"

        },
        {
            typeOfResturant: { $regex: "^" + req.params.typeOfResturant, $options: 'i' },

            "menu.0": { "$exists": true },
            "services.0": "DineIn"

        },
        {
            location: { $regex: "^" + req.params.typeOfResturant, $options: 'i' },
            "menu.0": { "$exists": true },
            "services.0": "DineIn"
        },

        {
            "menu.name": { $regex: "^" + req.params.typeOfResturant, $options: 'i' }
        },

        ]
        )


    res.send(result);
})


router.post('/recomandationSearch', async (req, res) => {
    // var name = req.boday.location
    const result = await Resturant.find()
        .and([{
            location: { $regex: "^" + req.body.location, $options: 'i' },

            "menu.0": { "$exists": true },
            "services.0": "DineIn"
        },
        {
            typeOfResturant: { $regex: "^" + req.body.typeOfResturant, $options: 'i' },

            "menu.0": { "$exists": true },
            "services.0": "DineIn"

        },
        {
            averagePriceInMenu: req.body.averagePriceInMenu,
            "menu.0": { "$exists": true },
            "services.0": "DineIn"
        },

        {
            "menu.name": { $regex: "^" + req.body.menuname, $options: 'i' }
        },
        ])
    res.send(result);
})






router.get('/Reservetion/:id', async (req, res) => {

    let getReservation = await Reservation.find({ reservationId: req.params.id })
    if (!getReservation) {
        return res.status(404).send("you have no reservation yet");
    }
    //findone return only 1 reservation if user reserve 2 or more it does nort return this is the problem with findone

    //may be we save this reservation in user`s property//
    res.send(getReservation);
})

///---------------Reservation request-----------///

router.get('/Reservetion/placed/:id', async (req, res) => {

    let getReservation = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,

            reservationStatus: "placed"
        })
    if (!getReservation) {
        return res.status(404).send("no reservation")
        //.json({ message: "There is No reservation request" })
    }
    res.send(getReservation);
})

//------------------Update Reservation Status----------------// 

router.get('/confirmReservation/:id', async (req, res) => {
    const getUpdatedReservation = await Reservation.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            reservationStatus: "confirm",
        }, { new: true }
    );
    res.send(getUpdatedReservation);
})


router.get('/completeReservation/:id', async (req, res) => {
    const getUpdatedReservation = await Reservation.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            reservationStatus: "complete",
        }, { new: true }
    );
    res.send(getUpdatedReservation);
})


router.get('/confirmdReservation/:id', async (req, res) => {
    const getUpdatedReservation = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,
            reservationStatus: "confirm",
        }
    );
    res.send(getUpdatedReservation);
})


router.get('/completedReservation/:id', async (req, res) => {
    const getUpdatedReservation = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,
            reservationStatus: "complete",
        }
    );
    res.send(getUpdatedReservation);
})


router.put('/rejectReservation/:id', async (req, res) => {
    const getUpdatedReservation = await Reservation.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            reservationStatus: "reject",
            rejectionReason: req.body.rejectionReason
        }, { new: true }
    );
    res.send(getUpdatedReservation);
})
router.get('/rejectReservation/:id', async (req, res) => {
    const getUpdatedReservation = await Reservation.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            reservationStatus: "reject",
            // rejectionReason: req.body.rejectionReason
        }, { new: true }
    );
    res.send(getUpdatedReservation);
})

router.put('/rejectDelivery/:id', async (req, res) => {
    const getUpdatedDelivery = await Delivery.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            deliveryStatus: "reject",
            rejectionReason: req.body.rejectionReason
        }, { new: true }
    );
    res.send(getUpdatedDelivery);
})

///---------------Confirm Reservations request-----------///

router.get('/Reservetion/confirm/:id', async (req, res) => {
    let getReservation = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,

            reservationStatus: "confirm"
        })
    if (!getReservation) {
        return res.status(404).send("No COnfirm Reservation Yet")
        //.json({ message: "There is No reservation request" })
    }
    res.send(getReservation);
})

router.get('/Reservetion/Completed/:id', async (req, res) => {

    let getReservation = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,
            reservationStatus: "Complete"
        })
    if (!getReservation) {
        return res.status(404).send("No COnfirm Reservation Yet")
        //.json({ message: "There is No reservation request" })
    }
    res.send(getReservation);
})

router.get('/Reservetion/Cencel/:id', async (req, res) => {

    let getReservation = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,

            reservationStatus: "cencel"
        })
    if (!getReservation) {
        return res.status(404).send("No Cencel reservation yet")
        //.json({ message: "There is No reservation request" })
    }
    res.send(getReservation);
})

router.get('/confirmDelivery/:id', async (req, res) => {
    const getUpdatedDeliveriy = await Delivery.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            deliveryStatus: "confirm",
        }, { new: true }
    );
    res.send(getUpdatedDeliveriy);
})

router.get('/completedDelivery/:id', async (req, res) => {
    const getUpdatedDeliveriy = await Delivery.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        {
            deliveryStatus: "Completed",
        }, { new: true }
    );
    res.send(getUpdatedDeliveriy);
})

///---------------Delivery request-----------///
router.get('/Delivery/placed/:id', async (req, res) => {
    let getDelivery = await Delivery.find(
        {
            "resturant.resturantId": req.params.id,
            deliveryStatus: "placed"
        })
    if (!getDelivery) {
        return res.status(404).send("no Delicvery")
    }
    res.send(getDelivery);
})

///---------------Confirm Reservations request-----------///

router.get('/Delivery/confirm/:id', async (req, res) => {
    let getDelivery = await Delivery.find(
        {
            "resturant.resturantId": req.params.id,
            deliveryStatus: "confirm"
        })
    if (!getDelivery) {
        return res.status(404).send("no Delicvery")
    }
    res.send(getDelivery);

})
router.get('/Delivery/Completed/:id', async (req, res) => {
    let getDelivery = await Delivery.find(
        {
            "resturant.resturantId": req.params.id,
            deliveryStatus: "Completed"
        })
    if (!getDelivery) {
        return res.status(404).send("no Delicvery")
    }
    res.send(getDelivery);
})




//------------------Get All Reservation history-----------------// 
router.get('/Reservation/History/:id', async (req, res) => {
    const getReservationHistory = await Reservation.find({ resturantId: req.params.id })
        .sort({ dateOfReservation: 1 });
    if (!getReservationHistory) {
        return res.status(404).send("you have no reservation yet");
    }
    try {
        // const resturant = await Resturant.findById(getReservationHistory.resturantId)
        res.send(getReservationHistory)
    }
    catch (err) { res.send(err.message) }
})













router.get('/profileVisits/:id', async (req, res) => {
    const getResturant = await Resturant.findOne({ _id: req.params.id });

    var visit = getResturant.profileVisits + 1
    console.log(visit)

    const result = await Resturant.findOneAndUpdate({ _id: req.params.id },
        {
            "$set":
            {
                "profileVisits": visit

            }
        }, { new: true });
    res.send(result);
    // const getUpdatedResturant =
    //     await Resturant.findOneAndUpdate(
    //         { _id: req.params.id },
    //         {
    //             "$set":
    //             {
    //                 "profileVisits": 

    //             }
    //         }, { new: true });

    // res.send(getUpdatedResturant);
})


router.post('/account/:id', async (req, res) => {
    try {
        const getResturant = await Resturant.findOneAndUpdate({ _id: req.params.id },
            {
                $set:
                {
                    easyPaisaAccount:
                    {
                        easyPaisaName: req.body.easyPaisaName,
                        easyPaisaPhone: req.body.easyPaisaPhone,
                        //  varified
                    }
                }
            }, { new: true });
        res.send(getResturant);
    }
    catch (err) {
        res.send(err);
    }
})

//-------------Get name of resturant----------////

router.get('/:id', async (req, res) => {
    const result = await Resturant.findById(req.params.id)

    res.json(result);
})




module.exports = router;