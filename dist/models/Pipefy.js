"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipefy = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../instances/pg");
exports.Pipefy = pg_1.sequelize.define('Pipefy', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    pipe: {
        type: sequelize_1.DataTypes.INTEGER
    },
    report: {
        type: sequelize_1.DataTypes.INTEGER
    },
    export_id: {
        type: sequelize_1.DataTypes.INTEGER
    },
    url: {
        type: sequelize_1.DataTypes.STRING
    },
    state: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    tableName: 'pipefyreportexport',
    timestamps: false
});
