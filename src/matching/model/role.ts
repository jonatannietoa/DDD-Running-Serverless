// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export abstract class Role {
    public readonly id: Id;

    public isUnidentified(): boolean {
        return this.id === null;
    }

    public equals(other: Object): boolean {
        return this === other;
    }

    constructor(id?: Id) {
        this.id = id;
    }
}
