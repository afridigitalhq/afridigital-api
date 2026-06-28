// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class KernelSpineVM {
  constructor({ ledger, validator, router }) {
    this.ledger = ledger;
    this.validator = validator;
    this.router = router;
  }

  ingest(event) {
    if (!this.validator?.validate?.(event)) {
      return { ok: false, error: "REJECTED" };
    }

    this.ledger?.append?.(event);

    return this.router.route(event);
  }
}
module.exports = { KernelSpineVM };
// DEPRECATED (SAFE MODE): superseded by canonical kernel map
