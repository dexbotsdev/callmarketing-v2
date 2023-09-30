"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_1 = require("telegram");
const index_js_1 = require("telegram/sessions/index.js");
const input_1 = require("input");
const db_1 = require("../database/db");
const TokenProcessor_1 = require("../processor/TokenProcessor");
const CustomQuery_1 = require("../database/CustomQuery");
const MessageFormats_1 = require("../processor/MessageFormats");
class TelegramAccountService {
    client;
    channels;
    botClient;
    em;
    chatIds;
    channelMaps;
    alphachannelMaps;
    publishChannel;
    publishTo;
    alphaChannels;
    constructor(config, em) {
        this.client = new telegram_1.TelegramClient(new index_js_1.StoreSession(config.dataStoragePath), config.telegram_api_id, config.telegram_api_hash, {});
        this.channels = config.followChannels;
        this.alphaChannels = config.alphaChannels;
        this.chatIds = [];
        this.em = em;
        this.channelMaps = [];
        this.initClient();
        this.publishChannel = config.publishChannel;
    }
    disconnect = () => {
        this.client.disconnect();
    };
    getGroupChatIdByName = async () => {
        try {
            const dialogs = await this.client.getDialogs();
            dialogs.forEach((element) => {
                if (element.entity?.className === 'Channel') {
                    if (Number(element.dialog.peer?.channelId)
                        && (this.channels.includes(element?.entity?.username) || this.channels.includes(element?.entity?.title))
                        && (this.alphaChannels.includes(element?.entity?.username) || this.alphaChannels.includes(element?.entity?.title))) {
                        this.chatIds.push(Number(element.dialog?.peer?.channelId));
                        this.channelMaps.push({
                            name: element?.entity?.username,
                            title: element?.entity?.title,
                            id: Number(element.dialog.peer?.channelId),
                            isAlpha: this.alphaChannels.includes(element?.name)
                        });
                    }
                }
                else if (element.entity?.className === 'Chat' && (this.channels.includes(element?.entity?.username) || this.channels.includes(element?.entity?.title))
                    && (this.alphaChannels.includes(element?.entity?.username) || this.alphaChannels.includes(element?.entity?.title))) {
                    this.chatIds.push(Number(element.entity?.id));
                    this.channelMaps.push({
                        name: element?.entity?.title,
                        title: element?.entity?.title,
                        id: Number(element.entity?.id),
                        isAlpha: this.alphaChannels.includes(element?.name)
                    });
                }
                if (this.publishChannel === element?.entity?.username || this.publishChannel === element?.entity?.title) {
                    this.publishTo = {
                        name: element?.entity?.username,
                        title: element?.entity?.title,
                        id: Number(element.dialog.peer?.channelId)
                    };
                }
            });
            if (this.channelMaps.length > 0) {
                this.channelMaps.forEach(async (element) => {
                    const cnl = {
                        channelId: Number(element.id),
                        channelName: element?.name,
                        channelTitle: element?.title,
                        enabled: true,
                        isAlpha: this.alphaChannels.includes(element?.name)
                    };
                    const chnl = await db_1.Channels.upsert(cnl).then((result) => { console.log(result); });
                });
                // console.log(this.publishTo );
                // console.log(this.channelMaps );
                // console.log(this.chatIds );
            }
        }
        catch (error) {
            console.log(error);
            throw new Error(`Group not found.`);
        }
        finally {
            //console.log(this.channelMaps);
        }
    };
    initClient = async () => {
        await this.client.start({
            phoneNumber: async () => await (0, input_1.text)("Please enter your number: "),
            password: async () => await (0, input_1.text)("Please enter your password: "),
            phoneCode: async () => await (0, input_1.text)("Please enter the code you received: "),
            onError: (err) => console.log(err),
        });
        const me = await this.client.getMe();
        if (me) {
            this.getGroupChatIdByName();
        }
    };
    subscribe = async () => {
        this.client.addEventHandler(async (event) => {
            if (event?.message) {
                // 
                //  console.log(this.chatIds); 
                const chatId = event.message?.peerId?.channelId ? event.message?.peerId?.channelId : event.message?.peerId?.chatId;
                if (this.chatIds.includes(Number(chatId))) {
                    console.log('------------------------------------------------------');
                    console.log(' Message from ' + this.channelMaps.find((item) => item.id === Number(chatId)).title);
                    let data = await (0, TokenProcessor_1.processMessage)(event.message);
                    let signal = {};
                    //  console.log(data);
                    console.log('------------------------------------------------------');
                    if (data) {
                        signal = {
                            callerPostId: event.message.id,
                            callerTG: this.channelMaps.find((item) => item.id === Number(chatId)).title,
                            channelName: this.channelMaps.find((item) => item.id === Number(chatId)).name,
                            isAlpha: this.channelMaps.find((item) => item.id === Number(chatId)).isAlpha,
                            callTime: Date.now(),
                            tokenAddress: data.tokenAddress,
                            tokenSymbol: data.tokenSymbol,
                            tokenName: data.tokenName,
                            tokenAge: data.tokenAge,
                            tokenMC: data.tokenMC,
                            liquidityETH: data.liquidityETH,
                            currPrice: data.currPrice,
                            chainId: data.chainId,
                            dex: data.dex,
                            version: data.version,
                            athROI: "0"
                        };
                        this.em.emit('newSignal', signal);
                    }
                }
                else {
                    //console.log(event.message);
                }
            }
        });
    };
    sendTokenCallMessage = async (tradeSignal) => {
        const botlinkedchannel = await this.client.getInputEntity('marketingalert');
        let tradingSignal = JSON.parse(tradeSignal);
        this.client.setParseMode("html");
        const tokenAddress = tradingSignal.tokenAddress;
        const tokenStats = await (0, CustomQuery_1.getTokenStats)(tokenAddress);
        const callerTG = tradingSignal.callerTG;
        let currTGCallsCount = 0;
        let totalCallsCount = tokenStats.callCount;
        console.log(tokenStats);
        tokenStats.calls.forEach(element => {
            if (element.callerTG === callerTG) {
                currTGCallsCount = element.calls;
                //callerTG , tokenName,tokenSymbol, tokenAddress, min(tokenMC) as mcap,count(*) as calls 
            }
        });
        console.log(tokenStats);
        let message = '';
        if (tokenStats.calls.length > 0) {
            tradingSignal.minCallerTG = tokenStats.calls[0].callerTG;
            tradingSignal.minCallerMcap = tokenStats.calls[0].mcap;
            tradingSignal.minCallerChannelName = tokenStats.calls[0].channelName;
            tradingSignal.minCallercallerPostId = tokenStats.calls[0].callerPostId;
        }
        if (totalCallsCount === 1 && currTGCallsCount === 1 && !tradingSignal.isAlpha) {
            message = (0, MessageFormats_1.NewMessageFormat)(tradingSignal, totalCallsCount);
        }
        else if (totalCallsCount > 1 && currTGCallsCount === 1 && !tradingSignal.isAlpha) {
            message = (0, MessageFormats_1.UpdateFromNewCall)(tradingSignal, totalCallsCount);
        }
        if (!tradingSignal.isAlpha) {
            message = (0, MessageFormats_1.UpdateFromAddonCall)(tradingSignal, currTGCallsCount);
        }
        const tradeLogMessage = await (0, MessageFormats_1.AllCallsMessage)(JSON.parse(tradeSignal), tokenStats);
        const oldLogsOpenData = await db_1.UpdateLogs.findOne({
            where: {
                tokenAddress: tokenAddress
            }
        });
        const oldMessageId = oldLogsOpenData?.dataValues?.lastMessageId ? oldLogsOpenData?.dataValues?.lastMessageId : 0;
        console.log(tradeLogMessage);
        if (oldMessageId === 0) {
            // const resultLog  = await this.client.invoke(
            //     new Api.messages.SendMessage({
            //         peer: "botlinkedchannel",
            //         message: tradeLogMessage,
            //         noWebpage:true, 
            //         randomId: bigInt.fromArray([parseInt("" + Math.random() * 10 ** 10)]),
            //     })
            // );
            const resultLog = await this.client.sendMessage(botlinkedchannel, { message: tradeLogMessage, parseMode: 'html', linkPreview: false });
            const resultLogData = JSON.parse(JSON.stringify(resultLog));
            console.log(resultLogData);
            await db_1.UpdateLogs.create({ lastMessageId: resultLogData.id, tokenAddress: tokenAddress });
        }
        else {
            try {
                console.log(botlinkedchannel);
                const resultX = await this.client.sendMessage(botlinkedchannel, {
                    replyTo: oldMessageId,
                    message: message, parseMode: 'html', linkPreview: false
                });
                // const resultX  = await this.client.invoke(
                //     new Api.messages.SendMessage({
                //         peer: "botlinkedchannel",
                //         message: message,
                //         noWebpage:true, 
                //         randomId: bigInt.fromArray([parseInt("" + Math.random() * 10 ** 10)]),
                //     })
                // );
                console.log('RESULT HERE ');
                const result = JSON.parse(JSON.stringify(resultX));
                console.log(tokenStats);
                const resultLog = await this.client.editMessage(botlinkedchannel, { message: oldMessageId, text: tradeLogMessage, parseMode: 'html', linkPreview: false });
                // const resultLog  = await this.client.invoke(
                //     new Api.messages.EditMessage({
                //         peer: "botlinkedchannel",
                //         message: tradeLogMessage,
                //         noWebpage:true,
                //         id: oldMessageId
                //      })
                // );
                const resultLogData = JSON.parse(JSON.stringify(resultLog));
                console.log(resultLogData);
                await db_1.UpdateLogs.destroy({ where: { tokenAddress: tokenAddress } });
                await db_1.UpdateLogs.create({ lastMessageId: resultLogData.id, tokenAddress: tokenAddress });
            }
            catch (err) {
                console.log(err);
            }
        }
    };
}
exports.default = TelegramAccountService;
