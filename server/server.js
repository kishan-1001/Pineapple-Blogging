import express from 'express';
import mongoose from 'mongoose';   
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import 'dotenv/config';
const server = express();
let PORT =3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json());

mongoose.connect(process.env.DB_LOCATION,{autoIndex:true});
const formatDataToSend=(data)=>{
    return {
        
        fullname:data.personal_info.fullname,
     
        username:data.personal_info.username,
        
        profile_img:data.personal_info.profile_img,
        
    }
}
const generateUsername=async(email)=>{
    let username=email.split('@')[0];
    let usernameExists=await User.exists({'personal_info.username':username});
    if (usernameExists) {
        username += nanoid().substring(0, 5);
    }
    return username;
}
server.post('/signup',(req,res)=>{    
     let{fullname,email,password}=req.body;
     if(fullname.length<=3){
        return res.status(403).json({error:"Fullname must be at least 3 characters long"});
     } 
     if(!email.length){
        return res.status(403).json({error:"Enter a valid email"});
     } 
     if(password.length<=3){
        return res.status(403).json({error:"Password must be at least 3 characters long"});
     }
     if(!emailRegex.test(email)){
        return res.status(403).json({error:"Enter a valid email"});
     }
     if(!passwordRegex.test(password)){
        return res.status(403).json({error:"Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter"});
     }
     bcrypt.hash(password,10,async(err,hashed_password)=>{
        let username= await generateUsername(email); 
        let user=new User({
            personal_info: {
                fullname: fullname,
                email: email,
                password: hashed_password,
                username: username
            }
        });
        user.save()
        .then((u)=>{
            return res.status(200).json(formatDataToSend(u) );
        })
        .catch(err=>{
            if(err.code==11000){
                return res.status(500).json({error:"Email already registered"});
            }
            return res.status(500).json({error:"Error saving user"});
        })
     })

});
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
 