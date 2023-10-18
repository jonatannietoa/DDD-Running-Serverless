// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from './Id'

export abstract class Role {
  public readonly id: Id

  isIdentified(): boolean {
    return this.id !== null && this.id !== undefined
  }

  isUnidentified(): boolean {
    return !this.isIdentified()
  }

  equals(other: Object): boolean {
    return this === other
  }

  constructor(id: Id) {
    this.id = id
  }
}
