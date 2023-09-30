"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.question = void 0;
const util_1 = require("util");
const readline_1 = require("readline");
const rl = (0, readline_1.createInterface)({
    input: process.stdin,
    output: process.stdout
});
rl.question[util_1.promisify.custom] = (arg) => {
    return new Promise((resolve) => {
        rl.question(arg, resolve);
    });
};
exports.question = (0, util_1.promisify)(rl.question);
