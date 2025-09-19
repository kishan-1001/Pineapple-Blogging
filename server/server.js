import express from 'express';
import mongoose from 'mongoose';   
const server = express();
let PORT =3000;
mongoose.connect();
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
 