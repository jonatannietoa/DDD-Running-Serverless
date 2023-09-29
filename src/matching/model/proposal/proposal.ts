// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client } from '../Client';
import { Doer } from '../Doer';
import { DomainEvent } from '../../../common/DomainEvent';
import { EventSourcedEntity } from '../../../common/EventSourcedEntity';
import { Expectations } from './Expectations';
import { Id } from '../Id';
import { Set as OSet } from "typescript-collections";
import { Progress } from './Progress';
import { ProposalState } from './ProposalState';
import { ProposalSubmitted,
         PricingAccepted,
         PricingRejected,
         DoersPooled,
         DoersMerged
        } from './events';

export class Proposal extends EventSourcedEntity {
    private _proposalState: ProposalState;

    static submitFor(client: Client, expectations: Expectations): Proposal {
        return new Proposal(client, expectations, null);
    }

    acceptPricing(): void {
        if (!this.progress.hasPricingAccepted()) {
            this.apply(PricingAccepted.with(this.id));
        }
    }

    rejectPricing(suggestedPricing: number): void {
        if (!this.progress.hasPricingRejected()) {
            this.apply(PricingRejected.with(this.id, suggestedPricing));
        }
    }

    poolDoers(doers: OSet<Doer>): void {
        if (!this.progress.hasPooledDoers()) {
            this.apply(DoersPooled.with(this.id, doers));
        }
    }

    mergeDoers(doers: OSet<Doer>): void {
        if (!this.progress.hasMergedDoers()) {
            // a merge must not result in more doers
            const currentCandidates = this.candidateDoers;
            const beforeMergedSize = currentCandidates.size();
            if (this.state.mergeDoers(currentCandidates).size() > beforeMergedSize) {
                throw new Error("Merge cannot result in more doers than current pooled candidates of " + beforeMergedSize + ".");
            }
            this.apply(DoersMerged.with(this.id, doers));
        }
    }

    get candidateDoers(): OSet<Doer> {
        const candidates = new OSet<Doer>();
        candidates.union(this.state.candidateDoers);
        return candidates;
    }

    get client(): Client {
        return this.state.client;
    }

    get expectations(): Expectations {
        return this.state.expectations;
    }

    get id(): Id {
        return this.state.id;
    }

    get matchedDoer(): Doer {
        return this.state.matchedDoer;
    }

    get progress(): Progress {
        return this.state.progress;
    }

    get state() {
        return this._proposalState;
    }

    private set state(value: ProposalState) {
        this._proposalState = value;
    }

    protected when(e: DomainEvent): void {
        switch (e.type) {
            case ProposalSubmitted.Type:
                this.whenProposalSubmitted(e as ProposalSubmitted);
                break;
            case PricingAccepted.Type:
                this.whenPricingAccepted(e as PricingAccepted);
                break;
            case PricingRejected.Type:
                this.whenPricingRejected(e as PricingRejected);
                break;
            case DoersPooled.Type:
                this.whenDoersPooled(e as DoersPooled);
                break;
            case DoersMerged.Type:
                this.whenDoersMerged(e as DoersMerged);
                break;
            default:
                throw new Error("Unknown event type");
        }
    }

    // INTERNAL USE ONLY
    static restoreStateWith(stream: Array<DomainEvent>): Proposal {
        return new Proposal(null, null, stream);
    }

    private constructor(client?: Client, expectations?: Expectations, stream?: Array<DomainEvent>) {
        super(stream);

        if (!stream) {
            this._proposalState = ProposalState.empty();
        
            if (client && expectations) {
                this.apply(ProposalSubmitted.with(Id.unique(), client, expectations));
            }
        }
    }

    private whenProposalSubmitted(e: ProposalSubmitted): void {
        this.state =
            new ProposalState(
                e.proposalId,
                e.client,
                e.expectations,
                new OSet<Doer>(),
                null,
                Progress.submitted());
    }

    private whenPricingAccepted(e: PricingAccepted): void {
        this.state =
            new ProposalState(
                this.id,
                this.client,
                this.expectations,
                this.state.candidateDoers,
                this.state.matchedDoer,
                this.progress.withPricingAccepted()
            );
    }

    private whenPricingRejected(e: PricingRejected): void {
        this.state =
            new ProposalState(
                this.id,
                this.client,
                this.expectations.withSuggestedPrice(e.suggestedPricing),
                this.candidateDoers,
                this.matchedDoer,
                this.progress.withPricingRejected()
            );
    }

    private whenDoersPooled(e: DoersPooled) {
        this.state =
            new ProposalState(
                Id.unique(),
                this.client,
                this.expectations,
                e.doers,
                this.matchedDoer,
                this.progress.withPooledDoers());
    }

    private whenDoersMerged(e: DoersMerged): void {
        this.state =
            new ProposalState(
                this.id,
                this.client,
                this.expectations,
                this.state.mergeDoers(e.doers),
                this.matchedDoer,
                this.progress.withMergedDoers().withMatchPending());
    }
}
