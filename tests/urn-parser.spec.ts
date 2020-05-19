import { parseURN } from '../src/urn-parser';
import { buildMapFromObject } from './helpers';

describe('Test urn-parser functionality', () => {
  test('should parse a simple urn', () => {
    const result = buildMapFromObject({
      betriebsmittel: { read: true }
    });

    expect(parseURN('ams:betriebsmittel:read')).toEqual(result);
    expect(parseURN('ams  :  betriebsmittel :  read')).toEqual(result);
  });

  test('should parse a single entity with multiple rights', () => {
    const result = buildMapFromObject({
      betriebsmittel: { read: true, write: true }
    });

    expect(parseURN('ams:betriebsmittel:{read,write}')).toEqual(result);
    expect(parseURN('ams: betriebsmittel:{read  ,write   }')).toEqual(result);
  });

  test('should parse multiple entities with a single right', () => {
    const result = buildMapFromObject({
      betriebsmittel: { write: true },
      gefahrstoffe: { write: true }
    });

    expect(parseURN('ams:{betriebsmittel,gefahrstoffe}:write')).toEqual(result);
    expect(parseURN('  ams:{betriebsmittel  ,  gefahrstoffe}:write  ')).toEqual(
      result
    );
    expect(
      parseURN('  ams:{betriebsmittel  ,  gefahrstoffe}  :write  ')
    ).toEqual(result);
  });

  test('should parse multiple entities with multiple rights', () => {
    const result = buildMapFromObject({
      betriebsmittel: { write: true, read: true },
      gefahrstoffe: { write: true, read: true }
    });

    expect(parseURN('ams:{betriebsmittel,gefahrstoffe}:{read,write}')).toEqual(
      result
    );
  });

  test.todo('should not parse malformed urn');

  test('should parse an array of simple urns inside of a single map', () => {
    const result = buildMapFromObject({
      betriebsmittel: { read: true, write: true },
      gefahrstoffe: { read: true, delete: true }
    });
    // Welche Variante hat prio beim serialisieren?
    expect(
      parseURN([
        'ams:{betriebsmittel,gefahrstoffe}:read',
        'ams:betriebsmittel:write',
        'ams:gefahrstoffe:delete'
      ])
    ).toEqual(result);
  });
});
