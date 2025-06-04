// Breadcrumb navigation component displaying hierarchical operational location
import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-slate-500 mb-3">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span className="sr-only sm:not-sr-only">Beranda</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-slate-800 truncate" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-slate-900 transition-colors truncate"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
