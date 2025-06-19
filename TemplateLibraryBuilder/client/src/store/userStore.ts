import { create } from 'zustand';
import { PlanTier } from '@/types/plans';

interface UserState {
  currentPlan: PlanTier;
  isAuthenticated: boolean;
  setPlan: (plan: PlanTier) => void;
  setAuthenticated: (auth: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentPlan: 'Admin', // Admin plan with all features unlocked
  isAuthenticated: false,
  setPlan: (plan) => set({ currentPlan: plan }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
}));