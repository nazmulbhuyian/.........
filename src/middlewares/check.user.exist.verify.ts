import UserModel from "../app/userReg/user.model";

// Find A User is Exist ?
export const checkAUserExitsForVerify = async (
  user_phone: string
): Promise<any> => {
  const FindUser = await UserModel.findOne({ user_phone: user_phone }).select(
    "user_role user_phone user_status"
  );
  return FindUser;
};
