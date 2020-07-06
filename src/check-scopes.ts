import { AMSParsedScope, parseURN } from './urn-parser';

export class AccessController {
  private accessMap: Map<string, AMSParsedScope>;

  constructor(userScopes?: string | string[]) {
    if (userScopes) {
      this.accessMap = parseURN(userScopes);
    }
  }

  // 1. Überprüfe, ob scopes angefragt wurden
  // 2. Überprüfe, ob jedes Modul verfügbar ist
  // 3. Überprüfe, ob alle Rechte innerhalb jedes Moduls verfügbar sind
  public can(requestedScopes: string | string[]): boolean {
    if (!requestedScopes?.length || !this.accessMap?.size) {
      return false;
    }

    const parsedRequest = parseURN(requestedScopes);

    for (const module of parsedRequest.keys()) {
      // 2. Überprüfe, ob jedes Modul verfügbar ist
      if (!this.accessMap.has(module)) {
        return false;
      }

      // 3. Überprüfe, ob alle Rechte innerhalb jedes Moduls verfügbar sind
      const requestedRights = parsedRequest.get(module);

      if (
        !Object.keys(requestedRights).every(
          (right) => this.accessMap.get(module)[right]
        )
      ) {
        return false;
      }
    }

    return true;
  }

  public updateUserScopes(userScopes: string | string[]) {
    this.accessMap = parseURN(userScopes);
  }

  //   public getCurrentScopes(): string; {

  //   }
}
