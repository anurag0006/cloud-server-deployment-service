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
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const aws_1 = require("./aws");
const utils_1 = require("./utils");
dotenv_1.default.config();
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const response = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), "build-queue", 0);
            console.log(response);
            //  @ts-ignore
            const id = response.element;
            yield (0, aws_1.downloadS3Folder)(`output/${id}/`);
            yield (0, utils_1.buildProject)(id);
            (0, aws_1.copyFinalDist)(id);
        }
    });
}
main();
