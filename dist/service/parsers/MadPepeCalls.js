"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadPepeCalls = void 0;
const TokenProcessor_1 = require("../../processor/TokenProcessor");
const MadPepeCalls = (text) => {
    try {
        // Define a regular expression to extract Ethereum addresses
        const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/g;
        // Extract Ethereum addresses using the regular expression
        const ethereumAddresses = text.match(ethereumAddressRegex);
        console.log("Pair Address:", ethereumAddresses && ethereumAddresses[0]);
        if (!ethereumAddresses)
            return null;
        return (0, TokenProcessor_1.getPairData)(ethereumAddresses[0]);
    }
    catch (Error) {
        console.log('Parse Error ' + Error);
    }
};
exports.MadPepeCalls = MadPepeCalls;
