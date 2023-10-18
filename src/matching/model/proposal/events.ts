// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { DomainEvent } from '../../../common/DomainEvent'
import { Client } from '../Client'
import { Doer } from '../Doer'
import { Id } from '../Id'
import { Expectations } from './Expectations'
import { Set as OSet } from 'typescript-collections'

export class ProposalSubmitted extends DomainEvent {
  static readonly Type = 'ProposalSubmitted'

  readonly proposalId: Id
  readonly client: Client
  readonly expectations: Expectations

  static with(
    proposalId: Id,
    client: Client,
    expectations: Expectations
  ): ProposalSubmitted {
    return new ProposalSubmitted(proposalId, client, expectations)
  }

  constructor(proposalId: Id, client: Client, expectations: Expectations) {
    super(ProposalSubmitted.Type, proposalId.value)

    this.proposalId = proposalId
    this.client = client
    this.expectations = expectations
  }

  toString(): string {
    const json = JSON.stringify(this)
    return this.type.concat('[').concat(json).concat(']')
  }
}

export class PricingAccepted extends DomainEvent {
  static readonly Type = 'PricingAccepted'

  readonly proposalId: Id

  static with(proposalId: Id): PricingAccepted {
    return new PricingAccepted(proposalId)
  }

  constructor(proposalId: Id) {
    super(PricingAccepted.Type, proposalId.value)

    this.proposalId = proposalId
  }

  toString(): string {
    const json = JSON.stringify(this)
    return this.type.concat('[').concat(json).concat(']')
  }
}

export class PricingRejected extends DomainEvent {
  static readonly Type = 'PricingRejected'

  readonly proposalId: Id
  readonly suggestedPricing: number

  static with(proposalId: Id, suggestedPricing: number): PricingRejected {
    return new PricingRejected(proposalId, suggestedPricing)
  }

  constructor(proposalId: Id, suggestedPricing: number) {
    super(PricingRejected.Type, proposalId.value)

    this.proposalId = proposalId
    this.suggestedPricing = suggestedPricing
  }

  toString(): string {
    const json = JSON.stringify(this)
    return this.type.concat('[').concat(json).concat(']')
  }
}

export class DoersPooled extends DomainEvent {
  static readonly Type = 'DoersPooled'

  readonly proposalId: Id
  readonly doers: OSet<Doer>

  static with(proposalId: Id, doers: OSet<Doer>) {
    return new DoersPooled(proposalId, doers)
  }

  constructor(proposalId: Id, doers: OSet<Doer>) {
    super(DoersPooled.Type, proposalId.value)

    this.proposalId = proposalId
    this.doers = new OSet<Doer>()
    this.doers.union(doers)
  }

  toString(): string {
    const json = JSON.stringify(this)
    return this.type.concat('[').concat(json).concat(']')
  }
}

export class DoersMerged extends DomainEvent {
  static readonly Type = 'DoersMerged'

  readonly proposalId: Id
  readonly doers: OSet<Doer>

  static with(proposalId: Id, doers: OSet<Doer>) {
    return new DoersMerged(proposalId, doers)
  }

  constructor(proposalId: Id, doers: OSet<Doer>) {
    super(DoersMerged.Type, proposalId.value)

    this.proposalId = proposalId
    this.doers = new OSet<Doer>()
    this.doers.union(doers)
  }
}
