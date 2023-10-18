// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export abstract class DomainEvent {
  public readonly id: string
  public readonly occurredOn: Date
  public readonly type: string
  public readonly version: number

  toString(): string {
    const json = JSON.stringify(this)
    return this.type.concat('[').concat(json).concat(']')
  }

  protected constructor(type: string, id: string, version = 1) {
    this.type = type
    this.id = id
    this.occurredOn = new Date()
    this.version = version
  }
}
