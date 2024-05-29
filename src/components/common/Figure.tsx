import { RxCross2, RxCircle } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

interface FigureProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLHeadingElement
  > {
  role?: 'x' | 'o';
}

export default function Figure({ role, className }: FigureProps) {
  const classes = twMerge('w-fit h-fit', className);

  if (!role) {
    return <span className=" text-lg font-medium pl-1">no role</span>;
  }

  const renderFigure = () => {
    if (role === 'x') {
      return <RxCross2 className=" w-full h-full stroke-1 text-blue-500" />;
    }
    if (role === 'o') {
      return (
        <RxCircle className=" w-full h-full stroke-1 text-yellow-500 p-[0.3px]" />
      );
    }
  };

  return <div className={classes}>{renderFigure()}</div>;
}
