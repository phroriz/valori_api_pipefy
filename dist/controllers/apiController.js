"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.createPipeReportExport = exports.pipeReportExport = exports.ping = void 0;
const axios_1 = __importDefault(require("axios"));
const Pipefy_1 = require("../models/Pipefy");
const ping = (req, res) => {
    res.json({ pong: true });
};
exports.ping = ping;
const pipeReportExport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pipes = req.params.pipes;
    let reports_v2 = req.params.reports_v2;
    var pipefy = yield Pipefy_1.Pipefy.findOne({
        where: {
            pipe: pipes,
            report: reports_v2,
            state: 'done'
        },
        order: [['id', 'DESC']]
    });
    pipefy = JSON.parse(JSON.stringify(pipefy));
    console.log(pipefy);
    res.json(pipefy === null || pipefy === void 0 ? void 0 : pipefy.url);
    //res.json({pipefy});
});
exports.pipeReportExport = pipeReportExport;
const createPipeReportExport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var pipe = req.params.pipes;
    var report = req.params.reports_v2;
    var state = 'done';
    var export_id = 0;
    var url = 'none';
    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDEwODAzNjMsImVtYWlsIjoiZ2FicmllbEB2YWxvcmliYW5rLmNvbSIsImFwcGxpY2F0aW9uIjozMDAxNzAzNjd9fQ.ReD8IumJny6hGvfBtWjRZvk1p5k2v24-a9Ue_LsfxuRSMPNkmUkw1DycRvh7PYF6-hvOMEB4RM8JKWx5TUY9QQ";
    function buscarDados(pipe, report, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = JSON.stringify({
                query: `mutation { exportPipeReport(input: {pipeId: ${pipe}, pipeReportId: ${report}}){
              pipeReportExport {
                id
                fileURL
              }
            }
          }`,
                variables: {}
            });
            var config = {
                method: 'post',
                url: 'https://api.pipefy.com/graphql',
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                data: data
            };
            (0, axios_1.default)(config)
                .then(function (response) {
                let obj = JSON.parse(JSON.stringify(response.data));
                console.log(obj.data.exportPipeReport.pipeReportExport.id);
                // inserir dados na function
                export_id = obj.data.exportPipeReport.pipeReportExport.id;
                InserirDados(export_id);
            })
                .catch(function (error) {
                console.log(error);
            });
        });
    }
    function InserirDados(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = JSON.stringify({
                query: `{
                pipeReportExport(id: ${id}) {
                    fileURL
                    state
                    startedAt
                    requestedBy {
                    id
                    }
                }
                }`,
                variables: {}
            });
            var config = {
                method: 'post',
                url: 'https://api.pipefy.com/graphql',
                headers: {
                    'accept': 'application/json',
                    'authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                data: data
            };
            (0, axios_1.default)(config)
                .then(function (response) {
                let result = JSON.parse(JSON.stringify(response.data));
                url = result.data.pipeReportExport.fileURL;
                // enviar api pipefy
                Pipefy_1.Pipefy.create({ pipe, report, export_id, url, state });
                res.json({ report, export_id, url, state });
            })
                .catch(function (error) {
                console.log(error);
            });
        });
    }
    ;
    buscarDados(pipe, report, token);
});
exports.createPipeReportExport = createPipeReportExport;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.test = test;
