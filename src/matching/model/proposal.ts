// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client } from './client';
import { Doer } from './doer';
import { Expectations } from './expectations';
import { Id } from './id';
import { Progress } from './progress';

export class Proposal {
    private proposalState: ProposalState;

    static submitFor(client: Client, expectations: Expectations): Proposal {
        return new Proposal(client, expectations);
    }

    public acceptedPricing(): void {
        if (!this.progress().hasPricingAccepted()) {
            this.proposalState =
                new ProposalState(
                    this.id(),
                    this.client(),
                    this.expectations(),
                    this.proposalState.candidateDoers,
                    this.proposalState.matchedDoer,
                    this.progress().withPricingAccepted()
                );
        }
    }

    public rejectPricing(suggestedPricing: bigint): void {
        if (!this.progress().hasPricingRejected()) {
            this.proposalState =
                new ProposalState(
                    this.id(),
                    this.client(),
                    this.expectations().withSuggestedPrice(suggestedPricing),
                    this.candidateDoers(),
                    this.matchedDoer(),
                    this.progress().withPricingRejected()
                );
        }
    }

    public poolDoers(doers: Set<Doer>) {
        if (!this.state().progress.hasPooledDoers()) {
            this.proposalState =
                new ProposalState(
                    Id.unique(),
                    this.client(),
                    this.expectations(),
                    doers,
                    this.matchedDoer(),
                    this.progress().withPooledDoers());
        }
    }

    public mergeDoers(doers: Set<Doer>): void {
        if (!this.progress().hasMergedDoers()) {
            this.proposalState =
                new ProposalState(
                    this.id(),
                    this.client(),
                    this.expectations(),
                    this.state().mergeDoers(doers),
                    this.matchedDoer(),
                    this.progress().withMergedDoers().withMatchPending());
        }
    }

    public candidateDoers(): Set<Doer> {
        return new Set<Doer>(this.state().candidateDoers);
    }

    public client(): Client {
        return this.state().client;
    }

    public expectations(): Expectations {
        return this.state().expectations;
    }

    public id(): Id {
        return this.state().id;
    }

    public matchedDoer(): Doer {
        return this.state().matchedDoer;
    }

    public progress(): Progress {
        return this.state().progress;
    }

    public state(): ProposalState {
        return this.proposalState;
    }

    private constructor(client: Client, expectations: Expectations) {
        this.proposalState =
            new ProposalState(
                Id.unique(),
                client,
                expectations,
                new Set<Doer>(),
                null,
                Progress.submitted());
    }
}

export class ProposalState {
    public readonly id: Id;
    public readonly client: Client;
    public readonly expectations: Expectations;
    public readonly candidateDoers: Set<Doer>;
    public readonly matchedDoer: Doer;
    public readonly progress: Progress;

    constructor(
        id: Id,
         client: Client,
          expectations: Expectations,
          candidateDoers: Set<Doer>,
          matchedDoer: Doer,
          progress: Progress) {

        this.id = id;
        this.client = client;
        this.expectations = expectations;
        this.candidateDoers = candidateDoers;
        this.matchedDoer = matchedDoer;
        this.progress = progress;
    }

    mergeDoers(doers: Set<Doer>): Set<Doer> {
        const merged = new Set<Doer>();
        this.candidateDoers.forEach(candidate => {
            if (doers.has(candidate)) {
                merged.add(candidate);
            }
        });
        return merged;
    }
}
