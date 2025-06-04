'use client';

// Sortable column header component for TanStack Table with asc/desc indicators and dropdown actions
import React from 'react';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-xs font-semibold text-slate-400', className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-1.5', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 px-2.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 data-[state=open]:bg-slate-100"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-blue-600" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36 rounded-xl border-slate-200 bg-white shadow-lg p-1">
          <DropdownMenuItem
            onClick={() => column.toggleSorting(false)}
            className="text-xs font-medium text-slate-700 py-1.5 cursor-pointer"
          >
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-slate-400" />
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => column.toggleSorting(true)}
            className="text-xs font-medium text-slate-700 py-1.5 cursor-pointer"
          >
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-slate-400" />
            Descending
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator className="my-1 bg-slate-100" />
              <DropdownMenuItem
                onClick={() => column.toggleVisibility(false)}
                className="text-xs font-medium text-slate-700 py-1.5 cursor-pointer"
              >
                <EyeOff className="mr-2 h-3.5 w-3.5 text-slate-400" />
                Sembunyikan
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
