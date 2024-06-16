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
exports.User = void 0;
/* eslint-disable  @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_1 = __importDefault(require("http-status"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        select: false,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    role: {
        type: String,
        default: "user",
    },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, 12);
        next();
    });
});
userSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const value = this.getUpdate();
        if (value) {
            if (value.password) {
                throw new appError_1.default(http_status_1.default.FORBIDDEN, "You can not update the password");
            }
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", userSchema);
