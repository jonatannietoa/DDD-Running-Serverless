// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from './id';
import { Role } from './role';

export class Client extends Role {
    public readonly id: Id;

    public static from(referencedId: string): Client {
        return new Client(Id.fromExisting(referencedId));
    }

    public static with(id: Id): Client {
        return new Client(id);
    }

    constructor(id: Id) {
        super(id);
    }
}
