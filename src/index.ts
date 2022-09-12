import express from 'express';
import { RankingController } from './controllers/ranking.controller.js';
import { CSVtoObject } from './csv-utils.js';

const app = express();
CSVtoObject().then((repositories) => {
  // Initialize controllers singleton instance
  RankingController.getInstance();

  // Register endpoints
  app.get('/topRepo', async (req, res) => {
    await RankingController.getInstance().getTopRepos(req, res, repositories);
  });

  app.listen(3000, () => console.log('App is listening in port 3000'));
});
