import {Model, DataType, DataTypes} from 'sequelize';
import {sequelize} from '../instances/pg';

export interface PipefyInstance extends Model {
    id: number;
    pipe: number;
    report: number;
    export_id: number;
    url: string;
    state: string
}

export const Pipefy = sequelize.define<PipefyInstance>('Pipefy', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    pipe: {
        type: DataTypes.INTEGER
    },
    report: {
        type: DataTypes.INTEGER
    },
    export_id: {
        type: DataTypes.INTEGER
    },
    url: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'pipefyreportexport',
    timestamps: false
});

export interface PipeReportExport {
    id: string;
    fileURL: string;
}

export interface ExportPipeReport {
    pipeReportExport: PipeReportExport;
}

export interface Data {
    exportPipeReport: ExportPipeReport;
}

export interface RootObject {
    data: Data;
}
