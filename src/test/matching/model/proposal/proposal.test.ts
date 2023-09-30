// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import {
    DoersMerged,
    DoersPooled,
    PricingAccepted,
    PricingRejected,
    ProposalSubmitted
} from '../../../../matching/model/proposal/Events';

import { Proposal } from '../../../../matching/model/proposal/Proposal';

import {
    client,
    expectations,
    doer1, doer2, doer3,
    recommendedDoers,
    availableDoers,
    higherPrice,
    fairPrice,
    uniqueId,
} from '../fixures';

describe('Proposal class', () => {
    test('Proposal::submitFor', () => {
        const proposal = Proposal.submitFor(client, expectations);

        expect(proposal).not.toBeNull();
        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(ProposalSubmitted.Type);
        expect((proposal.applied[0] as ProposalSubmitted).client.id.value).toBe(client.id.value);
        expect(proposal.progress.isSubmitted()).toBeTruthy();
        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(ProposalSubmitted.Type);
    });

    test('Proposal::acceptedPricing', () => {
        const stream = [ ProposalSubmitted.with(uniqueId, client, expectations) ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.acceptPricing();

        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(PricingAccepted.Type);
        expect((proposal.applied[0] as PricingAccepted).proposalId.value).toBe(uniqueId.value);

        expect(proposal.progress.hasPricingAccepted()).toBeTruthy();
        expect(proposal.progress.hasPricingRejected()).toBeFalsy();
        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(PricingAccepted.Type);
    });

    test('Proposal::rejectPricing', () => {
        const stream = [ ProposalSubmitted.with(uniqueId, client, expectations) ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.rejectPricing(fairPrice);
        
        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(PricingRejected.Type);
        expect((proposal.applied[0] as PricingRejected).proposalId.value).toBe(uniqueId.value);
        expect((proposal.applied[0] as PricingRejected).suggestedPricing).toBe(fairPrice);

        expect(proposal.progress.hasPricingAccepted()).toBeFalsy();
        expect(proposal.progress.hasPricingRejected()).toBeTruthy();
        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(PricingRejected.Type);
        expect(proposal.expectations.suggestedPrice).toBe(fairPrice);
    });

    test('Proposal::poolDoers', () => {
        const stream = [ 
            ProposalSubmitted.with(uniqueId, client, expectations),
            PricingAccepted.with(uniqueId)
        ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.poolDoers(recommendedDoers);

        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(DoersPooled.Type);
        expect((proposal.applied[0] as DoersPooled).proposalId.value).toBe(uniqueId.value);
        expect((proposal.applied[0] as DoersPooled).doers.contains(doer1)).toBeTruthy();
        expect((proposal.applied[0] as DoersPooled).doers.contains(doer2)).toBeTruthy();
        expect((proposal.applied[0] as DoersPooled).doers.contains(doer3)).toBeTruthy();

        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(DoersPooled.Type);
        expect(proposal.progress.hasPooledDoers()).toBeTruthy();
        expect(proposal.candidateDoers.size()).toBe(3);
        expect(proposal.candidateDoers.contains(doer1)).toBeTruthy();
        expect(proposal.candidateDoers.contains(doer2)).toBeTruthy();
        expect(proposal.candidateDoers.contains(doer3)).toBeTruthy();
    });

    test('Proposal::mergeDoers', () => {
        const stream = [ 
            ProposalSubmitted.with(uniqueId, client, expectations),
            PricingAccepted.with(uniqueId),
            DoersPooled.with(uniqueId, recommendedDoers),
        ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.mergeDoers(availableDoers);

        expect(proposal.applied.length).toBe(1);
        expect(proposal.applied[0].type).toBe(DoersMerged.Type);

        expect((proposal.applied[0] as DoersMerged).doers.size()).toBe(2);
        expect((proposal.applied[0] as DoersMerged).doers.contains(doer1)).toBeTruthy();
        expect((proposal.applied[0] as DoersMerged).doers.contains(doer2)).toBeFalsy();
        expect((proposal.applied[0] as DoersMerged).doers.contains(doer3)).toBeTruthy();

        expect(proposal.progress.hasMergedDoers()).toBeTruthy();
        expect(proposal.candidateDoers.size()).toBe(2);
        expect(proposal.candidateDoers.contains(doer1)).toBeTruthy();
        expect(proposal.candidateDoers.contains(doer2)).toBeFalsy();
        expect(proposal.candidateDoers.contains(doer3)).toBeTruthy();
    });
});
