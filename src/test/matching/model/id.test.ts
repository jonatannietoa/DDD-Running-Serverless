// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from '../../../matching/model/id';

describe('Id class', () => {
    test('Id::fromExisting', () => {
        const idValue = Id.unique().value;
        const id = Id.fromExisting(idValue);
        expect(id).not.toBeNull();
        expect(id.value).toBe(idValue);
    });

    test('Id::unique', () => {
        const id = Id.unique();
        expect(id).not.toBeNull();
        const idValue = id.value;
        expect(idValue).not.toBeNull();
        expect(idValue.length).toBe(id.value.length);
        expect(id.value).toBe(idValue);
    });
});
