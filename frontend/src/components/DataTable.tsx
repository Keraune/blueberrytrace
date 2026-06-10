import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  title: string;
  description: string;
  columns: TableColumn<T>[];
  items: T[];
}

export function DataTable<T extends { id: number }>({ title, description, columns, items }: DataTableProps<T>) {
  return (
    <section className="panel-card">
      <div className="panel-card__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="panel-card__count">{items.length} registros</span>
      </div>

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => {
                  const raw = item[column.key as keyof T];
                  return (
                    <td key={String(column.key)}>
                      {column.render ? column.render(item) : String(raw ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="data-table__empty">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

