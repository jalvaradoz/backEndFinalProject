import mongoose from "mongoose"

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    lastName: { type: String },
    email: { type: String, require: true },
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel