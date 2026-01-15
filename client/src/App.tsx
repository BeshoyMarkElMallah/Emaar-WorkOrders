import { useEffect, useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from './components/Table';
import { getOrders } from './services/orderService';
import type { Order } from './types/orders';
import type { PaginationState } from '@tanstack/react-table';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Current page index is 0-based, API expects 1-based
    getOrders(pagination.pageIndex + 1, pagination.pageSize)
      .then((data) => {
        setOrders(data.orders);
        setPageCount(data.pagination.totalPages);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [pagination.pageIndex, pagination.pageSize]);


  const columns = useMemo<ColumnDef<Order>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'caseType',
      header: 'Case Type',
    },
    {
      accessorKey: 'probCode',
      header: 'Prob Code',
    },
    {
      accessorKey: 'subType',
      header: 'Syb Type',
    },
    {
      accessorKey: 'project',
      header: 'Project',
    },
    {
      accessorKey: 'parcel',
      header: 'Parcel',
    },
    {
      accessorKey: 'area',
      header: 'Area',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'asset_id',
      header: 'Asset ID',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => {
        const action = row.getValue('action') as string;
        const isCleared = action?.toLowerCase() === 'cleared';
        const isGenerated = action?.toLowerCase() === 'generated';

        return (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
            ${isCleared ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              isGenerated ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-brand-medium text-brand-text border border-brand-light'}
          `}>
            {action}
          </span>
        );
      },
    },
    {
      accessorKey: 'generated_at',
      header: 'Generated At',
      cell: ({ row }) => {
        const dateStr = row.getValue('generated_at') as string;
        if (!dateStr) return '-';
        return new Date(dateStr).toUTCString();
      },
    },
    {
      accessorKey: 'cleared_at',
      header: 'Cleared At',
      cell: ({ row }) => {
        const dateStr = row.getValue('cleared_at') as string;
        if (!dateStr) return '-';
        return new Date(dateStr).toUTCString();
      },
    },
    {
      accessorKey: 'sf_response',
      header: 'SF Response',
    },
    {
      accessorKey: 'is_active',
      header: 'Is Active',
    },

  ], []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start md:p-8 overflow-hidden">
      <div className="flex flex-col items-end justify-center pb-5 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-text">EMAAR MISR Work Orders</h1>
      </div>
      <div className="w-full max-w-full flex-1 flex flex-col items-center gap-6 overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          pageCount={pageCount}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          initialColumnVisibility={{
            id: false,
            asset_id: false,
            sf_response: false,
            cleared_at: false,
            probCode: false,
            subType: false,
            description: false,
            is_active: false,
          }}
        />
      </div>
    </div>
  );
}

export default App;

