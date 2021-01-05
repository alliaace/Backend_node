//What is in this file?
/*      
        User SignIn
        User LogIn + LogIn Validation
*/
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Delivery } = require('../Models/delivery');
const { Reservation } = require('../Models/Reservation');
const { Resturant } = require('../Models/Resturant');
const { userValidation, User } = require('../Models/user');


router.post('/SignUp', async (req, res) => {
    const result = userValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
    })

    try {
        const userSaved = await newUser.save();
        // console.log("working")
        return res.send(userSaved);

    }
    catch (err) {
        res.status(500).send(String(err.message));
    }


})

//------------User LogIn------------//
router.post('/login', async (req, res) => {
    const result = logInValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    try {
        const getUser = await User.findOneAndUpdate({ email: req.body.email, password: req.body.password }, { onlineStatus: true })
        if (!getUser) {
            //console.log(getUser);
            return res.status(400).send("user or password incorrect....");
            //   return res.status(404).send("name or password incorrect");
        }
        else
            res.send(getUser);
    }
    catch (error) {

        res.json({
            error: "server is down"
        });

        // res.send(json({ error: 'Internal server error' }));
    }

})

//------------Update User By Id    ------------//
router.put('/:id', async (req, res) => {
    /*  const result = userValidation(req.body);
      if (result.error != null) {
          return res.status(400).send(result.error.details[0].message);
      }*/
    const user = await User.findOneAndUpdate({ _id: req.params.id },
        {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            password: req.body.password,

        });


    // const updatedUser = await user.save();
    return res.send(user);
})

//check findone and find difference when we use find one it return null but when we use find it does not retun null return empty document

///-----------get reservation detail of on reservatin---------///
/*
router.get('/Reservetion/:id', async (req, res) => {

    let getReservation = await Reservation.findOne({ userId: req.params.id })
    if (!getReservation) {
        return res.status(404).send("you have no reservation yet");
    }
    //findone return only 1 reservation if user reserve 2 or more it does nort return this is the problem with findone
    else
        //may be we save this reservation in user`s property//
        res.send(getReservation);
})




*/

router.get('/Reservation/History/:id', async (req, res) => {
    // user = user.name
    const getReservationHistory = await Reservation.find({ userId: req.params.id });
    if (!getReservationHistory) {
        return res.status(404).send("you have no reservation yet");
    }
    //   Resturant.find({})
    //console.log(getReservationHistory[0].resturantId);
    // return res.send(getReservationHistory.userId);
    try {
        const resturant = await Resturant.findById(getReservationHistory.resturantId)

        res.send(getReservationHistory)
    }
    catch (err) { res.send(err.message) }
    //  res.send(getReservationHistory)
    /*   res.json({
           // resturantName: resturant.name,
           order: getReservationHistory.order
       });
       /*const result = await Resturant.findOne({ "menu._id": getReservationHistory.order[0] })
           .select('menu -_id');
   
       res.send(result.menu[1]);*/


})

///---------------Delivery request-----------///

router.get('/Delivery/placed/:id', async (req, res) => {
    let getDelivery = await Delivery.find(
        {
            "user.userId": req.params.id,
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
            "user.userId": req.params.id,
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
            "user.userId": req.params.id,
            deliveryStatus: "Completed"
        })
    if (!getDelivery) {
        return res.status(404).send("no Delicvery")
    }
    res.send(getDelivery);
})



///---------------Reservation request-----------///

router.get('/Reservetion/placed/:id', async (req, res) => {
    let getReservation = await Reservation.find(
        {
            "user.userId": req.params.id,
            reservationStatus: "placed"
        })
    if (!getReservation) {
        return res.status(404).send("no reservation")
    }
    res.send(getReservation);
})

///---------------Confirm Reservations request-----------///

router.get('/Reservetion/confirm/:id', async (req, res) => {
    let getReservation = await Reservation.find(
        {
            "user.userId": req.params.id,
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
            "user.userId": req.params.id,
            reservationStatus: "Completed"
        })
    if (!getReservation) {
        return res.status(404).send("No COnfirm Reservation Yet")
        //.json({ message: "There is No reservation request" })
    }
    res.send(getReservation);
})

router.get('/rejectedReservations/:id', async (req, res) => {
    const getRejectedReservations = await Reservation.find(
        {
            "user.userId": req.params.id,
            reservationStatus: "reject",
        }
    );
    res.send(getRejectedReservations);
})



//------------------Get All Reservation history-----------------// /*
/*router.get('/Reservation/History/:id', async (req, res) => {
    // user = user.name
    const getReservationHistory = await Reservation.findOne({ userId: req.params.id });
    if (!getReservationHistory) {
        return res.status(404).send("you have no reservation yet");
    }
    //   Resturant.find({})
    //console.log(getReservationHistory[0].resturantId);
    // return res.send(getReservationHistory.userId);
    try {
        const resturant = await Resturant.findById(getReservationHistory.resturantId)

        //  res.send(getReservationHistory.order)
        res.json({
            resturantName: resturant.name,

            noOfPersons: getReservationHistory.noOfPersons,
            dateOfReservation: getReservationHistory.dateOfReservation,

            order: getReservationHistory.order
        });
    }
    catch (err) { res.send(err.message) }
    //  res.send(getReservationHistory)
    /*   res.json({
           // resturantName: resturant.name,
           order: getReservationHistory.order
       });
       /*const result = await Resturant.findOne({ "menu._id": getReservationHistory.order[0] })
           .select('menu -_id');
   
       res.send(result.menu[1]);*/


//})
router.get('/order/:id', async (req, res) => {

    const result = await Resturant.findOne({ "menu._id": req.params.id })
        .select('menu -_id');
    console.log(typeof (result));
    //  console.log((Object.keys(result)));
    res.send(result.menu[0]);

    //.select

    /*    db.students.find(
            { "grades.mean": { $gt: 70 } },
            { "grades.$3": 1 }
         )
    */
})
router.get('/order/:id', async (req, res) => {
    const result = await Reservation.findById(req.params.id);
    res.send(result.order);
})


///////post Review////
router.post('/review/:id/:userId', async (req, res) => {


    try {
        const getUser = await User.findById(req.params.userId);

        const getResturant = await Resturant.findOneAndUpdate({ _id: req.params.id },
            {
                $push:
                {
                    reviews:
                    {
                        userId: getUser._id,
                        userName: getUser.name,
                        review: req.body.review
                    }
                }
            }, { new: true });

        res.send(getResturant);
    }
    catch (err) {
        res.send(err.message)
    }
})



//------------LogIn Validation-----------//
function logInValidation(user) {
    const userSchema = Joi.object({
        email: Joi.string().email().required().min(3).max(120),
        password: Joi.string().min(6).max(30).required(),
    })
    return userSchema.validate(user)
}
module.exports = router;