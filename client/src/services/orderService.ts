import api from './api';
import type { OrdersSchema } from '../types/orders';

// Removed local interface to avoid conflicts
// and ensure single source of truth


export const getOrders = async (page = 1, pageSize = 40): Promise<OrdersSchema> => {
    const response = await api.get<OrdersSchema>('/orders', {
        params: { page, pageSize },
    });
    return response.data;
};
