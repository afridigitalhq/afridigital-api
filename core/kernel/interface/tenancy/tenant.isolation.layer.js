// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * MULTI-TENANT CONTROL PLANE ISOLATION LAYER
 * Logical separation of kernel state per tenant
 */

class TenantIsolationLayer {
  constructor({ ledger, telemetry, fault }) {
    this.ledger = ledger;
    this.telemetry = telemetry;
    this.fault = fault;
  }

  getTenantContext(tenantId) {
    return {
      tenantId,
      state: this._filterState(tenantId),
      events: this._filterEvents(tenantId),
      telemetry: this._filterTelemetry(tenantId)
    };
  }

  _filterState(id) {
    return this.ledger?.byTenant?.(id) || {};
  }

  _filterEvents(id) {
    return this.telemetry?.eventsByTenant?.(id) || [];
  }

  _filterTelemetry(id) {
    return this.telemetry?.streamByTenant?.(id) || {};
  }
}

module.exports = { TenantIsolationLayer };
