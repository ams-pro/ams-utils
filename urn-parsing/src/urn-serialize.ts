/**
 * {
 *  module: 'betriebsmittel,
 *  read: true
 * }
 * ======>
 * ams:betriebsmittel:read
 */

type AMSReadWrite = {
  read?: boolean;
  write?: boolean;
};

export type AMSRolesInput = {
  module: string;
  read?: boolean;
  write?: boolean;
};

function serializeToGlob(object: AMSReadWrite | string) {
  if (Object.keys(object).length > 1) {
    return JSON.stringify(object).replace(/(true|"|:|\s)/g, '');
  }
  return JSON.stringify(object).replace(/(true|"|:|{|}|\s)/g, '');
}

export function serializeToUrn(roles: AMSRolesInput[]): string {
  // transform input array to roles-map
  const parsed = roles.reduce((prev, curr) => {
    const value = {};
    Object.keys(curr).forEach(asd => {
      if (asd === 'module') {
        return;
      }
      value[asd] = curr[asd] || false;
    });

    if (prev.has(curr.module)) {
      const prevMapValue = prev.get(curr.module);

      Object.keys(prevMapValue).forEach(roleKey => {
        if (prevMapValue[roleKey] || value[roleKey] || curr[roleKey]) {
          value[roleKey] = true;
        }
      });
    }

    prev.set(curr.module, value);
    return prev;
  }, new Map<string, AMSReadWrite>());

  const duplicatesTracker = [];

  const keyArray = [];

  /**
   * Optimize duplicates with following priority:
   * 1. Rollen und Rechte
   * 2. Module
   */
  for (const [key, val] of parsed.entries()) {
    // Remove falsy values inside of Roles-Map to minimize urn output
    Object.keys(val).forEach(k => {
      if (!val[k]) {
        delete val[k];
      }
    });
    // Check if current value was already present inside of Roles-Map
    const idx = duplicatesTracker.findIndex(
      e => JSON.stringify(e) === JSON.stringify(val)
    );
    if (idx !== -1) {
      // If present append to Key-Array and append comma for later parsing
      keyArray[idx] += key + ',';
      // Delete from map, cause values are inserted later as a bulk urn
      parsed.delete(key);
      continue;
    }

    // If not present, push to duplicate-Array (later needed for Mapping as well)
    const pusher = duplicatesTracker.push(val);
    parsed.delete(key);
    keyArray[pusher - 1] = (keyArray[pusher - 1] || '') + key + ',';
  }

  // Insert duplicates with respective value to Roles-Map
  keyArray.forEach((e, index) => {
    parsed.set(e, duplicatesTracker[index]);
  });

  const resultScopes = [];

  // Transform Roles-Map into scopes
  parsed.forEach((val, key) => {
    // Remove trailing comma caused by always appending to merged keys
    if (key.charAt(key.length - 1) === ',') {
      key = key.substring(0, key.length - 1);
    }
    // If key is mergedKey, then transorm to glob-urn
    if (key.includes(',')) {
      key = `{${key}}`;
    }
    resultScopes.push('ams:' + key + ':' + serializeToGlob(val));
  });
  return resultScopes.join(' ');
}
