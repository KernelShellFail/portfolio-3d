import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface MangaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-light';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantMap: Record<NonNullable<MangaButtonProps['variant']>, string> = {
  primary:
    'bg-[#632D40] text-[#FFF9F1] border-2 border-[#211E25] shadow-[4px_4px_0_#211E25] hover:bg-[#B84955] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#211E25]',
  secondary:
    'bg-[#FFF9F1] text-[#211E25] border-2 border-[#211E25] shadow-[4px_4px_0_#211E25] hover:bg-[#E8BFC9] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#211E25]',
  'outline-light':
    'bg-[#301B29] text-[#FFF9F1] border-2 border-[#E8BFC9] shadow-[4px_4px_0_#B84955] hover:bg-[#632D40] active:translate-x-[2px] active:translate-y-[2px]',
};

const sizeMap: Record<NonNullable<MangaButtonProps['size']>, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-xs',
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[48px] px-6 py-3 text-base',
};

export function MangaButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}: MangaButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap shrink-0 transition-[background-color,transform,box-shadow] duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantMap[variant]} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
