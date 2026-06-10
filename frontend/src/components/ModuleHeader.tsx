import type { ReactNode } from 'react';

interface ModuleHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function ModuleHeader({ eyebrow, title, description, actions }: ModuleHeaderProps) {
  return (
    <section className="module-header">
      <div>
        <span className="hero-panel__tag">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {actions ? <div className="module-header__actions">{actions}</div> : null}
    </section>
  );
}
