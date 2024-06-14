import { log } from "console";
import { IBike } from "./bike.interface";
import { Bike } from "./bike.model";

const createBikeInDatabase = async (payload: IBike) => {
  const result = await Bike.create(payload);
  return result;
};

const getAllBikesFromDatabase = async () => {
  const result = await Bike.find();
  return result;
};

const updateBikeFromDatabase = async (id: string, payload: Partial<IBike>) => {
  console.log({ payload });

  const resulttt = await Bike.findByIdAndUpdate(id, payload, { new: true });

  const result = await Bike.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  console.log({ resulttt }, { result });
  return resulttt;
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
