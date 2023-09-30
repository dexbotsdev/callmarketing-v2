"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLogs = exports.Channels = exports.TokenCalls = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './data/database.sqlite',
    logging: true,
    pool: {
        max: 100,
        min: 5,
        acquire: 1000,
        idle: 10
    }
});
class TokenCalls extends sequelize_1.Model {
}
exports.TokenCalls = TokenCalls;
;
class UpdateLogs extends sequelize_1.Model {
}
exports.UpdateLogs = UpdateLogs;
UpdateLogs.init({
    // Model attributes are defined here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    lastMessageId: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    tokenAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'UpdateLogs',
    sequelize: exports.sequelize,
});
class Channels extends sequelize_1.Model {
}
exports.Channels = Channels;
;
TokenCalls.init({
    // Model attributes are defined here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    callerPostId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    callerTG: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    channelName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    callTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    tokenAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    tokenSymbol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    tokenName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    tokenAge: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    tokenMC: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    liquidityETH: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    currPrice: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    athROI: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
    },
    chainId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dex: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    version: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isAlpha: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
}, {
    tableName: 'TokenCalls',
    sequelize: exports.sequelize,
});
Channels.init({
    // Model attributes are defined here
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    channelId: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    channelName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    channelTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    enabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
    isAlpha: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
}, {
    tableName: 'Channels',
    sequelize: exports.sequelize,
});
