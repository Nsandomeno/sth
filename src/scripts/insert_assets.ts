import { Cmc, CmcAsset } from "../service/cmc.js";
import { Db, Asset, isAsset } from "../db/database.js";

const SUPPORT_COUNT = 4;

const db = new Db();
const client = new Cmc();


const results = await client.loadAssets();

// TODO [ a ] clean
const assets   = [];
const dbAssets = [];

for (let i = 0; i < SUPPORT_COUNT; i++) {
    let asset: CmcAsset = results[i];
    let result = await db.insertAsset(asset);

    if (isAsset(result)) {
        // TODO [ a ] clean
        assets.push(asset.symbol);
        dbAssets.push(result);
    } else {
        // TODO error handling strategy
        console.log("A failure occurred inserting assets.")
    }
}
// create cmc multi-asset symbol query param
const bulkParam = assets.toString();

const priceData = await client.getPrices(bulkParam, "1698670532", "1700225647");

for (const key in priceData.data) {
    let item = priceData.data[key];
    let quotes = item.quotes;
    let symbol = item.symbol;
    // TODO [ a ] clean link to asset pk / id
    let dbAsset = dbAssets.find((asset: Asset) => asset.symbol.toUpperCase() === symbol);

    for (const quote of quotes) {
        const ts = quote.timestamp;
        const price = quote.quote.USD.price;


        const insertRes = await db.insertPrice(dbAsset.id, ts, price);
        console.log("inserted data successfully: ", insertRes);
    }
}
