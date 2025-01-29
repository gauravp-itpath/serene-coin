export interface CryptoData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    high_24h: number;
    low_24h: number;
    market_cap: number;
    total_volume: number;
    ath: number;
    price_change_percentage_24h: number;
}
export type SortField =
    | "price"
    | "price_change"
    | "market_cap"
    | "volume"
    | "high_24h"
    | "low_24h";

export interface CryptoTableProps {
    data: CryptoData[];
}



export interface Column {
    label: string;
    field: SortField;
    sortable: boolean;
}