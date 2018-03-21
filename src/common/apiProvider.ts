export class ApiProvider {
  private constructor(private value: number, private name: string) {
  }

  public static LIGI = new ApiProvider(0, 'LIGI'); 
  public static API_FOOTBALL_DATA: ApiProvider = new ApiProvider(1, 'API_FOOTBALL_DATA');

  public toString(): string { return this.name; }
  public equals(o: any): boolean {
    return (o instanceof ApiProvider) && (this.value == o.value);
  } 
}