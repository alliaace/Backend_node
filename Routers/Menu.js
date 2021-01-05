
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { Resturant } = require('../Models/Resturant');

let menuSc = {
    name: Joi.string().required().min(3).max(120),
    price: Joi.number().required().min(3),
}

function menuValidation(menu) {
    const menuSchema = Joi.array().items(menuSc)
    return result = menuSchema.validate(menu)
}

router.post('/resturant/menu/:id', async (req, res) => {
    const result = menuValidation(req.body);
    if (result.error != null) {
        return res.status(400).send(result.error.details[0]);
    }
    try {
        const updatedMenu = await Resturant.update({ _id: req.params.id }, {
            $set: { menu: req.body }
        })
        res.send(updatedMenu)
    }
    catch (err) {
        res.send(err);
    }

})
router.put('/resturant/menu/:id', async (req, res) => {
    await Resturant.findById(req.params.id);
})
module.exports = router;
