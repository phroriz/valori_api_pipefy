import { Router } from 'express';

import * as apiController from '../controllers/apiController';

const router = Router();

router.get('/ping', apiController.ping);

// PIPEFY 
let pipefy: string = 'pipefy'; 

// routers
router.get(`/${pipefy}/pb/pipes/:pipes/reports_v2/:reports_v2`, apiController.pipeReportExport);

router.get(`/${pipefy}/pipes/:pipes/reports_v2/:reports_v2`, apiController.createPipeReportExport);

router.get(`/${pipefy}/teste`, apiController.test)

export default router;