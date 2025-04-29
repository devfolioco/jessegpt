'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  target?: string;
  appearance?: 'primary' | 'secondary';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, target, appearance = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles = 'px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-md';
    const variants = {
      primary: 'text-[#6B8A96] bg-white hover:bg-gray-100',
      secondary: 'border border-white/40 text-white bg-white/10 hover:bg-white/20',
    };

    const combinedClassName = `${baseStyles} ${variants[appearance]} ${className}`;

    if (href) {
      return (
        <Link href={href} target={target} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
