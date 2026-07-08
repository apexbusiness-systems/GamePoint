export type SourceTier = 'verified' | 'mixed' | 'policy' | 'none';
export type CoachingResponse = { advice_text: string; recommended_action: string; evidence_ids: string[]; confidence: number; source_tier: SourceTier; not_verified: boolean; latency_ms?: number };
