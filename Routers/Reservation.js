
const express = require('express');
const { func } = require('joi');
const router = express.Router();
const Joi = require('joi');
const { reservationValidation, Reservation } = require('../Models/Reservation');
const { Resturant } = require('../Models/Resturant');
const { User } = require('../Models/user');

router.post('/', async (req, res) => {
    const result = reservationValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    try {

        /*-------------Validation For Reservation In Future
           
                1- Apply validation that user cant reserve same or different resturant at same time 
                2-Cant reserve resturant on same day of reservetion 
                3- can reserve after 6 hour (may be he can reserve resturant for friend/family (optional case) resturant if reserve 
        
        */
        const getUser = await User.findById(req.body.userId);
        if (!getUser) {
            return res.send("invalid user user not found");
        }

        const getResturant = await Resturant.findById(req.body.resturantId);
        if (!getResturant) {
            return res.send("invalid Resturant. Resturant not found");
        }




        var check = await Reservation.findOne({
            "user.userId": getUser._id,
            "resturant.resturantId": getResturant._id
        });
        if (check != null) {

            const getAllReservations = await Reservation.find(
                {
                    dateOfReservation: req.body.dateOfReservation,
                    reservationStatus: "placed",
                    "resturant.resturantId": getResturant._id
                });
            var totalreservation = 0

            for (var i = 0; i < getAllReservations.length; i++) {
                console.log(getAllReservations[i].noOfPersons)
                totalreservation += getAllReservations[i].noOfPersons;
            }
            if ((totalreservation) < getResturant.sittingCapacity)
            // console.log(totalreservation);
            {

                const newReservation = new Reservation({
                    user: {
                        userId: getUser._id,
                        userName: getUser.name,
                        userPhone: getUser.phone,
                    },
                    resturant: {
                        resturantId: getResturant._id,
                        resturantName: getResturant.name,
                        resturantPhone: getResturant.phone,
                    },
                    noOfPersons: req.body.noOfPersons,
                    dateOfReservation: req.body.dateOfReservation,
                    //  timeOfReservation: req.body.timeOfReservation,
                    order: req.body.order,
                    totalBill: req.body.totalBill,
                    userEasyPaisaName: req.body.userEasyPaisaName,
                    userEasyPaisaPhoneNo: req.body.userEasyPaisaPhoneNo,
                    paymentBeforeReservation: req.body.paymentBeforeReservation,
                    newCustomer: "Customer Repeat",

                })
                getUser.reservationId.push(newReservation._id);
                getResturant.reservationId.push(newReservation._id);
                const result = await getUser.save();
                const saveNewReservation = await newReservation.save();
                return res.send(saveNewReservation);
            }
            //  return res.send("REservation DOne")
            else {
                return res.send("Resturant is fully Reserved ")
            }
        }

        else {
            const getAllReservations = await Reservation.find(
                {
                    dateOfReservation: req.body.dateOfReservation,
                    reservationStatus: "placed",
                    "resturant.resturantId": getResturant._id
                });
            var totalreservation = 0

            for (var i = 0; i < getAllReservations.length; i++) {
                console.log(getAllReservations[i].noOfPersons)
                totalreservation += getAllReservations[i].noOfPersons;
            }
            if ((totalreservation) < getResturant.sittingCapacity)
            // console.log(totalreservation);
            {

                const newReservation = new Reservation({
                    user: {
                        userId: getUser._id,
                        userName: getUser.name,
                        userPhone: getUser.phone,
                    },
                    resturant: {
                        resturantId: getResturant._id,
                        resturantName: getResturant.name,
                        resturantPhone: getResturant.phone,
                    },
                    noOfPersons: req.body.noOfPersons,
                    dateOfReservation: req.body.dateOfReservation,
                    //  timeOfReservation: req.body.timeOfReservation,
                    order: req.body.order,
                    totalBill: req.body.totalBill,
                    userEasyPaisaName: req.body.userEasyPaisaName,
                    userEasyPaisaPhoneNo: req.body.userEasyPaisaPhoneNo,
                    paymentBeforeReservation: req.body.paymentBeforeReservation,
                    newCustomer: "New Customer",

                })
                getUser.reservationId.push(newReservation._id);
                getResturant.reservationId.push(newReservation._id);
                const result = await getUser.save();
                const saveNewReservation = await newReservation.save();

                return res.send(saveNewReservation);
            }
            else {
                return res.send("Resturant is fully Reserved")
            }
        }

    }

    catch (err) {
        return res.send(err);
    }

})

router.get('/getNewCustomer/:id', async (req, res) => {

    const customers = await Reservation.find(
        {
            "resturant.resturantId": req.params.id,
            newCustomer: "true",

        })
    res.send(customers)


})

module.exports = router;