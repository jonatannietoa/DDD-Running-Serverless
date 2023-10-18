// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from './Id'
import { Role } from './Role'

export class Client extends Role {
  static from(referencedId: string): Client {
    return new Client(Id.fromExisting(referencedId))
  }

  static none(): Client {
    return new Client(Id.empty())
  }

  static with(id: Id): Client {
    return new Client(id)
  }

  toString(): string {
    return 'Client[' + JSON.stringify(this) + ']'
  }

  private constructor(id: Id) {
    super(id)
  }
}
