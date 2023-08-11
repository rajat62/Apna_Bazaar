import mongoose from "mongoose";

const productSchema = mongoose.Schema({
      name: {type: String, required: true},
      imagelink : {type: String, required: true},
      price : {type: Number, required: true},
      quantity: {type : Number, required: true},
      details: {type:String, required: true},
})

export default mongoose.model("Product", productSchema);