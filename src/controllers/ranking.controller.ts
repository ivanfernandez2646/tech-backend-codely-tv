import { Express, Request, Response } from 'express';
import { ObjectToCSVStringify } from '../csv-utils.js';
import { Repository } from '../interfaces/repository.interface';

export class RankingController {
  private static instance: RankingController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RankingController();
    }
    return this.instance;
  }

  async getTopRepos(req: Request, res: Response, repositories: Repository[]) {
    const language: string = req.query.language as string;
    const num: number = Number(req.query.num);

    if (!language) {
      return res.status(400).send('language parameter not found');
    }

    if (!num) {
      return res.status(400).send('num parameter not found');
    }

    const filteredRepos = repositories
      .map((r) => {
        return { ...r };
      })
      .filter(
        (r) =>
          r.language.toLowerCase() === language.toLowerCase() &&
          r.item.toLowerCase() === language.toLowerCase()
      )
      .slice(0, num);

    const adaptedReposHtml = await ObjectToCSVStringify(filteredRepos);
    res.send(adaptedReposHtml);
  }
}
