import type { Metadata } from "next";
import ProposalClient from "./_client";

export const metadata: Metadata = {
  title: "Your Proposal",
  description:
    "Your personalised lead generation proposal with pricing tailored to your business.",
};

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProposalClient leadId={id} />;
}
