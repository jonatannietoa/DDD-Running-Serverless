// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Proposal } from '../../../../matching/model/proposal/proposal';
import {
    client,
    expectations,
    doer1, doer2, doer3,
    recommendedDoers,
    availableDoers, 
    higherPrice } from '../fixures';

describe('Proposal class', () => {
    test('Proposal::submitFor', () => {
        const proposal = Proposal.submitFor(client, expectations);
        expect(proposal).not.toBeNull();
        expect(proposal.progress().isSubmitted()).toBeTruthy();
    });

    test('Proposal::acceptedPricing', () => {
        const proposal = Proposal.submitFor(client, expectations);
        proposal.acceptedPricing();
        expect(proposal.progress().hasPricingAccepted()).toBeTruthy();
        expect(proposal.progress().hasPricingRejected()).toBeFalsy();
    });

    test('Proposal::rejectPricing', () => {
        const proposal = Proposal.submitFor(client, expectations);
        proposal.rejectPricing(higherPrice);
        expect(proposal.progress().hasPricingAccepted()).toBeFalsy();
        expect(proposal.progress().hasPricingRejected()).toBeTruthy();
        expect(proposal.expectations().suggestedPrice).toBe(higherPrice);
    });

    test('Proposal::poolDoers', () => {
        const proposal = Proposal.submitFor(client, expectations);
        proposal.acceptedPricing();
        console.info("recommended: " + recommendedDoers);
        proposal.poolDoers(recommendedDoers);
        expect(proposal.progress().hasPooledDoers()).toBeTruthy();
        expect(proposal.candidateDoers().size).toBe(3);
        expect(proposal.candidateDoers().has(doer1)).toBeTruthy();
        expect(proposal.candidateDoers().has(doer2)).toBeTruthy();
        expect(proposal.candidateDoers().has(doer3)).toBeTruthy();
    });

    test('Proposal::mergeDoers', () => {
        const proposal = Proposal.submitFor(client, expectations);
        proposal.acceptedPricing();
        proposal.poolDoers(recommendedDoers);
        proposal.mergeDoers(availableDoers);
        expect(proposal.progress().hasPooledDoers()).toBeTruthy();
        expect(proposal.candidateDoers().size).toBe(2);
        expect(proposal.candidateDoers().has(doer1)).toBeTruthy();
        expect(proposal.candidateDoers().has(doer2)).toBeFalsy();
        expect(proposal.candidateDoers().has(doer3)).toBeTruthy();
    });
});
