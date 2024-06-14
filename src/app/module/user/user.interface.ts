export type TUserRole = "user" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: TUserRole;
}
