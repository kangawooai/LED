"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EmailComposer } from "./EmailComposer";
import type { CustomerCommunication } from "@/lib/types/crm";

interface CommunicationsSectionProps {
  customerId: string;
  customerEmail: string;
  customerName: string;
  communications: CustomerCommunication[];
}

export function CommunicationsSection({
  customerId,
  customerEmail,
  customerName,
  communications,
}: CommunicationsSectionProps) {
  const [isComposing, setIsComposing] = useState(false);

  const typeIcons: Record<string, string> = {
    email: "Email",
    call: "Call",
    text: "Text",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-md p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Communications</h3>
        <Button variant="outline" size="sm" onClick={() => setIsComposing(true)}>
          Email Customer
        </Button>
      </div>

      {communications && communications.length > 0 ? (
        <div className="space-y-2">
          {communications.map((comm) => (
            <div key={comm.id} className="p-3 rounded-md bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium capitalize">
                    {typeIcons[comm.type] || comm.type}
                  </span>
                  <span className="text-[10px] text-foreground/30">
                    {comm.direction === "inbound" ? "Received" : "Sent"}
                  </span>
                </div>
                <span className="text-[10px] text-foreground/30">
                  {new Date(comm.createdAt).toLocaleString()}
                </span>
              </div>
              {comm.summary && (
                <p className="text-sm text-foreground/70">{comm.summary}</p>
              )}
              {comm.duration != null && (
                <p className="text-xs text-foreground/30 mt-1">
                  Duration: {Math.floor(comm.duration / 60)}m {comm.duration % 60}s
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground/30 text-center py-2">
          No communications yet.
        </p>
      )}

      {isComposing && (
        <EmailComposer
          customerId={customerId}
          customerEmail={customerEmail}
          customerName={customerName}
          onClose={() => setIsComposing(false)}
          onSent={() => setIsComposing(false)}
        />
      )}
    </div>
  );
}
