import AddressModel from "../models/Address-Model.js";
import UserModel from "../models/User-Model.js";
import CartProductModel from "../models/cartProduct-Model.js";
import session from "express-session";
import flash from "connect-flash";
import { log } from "console";




// Render Add Address Page
export const addAddressPage = async (req, res) => {
    try {
        console.log("REQUSET QUERY.................................................", req.query.from)
        res.render("Address/address", {
            layout: false,
            user: req.session.user.id,
            address: null, // No address data for adding a new address
            from: req.query.from ?? "address"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};


// Save Address
export const addAddressController = async (req, res) => {
    try {

        const {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            from
        } = req.body;


        // Validation
        if (
            !address_line ||
            !city ||
            !state ||
            !pincode ||
            !country ||
            !mobile
        ) {

            return res.status(400).send("All fields are required.");

        }

        // Create Address
        const createdAddress = new AddressModel({
            userId: req.session.user.id, // Logged in user
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        });

        const saveAddress = await createdAddress.save();


        // Redirect back to checkout

        if (from === "checkout") {
            return res.redirect("/address/checkout");
        } else {
            return res.redirect("/address");
        }


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};





//MANAGE ADDRESS (address list page)
export const addressListPage = async (req, res) => {
    try {

        const userId = req.session.user.id;
        console.log('log to userId', userId);

        const createdAddress = await AddressModel.find({ userId });
        console.log("addresslist", createdAddress);

        res.render("Address/address-list", {
            layout: false,
            createdAddress,
            userId
        });

    } catch (error) {

        console.log("Address List Error:", error);
        res.status(500).send("Server Error");
    }

}



// EDIT ADDRESS
export const updateAddressPage = async (req, res) => {
    console.log(".........edit page 1 ...........");

    try {
        const { id } = req.params;

        console.log("Address ID:", id);
        console.log("User ID:", req.session.user.id);

        const address = await AddressModel.findOne({
            _id: id,
            userId: req.session.user.id
        });

        console.log("Found Address:", address);

        // if (!address) {
        //     req.flash("error", "Address not found");
        //     return res.redirect("/address/checkout");
        // }

        return res.render("Address/edit-address", {
            layout: false,
            user: req.session.user.id,
            address
        });

    } catch (error) {
        console.log("Update Address Page Error:", error);

        req.flash("error", "Unable to edit address");
        return res.redirect("/address/checkout");
    }
};



// UPDATE ADDRESS
export const updateAddressController = async (req, res) => {

    try {

        const userId = req.session.user.id;
        const { id } = req.params;


        const {
            address_line,
            city,
            state,
            pincode,
            country,
            mobile
        } = req.body;

        const updatedAddress = await AddressModel.updateOne(
            {
                _id: id,
                userId: userId
            },
            {
                address_line,
                city,
                state,
                pincode,
                country,
                mobile
            }
        );

        console.log("Updated Address:", updatedAddress);

        req.flash("success", "Address updated successfully");
        res.redirect("/address");

    } catch (error) {

        console.error(error);

        req.flash("error", "Failed to update address");

        res.redirect("/address");
    }
};
// DELETE ADDRESS
export const deleteAddressController = async (req, res) => {
    try {
        const { id } = req.params;

        const userId = req.session.user.id;

        const deletedAddress = await AddressModel.findOneAndDelete({
            _id: id,
            userId: userId,
        });

        if (!deletedAddress) {
            req.flash("error", "The requested address could not be found.");
            return res.redirect("/address");
        }

        console.log("Address deleted");

        req.flash("success", "Address has been deleted successfully.");
        return res.redirect("/address");

    } catch (error) {
        console.log(error);

        req.flash(
            "error",
            "We couldn't delete the address. Please try again."
        );

        return res.redirect("/address");
    }
};

// CHECK OUT PAGE
export const checkoutPage = async (req, res) => {

    try {

        const userId = req.session.user.id;
        const createdAddress = await AddressModel.find({ userId });

        const cartItems = await CartProductModel.find({ userId })
            .populate("productId")


        let validCartItems = cartItems.filter(item => item.productId);


        let totalPrice = 0;
        let totalQuantity = 0;


        validCartItems.forEach(item => {
            totalPrice += Number(item.productId.price) * item.quantity;
            totalQuantity += item.quantity;

        });


        let deliveryCharge = validCartItems.length > 0 ? 50 : 0;
        let grandTotal = totalPrice + deliveryCharge;


        console.log(totalPrice, totalQuantity, deliveryCharge, grandTotal);
        console.log(cartItems);
        console.log(validCartItems);

        res.render("Checkout/checkout-page", {
            layout: false,
            createdAddress,
            cartItems: validCartItems,
            totalPrice,
            totalQuantity,
            deliveryCharge,
            grandTotal
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};