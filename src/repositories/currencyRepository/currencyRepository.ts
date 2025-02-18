import { ICurrencyRepository } from "./currencyRepositoryType.js";

export class CurrencyRepository implements ICurrencyRepository {
    getCurrency(currencyPair: [string, string]): Promise<string> {
        return Promise.resolve("");
    }
}

export const currencyRepository = new CurrencyRepository();