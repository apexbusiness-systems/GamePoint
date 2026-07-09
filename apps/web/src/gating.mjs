// Pure title-gating logic shared by UI and tests. Mirrors compliance-matrix semantics.
/** @param {{compliance_status: string, runtime_eligible: boolean}} t */
export function canStartSession(t) {
  return t.compliance_status === 'cleared' && t.runtime_eligible === true;
}
/** @param {{compliance_status: string, runtime_eligible: boolean}} t */
export function gateReason(t) {
  if (canStartSession(t)) return null;
  switch (t.compliance_status) {
    case 'cleared': return 'Registry only in v1.0 — runtime coaching not yet enabled for this title.';
    case 'verify_terms': return 'Publisher terms under review — runtime blocked until cleared.';
    case 'license_blocked': return 'Knowledge licensing blocks runtime coaching for this title.';
    default: return 'Not runtime supported until cleared.';
  }
}
