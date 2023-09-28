// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client } from '../../../matching/model/Client';
import { Id } from '../../../matching/model/Id';

describe('Client class', () => {
    test('Client::from', () => {
        const id = Id.unique();
        const idValue = id.value;
        const client = Client.from(idValue);
        expect(client).not.toBeNull();
        expect(client.id.value).toStrictEqual(idValue);
    });

    test('Client::with', () => {
        const id = Id.unique();
        const client = Client.with(id);
        expect(client).not.toBeNull();
        expect(client.id).toStrictEqual(id);
    });
});
