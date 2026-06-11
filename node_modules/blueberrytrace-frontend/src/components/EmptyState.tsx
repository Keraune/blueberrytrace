import type { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  compact?: boolean;
  inline?: boolean;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, compact = false, inline = false, action }: EmptyStateProps) {
  const className = [
    'empty-state',
    compact ? 'empty-state--compact' : '',
    inline ? 'empty-state--inline' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={className}>
      {icon || <PackageOpen size={26} />}
      <strong>{title}</strong>
      <small>{description}</small>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
