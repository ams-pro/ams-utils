import { AMSRolesInput, serializeToUrn } from '../src/urn-serialize';
import { buildMapFromObject } from './helpers';
import { parseURN } from '../src/urn-parser';

describe('Test urn-serializer with urn-parser as validation', () => {
  test('should serialize and deserialize correctly', () => {
    const input: AMSRolesInput[] = [
      {
        module: 'betriebsmittel',
        read: true,
        write: true
      }
    ];

    const serialization = serializeToUrn(input);

    expect(parseURN(serialization.split(' '))).toEqual(
      buildMapFromObject({
        betriebsmittel: { read: true, write: true }
      })
    );
  });

  test('should serialize and merge multiple roles into one urn with one entity', () => {
    const input = [
      {
        module: 'betriebsmittel',
        read: true
      },
      {
        module: 'betriebsmittel',
        write: true
      },
      {
        module: 'betriebsmittel',
        delete: true
      }
    ];

    const serialization = serializeToUrn(input);

    expect(parseURN(serialization.split(' '))).toEqual(
      buildMapFromObject({
        betriebsmittel: { read: true, write: true, delete: true }
      })
    );
  });

  test('should serialize and merge multiple roles into one urn with multiple entities', () => {
    const input = [
      {
        module: 'betriebsmittel',
        read: true
      },
      {
        module: 'betriebsmittel',
        write: true
      },
      {
        module: 'gefahrstoffe',
        read: true
      },
      {
        module: 'gefahrstoffe',
        write: true
      }
    ];
    const serialization = serializeToUrn(input);

    expect(parseURN(serialization.split(' '))).toEqual(
      buildMapFromObject({
        betriebsmittel: { read: true, write: true },
        gefahrstoffe: { read: true, write: true }
      })
    );

    const input2 = [
      {
        module: 'betriebsmittel',
        read: true
      },
      {
        module: 'gefahrstoffe',
        read: true
      },
      {
        module: 'gbu',
        write: true
      },
      {
        module: 'ba',
        write: true
      }
    ];

    const serialization2 = serializeToUrn(input2);

    expect(parseURN(serialization2.split(' '))).toEqual(
      buildMapFromObject({
        betriebsmittel: { read: true },
        gefahrstoffe: { read: true },
        gbu: { write: true },
        ba: { write: true }
      })
    );
  });

  test('should serialize and merge diffrent roles into diffrent urns', () => {
    const input: any[] = [
      {
        module: 'betriebsmittel',
        read: true,
        write: true
      },
      {
        module: 'gefahrstoffe',
        read: true
      }
    ];

    const serialization = serializeToUrn(input);

    expect(parseURN(serialization.split(' '))).toEqual(
      buildMapFromObject({
        betriebsmittel: { read: true, write: true },
        gefahrstoffe: { read: true }
      })
    );
    const input2 = [...input, { module: 'gefahrstoffe', delete: true }];
    const serialization2 = serializeToUrn(input2);

    expect(parseURN(serialization2.split(' '))).toEqual(
      buildMapFromObject({
        gefahrstoffe: { read: true, delete: true },
        betriebsmittel: { read: true, write: true }
      })
    );
  });
});
