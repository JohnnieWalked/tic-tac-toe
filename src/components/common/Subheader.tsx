import React from 'react';

type SubheaderProps = {
  props?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >;
  children?: React.ReactNode;
};

export default function Subheader({ props, children }: SubheaderProps) {
  return (
    <h2
      {...props}
      className={`text-xl text-center font-bold ${props?.className}`}
    >
      {children}
    </h2>
  );
}
