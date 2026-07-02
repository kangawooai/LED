"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Campaign, CampaignStatus } from "@/lib/types/crm";
import * as campaignsApi from "@/lib/api/campaigns";
import * as proposalsApi from "@/lib/api/proposals";
import { useRealtimeSubscription } from "./useRealtimeSubscription";

export function useCampaigns() {
  useRealtimeSubscription({ table: "campaigns", queryKey: ["campaigns"] });

  return useQuery({
    queryKey: ["campaigns"],
    queryFn: campaignsApi.getCampaigns,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => campaignsApi.getCampaign(id),
    enabled: !!id,
  });
}

export function useCampaignStats(id: string) {
  return useQuery({
    queryKey: ["campaigns", id, "stats"],
    queryFn: () => campaignsApi.getCampaignStats(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (campaign: Omit<Campaign, "id" | "createdAt">) =>
      campaignsApi.createCampaign(campaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Campaign> }) =>
      campaignsApi.updateCampaign(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", data.id] });
    },
  });
}

export function useUpdateCampaignStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CampaignStatus }) =>
      campaignsApi.updateCampaignStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns", data.id] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useProposals() {
  useRealtimeSubscription({ table: "campaigns", queryKey: ["proposals"] });

  return useQuery({
    queryKey: ["proposals"],
    queryFn: proposalsApi.getProposals,
  });
}

export function useAcceptProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => proposalsApi.acceptProposal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}
