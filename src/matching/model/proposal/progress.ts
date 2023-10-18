// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Set as OSet } from 'typescript-collections'

export class Progress {
  private readonly steps: OSet<Step>

  static none(): Progress {
    return new Progress(Step.None)
  }

  static submitted(): Progress {
    return new Progress(Step.Submitted)
  }

  isSubmitted(): boolean {
    return this.steps.contains(Step.Submitted)
  }

  isAcceptable(): boolean {
    return (
      this.steps.contains(Step.Submitted) &&
      this.steps.contains(Step.PricingAccepted) &&
      this.steps.contains(Step.PooledDoers) &&
      this.steps.contains(Step.MergedDoers)
    )
  }

  isMatchable(): boolean {
    return this.isAcceptable() && this.steps.contains(Step.MatchPending)
  }

  isMatched(): boolean {
    return this.isMatchable() && this.steps.contains(Step.Matched)
  }

  isUnmatched(): boolean {
    return !this.isMatchable()
  }

  hasPooledDoers(): boolean {
    return this.steps.contains(Step.PooledDoers)
  }

  hasMergedDoers(): boolean {
    return this.steps.contains(Step.MergedDoers)
  }

  hasDoersUnavailable(): boolean {
    return this.steps.contains(Step.DoersUnavailable)
  }

  hasPricingAccepted(): boolean {
    return this.steps.contains(Step.PricingAccepted)
  }

  hasPricingRejected(): boolean {
    return this.steps.contains(Step.PricingRejected)
  }

  withPricingAccepted(): Progress {
    return new Progress(
      Step.PricingAccepted,
      this.withoutStep(Step.PricingRejected)
    )
  }

  withPricingRejected(): Progress {
    return new Progress(
      Step.PricingRejected,
      this.withoutStep(Step.PricingAccepted)
    )
  }

  withPooledDoers(): Progress {
    return new Progress(
      Step.PooledDoers,
      this.withoutStep(Step.DoersUnavailable)
    )
  }

  withMergedDoers(): Progress {
    return new Progress(
      Step.MergedDoers,
      this.withoutStep(Step.DoersUnavailable)
    )
  }

  withDoersUnavailable(): Progress {
    return new Progress(
      Step.DoersUnavailable,
      this.withoutStep(Step.PooledDoers)
    )
  }

  withMatchPending(): Progress {
    return new Progress(Step.MatchPending, this.steps)
  }

  withMatched(): Progress {
    return new Progress(Step.Matched, this.steps)
  }

  toString(): string {
    let values = ''

    this.steps.forEach((step) => {
      values = values + step.toString() + ','
    })

    return 'Progress [' + values + ']'
  }

  private constructor(step: Step, steps?: OSet<Step>) {
    this.steps = new OSet<Step>()
    if (steps) {
      this.steps.union(steps)
    }
    if (step !== Step.None) {
      this.steps.add(step)
    }
  }

  private withoutStep(step: Step): OSet<Step> {
    if (this.steps.contains(step)) {
      let without = new OSet<Step>()
      this.steps.forEach((stepElement) => {
        if (step !== stepElement) {
          without.add(stepElement)
        }
      })
      return without
    }

    return this.steps
  }

  get __forTestingSteps() {
    return this.steps
  }
}

enum Step {
  None = 0,
  Submitted = 1,
  PricingAccepted = 2,
  PricingRejected = 3,
  PooledDoers = 4,
  MergedDoers = 5,
  DoersUnavailable = 6,
  MatchPending = 7,
  Matched = 8,
}
