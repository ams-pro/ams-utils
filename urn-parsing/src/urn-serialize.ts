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
}

const serializeToGlob = (object: AMSReadWrite) => JSON.stringify(object).replace(/(true|"|:)/g, '');

export function serializeToUrn(roles: AMSRolesInput[]): string {

  const array = [];
  roles.reduce((prev, curr) => {

    const value = {
      read: curr.read || false,
      write: curr.write || false
    }

    if (prev.has(curr.module)) {

      const prevMapValue = prev.get(curr.module);

      if (prevMapValue.read || value.read || curr.read) {
        value.read = true
      }
      if (prevMapValue.write || value.write || curr.write) {
        value.write = true
      }
    }

    prev.set(curr.module, value)
    return prev;
  },
    new Map<string, AMSReadWrite>())
    .forEach((val, key) => {
      const string = 'ams:' + key + ':' + serializeToGlob(val)
      array.push(string)
    })

  // Collect all Keys bei denen die Werte gleich sind und fasse diese zusammen

  console.log(array);

  return array.join(' ');
}
