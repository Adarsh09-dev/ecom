import { Router } from 'express'
import {
    addressListPage,
    addAddressPage,
    addAddressController,
    checkoutPage,
    updateAddressController,
    deleteAddressController,
    updateAddressPage,


} from '../controllers/addressController.js'


const addressRouter = Router()

addressRouter.get("/add-address", addAddressPage);
addressRouter.post("/add-address", addAddressController);
addressRouter.get("/checkout", checkoutPage);
addressRouter.get("/",addressListPage);
addressRouter.get("/edit/:id",updateAddressPage)
addressRouter.put("/update/:id",updateAddressController);
addressRouter.delete("/:id",deleteAddressController)








export default addressRouter