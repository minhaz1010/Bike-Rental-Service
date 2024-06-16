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
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const seeProfileServices = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload === null || payload === void 0 ? void 0 : payload.email;
    const result = yield user_model_1.User.findOne({ email }).select("-password");
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "No user found");
    }
    return result;
});
const updateProfileServices = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload === null || payload === void 0 ? void 0 : payload.email;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "No user found");
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email }, userData, {
        new: true,
    }).select("-password");
    return result;
});
exports.UserServices = {
    seeProfileServices,
    updateProfileServices,
};
