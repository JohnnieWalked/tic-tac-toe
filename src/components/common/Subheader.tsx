import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Subheader(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
) {
  const className = twMerge('text-xl text-center font-bold', props.className);
  return (
    <h2 {...props} className={className}>
      {props.children}
    </h2>
  );
}
