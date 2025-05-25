import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    items: [{ name: String, price: Number, quantity: Number }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);