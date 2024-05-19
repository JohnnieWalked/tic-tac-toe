'use client';

import { FaLock } from 'react-icons/fa';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import JoinRoomForm from '../JoinRoomForm';
import { Input } from '../ui/input';
import PrimaryButton from '../common/PrimaryButton';

export type Room = {
  id: string;
  isPrivate: boolean;
  amount: number;
  roomname: string;
};

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: 'isPrivate',
    header: undefined,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          {row.getValue('isPrivate') ? (
            <FaLock className=" text-primary" />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: 'roomname',
    header: 'Room',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return (
        <div className="flex justify-between items-center">
          <div className=" tracking-wider">{row.getValue('amount')}/2</div>

          <JoinRoomForm inputNameAttr="roomname">
            <Input
              type="hidden"
              name="roomname"
              id="roomname"
              value={row.getValue('roomname')}
            />
            <PrimaryButton
              type="submit"
              className=" text-green-700 hover:text-background dark:text-green-700 dark:hover:text-primary hover:bg-green-700"
              variant="ghost"
            >
              Join game
            </PrimaryButton>
          </JoinRoomForm>
        </div>
      );
    },
  },
];
