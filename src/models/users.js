import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email.");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password can not contain 'password'");
            }
        }
    }
});
//This method runs while sending response.
userSchema.methods.toJSON = function(){
    const user = this;
    const dataObject = user.toObject();

    delete dataObject.password;

    return dataObject;
}

//This function runs before saving data to database.
userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
})

export const Users = mongoose.model('users', userSchema);