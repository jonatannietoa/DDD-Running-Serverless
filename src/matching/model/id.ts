// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export class Id {
  public readonly value: string

  static empty() {
    return new Id('')
  }

  static fromExisting(referencedId: string): Id {
    return new Id(referencedId)
  }

  static unique(): Id {
    return new Id()
  }

  private constructor(referencedId?: string) {
    if (referencedId) {
      this.value = referencedId
    } else {
      this.value = `id-${Math.random().toString(36)}`
    }
  }
}
