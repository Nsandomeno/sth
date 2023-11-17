import { PrismaClient } from "@prisma/client";
import { CmcAsset } from "../service/cmc.js";
/**
 * @dbModel Asset
 */
export interface Asset {
    id        : number,
    createdAt : Date,
    updatedAt : Date,
    name      : string,
    slug      : string,
    symbol    : string,
    cmcId     : string,
}
/**
 * 
 * @param value any
 * @returns true if value implements Asset, false otherwise
 */
export const isAsset = (value): value is Asset => !!value?.id;

/**
 * @PrismaORMDBClient
 */
export class Db {
    db: PrismaClient;

    constructor() {
        this.db = new PrismaClient();
    }
    /**
     * 
     * @param asset Asset table input schema
     * 
     * @TODO error handling strategy
     * 
     * @returns Asset, which will include DB PK for the value
     *          that otherwises matches CmcAsset. Consider inheritance.
     */
    async insertAsset(asset: CmcAsset) {
        return await this.db.asset.create({
            data: {
                name: asset.name,
                slug: asset.slug,
                symbol: asset.symbol,
                cmcId: asset.id
            }
        })
        // TODO standardize common chaining
        .then(async (data) => {
            console.log("Success disconnecting.")
            await this.db.$disconnect();
            return data
        })
        .catch(async (e) => {
            console.log("error inserting assets: ", e);
            await this.db.$disconnect();
        })
    }

    /**
     * 
     * @param id an Asset table PK
     * @param timestamp a string parsable by Date
     * @param value a number value fitting Postgres' Float
     * 
     * @TODO error handling strategy
     * 
     * @returns PriceUsd object inserted to DB
     */
    async insertPrice(
        id        : number,
        timestamp : string,
        value     : number,
    ) {

        return await this.db.priceUsd.create({
            data: {
                assetId: id,
                timestamp: new Date(Date.parse(timestamp)),
                value: value
            }
        })
        // TODO standardize common chaining
        .then(async (data) => {
            await this.db.$disconnect();
            return data
        })
        .catch(async (e) => {
            await this.db.$disconnect();
        })
    }
    /**
     * 
     * @param symbols Array of asset.symbol strings
     * @param start string parsable by Date
     * @param stop  string parsable by Date
     * @param offset number to offset return data by
     * @param limit  number to limit returned data set
     * 
     * @TODO error handling strategy
     */
    async readPrices(
        symbols : Array<string>, 
        start   : string, 
        stop    : string, 
        offset  : number, 
        limit   : number
    ) {
        await this.db.asset.findMany({
            where: {
                symbol: {
                    in: symbols
                }
            },
            // TODO finish building query and error handling
            // strategy
            // include: {
            //     priceUsd: {
            //         where: {

            //         }
            //     }
            // }
        })
    }
}
