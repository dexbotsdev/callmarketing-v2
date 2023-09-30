"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter_1 = require("emitter");
const fs_1 = __importDefault(require("fs"));
const Logger_1 = __importDefault(require("./service/Logger"));
const TelegramAccountService_1 = __importDefault(require("./service/TelegramAccountService"));
const db_1 = require("./database/db");
const eventEmitter = new emitter_1.EventEmitter();
eventEmitter.setMaxListeners(1);
let config = null;
async function start() {
    await db_1.sequelize.sync({ force: false, alter: true });
    fs_1.default.readFile('./client.config.json', 'utf8', (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        config = JSON.parse(data);
        const tsA = new TelegramAccountService_1.default(config, eventEmitter);
        tsA.subscribe();
        eventEmitter.on('newListener', (event, listener) => {
            Logger_1.default.info(`Added Signal Repeater Server ${event.toUpperCase()} listener.`);
        });
        eventEmitter.on('newSignal', async (tradeSignal) => {
            Logger_1.default.info('Recieved ');
            console.log(tradeSignal);
            const oldSignal = await db_1.TokenCalls.findOne({ where: {
                    tokenAddress: tradeSignal.tokenAddress,
                    callerTG: tradeSignal.callerTG,
                    callerPostId: tradeSignal.callerPostId
                } });
            if (oldSignal && oldSignal.dataValues && oldSignal.dataValues.tokenAddress) {
                Logger_1.default.error('skipping Duplicates');
            }
            else {
                const newTrade = await db_1.TokenCalls.create(tradeSignal);
                tsA.sendTokenCallMessage(JSON.stringify(tradeSignal));
            }
        });
        eventEmitter.on('Disconnected', (message) => {
            Logger_1.default.info('Disconnected -- need to restart ' + message.toUpperCase());
            eventEmitter.removeAllListeners();
            tsA.disconnect();
            start();
        });
        eventEmitter.on('24hourlyStats', async (message) => {
            Logger_1.default.info('Recieved 24 Hourly Stats --   ');
            console.log(message);
        });
    });
}
start();
