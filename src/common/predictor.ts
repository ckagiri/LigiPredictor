import { Score } from './score';
import Vose from './vose';

export interface IPredictor {
  predict(odds?: any): Score
}

export class VosePredictor implements IPredictor {
  static getInstance() {
    return new VosePredictor();
  }

  underdogVose: Vose;
  drawVose: Vose;
  favoriteVose: Vose;

  predict(odds: any = {}) {
    if (odds == null) { odds = {}; }
    let { homeWin, awayWin, draw } = odds;
    let homeWinOdds = homeWin || 1;
    let awayWinOdds = awayWin || 1;
    let drawOdds = draw || 1;
    
    let underdogWeight: number;
    let favoriteWeight: number;
    let homeWinWeight = Math.round((1 / homeWinOdds) * 100);
    let drawWeight = Math.round((1 / drawOdds) * 100);
    let awayWinWeight = Math.round((1 / awayWinOdds) * 100);
    let v = new Vose([homeWinWeight, drawWeight, awayWinWeight]);
    let outcomes: string[] = ['HOME','DRAW','AWAY']
    let outcome = outcomes[v.next()]
    let score = '';
    if (outcome === 'HOME') {
      if(homeWinWeight > awayWinWeight) {
        score = this.getFavouriteScore(true);
      } else {
        score = this.getUnderdogScore(true);
      }
    }
    if (outcome === 'AWAY') {
      if(awayWinWeight > homeWinWeight) {
        score = this.getFavouriteScore(false);
      } else {
        score = this.getUnderdogScore(false);
      }
    }
    if (outcome === 'DRAW') {
      score = this.getDrawScore();
    }
    let goals = score.split('-');
		let goalsHomeTeam = Number(goals[0]);
		let goalsAwayTeam = Number(goals[1]);
		return { goalsHomeTeam, goalsAwayTeam }
  } 

  private getFavouriteScore(isHomeTeam: boolean) {
    let scores: string[];
    let weights: number[];
    if(isHomeTeam) {
      scores = ['1-0', '2-1', '2-0', '3-1', '3-0', '3-2'] 
      weights = [ 98,    89,    81,    52,    48,    28]
    } else {
      scores = ['0-1', '1-2', '0-2', '1-3', '2-3', '0-3'] 
      weights = [ 63,    56,    34,    23,    18,    14]
    }
    if(this.favoriteVose == null) {
      this.favoriteVose = new Vose(weights);
    }
    return scores[this.favoriteVose.next()]
  }
  
  private getUnderdogScore(isHomeTeam: boolean) {
    let scores: string[];
    let weights: number[];
    if(isHomeTeam) {
      scores = ['1-0', '2-1', '2-0'] 
      weights = [ 98,    89,    81]
    } else {
      scores = ['0-1', '1-2', '0-2'] 
      weights = [ 63,    56,    34]
    }
    if(this.underdogVose == null) {
      this.underdogVose = new Vose(weights);
    }
    return scores[this.underdogVose.next()]
  }

  private getDrawScore() {
    var scores = ['1-1', '0-0', '2-2'] 
    var weights = [116,    72,    52]
    if(this.drawVose == null) {
      this.drawVose = new Vose(weights);
    }
    return scores[this.drawVose.next()]
  }
}