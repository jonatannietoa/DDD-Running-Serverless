// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from "./Id";

export abstract class Role {
    private readonly _id: Id;

    isUnidentified(): boolean {
        return this.id === null;
    }

    equals(other: Object): boolean {
        return this === other;
    }

    get id() {
        return this._id;
    }

    constructor(id: Id) {
        this._id = id;
    }
}
