import { getPairData } from "../../processor/TokenProcessor";

export const gEmsgAmbleseth=(text: any)=>{

try{
    // Define a regular expression to extract Ethereum addresses
const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;

// Extract Ethereum addresses using the regular expression
const ethereumAddressMatch = text.match(ethereumAddressRegex);
const ethereumAddress = ethereumAddressMatch ? ethereumAddressMatch[0] : null;

console.log("Token Address:", ethereumAddress);

return getPairData(ethereumAddress);
}catch(err){
    console.log(err)
}

}