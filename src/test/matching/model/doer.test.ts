// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Doer } from '../../../matching/model/Doer';
import { Id } from '../../../matching/model/Id';

describe('Doer class', () => {
    test('Doer::from', () => {
        const id = Id.unique();
        const idValue = id.value;
        const doer = Doer.from(idValue);
        expect(doer).not.toBeNull();
        expect(doer.id.value).toStrictEqual(idValue);
    });

    test('Doer::with', () => {
        const id = Id.unique();
        const doer = Doer.with(id);
        expect(doer).not.toBeNull();
        expect(doer.id).toStrictEqual(id);
    });
});
