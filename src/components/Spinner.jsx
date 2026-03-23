import { Loader2 } from 'lucide-react';

/**
 * Reusable spinner component.
 * @param {object} props
 * @param {number} [props.size=20] - Icon size in px
 * @param {'brand'|'white'|'danger'} [props.variant='brand'] - Color variant
 * @param {string} [props.className] - Additional classNames
 */
export default function Spinner({ size = 20, variant = 'brand', className = '' }) {
  const colorMap = {
    brand: 'var(--brand-primary)',
    white: '#FFFFFF',
    danger: 'var(--danger)',
  };

  return (
    <Loader2
      size={size}
      className={className}
      style={{
        color: colorMap[variant] || colorMap.brand,
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );
}
