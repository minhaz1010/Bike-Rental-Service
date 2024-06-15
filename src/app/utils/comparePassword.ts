import bcryp from "bcrypt";

const checkPasswordIsCorrectOrNot = async (
  payloadPassword: string,
  userPassword: string,
) => {
  return await bcryp.compare(payloadPassword, userPassword);
};

export default checkPasswordIsCorrectOrNot;
