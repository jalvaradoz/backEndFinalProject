import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    lastName: { type: String },
    email: { type: String, require: true },
})

userSchema.plugin(mongoosePaginate)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel