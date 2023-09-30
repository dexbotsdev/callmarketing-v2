import { getPairData } from "../../processor/TokenProcessor";


export const LuffyChanCalls= (text: string)=>{

    try{
    
  
// Extracting the token name (e.g., $LUPE - ETH)
const tokenNameRegex = /^\$(.*?)\s+-\s+(\w+)\s+✅/m;
const tokenNameMatch = text.match(tokenNameRegex);
const tokenSymbol = tokenNameMatch ? tokenNameMatch[1].replace(/[^a-zA-Z0-9]/g, '') : "N/A"; // Removes improper characters
const tokenPair = tokenNameMatch ? tokenNameMatch[2] : "N/A";   // ETH

// Extracting information about the token
const infoRegex = /Just launched, name look bullish with LP locked one month, CA renounced\. But only gamble for now, aped some\. DYOR!/m;
const infoMatch = text.match(infoRegex);
const tokenInfo = infoMatch ? infoMatch[0] : "N/A"; // Just launched, name look bullish with LP locked one month, CA renounced. But only gamble for now, aped some. DYOR!

// Extracting Tax and Market Cap information
const taxRegex = /Tax:\s+(.*?)\n/m;
const marketCapRegex = /Mcap:\s+(.*?)\n/m;

const taxMatch = text.match(taxRegex);
const marketCapMatch = text.match(marketCapRegex);

const tax = taxMatch ? taxMatch[1].replace(/[^a-zA-Z0-9/]/g, '') : "N/A"; // Removes improper characters
const marketCap = marketCapMatch ? marketCapMatch[1].replace(/[^a-zA-Z0-9]/g, '') : "N/A"; // Removes improper characters

// Extracting URLs
const urlRegex = /https:\/\/[^\s]+/g;
const urls = text.match(urlRegex) || []; // In case there are no URLs, initialize as an empty array

// Extracting Token Address from the URL if it contains "dextools" or "dexscreener"
let tokenAddress = "N/A"; // Default value

for (const url of urls) {
  if (url.includes("dextools") || url.includes("dexscreener")) {
    const tokenAddressMatch = url.match(/0x[a-fA-F0-9]{40}/);
    tokenAddress = tokenAddressMatch ? tokenAddressMatch[0] : "N/A"; // Extracted Token Address
    break; // Stop searching after finding the first matching URL
  }
}

console.log("Token Symbol:", tokenSymbol);
console.log("Token Pair:", tokenPair);
console.log("Token Info:", tokenInfo);
console.log("Tax:", tax);
console.log("Market Cap:", marketCap);
console.log("Token Address:", tokenAddress);


return getPairData(tokenAddress);


    }catch(Error){
        console.log('Parse Error '+ Error);
    }
    }