import express, { Request } from "express";
import { Cmc } from "../service/cmc.js";
import { SearchQuery } from "../interfaces/SearchRequest.js";

const router = express.Router();

interface ReqParams {}
interface ResBody {}
interface ReqBody {}
/**
 * CoinMarketCap PRICE-USD endpoint
 * @QueryParams
 * @param start string unix timestamp
 * @param stop string unix timestamp
 * @param symbol CoinMarketCap Sandbox symbol or list of symbols chained by comma
 *               and no white-space.
 * 
 * @TODO validation
 * @TODO error handling strategy
 * 
 * @param count not working in sandbox
 * @param offset not working in sandbox
 */
router.get("/price-usd", async (req: Request<ReqParams, ResBody, ReqBody, SearchQuery>, res) => {
    try {
        // TODO validate query + body
        const { start, stop, symbol, count } = req.query;
        /**  
         * @NOTE cant seem to paginate sandbox data myself
                 for mentioned APIs.

        // const db = new Db();
        */
        const client = new Cmc();
        const data = await client.paginatePriceDate(symbol, start, stop, count);
        // TODO validate data for alt status code responses
        if (!data) {
            // failure case - error detected from client / db
            res.status(400)
            res.json({ "error": true }) 
        } else {
            // success case
            res.json({
                "prices": data,
            });
        }  
    } catch (e) {
        // failure case - catch all
        res.status(500);
        res.json({
            e,
        })
    }
});

export default router;
