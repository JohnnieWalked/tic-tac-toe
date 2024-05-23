/* components */
import GameField from '@/components/GameField';
import Chat from '@/components/chat/Chat';
import LeaveRoomButton from '@/components/lobby-room/LeaveRoomButton';
import RoomControlBar from '@/components/lobby-room/RoomControlBar';

interface GameRoomPageProps {
  searchParams: {
    roomname: string;
    password: string;
  };
}

export default function GameRoomPage({ searchParams }: GameRoomPageProps) {
  const { roomname, password } = searchParams;

  return (
    <div>
      <section className="border rounded p-5">
        <RoomControlBar roomnameURLQuery={roomname} />
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 place-items-center pt-5">
        <div className="w-max overflow-hidden">
          <GameField animateGameplay={false} disableClickSquare={false} />
        </div>
        <Chat roomnameURLQuery={roomname} passwordURLQuery={password} />
        <LeaveRoomButton />
      </section>
    </div>
  );
}
