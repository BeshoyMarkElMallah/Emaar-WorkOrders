export interface Orders {
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

export interface TotalOrders {
    Total: number;
}