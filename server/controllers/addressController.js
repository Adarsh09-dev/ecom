import AdressModel from "../models/Address-Model.js";
import UserModel from "../models/User-Model.js";

export const addAdddressController = async (req, res) => {
    try {
        const userId = req.userId // middleware
        const { address_line, city, state, pincode, country, mobile} = req.body

        const createAddress = new AdressModel({
            address_line,
            city,
            state,
            country,
            pincode,
            mobile

        });
        const saveaddress = await createAddress.save();

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push : {
                address_detials: saveaddress._id,
            }

        }) 

        
    } catch (error) {

     res.status(500).send("Server Error");
     
    }
    
}