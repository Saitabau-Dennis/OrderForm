"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/dashboard/dashboard-button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  placeholder?: string
  standalone?: boolean
  title?: string
  layout?: 'default' | 'nested'
  disableHover?: boolean
  titleClassName?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  placeholder = "Search...",
  standalone = true,
  title,
  layout = 'default',
  disableHover = false,
  titleClassName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-3">
        {/* Nested Layout Interpretation:
            Outer Card: contains Title + Search + Inner Card
            Inner Card: contains Table
        */}
        {layout === 'nested' ? (
          <div className={cn(
            "p-8 space-y-6", // Increased outer padding
            standalone && "rounded-xl border border-border bg-card"
          )}>
            {/* Header Area (Title + Search) */}
            {(title || searchKey) && (
              <div className="flex flex-col gap-4 items-start w-full">
                {title && (
                  <h3 className={cn("text-3xl font-medium text-foreground font-poppins", titleClassName)}>{title}</h3>
                )}
                {searchKey && (
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      placeholder={placeholder}
                      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                      }
                      className="pl-10 h-10 w-full rounded-lg bg-background border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Inner Card (Table) */}
            <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
               <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} className="h-10 text-xs font-medium text-muted-foreground px-5">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "border-b border-border/50 transition-colors last:border-0",
                          !disableHover && "hover:bg-muted/30"
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3.5 px-5 text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm text-muted-foreground font-poppins"
                      >
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          /* Default Layout */
          <div className={cn(
            "overflow-hidden",
            standalone && "rounded-xl border border-border bg-card"
          )}>
            {/* Title bar with search */}
            {(title || searchKey) && (
              <div className="flex items-center justify-between px-8 py-5">
                {title && (
                  <h3 className={cn("text-base font-semibold text-foreground font-poppins", titleClassName)}>{title}</h3>
                )}
                {searchKey && (
                  <div className="relative w-full max-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                    <Input
                      placeholder={placeholder}
                      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                      }
                      className="pl-9 h-8 rounded-lg bg-background border-border text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
              </div>
            )}
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="h-10 text-xs font-medium text-muted-foreground px-8">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "border-b border-border/50 transition-colors last:border-0",
                        !disableHover && "hover:bg-muted/30"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3.5 px-8 text-sm">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-sm text-muted-foreground font-poppins"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-1 pt-1">
        <p className="text-xs text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-xl h-8 px-3 text-xs border-border hover:bg-accent disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-xl h-8 px-3 text-xs border-border hover:bg-accent disabled:opacity-40 transition-all"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
