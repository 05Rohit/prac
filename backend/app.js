const dotenv = require('dotenv')
const express = require('express');
const mongoose= require('mongoose');

const app = express();
const cookieParser = require('cookie-parser');
const authenticate = require('./middleware/authenticate');

app.use(cookieParser())


// for hide our pass and batabase url
dotenv.config({path: './config.env'});

 // for databse to our project
require('./db/conn');

app.use(express.json({limit: '25mb'})); // each-data store in data base has limit of 25mb . Data above that limit will not be stored 

// secure the port number
const port =process.env.PORT

// link the router file to make the app.js clean
app.use(require('./router/auth'));

// for product Add and show through backend
app.use(require('./router/product'));

app.get('/', (req, res) => {
    res.send("Hello from the server!");

  });


app.listen(port,()=>{
    console.log(`listening on port on ${port} `)
})