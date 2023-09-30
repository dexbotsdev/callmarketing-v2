import { getPairData } from "../../processor/TokenProcessor";


export const MadPepeCalls= (text: string)=>{

    try{
    
      

// Define a regular expression to extract Ethereum addresses
const ethereumAddressRegex = /0x[a-fA-F0-9]{40}/g;

// Extract Ethereum addresses using the regular expression
const ethereumAddresses = text.match(ethereumAddressRegex);


console.log("Pair Address:", ethereumAddresses && ethereumAddresses[0]);

if(!ethereumAddresses) return null;

return getPairData(ethereumAddresses[0]);


    }catch(Error){
        console.log('Parse Error '+ Error);
    }
    }