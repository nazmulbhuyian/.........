import { IUserInterface } from "../userReg/user.interface";
import UserModel from "../userReg/user.model";

// Check a user is exists?
export const findUserInfoServices = async (user_phone: string): Promise<IUserInterface | null> => {
    const user = await UserModel.findOne({ user_phone: user_phone }).select('-user_password');
    if (user) {
        return user;
    } else {
        return null
    }
}

// update user information
export const updateUserInfoService = async (data: IUserInterface | any): Promise<IUserInterface | any> => {
    const updateUserInfo: IUserInterface | null = await UserModel.findOne({ user_phone: data?.user_phone })
    if (!updateUserInfo) {
        return {}
    }
    const users = await UserModel.updateOne({ user_phone: data?.user_phone }, data, {
        runValidators: true
    });
    return users;
}
