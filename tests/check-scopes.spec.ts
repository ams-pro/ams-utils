import { AccessController } from '../src/check-scopes';
const USER_SCOPES = 'ams:{betriebsmittel, gefahrstoffe}:{read,write}';

describe('Test Acces-Checking functionality', () => {
  test('should grant access for scope, if it is a user-scope', () => {
    const accesController = new AccessController(USER_SCOPES);

    expect(accesController.can('ams:betriebsmittel:read')).toBe(true);

    expect(accesController.can('ams:gefahrstoffe:write')).toBe(true);

    expect(accesController.can('ams:{betriebsmittel,gefahrstoffe}:read')).toBe(
      true
    );
  });

  test('should permit access for scope, if it is not a user-scope', () => {
    const accesController = new AccessController(USER_SCOPES);

    expect(accesController.can('ams:betriebsanweisungen:read')).toBe(false);

    expect(accesController.can('ams:gefahrstoffe:delete')).toBe(false);

    expect(accesController.can(undefined)).toBe(false);

    expect(accesController.can(null)).toBe(false);

    expect(accesController.can('ams:gefahrstoffe:{read, delete}')).toBe(false);
  });

  test('should grant access for array of scopes, if user has all of them', () => {
    const accesController = new AccessController(USER_SCOPES);

    expect(
      accesController.can([
        'ams:betriebsmittel:read',
        'ams:betriebsmittel:write',
      ])
    ).toBe(true);

    expect(
      accesController.can(['ams:gefahrstoffe:read', 'ams:betriebsmittel:write'])
    ).toBe(true);
    expect(
      accesController.can([
        'ams:gefahrstoffe:read',
        'ams:betriebsmittel:write',
        'ams:gefahrstoffe:write',
        undefined,
      ])
    ).toBe(true);
  });

  test('should permit access for array of scopes, if user has not all of them (at least one is missing)', () => {
    const accesController = new AccessController(USER_SCOPES);

    expect(
      accesController.can([
        'ams:betriebsanweisungen:read',
        'ams:gefahrstoffe:delete',
      ])
    ).toBe(false);
  });
});

describe('AccessController can be updated and validates correctly all the time', () => {
  test('should be updated and handle new requests correctly', () => {
    const accesController = new AccessController(USER_SCOPES);

    expect(accesController.can('ams:betriebsmittel:read')).toBe(true);
    expect(accesController.can('ams:betriebsanweisungen:read')).toBe(false);
    expect(
      accesController.can([
        'ams:gefahrstoffe:read',
        'ams:betriebsmittel:write',
        'ams:gefahrstoffe:write',
        undefined,
      ])
    ).toBe(true);

    accesController.updateUserScopes([
      'ams:betriebsmittel:{read,write}',
      'ams:gefahrstoffe:delete',
      'ams:betriebsanweisungen:read',
    ]);

    expect(
      accesController.can([
        'ams:betriebsanweisungen:read',
        'ams:gefahrstoffe:delete',
      ])
    ).toBe(true);
  });
});
