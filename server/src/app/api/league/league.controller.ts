import { Observable } from 'rxjs'
import {Request, Response} from 'express';

import { ILeagueService, LeagueService } from './league.service';

export class LeagueController {
  static getInstance() {
    return new LeagueController(LeagueService.getInstance())
  }

  constructor(private leagueService: ILeagueService) {  }

  list = (req: Request, res: Response) => {
    this.leagueService.getAllLeagues$()
      .subscribe(leagues => {
        res.status(200).json(leagues);
      }, err => {
        res.status(500).json(err);
      });
  }

  show = (req: Request, res: Response) => {
		let id: string = req.params.id;
		this.leagueService.getLeagueById$(id)
			.subscribe(league => {
					res.status(200).json(league);
				}, (err: any) => {
					res.status(500).json(err);
    		});
  }

  listSeasons = (req: Request, res: Response) => {
		let leagueId: string = req.params.leagueId;
 		this.leagueService.getAllSeasonsByLeague$(leagueId)
			.subscribe((seasons: any[]) => {
					res.status(200).json(seasons);
				}, (err: any) => {
					res.status(500).json(err);
				});		
  }
}