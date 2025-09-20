import express from 'express';
import mongoose from 'mongoose';   
import bcrypt from 'bcrypt';
import User from './Schema/User.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const server = express();
let PORT =3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
server.use(express.json());

mongoose.connect(process.env.DB_LOCATION,{autoIndex:true});
const access_token=jwt({id:1},process.env.JWT_SECRET,{expiresIn:'1d'});



const formatDataToSend=(user)=>{


    const access_token=jwt.sign({id:user._id},process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        fullname:user.personal_info.fullname,
     
        username:user.personal_info.username,
        
        profile_img:user.personal_info.profile_img,
        
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

server.post('/signin',(req,res)=>{

    let {email,password}=req.body;
    if(!email.length){
        return res.status(403).json({error:"Enter a valid email"});
    }
    if(!password.length){
        return res.status(403).json({error:"Enter a valid password"});
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({error:"Enter a valid email"});
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({error:"Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter"});
    }
    User.findOne({ 'personal_info.email': email })
    .then(user => {
        if (!user) {
            return res.status(403).json({ error: "Invalid email or password" });
        }
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err || !result) {
                return res.status(403).json({ error: "Invalid email or password" });
            }
            return res.status(200).json(formatDataToSend(user));
        });
    })
    .catch(err => {
        return res.status(500).json({ error: "Error signing in" });
    });
});

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
 