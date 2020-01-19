type MapRights = {
  [key: string]: {
    [key: string]: boolean;
  };
};

export function buildMapFromObject(obj: MapRights): Map<string, MapRights> {
  const map = new Map();
  for (const key in obj) {
    map.set(key, obj[key]);
  }
  return map;
}
