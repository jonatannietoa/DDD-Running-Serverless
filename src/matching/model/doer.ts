// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from './Id';
import { Role } from './Role';

export class Doer extends Role {
    static from(referencedId: string): Doer {
        return new Doer(Id.fromExisting(referencedId));
    }

    static with(id: Id): Doer {
        return new Doer(id);
    }

    static none(): Doer {
        return new Doer(Id.empty());
    }

    toString(): string {
        return "Doer[" + JSON.stringify(this) + "]";
    }

    private constructor(id: Id) {
        super(id);
    }
}
