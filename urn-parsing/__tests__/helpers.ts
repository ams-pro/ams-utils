import { AMSParsedScope } from '../src/urn-parser';
type MapRights = {
  [key: string]: AMSParsedScope;
};

export function buildMapFromObject(
  obj: MapRights
): Map<string, AMSParsedScope> {
  const map = new Map<string, AMSParsedScope>();
  for (const key in obj) {
    map.set(key, obj[key]);
  }
  return map;
}
