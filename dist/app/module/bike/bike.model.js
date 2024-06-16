"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = void 0;
/* eslint-disable  @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const bikeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Your name is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    pricePerHour: {
        type: Number,
        required: [true, "price per hour  is required"],
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    cc: {
        type: Number,
        required: [true, "Bike CC is required"],
    },
    year: {
        type: Number,
        required: [true, "Bike release year is required"],
    },
    model: {
        type: String,
        required: [true, "Bike model is required"],
    },
    brand: {
        type: String,
        required: [true, "Bike brand is required"],
    },
});
bikeSchema.pre(/^findOneAnd(Update|Delete)$/, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = this;
        const _id = query.getQuery()._id;
        const bike = yield exports.Bike.findById(_id).session(null);
        if (!bike) {
            return next(new appError_1.default(http_status_1.default.NOT_FOUND, "No data found"));
        }
        next();
    });
});
// bikeSchema.pre<Query<any, any>>("findOneAndUpdate", async function(next) {
//   const { _id } = this.getQuery();
//
//   const checkExistOrNot = await Bike.findById(_id);
//
//   if (!checkExistOrNot) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "Sorry there is no such bike to update",
//     );
//   }
//
//   next();
// });
//
// bikeSchema.pre<Query<any, any>>("findOneAndDelete", async function(next) {
//   const { _id } = this.getQuery();
//   const checkExistOrNot = await Bike.findById(_id);
//   if (!checkExistOrNot) {
//     throw new AppError(httpStatus.NOT_FOUND, "Sorry there is no such product")
//   }
//   next();
// })
exports.Bike = (0, mongoose_1.model)("Bike", bikeSchema);
