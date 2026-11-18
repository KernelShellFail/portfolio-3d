interface HalftoneBackgroundProps {
  variant?: 'ink' | 'light' | 'pink';
  opacity?: string;
  className?: string;
}

const variantMap: Record<NonNullable<HalftoneBackgroundProps['variant']>, string> = {
  ink: 'halftone-dots',
  light: 'halftone-dots-light',
  pink: 'halftone-pink',
};

export function HalftoneBackground({
  variant = 'ink',
  opacity = 'opacity-45',
  className = '',
}: HalftoneBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${variantMap[variant]} ${opacity} ${className}`}
    />
  );
}
