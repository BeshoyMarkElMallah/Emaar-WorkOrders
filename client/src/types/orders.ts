export interface OrdersSchema {
    message: string;
    orders: Order[];
    pagination: Pagination;
}

export interface Order {
    id: number;
    caseType: string;
    probCode: string;
    subType: string;
    project: string;
    parcel: string;
    area: string;
    description: string;
    asset_id: string;
    action: string;
    generated_at: string;
    cleared_at: string;
    sf_response: string;
    is_active: boolean;
}









export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}
