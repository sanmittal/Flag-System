export interface EvaluationContext {
  userId?: string;
  groupId?: string;
  region?: string;
}

export type EvaluationSource =
  | "USER_OVERRIDE"
  | "GROUP_OVERRIDE"
  | "REGION_OVERRIDE"
  | "PERCENTAGE_ROLLOUT"
  | "GLOBAL_DEFAULT";

export interface FeatureEvaluationResult {
  key: string;
  enabled: boolean;
  source: EvaluationSource;
}
