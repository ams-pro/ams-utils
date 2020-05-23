<p align="center">
  <a href="https://ams-pro.de/" target="_blank"><img src="https://ams-pro.de/_nuxt/img/18dbf82.png" width="320" alt="AMS-Pro Logo" /></a>
</p>

# AMS-Scope utilities

Dieses Package dient dazu Scopes, welche innerhalb von AMS-Pro genutzt werden nutzbar zu machen, sodass innerhalb von Front- und Backend die Möglichkeit besteht zu überprüfen, ob ein User Zugriff (auf Basis der ihm zugewiesenen Scopes) auf eine bestimmte Ressource besitzt

## Nutzung im Frontend (VueJs)

Hauptanwendungsfall im Frontend wird sein, herauszufinden, wie bestimmte Elemente gerendert werden sollen, auf Basis der dem User zur Verfügung stehenden Scopes. Dazu kann, nachdem der User sich eingeloggt hat, eine Instanz des `AccessController`'s erstellt werden. Dieser nimmt als Parameter die aktuellen User-Scopes entgegen:

#### Beispiel:

```ts
let accessController;

function useScopes() {
  const init = (scopes: string | string[]) => {
    if (!accessController) {
      accessController = new AccessController(scopes);
    }
  };

  return {
    can: accessController.can,
    update: accesController.updateUserScopes,
    init,
  };
}
```

Nach dem einloggen **muss** nun einmal die Funktion `useScopes().init` aufgerufen werden, damit eine `AccessController`-Instanz zur Verfügung steht.

Innerhalb einer Komponente kann nun mithilfe von

```vue
<template>
  <div>
    <button :disabled="!can('ams:betriebsmittel:write')">Speichern</button>
  </div>
</template>
<script>
export default {
  setup() {
    const { can } = useScopes(/* Scopes */);

    return { can };
  },
};
</script>
```

Abgefragt werden, ob der User Zugriff hat oder nicht. Sollten sich die Scopes eines Users im Verlaufe einer Sitzung ändern (durch einloggen in eine andere Unit, o.ä.) können mithilfe von `AccessController.updateUserScopes` alle Scopes überschrieben werden.
