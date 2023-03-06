const mongoose = require("mongoose");
require("dotenv").config();
//===========================

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Database got connected ")
})
mongoose.set('strictQuery',false)
