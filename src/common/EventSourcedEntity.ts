// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { DomainEvent } from './DomainEvent'

export abstract class EventSourcedEntity {
  private _applied: Array<DomainEvent>
  private _version: number

  public get applied(): Array<DomainEvent> {
    return this._applied
  }

  public get nextVersion(): number {
    return this.version + 1
  }

  public get version(): number {
    return this._version
  }

  protected constructor(stream?: Array<DomainEvent>) {
    if (stream) {
      stream.forEach((e) => {
        this.when(e)
      })
      this.version = stream.length
    } else {
      this.version = 0
    }

    this.applied = []
  }

  protected apply(e: DomainEvent): void {
    this.applied.push(e)
    this.when(e)
  }

  protected abstract when(e: DomainEvent): void

  private set applied(empty: Array<DomainEvent>) {
    this._applied = empty
  }

  private set version(version: number) {
    this._version = version
  }
}
