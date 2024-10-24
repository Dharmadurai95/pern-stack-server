require('dotenv').config();
const express = require("express");
const logger = require('morgan')
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({urlencoded:true}))
app.use(cors())
const PORT = process.env.PORT || 8000;



app.use(logger('dev'));
const restaurantsRoute = require('./routers/restaurantRouter');
app.use('/api/v1/restaurants/',restaurantsRoute)
app.listen(PORT, () => console.log("server running in port  " + PORT))