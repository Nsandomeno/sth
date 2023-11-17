export interface SearchQuery {
    start: string;
    stop: string;
    symbol: string;
    count?: Number;
    offset?: Number;
}


export interface SearchBody {
    asset: string;
}

