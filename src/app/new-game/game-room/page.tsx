/* components */
import GameField from '@/components/GameField';
import Chat from '@/components/chat/Chat';
import LeaveRoomButton from '@/components/lobby-room/LeaveRoomButton';

interface GameRoomPageProps {
  searchParams: {
    roomname: string;
    password: string;
  };
}

export default function GameRoomPage({ searchParams }: GameRoomPageProps) {
  const { roomname, password } = searchParams;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 place-items-center">
      <div className="w-max overflow-hidden">
        <GameField animateGameplay={false} disableClickSquare={false} />
      </div>
      <Chat roomnameURLQuery={roomname} passwordURLQuery={password} />
      <LeaveRoomButton roomname={roomname} />
    </div>
  );
}
