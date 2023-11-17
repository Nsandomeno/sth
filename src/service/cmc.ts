import axios, { AxiosInstance, } from "axios";
import * as dotenv from "dotenv";

dotenv.config();
/**
 * @coinMarketCap AssetMap Response Item
 */
export interface CmcAsset {
    id                    : number;
    rank                  : number;
    name                  : string;
    symbol                : string;
    slug                  : string;
    is_active             : number;
    first_historical_data : string;
    last_historical_data  : string;
    platform?             : any;
}

/**
 * @coinMarketCap AssetMap Response
 */
export interface CmcMapResponse {
    data: Array<CmcAsset>
}

/**
 * @coinMarketCap [ Sandbox ] Client
 */
export class Cmc {
    api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.BASE_URL,
            headers: {
                "X-CMC_PRO_API_KEY": process.env.CMC_KEY
            }
        })
    }
    /**
     * @TODO error handling strategy from client to controller
     * @returns v1 asset map note, these are not real values
     */
    async loadAssets(): Promise<any> {
        return await this.api.get("/v1/cryptocurrency/map")
            .then(function ({ data }: { data: CmcMapResponse }) {

                return data.data;
            })
            .catch(function (error: any) {
                // TODO standardize error handling
                return false;
            })
    }
    /**
     *  
     * @param symbols    coin market cap symbol or list of symbols concat'd by
     *                   commas and no whitespace.
     * @param time_start string of unix timestamp
     * @param time_end   string of unix timestamp
     * 
     * @TODO error handling strategy
     * 
     * @returns untyped price data
     */    
    async getPrices(
        symbols: string, 
        time_start: string, 
        time_end: string
    ): Promise<any> {
        return await this.api.get(
                "/v1/cryptocurrency/quotes/historical",
                { params: { symbol: symbols, interval: "24h", count: 1000 }}
            )
            .then(function ({ data }: { data: any }) {

                return data;
            })
            .catch(function (error: any) {
                // TODO improve error handling
                return false;
            })
    }


    /**
     * 
     * @param symbols coin market cap. symbol or list of symbols concat'd
     *                  by commas and no whitespace.
     * @param time_start string of unix timestamp
     * @param time_end   string of unix timestamp
     * @param count     [ note: doesn't work in sandbox ] count to restrain results
     * 
     * @TODO error handling strategy.
     * 
     * @returns untyped coin market cap price data
     */
    async paginatePriceDate(
        symbols    : string,
        time_start : string,
        time_end   : string,
        count      : Number | null,
    ) {
        // fill count default
        const limit = count ? typeof(count) === "number" : 100;
        return await this.api.get(
            "/v1/cryptocurrency/quotes/historical",
            { params: { interval: "24h", symbol: symbols, time_start: time_start, time_end, count: limit }}
        )
        .then(function ({ data }: { data: any }) {

            return data;
        })
        .catch(function (error: any) {
            // TODO improve error handling
            return false;
        })
    }
}

