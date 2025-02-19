import { ICurrencyRepository } from "./currencyRepositoryType.js";
import * as process from "node:process";
import axios from "axios";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const HOST = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}`
export class ExchangeRatesCurrencyRepository implements ICurrencyRepository {
    async getCurrencyRateForPair(currencyPair: [string, string]): Promise<string> {
        const [currencyBase, currencyTarget] = currencyPair;
        try {
            const response = await axios.get(`${HOST}/pair/${currencyBase}/${currencyTarget}`);
            return String(response.data.conversion_rate);
        } catch (e) {
            console.error(e);
            return 'Error: service unavailable';
        }
    }
}

export const exchangeRatesCurrencyRepository = new ExchangeRatesCurrencyRepository();