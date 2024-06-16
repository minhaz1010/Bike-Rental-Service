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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const comparePassword_1 = __importDefault(require("../../utils/comparePassword"));
const loginService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "No user found with this email");
    }
    const check = yield (0, comparePassword_1.default)(payload.password, user.password);
    if (check === false) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Your password is wrong");
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const userObj = user.toObject();
    delete userObj['password'];
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.JWT_SECRET, {
        expiresIn: config_1.default.JWT_EXPIRES,
    });
    return {
        userObj,
        token,
    };
});
const signUpAUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.User(payload);
    yield user.save();
    const userObj = user;
    delete userObj['password'];
    return userObj;
});
exports.AuthServices = {
    loginService,
    signUpAUserService,
};
