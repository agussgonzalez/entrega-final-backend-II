import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Cambiado a product_id
        thumbnails: {type: String, required: true},
        quantity: { type: Number, required: true }
    }]
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;
