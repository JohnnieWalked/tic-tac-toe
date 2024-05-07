type ChatMemberStatusProps = {
  username: string;
  status?: boolean;
};

export default function ChatMemberStatus({
  username,
  status,
}: ChatMemberStatusProps) {
  const circleColor = () => {
    if (status) return `bg-green-500`;
    return `bg-red-500`;
  };

  return (
    <div className="flex flex-col">
      <h4 className=" font-medium ">{username}</h4>
      {status !== undefined && (
        <div className=" font-extralight">
          <span
            className={` inline-block w-2 h-2 rounded-full ${circleColor()}`}
          />{' '}
          {status ? 'online' : 'offline'}
        </div>
      )}
    </div>
  );
}
