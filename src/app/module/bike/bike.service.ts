import { IBike } from "./bike.interface";
import { Bike } from "./bike.model";

const createBikeInDatabase = async (payload: IBike) => {
  const result = await Bike.create(payload);
  return result;
};

const getAllBikesFromDatabase = async () => {
  const result = await Bike.find();
  return result;
}

const getSingleBikeFromDatabase = async (id: string) => {
  const result = await Bike.findById(id);
  return result;
}
const updateBikeFromDatabase = async (id: string, payload: Partial<IBike>) => {
  const result = await Bike.findByIdAndUpdate(id, payload, { new: true });
  return result;
}

const deleteASingleBikeFromDatabase = async (id: string) => {
  const result = await Bike.findByIdAndDelete(id);
  return result;
}

export const BikeServices = {
  createBikeInDatabase,
  getAllBikesFromDatabase,
  getSingleBikeFromDatabase,
  updateBikeFromDatabase,
  deleteASingleBikeFromDatabase
};
