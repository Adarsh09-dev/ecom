import OrderModel from "../models/Order-Model.js";
import UserModel from "../models/User-Model.js";


export const CashOnDeliveryOrderController = async (req, res) => {

    try {

        const userId = req.userId // auth
        const { list_items, totalAmt, addressId, subTotalAmt } = req.body


        // userId:
        // orderId:
        // productId:
        // product_detials: {
        //     name : "",
        //     image : ""
        // }
        // paymentId:
        // paymenat_status: ery_address:
        // subTotalAmt:
        // totalAmt:
        // Invoice_recept:





    } catch (error) {
        return res.status(500).json({

            message: error.message || error,
            errro: true,
            success: false

        })
    }
}