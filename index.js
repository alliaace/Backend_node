
const express = require('express');
const app = express();
const user = require('./Routers/User');
const resturant = require('./Routers/Resturant');

const delivery = require('./Routers/delivery');
const reservation = require('./Routers/Reservation');
const menu = require('./Routers/Menu');
const admin = require('./Routers/admin');
const cors = require('cors');
app.use(cors())
//++++++++++++DataBase Connection++++++++++++//

const mongoose = require('mongoose');
const { adminValidation } = require('./Models/admin');
mongoose.connect("mongodb://localhost:27017/FYP")

    .then(() => console.log("Connected to FYP...."))
    .catch((err) => console.log("Connection Failed...."));

//++++++++++++Midlle Wares++++++++++++//
const fs = require('fs')

const directories = source => fs.readdirSync(source, {
    withFileTypes: true
}).reduce((a, c) => {
    c.isDirectory() && a.push(c.name)
    return a
}, [])

app.use(express.json());
app.use('/user', user);//SignIn,LogIn,
app.use('/resturant', resturant);
app.use('/admin', admin);
app.use('/delivery', delivery);
app.use('/resturant/menu/', menu);
app.use('/reservation', reservation);
app.get('/', (req, res) => {
    res.send("hello World");
})
app.listen(3000, () => {
    console.log("listening on port no 3000");
})
 /* name:"abubakar",
phone:03424083037,
email:"mianabubakar@gmail.com",
password:"123456",
address:"abc" ,
*/