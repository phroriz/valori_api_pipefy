import { Request,Response } from 'express';
import axios from 'axios';
import { Pipefy } from '../models/Pipefy';

export const ping = (req: Request, res: Response) => {
    res.json({pong: true})
};

export const pipeReportExport = async (req: Request, res: Response) => {
    let pipes =  req.params.pipes;
    let reports_v2 = req.params.reports_v2;

    var pipefy  = await Pipefy.findOne({
        where: { 
            pipe: pipes,
            report: reports_v2,
            state: 'done'
        },
        order: [['id', 'DESC']]
    });

    pipefy = JSON.parse(JSON.stringify(pipefy))
    console.log(pipefy);
    res.json(pipefy?.url)
    
    //res.json({pipefy});
};

export const createPipeReportExport = async (req: Request, res: Response) => {
    var pipe =  req.params.pipes;
    var report = req.params.reports_v2;
    var state = 'done';
    var export_id = 0;
    var url = 'none';

    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDEwODAzNjMsImVtYWlsIjoiZ2FicmllbEB2YWxvcmliYW5rLmNvbSIsImFwcGxpY2F0aW9uIjozMDAxNzAzNjd9fQ.ReD8IumJny6hGvfBtWjRZvk1p5k2v24-a9Ue_LsfxuRSMPNkmUkw1DycRvh7PYF6-hvOMEB4RM8JKWx5TUY9QQ";

   
    async  function buscarDados (pipe:string, report:string, token:string) {

        
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
            data : data
          };
          
          axios(config)
          .then(function (response) {
            let obj = JSON.parse(JSON.stringify(response.data));
            console.log(obj.data.exportPipeReport.pipeReportExport.id);
            
            // inserir dados na function
            export_id = obj.data.exportPipeReport.pipeReportExport.id;
            InserirDados (export_id);

          })
          .catch(function (error) {
            console.log(error);
          });
    }
    async function InserirDados(id: number) {
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
                data : data
                };
                
                axios(config)
                .then(function (response) {
                    let result = JSON.parse(JSON.stringify(response.data));
                    url =  result.data.pipeReportExport.fileURL;

                    // enviar api pipefy
                    Pipefy.create({pipe,report,export_id,url,state});
                    res.json({report,export_id,url,state});
                })
                .catch(function (error) {
                console.log(error);
                });
                
    };
       
    
    buscarDados(pipe,report,token);

    
};

export const test = async (req: Request, res: Response) => {


}