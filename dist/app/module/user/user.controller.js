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
exports.UserController = void 0;
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../config"));
const seeUserProfile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = req.headers.authorization;
    if (!headers) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You have no access to this route");
    }
    const authToken = headers.split("Bearer ")[1];
    if (!authToken) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You have no access to this route');
    }
    const payload = jsonwebtoken_1.default.verify(authToken, config_1.default.JWT_SECRET);
    if (!payload) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Payload is corrupted");
    }
    const result = yield user_service_1.UserServices.seeProfileServices(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "User profile retrieved successfully",
        result,
    });
}));
const updateUserProfile = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const headers = req.headers.authorization;
    if (!headers) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You have no access to this route");
    }
    const authToken = headers.split("Bearer ")[1];
    if (!authToken) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You have no access to this route');
    }
    const payload = jsonwebtoken_1.default.decode(authToken);
    if (!payload) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Payload is corrupted");
    }
    const result = yield user_service_1.UserServices.updateProfileServices(payload, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Profile updated successfully",
        result,
    });
}));
exports.UserController = {
    seeUserProfile,
    updateUserProfile,
};
