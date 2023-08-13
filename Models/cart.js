import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
      username: {type:String, required:true},
      productId :{type: String, required:true}
})

export default mongoose.model("Cart", cartSchema);