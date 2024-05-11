'use client';

import { useState } from 'react';
import './LobbyTable.css';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import PrimaryButton from '../common/PrimaryButton';
import JoinRoomForm from '../JoinRoomForm';
import Subheader from '../common/Subheader';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function LobbyTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <Subheader>Available Lobbies</Subheader>
      <div className="flex items-center justify-between py-4">
        <div>
          <Label>{'Filter rooms:'}</Label>
          <Input
            placeholder="Filter rooms..."
            value={
              (table.getColumn('roomname')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('roomname')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className=" w-1/2">
          <JoinRoomForm inputNameAttr="roomname" className="lobby-form">
            <Label htmlFor="roomname" className="lobby-label">
              {'Direct join:'}
            </Label>

            <Input
              id="roomname"
              name="roomname"
              placeholder="Enter room name"
              className="max-w-sm lobby-input"
            />
            <PrimaryButton className="lobby-button" variant="ghost">
              Join
            </PrimaryButton>
          </JoinRoomForm>
        </div>
      </div>
      <div className="rounded-md border h-96 overflow-y-scroll">
        <Table className="">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
