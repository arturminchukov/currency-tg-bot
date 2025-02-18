import { currencyRepository, ICurrencyRepository  } from "@repositories";

class CurrencyService {
    private currencyRepository: ICurrencyRepository;

    constructor(currencyRepository: ICurrencyRepository) {
        this.currencyRepository = currencyRepository;
    }

    test(){
        console.log("test");
    }
}

export const currencyService = new CurrencyService(currencyRepository);