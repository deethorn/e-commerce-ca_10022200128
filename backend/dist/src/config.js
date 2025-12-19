"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_EXPIRY = exports.JWT_EXPIRY = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
exports.JWT_SECRET = requireEnv('JWT_SECRET');
exports.JWT_REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET');
exports.JWT_EXPIRY = process.env.JWT_EXPIRY ?? '15m';
exports.JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY ?? '7d';
