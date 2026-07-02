"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EmailComposerProps {
  customerId: string;
  customerEmail: string;
  customerName: string;
  onClose: () => void;
  onSent: () => void;
}

export function EmailComposer({
  customerId,
  customerEmail,
  customerName,
  onClose,
  onSent,
}: EmailComposerProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/crm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, to: customerEmail, subject, body }),
      });
      if (!res.ok) throw new Error("Failed to send email");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", customerId] });
      queryClient.invalidateQueries({ queryKey: ["jobs", customerId] });
      onSent();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-white/10 rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold">Email {customerName}</h3>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground text-xl"
          >
            x
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (subject.trim() && body.trim()) sendMutation.mutate();
          }}
          className="p-5 space-y-4"
        >
          <div className="space-y-2">
            <Label>To</Label>
            <Input value={customerEmail} readOnly className="opacity-60" />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message..."
              rows={8}
              className="w-full px-3 py-2 rounded-md border border-white/10 bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              required
            />
          </div>
          {sendMutation.isError && (
            <p className="text-red-400 text-sm">
              {sendMutation.error?.message || "Failed to send"}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sendMutation.isPending || !subject.trim() || !body.trim()}
            >
              {sendMutation.isPending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
