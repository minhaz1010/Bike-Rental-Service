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
exports.BikeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsyncError_1 = __importDefault(require("../../utils/catchAsyncError"));
const bike_service_1 = require("./bike.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const appError_1 = __importDefault(require("../../errors/appError"));
const createBike = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.createBikeInDatabase(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Bike added successfully",
        result,
    });
}));
const getAllBike = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.getAllBikesFromDatabase();
    if (!result.length) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "No data found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Bikes retrieved successfully",
        result,
    });
}));
const updateBike = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.updateBikeFromDatabase(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Bike updated successfully",
        result,
    });
}));
const deleteBike = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_service_1.BikeServices.deleteASingleBikeFromDatabase(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "Bike deleted successfully",
        result,
    });
}));
exports.BikeController = {
    createBike,
    getAllBike,
    updateBike,
    deleteBike,
};
