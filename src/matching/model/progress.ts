// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export class Progress {
    private readonly steps: Set<Step>;

    static submitted(): Progress {
        return new Progress(Step.Submitted);
    }

    isSubmitted(): boolean {
        return this.steps.has(Step.Submitted);
    }

    isAcceptable(): boolean {
        return this.steps.has(Step.Submitted) &&
               this.steps.has(Step.PricingAccepted) &&
               this.steps.has(Step.PooledDoers) &&
               this.steps.has(Step.MergedDoers);
    }

    isMatchable(): boolean {
        return this.isAcceptable() &&
               this.steps.has(Step.MatchPending);
    }

    isMatched(): boolean {
        return this.isMatchable() &&
               this.steps.has(Step.Matched);
    }

    isUnmatched(): boolean {
        return !this.isMatchable();
    }

    hasPooledDoers(): boolean {
        return this.steps.has(Step.PooledDoers);
    }

    hasMergedDoers(): boolean {
        return this.steps.has(Step.MergedDoers);
    }

    hasDoersUnavailable(): boolean {
        return this.steps.has(Step.DoersUnavailable);
    }

    hasPricingAccepted(): boolean {
        return this.steps.has(Step.PricingAccepted);
    }

    hasPricingRejected(): boolean {
        return this.steps.has(Step.PricingRejected);
    }

    withPricingAccepted(): Progress {
        return new Progress(Step.PricingAccepted, this.withoutStep(Step.PricingRejected));
    }

    withPricingRejected(): Progress {
        return new Progress(Step.PricingRejected, this.withoutStep(Step.PricingAccepted));
    }

    withPooledDoers(): Progress {
        return new Progress(Step.PooledDoers, this.withoutStep(Step.DoersUnavailable));
    }

    withMergedDoers(): Progress {
        return new Progress(Step.MergedDoers, this.withoutStep(Step.DoersUnavailable));
    }

    withDoersUnavailable(): Progress {
        return new Progress(Step.DoersUnavailable, this.withoutStep(Step.DoersPooled));
    }

    withMatchPending(): Progress {
        return new Progress(Step.MatchPending, this.steps);
    }

    withMatched(): Progress {
        return new Progress(Step.Matched, this.steps);
    }

    private constructor(step: Step, steps?: Set<Step>) {
        this.steps = steps ? new Set<Step>(steps) : new Set<Step>();
        this.steps.add(step);
    }

    private withoutStep(step: Step): Set<Step> {
        if (this.steps.has(step)) {
            let without = new Set<Step>();
            this.steps.forEach(stepElement => {
                if (step !== stepElement) {
                    without.add(stepElement);
                }
            });
            return without;
        }

        return this.steps;
    }
}

enum Step {
    Submitted = 1,
    PricingAccepted,
    PricingRejected,
    PooledDoers,
    MergedDoers,
    DoersUnavailable,
    MatchPending,
    Matched,
}
