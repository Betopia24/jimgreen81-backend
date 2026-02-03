// Plan types without Zod validation
export type TCreatePlan = {
  name: "BASIC" | "ADVANCED" | "EXPERT";
  isActive: boolean;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  maxReports: number;
  maxAccounts: number;
  features: {
    aiAnalysis: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    dashboardAnalytics: boolean;
    advancedReports: boolean;
  };
};

export type TUpdatePlan = {
  name?: "BASIC" | "ADVANCED" | "EXPERT";
  monthlyPrice?: number;
  annualPrice?: number;
  description?: string;
  maxReports?: number;
  maxAccounts?: number;
  features?: {
    aiAnalysis?: boolean;
    prioritySupport?: boolean;
    apiAccess?: boolean;
    customBranding?: boolean;
    dashboardAnalytics?: boolean;
    advancedReports?: boolean;
  };
  isActive?: boolean;
};

export type TPlanFilters = {
  searchTerm?: string;
  name?: "BASIC" | "ADVANCED" | "EXPERT";
  isActive?: boolean;
};