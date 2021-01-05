
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { deliveryValidation, Delivery } = require('../Models/delivery');
//const { reservationValidation, Reservation } = require('../Models/Reservation');
const { Resturant } = require('../Models/Resturant');
const { User } = require('../Models/user');

router.post('/', async (req, res) => {
    const result = deliveryValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0].message);
    }
    try {

        /*-------------Validation For delivery In Future
           
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

        // const getMenu = Resturant.find({ menu: [req.body.menu] })
        const newDelivery = new Delivery({
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
            dateOfDelivery: req.body.dateOfDelivery,

            order: req.body.order,
            totalBill: req.body.totalBill,
            address: req.body.address

        })
        getUser.deliveryId.push(newDelivery._id);
        getResturant.deliveryId.push(newDelivery._id);

        //    getUser.reservationId=newReservation._id
        const result = await getUser.save();
        //const updateUserReservation=getUser.reservationId.push(newReservation._id);
        //    const reservationCreated = await getResturant.save()
        const saveNewDelivery = await newDelivery.save();
        return res.send(saveNewDelivery);
        //we have to check order selected by user is from the reservation resturant`s menu//
        // if(getResturant.menu!=)
        /*  const menuVaidation=await Resturant.find({menu:req.body.order})//this will return resturant when order have all the property which are part of menu {_id,name,,price}
          res.send(menuVaidation)
          /*if(!menuVaidation)
          {
              let getResturnat=await Resturant.find({name:req.body.name})
              return res.send("select menu from "+getResturnat.name);
          }
          else
          {*/

    }

    catch (err) {
        return res.send(err);
    }

})
module.exports = router;