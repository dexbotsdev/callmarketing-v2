"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
class TelegramBotService {
    client;
    channels;
    botAuthToken;
    formatter;
    constructor(config) {
        this.client = new node_telegram_bot_api_1.default(config.botAuthToken, { polling: true });
        this.botAuthToken = config.botAuthToken;
        this.formatter = Intl.NumberFormat('en', { notation: 'compact' });
    }
    sendNewCallMessage = async (message) => {
        const commandDetail = JSON.parse(message);
        let formatter = Intl.NumberFormat('en', { notation: 'compact' });
        let outmessage = `<b>🟢 Caller 1</b> »  ${commandDetail.callerTG}

<b>🚀 Token :</b>  $${commandDetail.tokenSymbol} || ${commandDetail.tokenName}


<b>💰 Real-Time Mcap :</b>  ${formatter.format(commandDetail.tokenMC)}
<b>🔥 First Call :</b> ${commandDetail.firstCaller} @ ${formatter.format(commandDetail.firstMC)} mcap

<b>📞 C :</b>  ${commandDetail.tokenAddress}  
        
        
<b>First on Zodiac CallerStats</b>
        `;
        this.client.sendMessage(-1001919503254, outmessage, { parse_mode: "HTML" });
    };
    sendUpdatedCallMessage = async (message) => {
        const commandDetail = JSON.parse(message);
        let formatter = Intl.NumberFormat('en', { notation: 'compact' });
        let outmessage = `<b>🟢 Caller 1</b> »  ${commandDetail.callerTG}

<b>🚀 Token :</b>  $${commandDetail.tokenSymbol} || ${commandDetail.tokenName}


<b>💰 Real-Time Mcap :</b>  ${formatter.format(commandDetail.tokenMC)}
<b>🔥 First Call :</b> ${commandDetail.firstCaller} @ ${formatter.format(commandDetail.firstMC)} mcap

<b>📞 C :</b>  ${commandDetail.tokenAddress}  
        
        
<b>First on Zodiac CallerStats</b>
        `;
        this.client.sendMessage(-1001919503254, outmessage, { parse_mode: "HTML" });
    };
    getCallCountBalls = (cnt) => {
        let disp = '';
        for (var i = 1; i <= cnt; i++) {
            disp = disp + '🟢';
            if (i % 3 === 0)
                disp = disp + '||';
        }
        return disp;
    };
    getCallerLines(calls) {
        let outcome = '     ';
        for (var i = 0; i < calls.length; i++) {
            outcome += `    <b><u>${i + 1}. ${calls[i].callerTG}</u></b>
    
            🟦 <b> Market Cap : $${this.formatter.format(calls[i].mcap)} </b>
    
    `;
        }
        return outcome;
    }
    sendReport = async (message) => {
        const commandDetail = JSON.parse(message);
        let outmessage = `<b> 🚀 Total Calls Recieved : ${commandDetail.callCount}</b> »  $${commandDetail.calls[0].tokenSymbol}

${this.getCallCountBalls(commandDetail.callCount)}

${this.getCallerLines(commandDetail.calls)}

<b>🚀 Token Name :</b>  $${commandDetail.calls[0].tokenName} (${commandDetail.calls[0].tokenSymbol})
<b>📌 CA :</b>  ${commandDetail.tokenAddress} 
<b>📈 Chart :<a href="https://dex.guru/token/eth/${commandDetail.tokenAddress}" >DexG</a></b>


------------------------------------------------
<b>Call Alerts from @callmerketing</b>
        `;
        this.client.sendMessage(-1001919503254, outmessage, { parse_mode: "HTML",
            disable_web_page_preview: true });
    };
    subscribe = async () => {
        this.client.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            try {
                console.log(msg);
            }
            catch (error) {
                console.log('User AlreadyExists');
            }
            this.client.sendMessage(chatId, "Hi There Friend! I'm Your New Friend in Tech, here to treat you with some Live Friends Information ");
        });
    };
    initClient = async () => {
    };
}
exports.default = TelegramBotService;
