import { IUserInterface } from "../userReg/user.interface";
import UserModel from "../userReg/user.model";

// Check a user is exists?
export const findUser = async (user_phone: string): Promise<IUserInterface | null> => {
    const users: IUserInterface | null = await UserModel.findOne({ user_phone: user_phone });
    return users;
}

// Update user status
export const updateUserStatus = async (user_phone: string): Promise<IUserInterface | any> => {
    const users: IUserInterface | any = await UserModel.updateOne({ user_phone: user_phone }, { user_status: 'active' }, { runValidators: true });
    return users;
}

// update new password
export const updateforgotPasswordUsersChangeNewPasswordService = async (user_phone: string, user_password: string): Promise<IUserInterface | any> => {
    const findUser: IUserInterface | null = await UserModel.findOne({ user_phone: user_phone })
    if (findUser) {
        const users = await UserModel.updateOne({ user_phone: user_phone }, { user_password: user_password }, {
            runValidators: true
        });
        return users;
    } else {
        return {};
    }
}
