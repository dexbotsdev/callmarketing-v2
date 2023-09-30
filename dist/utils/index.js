"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shorten = void 0;
const shorten = (str) => {
    if (str.length < 10)
        return str;
    return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
};
exports.shorten = shorten;
