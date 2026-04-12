import type { PropsWithChildren, ReactNode } from "react";

type DetailSectionProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>;

export function DetailSection({ title, action, children }: DetailSectionProps) {
  return (
    <section className="detail-section">
      <div className="detail-section__header">
        <h3>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
