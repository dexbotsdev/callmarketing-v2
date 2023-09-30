import { getPairData } from "../../processor/TokenProcessor";


export const nomsgems= (text: string)=>{

    try{
    
// Define a regular expression to extract Ethereum addresses
const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/;

// Extract Ethereum addresses using the regular expression
const ethereumAddressMatch = text.match(ethereumAddressRegex);
const ethereumAddress = ethereumAddressMatch ? ethereumAddressMatch[0] : null;

console.log("Pair Address:", ethereumAddress);
if(!ethereumAddress) return null;

return getPairData(ethereumAddress);

    }catch(Error){
        console.log('Parse Error '+ Error);
    }
    }