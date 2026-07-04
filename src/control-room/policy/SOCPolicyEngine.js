export class SOCPolicyEngine {
  constructor() {
    this.policies = new Map();
  }

  addPolicy(id, rule) {
    this.policies.set(id, rule);
  }

  removePolicy(id) {
    return this.policies.delete(id);
  }

  evaluate(caseFile) {
    const results = [];

    for (const [id, rule] of this.policies.entries()) {
      if (rule.condition(caseFile)) {
        results.push({
          policyId: id,
          action: rule.action,
          priority: rule.priority || "MEDIUM"
        });
      }
    }

    return results.sort((a, b) => {
      const order = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
      return order[b.priority] - order[a.priority];
    });
  }
}

export const socPolicyEngine = new SOCPolicyEngine();
