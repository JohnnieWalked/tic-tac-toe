'use client';

import React from 'react';
import { useToast } from './ui/use-toast';

/* socket */
import { socket, socketEvents } from '@/socket';

/* rtk */
import { useAppSelector } from '@/hooks/hooks';

/* types */
import { IResponseFromServer } from '@/types';

/* ui */
import { Button } from './ui/button';
import { motion } from 'framer-motion';

type GameSquareProps = {
  player: 1 | 2 | number;
  pressedSquareIndex: number;
  isDisabledByParent?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const draw = {
  hidden: { pathLength: 0 },
  visible: () => {
    return {
      pathLength: 1,
      transition: {
        pathLength: { duration: 1 },
      },
    };
  },
};

export default function GameSquare({
  isDisabledByParent,
  className,
  pressedSquareIndex,
  player,
}: GameSquareProps) {
  const { toast } = useToast();
  const { roomname } = useAppSelector((state) => state.roomSlice);

  function fillSquare() {
    switch (player) {
      case 1: {
        return (
          <>
            <motion.line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              variants={draw}
              strokeWidth={3}
              strokeLinecap="round"
              stroke="hsl(var(--primary))"
            />
            <motion.line
              x1="0"
              y1="100%"
              x2="100%"
              y2="0"
              variants={draw}
              strokeWidth={3}
              strokeLinecap="round"
              stroke="hsl(var(--primary))"
            />
          </>
        );
      }
      case 2: {
        return (
          <motion.circle
            cx="50%"
            cy="50%"
            r={`calc(50% - 3px)`}
            strokeWidth={3}
            stroke="hsl(var(--primary))"
            strokeLinecap="round"
            variants={draw}
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!roomname) return;

    const buttonValue = +event.currentTarget.value;
    if (buttonValue !== 0) {
      toast({
        title: 'Oops!',
        variant: 'destructive',
        description: 'This square has been already marked.',
      });
      return;
    }
    socket.emit(
      socketEvents.PLACE_MARK,
      { roomname, pressedSquareIndex },
      (response: IResponseFromServer) => {
        if (response.success) {
          toast({
            title: response.description,
          });
        } else {
          toast({
            title: 'Something went wrong!',
            variant: 'destructive',
            description: response.description,
          });
        }
      }
    );
  };

  return (
    <Button
      value={player}
      onClick={(e) => handleClick(e)}
      disabled={
        player === 0 ? isDisabledByParent : true
      } /* disable button if it has player value (1 or 2) */
      className={`p-4 bg-background text-primary w-full h-full flex items-center justify-center ${className}`}
    >
      <motion.svg
        className="w-full h-full"
        // viewBox="0 0 100% 100%"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
        fill="none"
      >
        {fillSquare()}
      </motion.svg>
    </Button>
  );
}
