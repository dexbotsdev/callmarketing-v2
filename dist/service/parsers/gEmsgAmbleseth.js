"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gEmsgAmbleseth = void 0;
const TokenProcessor_1 = require("../../processor/TokenProcessor");
const gEmsgAmbleseth = (text) => {
    try {
        // Define a regular expression to extract Ethereum addresses
        const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;
        // Extract Ethereum addresses using the regular expression
        const ethereumAddressMatch = text.match(ethereumAddressRegex);
        const ethereumAddress = ethereumAddressMatch ? ethereumAddressMatch[0] : null;
        console.log("Token Address:", ethereumAddress);
        return (0, TokenProcessor_1.getPairData)(ethereumAddress);
    }
    catch (err) {
        console.log(err);
    }
};
exports.gEmsgAmbleseth = gEmsgAmbleseth;
