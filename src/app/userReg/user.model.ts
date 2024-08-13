import { Schema, model } from "mongoose";
import { IUserInterface } from "./user.interface";

// User Schema
const userSchema = new Schema<IUserInterface>({
    user_name: {
        type: String
    },
    user_password: {
        type: String
    },
    user_phone: {
        required: true,
        unique: true,
        type: String,
        validate: {
            validator: function (v: any) {
                return /^\d{11}$/.test(v); // Validate format and length
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    user_address: {
        type: String
    },
    user_district: {
        type: String
    },
    user_division: {
        type: String
    },
    user_role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
    user_status: {
        type: String,
        enum: ["active", "in-active"],
        default: "in-active",
    },
}, {
    timestamps: true
})

const UserModel = model<IUserInterface>("users", userSchema);

export default UserModel;
