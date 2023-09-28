// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly type: string;

    toString(): string {
        const json = JSON.stringify(this);
        return this.type.concat("[").concat(json).concat("]");
    }

    protected constructor(type: string) {
        this.type = type;
        this.occurredOn = new Date();
    }
}
