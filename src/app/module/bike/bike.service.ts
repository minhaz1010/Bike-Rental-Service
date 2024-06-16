import { IBike } from "./bike.interface";
import { Bike } from "./bike.model";

const createBikeInDatabase = async (payload: IBike) => {
  const result = await Bike.create(payload);
  return result;
};

const getAllBikesFromDatabase = async () => {
  const result = await Bike.find({isAvailable:true});
  return result;
};

const updateBikeFromDatabase = async (id: string, payload: Partial<IBike>) => {


  const result = await Bike.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteASingleBikeFromDatabase = async (id: string) => {
  const result = await Bike.findOneAndDelete({ _id: id });
  return result;
};

export const BikeServices = {
  createBikeInDatabase,
  getAllBikesFromDatabase,
  updateBikeFromDatabase,
  deleteASingleBikeFromDatabase,
};
