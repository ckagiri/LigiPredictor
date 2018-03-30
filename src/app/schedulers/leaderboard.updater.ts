export interface ILeaderboardUpdater {
  updateScores(finishedFixtures: any[])
  updateRankigs()
}

export class LeaderboardUpdater implements ILeaderboardUpdater {
  updateScores(finishedFixtures: any[]) {
    // fe fixtures
    // fe user
    // fe lbs
    // fe pred
    // fe score
  }

  updateRankigs() {
    throw new Error("Method not implemented.");
  }
}