"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nomsgems = void 0;
const TokenProcessor_1 = require("../../processor/TokenProcessor");
const nomsgems = (text) => {
    try {
        // Define a regular expression to extract Ethereum addresses
        const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
        // Extract Ethereum addresses using the regular expression
        const ethereumAddressMatch = text.match(ethereumAddressRegex);
        const ethereumAddress = ethereumAddressMatch ? ethereumAddressMatch[0] : null;
        console.log("Pair Address:", ethereumAddress);
        if (!ethereumAddress)
            return null;
        return (0, TokenProcessor_1.getPairData)(ethereumAddress);
    }
    catch (Error) {
        console.log('Parse Error ' + Error);
    }
};
exports.nomsgems = nomsgems;
