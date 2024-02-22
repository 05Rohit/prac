const express = require("express");
const router = express.Router();


const product = require("../model/productShema");

const app = express();
app.use(express.json()); //express.json() middleware ensures that the JSON data is parsed(converted into object form --- Mongo store data in object form) and made available in the req.body object for further processing within the route handler.

app.get('/prod', (req,res)=>{
  res.send("hello product section")
} )


router.post('/uploadproduct',async (req,res) => {

    // save into data base (product is the variable in model of our schema stores)
    const productdata = await product(req.body);
    
     await productdata.save();  
  //  const data= await productdata.save(); 
  
})


// Get all the data from the Database to the frontend (i.e stored in the frontend)
router.get('/productdata',async (req,res) => {
    const data=await product.find({})   //'product ' is the variable  of our schema ya model stores the final data
    res.send(JSON.stringify(data));

  })

  
module.exports = router;