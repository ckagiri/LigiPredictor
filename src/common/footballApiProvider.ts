export class FootballApiProvider {
  private constructor(private value: number, private name: string) {
  }

  public static LIGI = new FootballApiProvider(0, 'LIGI'); 
  public static API_FOOTBALL_DATA: FootballApiProvider = new FootballApiProvider(1, 'API_FOOTBALL_DATA');

  public toString(): string { return this.name; }
  public equals(o: any): boolean {
    return (o instanceof FootballApiProvider) && (this.value == o.value);
  } 
}