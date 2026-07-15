"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface KanbanColumn<T extends string> {
  id: T;
  label: string;
}

interface KanbanItem {
  id: string;
  status: string;
}

interface KanbanBoardProps<TStatus extends string, TItem extends KanbanItem> {
  columns: KanbanColumn<TStatus>[];
  items: TItem[];
  onStatusChange: (itemId: string, newStatus: TStatus) => void;
  renderItem: (item: TItem) => React.ReactNode;
}

export function KanbanBoard<TStatus extends string, TItem extends KanbanItem>({
  columns,
  items,
  onStatusChange,
  renderItem,
}: KanbanBoardProps<TStatus, TItem>) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: TStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      onStatusChange(itemId, columnId);
    }
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(200px, 1fr))` }}>
        {columns.map((column) => {
          const columnItems = items.filter((item) => item.status === column.id);
          return (
            <div
              key={column.id}
              className={cn(
                "rounded-md border border-white/10 bg-white/[0.02] p-3 min-h-[200px] transition-colors",
                dragOverColumn === column.id && "border-primary/40 bg-primary/5"
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  {column.label}
                </h3>
                <span className="text-xs text-foreground/30">{columnItems.length}</span>
              </div>
              <div className="space-y-2">
                {columnItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    {renderItem(item)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
