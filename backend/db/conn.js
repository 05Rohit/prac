const mongoose=require('mongoose')

// connect  to data base mongoDB Atlas 
mongoose.set('strictQuery',false);

const DB=process.env.DATABASE;

mongoose.connect(DB,
).then(()=>{
    console.log('connection established to the dataBase')
}).catch((err) => console.log(err));