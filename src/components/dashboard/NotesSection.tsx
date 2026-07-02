"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CustomerNote } from "@/lib/types/crm";

interface NotesSectionProps {
  customerId: string;
  notes: CustomerNote[];
  stage: "lead" | "job";
}

export function NotesSection({ customerId, notes, stage }: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState("");
  const queryClient = useQueryClient();

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch("/api/crm-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, content }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [stage === "lead" ? "leads" : "jobs", customerId],
      });
      setNewNote("");
      setIsAdding(false);
    },
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Notes</h3>
        {!isAdding && (
          <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
            Add Note
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button
              size="sm"
              onClick={() => addNoteMutation.mutate(newNote)}
              disabled={addNoteMutation.isPending || !newNote.trim()}
            >
              {addNoteMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setIsAdding(false); setNewNote(""); }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {notes.length > 0 ? (
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="p-3 rounded-md bg-white/[0.03] border border-white/5">
              {note.isVoiceNote && (
                <span className="text-[10px] uppercase tracking-widest text-primary mb-1 block">
                  Voice Note
                </span>
              )}
              <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              <p className="text-xs text-foreground/30 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !isAdding && (
          <p className="text-sm text-foreground/30 text-center py-2">No notes yet.</p>
        )
      )}
    </div>
  );
}
