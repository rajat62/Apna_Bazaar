import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
      productId :{type: String, required:true}
})

export default mongoose.model("Cart", cartSchema);