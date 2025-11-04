
import * as React from 'react';
import { clsx } from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm'|'md'|'lg';
};
export function Button({ className, variant='default', size='md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-2xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 border-transparent',
    outline: 'bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-transparent'
  };
  const sizes = { sm:'h-8 px-3', md:'h-10 px-4', lg:'h-12 px-6' };
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />;
}
