// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export class Id {
  private readonly _value: string;

  static empty() {
    return new Id("");
  }

  static fromExisting(referencedId: string): Id {
    return new Id(referencedId);
  }

  static unique(): Id {
    return new Id();
  }

  get value(): string {
    return this._value;
  }

  private constructor(referencedId?: string) {
    if (referencedId) {
      this._value = referencedId;
    } else {
      this._value = `id-${Math.random().toString(36)}`;
    }
  }
}
