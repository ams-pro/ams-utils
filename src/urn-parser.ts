const URN_REGEX = /(?<company>[a-z,\s]+):{?(?<ressources>[a-z,\s]+)}?:{?(?<rights>[a-z,\s]+)}?/m;
export type AMSParsedScope = {
  [key: string]: boolean;
};
/* TODOS:
 * handle edgecases and provide good error preventions inside
 * Custom AMSMap which enables easy acces to certain rights
 */

export class ParsingError extends Error {
  constructor(property: string) {
    const message = `[ParsingError]: Missing property ${property} in URN`;
    super(message);
    this.message = message;
    this.name = 'ParsingError';
  }
}

function parseGlob(glob: string) {
  return glob.split(',');
}

function extractScopes(
  urn: string,
  currentStateMap: Map<string, AMSParsedScope>
) {
  urn = urn.replace(/\s/g, '');
  /* const {
    groups: { company, ressources, rights },
  } = URN_REGEX.exec(urn); */
  const parsed = URN_REGEX.exec(urn);
  if (!parsed?.groups) {
    throw new ParsingError('groups');
  }
  const {
    groups: { company, ressources, rights },
  } = parsed;
  if (!company) {
    throw new ParsingError('company');
  }
  if (!ressources) {
    throw new ParsingError('ressources');
  }
  if (!rights) {
    throw new ParsingError('rights');
  }
  const parsedRessources = parseGlob(ressources);
  const parsedRights = parseGlob(rights);

  const formatted = parsedRights.reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: true,
    }),
    {}
  );
  for (const resource of parsedRessources) {
    if (!currentStateMap.has(resource)) {
      currentStateMap.set(resource, formatted);
      continue;
    }
    const current = currentStateMap.get(resource);
    currentStateMap.set(resource, { ...current, ...formatted });
  }
}

export function parseURN(urn: string | string[]): Map<string, AMSParsedScope> {
  const result = new Map<string, AMSParsedScope>();
  if (Array.isArray(urn)) {
    for (const part of urn) {
      if (part) {
        extractScopes(part, result);
      }
    }
    return result;
  }

  urn && extractScopes(urn, result);
  return result;
}
