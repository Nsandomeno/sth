export interface Asset {
    name   : string;
    symbol : string;
}

export interface Price {
    timestamp : Date;
    value     : Number;
}

export interface PriceResponse {
    asset  : Asset;
    prices : Array<Price>;
}
