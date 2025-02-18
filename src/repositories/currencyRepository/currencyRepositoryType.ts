export interface ICurrencyRepository {
    getCurrency: (currencyPair: [string, string]) => Promise<string>;
}