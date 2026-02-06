import UserModel from "../models/User-Model.js";

import bcrypt from 'bcrypt'

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || password) {
      return res.status(400).json({
        message: "provide email, name, password",
        error:true,
        success:false
      });
    }

    const user = await UserModel.findOne({email})


    if(user){
        return res.json({
        message:'All ready redgister',
        error:true,
        success:false
    })
        
    }

    const salt = await bcrypt.genSalt(10)
     const hashPassword = await bcrypt.hash(password,salt)

     const payload = {
        name,
        email,
        password:hashPassword
     }

     const newUser = new UserModel(payload)
     const save = await newUser.save()

  } catch (err) {
    return res.status(500).json({
      message: error.message || error,
      status: true,
      success: false,
    });
  }
}
