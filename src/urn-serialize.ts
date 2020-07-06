type AMSReadWrite = {
  read?: boolean;
  write?: boolean;
};

export type AMSRolesInput = {
  module: string;
  read?: boolean;
  write?: boolean;
};

function transformKeyToGlob(key: string) {
  if (key.includes(',')) {
    key = `{${key}}`;
  }
  return key;
}

function serializeToGlob(object: AMSReadWrite) {
  return transformKeyToGlob(Object.keys(object).join(','));
}

export function serializeToUrn(roles: AMSRolesInput[]): string {
  // transform input array to roles-map
  const parsed = roles.reduce((prev, curr) => {
    const value = {};
    for (const inputKey in curr) {
      if (inputKey !== 'module' && curr[inputKey]) {
        value[inputKey] = curr[inputKey];
      }
    }

    if (prev.has(curr.module)) {
      const prevMapValue = prev.get(curr.module);

      for (const roleKey in prevMapValue) {
        if (prevMapValue[roleKey] || value[roleKey] || curr[roleKey]) {
          value[roleKey] = true;
        }
      }
    }

    prev.set(curr.module, value);
    return prev;
  }, new Map<string, AMSReadWrite>());

  const duplicatesTracker: AMSReadWrite[] = [];

  const keyArray: string[] = [];

  /**
   * Optimize duplicates with following priority:
   * 1. Rollen und Rechte
   * 2. Module
   */
  for (const [key, val] of parsed.entries()) {
    const idx = duplicatesTracker.findIndex(
      (e) => JSON.stringify(e) === JSON.stringify(val)
    );

    parsed.delete(key);
    if (idx !== -1) {
      keyArray[idx] += ',' + key;
      continue;
    }

    // If not present, push to duplicate-Array (later needed for Mapping as well)
    const pushIdx = duplicatesTracker.push(val) - 1;
    keyArray[pushIdx] = (keyArray[pushIdx] || '') + key;
  }

  // Insert duplicates with respective value to Roles-Map
  keyArray.forEach((e, idx) => {
    parsed.set(e, duplicatesTracker[idx]);
  });

  const resultScopes = [];

  // Transform Roles-Map into scopes
  for (const [key, val] of parsed.entries()) {
    resultScopes.push(
      'ams:' + transformKeyToGlob(key) + ':' + serializeToGlob(val)
    );
  }
  return resultScopes.join(' ');
}
