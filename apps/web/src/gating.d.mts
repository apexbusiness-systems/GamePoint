export interface GateInput { compliance_status: string; runtime_eligible: boolean }
export declare function canStartSession(t: GateInput): boolean;
export declare function gateReason(t: GateInput): string | null;
