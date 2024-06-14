import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUserInDatabase = async (payload: IUser) => {
  const user = new User(payload);
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

export const UserServices = {
  createUserInDatabase,
};
