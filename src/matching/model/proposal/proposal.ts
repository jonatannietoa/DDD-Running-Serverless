// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client } from '../Client'
import { Doer } from '../Doer'
import { DomainEvent } from '../../../common/DomainEvent'
import { EventSourcedEntity } from '../../../common/EventSourcedEntity'
import { Expectations } from './Expectations'
import { Id } from '../Id'
import { Set as OSet } from 'typescript-collections'
import { ProposalState } from './ProposalState'
import {
  AcceptedBy,
  DoersMerged,
  DoersPooled,
  PricingAccepted,
  PricingRejected,
  ProposalSubmitted,
} from './events'

export class Proposal extends EventSourcedEntity {
  private proposalState: ProposalState

  static submitFor(client: Client, expectations: Expectations): Proposal {
    return new Proposal(client, expectations)
  }

  acceptPricing(): void {
    if (!this.state.progress.hasPricingAccepted()) {
      this.apply(PricingAccepted.with(this.state.id))
    }
  }

  rejectPricing(suggestedPricing: number): void {
    if (!this.state.progress.hasPricingRejected()) {
      this.apply(PricingRejected.with(this.state.id, suggestedPricing))
    }
  }

  poolDoers(doers: OSet<Doer>): void {
    if (!this.state.progress.hasPooledDoers()) {
      this.apply(DoersPooled.with(this.state.id, doers))
    }
  }

  mergeDoers(doers: OSet<Doer>): void {
    if (!this.state.progress.hasMergedDoers()) {
      // a merge must not result in more doers
      const currentCandidates = this.state.candidateDoers
      const beforeMergedSize = currentCandidates.size()
      if (this.state.mergeDoers(currentCandidates).size() > beforeMergedSize) {
        throw new Error(
          'Merge cannot result in more doers than current pooled candidates of ' +
            beforeMergedSize +
            '.'
        )
      }
      this.apply(DoersMerged.with(this.state.id, doers))
    }
  }

  acceptBy(doer: Doer): void {
    this.apply(AcceptedBy.with(this.state.id, doer))
  }

  get candidateDoers() {
    return this.state.candidateDoers
  }

  get expectations() {
    return this.state.expectations
  }

  get progress() {
    return this.proposalState.progress
  }

  get state() {
    return this.proposalState
  }

  private set state(value: ProposalState) {
    this.proposalState = value
  }

  protected when(e: DomainEvent): void {
    if (e.type === ProposalSubmitted.Type) {
      this.whenProposalSubmitted(e as ProposalSubmitted)
    } else if (e.type === PricingAccepted.Type) {
      this.whenPricingAccepted(e as PricingAccepted)
    } else if (e.type === PricingRejected.Type) {
      this.whenPricingRejected(e as PricingRejected)
    } else if (e.type === DoersPooled.Type) {
      this.whenDoersPooled(e as DoersPooled)
    } else if (e.type === DoersMerged.Type) {
      this.whenDoersMerged(e as DoersMerged)
    } else if (e.type === AcceptedBy.Type) {
      this.whenAcceptBy((e as AcceptedBy).doer)
    } else {
      throw new Error('Unknown event type')
    }
  }

  // INTERNAL USE ONLY
  static restoreStateWith(stream: Array<DomainEvent>): Proposal {
    // @ts-ignore
    return new Proposal(null, null, stream)
  }

  private constructor(
    client?: Client,
    expectations?: Expectations,
    stream?: Array<DomainEvent>
  ) {
    super(stream)

    if (!stream) {
      this.proposalState = ProposalState.empty()

      if (client && expectations) {
        this.apply(ProposalSubmitted.with(Id.unique(), client, expectations))
      }
    }
  }

  private whenProposalSubmitted(e: ProposalSubmitted): void {
    this.state = ProposalState.initialized(
      e.proposalId,
      e.client,
      e.expectations
    )
  }

  private whenPricingAccepted(e: PricingAccepted): void {
    this.state = this.state.withAcceptedPricing()
  }

  private whenPricingRejected(e: PricingRejected): void {
    this.state = new ProposalState(
      this.state.id,
      this.state.client,
      this.state.expectations.withSuggestedPrice(e.suggestedPricing),
      this.state.candidateDoers,
      this.state.progress.withPricingRejected(),
      this.state.matchedDoer
    )
  }

  private whenDoersPooled(e: DoersPooled) {
    this.state = new ProposalState(
      Id.unique(),
      this.state.client,
      this.state.expectations,
      e.doers,
      this.state.progress.withPooledDoers(),
      this.state.matchedDoer
    )
  }

  private whenDoersMerged(e: DoersMerged): void {
    this.state = new ProposalState(
      this.state.id,
      this.state.client,
      this.state.expectations,
      this.state.mergeDoers(e.doers),
      this.state.progress.withMergedDoers().withMatchPending(),
      this.state.matchedDoer
    )
  }

  private whenAcceptBy(doer: Doer): void {
    this.state = new ProposalState(
      this.state.id,
      this.state.client,
      this.state.expectations,
      this.state.candidateDoers,
      this.state.progress.withMatched().withAcceptedByDoer(),
      doer
    )
  }
}
