
import * as React from 'react';
import { clsx } from 'clsx';
export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={clsx('h-10 w-full rounded-2xl border px-3 text-sm outline-none border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900', className)} {...props} />;
});
