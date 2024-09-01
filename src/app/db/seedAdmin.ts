import { User } from "../module/user/user.model";

const admin = {
  name: "admin",
  email: "admin@gmail.com",
  password: "admin123",
  phone: "01800100101",
  address: "Sylhet,Bangladesh",
  role: "admin",
};



const seedAdmin = async () => {
  const isAdminExist = await User.findOne({ role: "admin" });
  if (!isAdminExist) {
    await User.create(admin);
  }
};

export default seedAdmin;
