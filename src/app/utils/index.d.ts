export type TErrorMessage = {
  path: string;
  message: string;
};
export type TSendinfo = {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  totalPrice: number;
  transactionId: string;
};
export type TErrorMessages = TErrorMessage[];

export type TUserRole = "admin" | "user";
