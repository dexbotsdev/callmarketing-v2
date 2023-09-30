"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pKnightGambles = void 0;
const TokenProcessor_1 = require("../../processor/TokenProcessor");
const pKnightGambles = (text) => {
    try {
        const tokenRegex = /🪙\$([^\s]+)/;
        const liquidityRegex = /(\d+(?:\.\d+)?k)/;
        const descriptionRegex = /(\d️⃣[^\n]+)/;
        const dextoolsLinkRegex = /(https:\/\/www\.dextools\.io\/app\/[^\n]+)/;
        const telegramLinkRegex = /(https:\/\/t\.me\/[^\n]+)/;
        const lockDurationRegex = /(\d+)\s+year/;
        const taxRegex = /tax\s+(\d+\/\d+)/;
        const addressRegex = /0x[a-fA-F0-9]{40}/; // Ethereum address pattern
        const tokenMatch = text.match(tokenRegex);
        const liquidityMatch = text.match(liquidityRegex);
        const descriptionMatch = text.match(descriptionRegex);
        const dextoolsLinkMatch = text.match(dextoolsLinkRegex);
        const telegramLinkMatch = text.match(telegramLinkRegex);
        const lockDurationMatch = text.match(lockDurationRegex);
        const taxMatch = text.match(taxRegex);
        const addressMatch = text.match(addressRegex);
        const token = tokenMatch ? tokenMatch[1] : null;
        const liquidity = liquidityMatch ? liquidityMatch[1] : null;
        const description = descriptionMatch ? descriptionMatch[1] : null;
        const dextoolsLink = dextoolsLinkMatch ? dextoolsLinkMatch[1] : null;
        const telegramLink = telegramLinkMatch ? telegramLinkMatch[1] : null;
        const lockDuration = lockDurationMatch ? lockDurationMatch[1] : null;
        const tax = taxMatch ? taxMatch[1] : null;
        const address = addressMatch ? addressMatch[0] : null;
        console.log("Token:", token);
        console.log("Liquidity:", liquidity);
        console.log("Description:", description);
        console.log("Lock Duration (Years):", lockDuration);
        console.log("Tax Information:", tax);
        console.log("Token Address:", address);
        console.log("Dextools Link:", dextoolsLink);
        console.log("Telegram Link:", telegramLink);
        return (0, TokenProcessor_1.getPairData)(address);
    }
    catch (Error) {
        console.log('Parse Error ' + Error);
    }
};
exports.pKnightGambles = pKnightGambles;
