import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';

interface CurrencyBadgeProps {
  amount: number;
  currency: string;
  className?: string;
  showApprox?: boolean;
}

export const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({
  amount,
  currency,
  className = '',
  showApprox = true,
}) => {
  const { formatDual } = useCurrency();
  const { localStr, homeStr, isDifferent } = formatDual(amount, currency);

  return (
    <span className={`inline-flex items-baseline gap-1.5 font-semibold ${className}`}>
      <span className="text-white">{localStr}</span>
      {isDifferent && showApprox && (
        <span className="text-xs font-normal text-sky-400/90 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
          ≈ {homeStr}
        </span>
      )}
    </span>
  );
};
