export interface ICurrencyRepository {
    getCurrencyRateForPair: (currencyPair: [string, string]) => Promise<string>;
}