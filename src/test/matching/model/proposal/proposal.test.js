// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import {
    DoersPooled,
    PricingAccepted,
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
    uniqueId,
} from '../fixures';

describe('Proposal class', () => {
    test('Proposal::submitFor', () => {
        const proposal = Proposal.submitFor(client, expectations);

        expect(proposal).not.toBeNull();
        expect(proposal.progress.isSubmitted()).toBeTruthy();
    });

    test('Proposal::acceptedPricing', () => {
        const stream = [ ProposalSubmitted.with(uniqueId, client, expectations) ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.acceptPricing();

        expect(proposal.progress.hasPricingAccepted()).toBeTruthy();
        expect(proposal.progress.hasPricingRejected()).toBeFalsy();
    });

    test('Proposal::rejectPricing', () => {
        const stream = [ ProposalSubmitted.with(uniqueId, client, expectations) ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.rejectPricing(higherPrice);
        
        expect(proposal.progress.hasPricingAccepted()).toBeFalsy();
        expect(proposal.progress.hasPricingRejected()).toBeTruthy();
        expect(proposal.expectations.suggestedPrice).toBe(higherPrice);
    });

    test('Proposal::poolDoers', () => {
        const stream = [ 
            ProposalSubmitted.with(uniqueId, client, expectations),
            PricingAccepted.with(uniqueId)
        ];

        const proposal = Proposal.restoreStateWith(stream);

        proposal.poolDoers(recommendedDoers);

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

        expect(proposal.progress.hasMergedDoers()).toBeTruthy();
        expect(proposal.candidateDoers.size()).toBe(2);
        expect(proposal.candidateDoers.contains(doer1)).toBeTruthy();
        expect(proposal.candidateDoers.contains(doer2)).toBeFalsy();
        expect(proposal.candidateDoers.contains(doer3)).toBeTruthy();
    });
});
