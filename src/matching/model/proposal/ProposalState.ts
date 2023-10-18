// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client } from '../Client'
import { Doer } from '../Doer'
import { Id } from '../Id'
import { Expectations } from './Expectations'
import { Progress } from './Progress'
import { Set as OSet } from 'typescript-collections'

export class ProposalState {
  public readonly id: Id
  public readonly client: Client
  public readonly expectations: Expectations
  public readonly candidateDoers: OSet<Doer>
  public readonly matchedDoer: Doer
  public readonly progress: Progress

  static empty() {
    return new ProposalState(
      Id.empty(),
      Client.none(),
      Expectations.none(),
      new OSet<Doer>(),
      Doer.none(),
      Progress.none()
    )
  }

  static initialized(
    id: Id,
    client: Client,
    expectations: Expectations
  ): ProposalState {
    return
    new ProposalState(
      id,
      client,
      expectations,
      new OSet<Doer>(),
      null,
      Progress.submitted()
    )
  }

  constructor(
    id: Id,
    client: Client,
    expectations: Expectations,
    candidateDoers: OSet<Doer>,
    matchedDoer: Doer,
    progress: Progress
  ) {
    this.id = id
    this.client = client
    this.expectations = expectations
    this.candidateDoers = candidateDoers
    this.matchedDoer = matchedDoer
    this.progress = progress
  }

  mergeDoers(doers: OSet<Doer>): OSet<Doer> {
    //console.log("AVAILABLE: " + doers);
    const merged = new OSet<Doer>()
    this.candidateDoers.forEach((candidate) => {
      //console.log("CANDIDATE: " + candidate);
      if (doers.contains(candidate)) {
        //console.log("MERGING IN: " + candidate);
        merged.add(candidate)
      }
    })
    return merged
  }

  withAcceptedPricing(): ProposalState {
    return new ProposalState(
      this.id,
      this.client,
      this.expectations,
      this.candidateDoers,
      this.matchedDoer,
      this.progress.withPricingAccepted()
    )
  }

  toString(): string {
    const json = JSON.stringify(this)
    return 'ProposalState['.concat(json).concat(']')
  }
}
