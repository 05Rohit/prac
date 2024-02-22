const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

const authenticate = require("../middleware/authenticate");
require("../db/conn");
const User = require("../model/userSchema");


/*{ registeration route } */
router.post("/register", async (req, res) => {

  console.log(req.body);
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "fill the data" });
  }
  try {
    const userExists = await User.findOne({ email:email });

    if (userExists) {
      return res.status(400).json({ error: "User Email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password don't Matched with confirm password" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      await user.save();

      // res.status(200).json({ user });
      res.status(201).json("uploaded");
    }
  } catch (error) {
    console.log(error);
  }
});


/*{ LOGIN deatils form validation route} */
// we use asyn and awit method for getting the data
// login route

router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Fill the data" });
    }

    // read the data of the MONGODB data base.

    const userLogin = await User.findOne({ email: email });
    //first email from the data base and the second email from the user filled during login 
    // in userLogin Full schema data we got in form of object

    if (userLogin) {
      //match the password with data base to verify the user.
      const isMatch = await bcrypt.compare(password, userLogin.password);
      //   console.log(`this is awesome ${req.cookies.jwtoken}`);

      // check given condition is true or not using loop
      if (!isMatch) {
        res.status(400).json({ error: "Invalid credials backend" });
      } 
      else {
        // using token after for th user who is login correctly ,each user have their unique token for verification that the content is belong to that specific user...by help of json-web-token

         token = await userLogin.generateAuthToken();
        console.log("the token part ::" + token);

        // cookie store data in the local storage for particular session
        res.cookie("jwttoken", token, {
          expires: new Date(Date.now() + 86400000), //30 days in millisecond 25892000000
          httpOnly: true,
        });

        
        // res.json({ message: "user signin sucessfully from backend" });
        res.json({userLogin})
      }
    }
    else {
      res.status(400).json({ error: "Invalid Credientials from backend server" });
    }
  } 
  catch (err) {
    console.log(err);
  }
});

//Logout ke liye
// router.post("/logout", async (req, res)=>{
//   res.status (200).cookie("token", "", { expires: new Date(Date.now) }).json({success: true,user: req.user,})
// });


// About as ka page
router.get("/about", authenticate, (req, res) => {
  console.log("hello from backend about")
   res.send(req.rootUser);
  
});

// logout ka page
router.get("/logout", authenticate, (req, res) => {
  console.log("hello from logout page")
  res.clearCookie('jwttokwn',{path:'/'})
   res.status(200).send('user logout');
  
});

// get user data for contact us and home page

router.get("/getdata",authenticate,(req,res) => {
  console.log("hello from contact Backend");
  res.send(req.rootUser);
})

// connect us page
router.post("/contact",authenticate,async(req,res) => {
  try {
    const {name,email,phone,message} = req.body;
    if(!name || !email || !phone || !message) {
      console.log("contact form error")
      return res.json({error:" please fill the contact form"})
    }
    const userContact =await User.findOne({_id:req.userID});

    if(userContact)
    {
      const userMessage = await userContact.addMessage(name,email,phone,message);

      await userContact.save();

      res.status(201).json({message:"user contact successfully"});
    }
    
  } catch (error) {
    console.log(error)
  }

})



module.exports = router;
