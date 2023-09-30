"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenStats = exports.callUniqueTokens24HrsMoreThanOneCall = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("./db");
const TokenProcessor_1 = require("../processor/TokenProcessor");
const callUniqueTokens24HrsMoreThanOneCall = async (eventEmitter) => {
    const result = [];
    const data = await db_1.sequelize.query(`SELECT tokenAddress, count(tokenAddress) as tcx
         from TokenCalls tc 
         group by tokenAddress 
         having createdAt >=datetime("now" , "-24 hours")  
         and count(tokenAddress)>1`, {
        type: sequelize_1.QueryTypes.SELECT
    });
    console.log(JSON.stringify(data));
    data.forEach(async (item) => {
        let response = {
            tokenName: item.tokenName,
            tokenAddress: item.tokenAddress,
            symbol: item.tokenSymbol,
            callCount: 0,
            calls: []
        };
        const tokenAddress = item.tokenAddress;
        const tokenDetails = await db_1.sequelize.query(`select callerTG , tokenName,tokenSymbol, tokenAddress, min(tokenMC) as mcap,count(*) as calls 
            from TokenCalls tc 
            group by callerTG ,tokenAddress
            having tokenAddress =?`, {
            replacements: [tokenAddress],
            type: sequelize_1.QueryTypes.SELECT
        });
        response.calls = tokenDetails;
        tokenDetails.forEach((x) => {
            response.callCount += Number(x.calls);
        });
        eventEmitter.emit('24hourlyStats', JSON.stringify(response));
    });
};
exports.callUniqueTokens24HrsMoreThanOneCall = callUniqueTokens24HrsMoreThanOneCall;
const getTokenStats = async (tokenAddress) => {
    let response = {
        callCount: 0,
        calls: []
    };
    const result = await (0, TokenProcessor_1.getPairData)(tokenAddress);
    console.log(result);
    const tokenDetails = await db_1.sequelize.query(`select callerTG ,channelName,isAlpha,athROI, callerPostId, tokenName,tokenSymbol,callerPostId, tokenAddress,currPrice,callTime, min(tokenMC) as mcap,count(*) as calls 
          from TokenCalls tc 
          group by callerTG ,tokenAddress
          having tokenAddress =? order by mcap `, {
        replacements: [tokenAddress],
        type: sequelize_1.QueryTypes.SELECT
    });
    response.calls = tokenDetails;
    tokenDetails.forEach((x) => {
        response.callCount += Number(x.calls);
        if (Number(result.currPrice) > Number(x.currPrice)) {
            const roi = Number(((result.currPrice - x.currPrice) / x.currPrice) * 100).toFixed(2);
            x.athROI = roi;
            db_1.TokenCalls.update({ athROI: roi }, {
                where: {
                    tokenAddress: x.tokenAddress,
                },
            });
        }
    });
    return response;
};
exports.getTokenStats = getTokenStats;
