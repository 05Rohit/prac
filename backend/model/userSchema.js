const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: Number,
         required:true
    },
    work:
    {
        type: String, 
        required:true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default:Date.now
    },
    messages:[
        {
            name:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required: true
            },
            phone:{
                type: Number,
                 required:true
            },
            message:{
                type: String,
                required: true
            }


        }
    ],

    tokens: [ 
         // token genetrate for every each login means, user jitna baar login karega utna baar token (unique every time) genrate hoga .ie. agar user 10 baar login karta hai to haar baar new token genetare hoga us particulatr user ke liye

         {
            token: {
                type:String,
                required:true
            }
         }
    ]
      

})


//we are hashing the password here using "bcrypt" module, this is a middleware

// pre method work like pahale.....i.e ye function work karega just "save" function se pahale ..means hashing password ka hoga uske baad data save hoga save function ke through database mee....
userSchema.pre('save', async function (next){
    console.log("hi from password hashing");

    if(this.isModified('password'))
    {
        this.password= await bcrypt.hash(this.password,12);
        this.cpassword= await bcrypt.hash(this.cpassword,12);
    }next();

});

// collection stored
const User = mongoose.model('USER',userSchema);

module.exports=User;