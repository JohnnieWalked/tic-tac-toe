'use client';

import { Button, ButtonProps } from '../ui/button';
import { useFormStatus } from 'react-dom';

export default function PrimaryButton(props: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button {...props} disabled={pending}>
      {pending ? <div className="loader" /> : props.children}
    </Button>
  );
}
