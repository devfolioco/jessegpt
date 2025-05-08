'use client';

import { nyghtBold } from '@/app/fonts/fonts';
import { Color } from '@/theme/colors';
import clsx from 'clsx';
import Link from 'next/link';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  target?: string;
  appearance?: 'primary' | 'secondary' | 'colored';
  color?: Color;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, target, appearance = 'primary', className = '', children, ...props }, ref) => {
    const basePrimarySecondaryStyles = clsx(
      'px-8 py-4 rounded-lg text-2xl font-semibold transition-all shadow-md',
      nyghtBold.className
    );
    const variants = {
      primary: 'text-[#6B8A96] bg-white hover:bg-gray-100',
      secondary: 'border border-white/40 text-white bg-white/10 hover:bg-white/20',
      colored: clsx(
        'flex items-center justify-center gap-2 py-4 px-10 w-full rounded-lg !font-semibold !text-xl hover:opacity-80 transition-opacity font-inter max-w-fit'
      ),
    };

    const combinedClassName = clsx(
      appearance === 'primary' || appearance === 'secondary' ? basePrimarySecondaryStyles : false,
      variants[appearance],
      className
    );

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
