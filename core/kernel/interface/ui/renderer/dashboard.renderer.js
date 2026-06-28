// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * CONTROL DASHBOARD RENDERER
 * Converts contract → UI-ready view model
 */

class DashboardRenderer {
  constructor(contract) {
    this.contract = contract;
  }

  render(state) {
    const sections = this.contract.sections;

    return Object.keys(sections).map((key) => {
      const section = sections[key];

      return {
        id: key,
        title: section.title,
        data: this._resolveFields(key, section.fields, state)
      };
    });
  }

  _resolveFields(sectionKey, fields, state) {
    const output = {};

    fields.forEach((field) => {
      output[field] =
        state?.[sectionKey]?.[field] ??
        state?.[field] ??
        null;
    });

    return output;
  }
}

module.exports = { DashboardRenderer };
