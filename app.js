const express = require('express');
const cors = require('cors');
// const {info} = require('./utils/logging');


const app = express();  
const dotenv = require('dotenv');
const _= require('lodash');
const connectDB = require('./config/db');
const morgan = require('morgan');

// load config
dotenv.config({path: './config/config.env'})
const port = process.env.PORT;

connectDB();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/v1/user',require('./src/components/routes/user.routes'));
app.use('/v1/products',require('./src/components/routes/product.routes'));
app.use('/v1/orders',require('./src/components/routes/order.routes'))



// api not found !handle 404
app.use(function(req, res, next) {
    res.status(404);

    return res.status(404).json({
        status: 404,
        message: 'API NOT FOUND! Please check the endpoint and the HTTP request type! or contact at @Ayush 💗 ',
        data: {
          url: req.url
        } 
    })
})


app.listen(port, ()=> {
   
    console.log(`Server is running in ${process.env.NODE_ENV} mode on PORT ${port}`);
})