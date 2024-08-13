import { IUserInterface, userSearchableField } from "./user.interface";
import UserModel from "./user.model";

// Find A User is Exist ?
export const checkAUserExitsWhenReg = async (
  user_phone: string
): Promise<IUserInterface | null> => {
  const FindUser: IUserInterface | null = await UserModel.findOne({
    user_phone: user_phone,
  });
  return FindUser;
};

// Registration A User
export const postRegUserServices = async (
  data: IUserInterface | any
): Promise<IUserInterface | null> => {
  const createUser = await UserModel.create(data);
  const userWithoutPassword = await UserModel.findById(createUser?._id).select(
    "-user_password"
  );
  return userWithoutPassword;
};

// Find All User
export const findAllUser = async (
  limit: number,
  skip: number,
  searchTerm: any
): Promise<IUserInterface[] | []> => {
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableField.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const FindUser: IUserInterface[] | [] = await UserModel.find(whereCondition)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .select("-user_password");
  return FindUser;
};

// Update account Status
export const updateUserStatusServices = async (
  user_status: string,
  user_phone: string
): Promise<IUserInterface | any> => {
  const findUser: IUserInterface | null = await UserModel.findOne({
    user_phone: user_phone,
  });
  if (!findUser) {
    return {};
  } else {
    const users = await UserModel.updateOne(
      { user_phone: user_phone },
      { user_status: user_status },
      {
        runValidators: true,
      }
    );
    return users;
  }
};

// Delete a user
export const deleteUserServices = async (
  id: string
): Promise<IUserInterface | any> => {
  const findUser: IUserInterface | null = await UserModel.findOne({ _id: id });
  if (!findUser) {
    return null;
  }
  const users = await UserModel.deleteOne(findUser, {
    runValidators: true,
  });
  return users;
};
