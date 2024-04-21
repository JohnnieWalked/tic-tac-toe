'use client';

import { FaLock } from 'react-icons/fa';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

export type Room = {
  id: string;
  amount: number;
  room: string;
};

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: 'isPrivate',
    header: undefined,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <FaLock className=" text-primary" />
        </div>
      );
    },
  },
  {
    accessorKey: 'room',
    header: 'Room',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <div className="flex justify-between items-center">
          <div className=" tracking-wider">{row.getValue('amount')}/2</div>

          <Button
            className=" text-green-700 hover:text-background dark:text-green-700 dark:hover:text-primary hover:bg-green-700"
            variant="ghost"
          >
            <span>Join game</span>
          </Button>
        </div>
      );
    },
  },
];
