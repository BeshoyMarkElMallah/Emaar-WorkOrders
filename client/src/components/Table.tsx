import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    VisibilityState,
    SortingState,
    ColumnFiltersState,
    PaginationState,
    OnChangeFn,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Settings2, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    totalOrders: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    onRefresh?: () => void;
    initialColumnVisibility?: VisibilityState;
    isLoading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    totalOrders,
    pagination,
    onPaginationChange,
    onRefresh,
    initialColumnVisibility = {},
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
    const [columnSizing, setColumnSizing] = useState({});
    const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            sorting,
            columnVisibility,
            columnSizing,
            globalFilter,
            columnFilters,
            pagination,
        },
        manualPagination: true,
        onPaginationChange,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnSizingChange: setColumnSizing,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        defaultColumn: {
            minSize: 50,
            size: 150,
            maxSize: 800,
        },
        columnResizeMode: 'onChange',
        // Global filter logic
        globalFilterFn: 'includesStringSensitive',
    });

    return (
        <div className="space-y-4 w-full h-full flex flex-col">
            <div className="flex items-center justify-between gap-4 shrink-0">
                {/* Refresh Button */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-3 py-2 bg-brand-medium border border-brand-light text-brand-text rounded-md shadow-sm hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Refresh data"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Column Visibility Toggle */}
                <div className="relative w-full flex flex-col items-end">
                    <button
                        onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2 bg-brand-medium border border-brand-light text-brand-text rounded-md shadow-sm hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-brand-light"
                    >
                        <Settings2 className="w-4 h-4" />
                        <span>Columns</span>
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    {isColumnDropdownOpen && (
                        <div className="absolute right-0 top-12 z-50 w-56 bg-brand-medium border border-brand-light rounded-md shadow-lg p-2">
                            <div className="mb-2 text-sm font-medium text-brand-text px-2">Toggle Columns</div>
                            {table.getAllLeafColumns().map((column) => {
                                return (
                                    <div key={column.id} className="flex items-center px-2 py-1">
                                        <label className="flex items-center w-full gap-2 cursor-pointer hover:text-brand-light">
                                            <input
                                                {...{
                                                    type: 'checkbox',
                                                    checked: column.getIsVisible(),
                                                    onChange: column.getToggleVisibilityHandler(),
                                                    className: "rounded border-brand-light text-brand-light focus:ring-brand-light bg-brand-dark"
                                                }}
                                            />
                                            <span className="text-sm truncate text-brand-text">
                                                {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                                            </span>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-md border border-brand-light flex-1 overflow-auto relative">
                <table className="text-sm text-left text-brand-text" style={{ width: table.getTotalSize(), minWidth: '100%' }}>
                    <thead className="bg-brand-medium text-brand-text font-medium border-b border-brand-light sticky top-0 z-20">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th
                                            key={header.id}
                                            className="relative px-4 py-3 group select-none  hover:bg-brand-light/20 transition-colors"
                                            style={{
                                                width: header.getSize(),
                                            }}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-center gap-2 cursor-pointer",
                                                    header.column.getCanSort() ? "cursor-pointer select-none" : ""
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                {{
                                                    asc: <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />,
                                                    desc: <ArrowUpDown className="ml-2 h-4 w-4" />,
                                                }[header.column.getIsSorted() as string] ?? (
                                                        header.column.getCanSort() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" /> : null
                                                    )}
                                            </div>

                                            {/* Resizer Handle */}
                                            <div
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                className={cn(
                                                    "absolute right-0 top-0 h-full w-0.5 cursor-col-resize hover:bg-brand-light touch-none select-none",
                                                    header.column.getIsResizing() ? "bg-brand-light w-1 z-10" : "bg-brand-light"
                                                )}
                                            />
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-brand-light/30 bg-brand-dark">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex justify-center items-center w-full h-full p-4">
                                        <LoadingSpinner className="w-8 h-8" />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-brand-medium/50 transition-colors">
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-4 py-3 whitespace-nowrap overflow-hidden text-ellipsis"
                                            style={{
                                                width: cell.column.getSize(),
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* </div>  Removed inner wrapper as outer wrapper now handles scroll */}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-2 shrink-0 py-4">
                <div className="text-sm text-brand-text/70">
                    {totalOrders} Total Work Orders
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 border border-brand-light rounded hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-brand-text bg-brand-medium"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="flex items-center gap-1 text-sm text-brand-text">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <button
                        className="p-2 border border-brand-light rounded hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed text-brand-text bg-brand-medium"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

        </div >
    );
}
