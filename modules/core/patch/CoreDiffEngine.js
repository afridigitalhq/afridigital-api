const CoreDiffEngine = {
  compare(before = {}, after = {}) {
    const beforeKeys = Object.keys(before);
    const afterKeys = Object.keys(after);

    return {
      before,
      after,
      added: afterKeys.filter(key => !beforeKeys.includes(key)),
      removed: beforeKeys.filter(key => !afterKeys.includes(key)),
      modified: afterKeys.filter(
        key => beforeKeys.includes(key) &&
        JSON.stringify(before[key]) !== JSON.stringify(after[key])
      ),
      comparedAt: new Date().toISOString(),
      status: "DIFF_GENERATED"
    };
  }
};

export default CoreDiffEngine;
