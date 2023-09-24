// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from './id';
import { Role } from './role';

export class Doer extends Role {
    public readonly id: Id;

    public static from(referencedId: string): Doer {
        return new Doer(Id.fromExisting(referencedId));
    }

    public static with(id: Id): Doer {
        return new Doer(id);
    }

    public static none() {
        return new Doer();
    }

    private constructor(id?: Id) {
        super(id);
    }
}
