type GameSquareProps = {
  isDisabled?: boolean;
  className: string;
  children?: React.ReactNode;
};

export default function GameSquare({
  isDisabled,
  className,
  children,
}: GameSquareProps) {
  return (
    <div
      className={`bg-background w-full h-full flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
}
