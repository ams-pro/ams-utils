import { AMSRolesInput, serializeToUrn } from '../src/urn-serialize';

describe('Test urn-serializer functionality', () => {

    test('should serialize a simple urn', () => {
        const input: AMSRolesInput[] = [
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
                read: true,
                write: true
            }
        ]
        expect(serializeToUrn(input)).toEqual('ams:betriebsmittel:{read,write} ams:gefahrstoffe:{read,write}')
    })

})
