import mongoose from "mongoose"

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch(err =>{
    console.log(err.message);
})

mongoose.connection.on('connected', ()=>{
    console.log('Mongoose connected to DB');
})

mongoose.connection.on('error', (err)=>{
    console.log(err.message);
})

mongoose.connection.on("disconnected", ()=>{
    console.log("Mongoose connection disconnected");
})

process.on('SIGINT', async()=>{
    await mongoose.connection.close();
    process.exit(0);
})