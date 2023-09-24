// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Progress } from '../../../../matching/model/proposal/progress';

describe('Progress class', () => {
    test('Progress::submitted', () => {
        const progress = Progress.submitted();
        expect(progress.isSubmitted()).toBeTruthy();
    });

    test('Progress::hasPricingAccepted', () => {
        let progress = Progress.submitted().withPricingRejected();
        expect(progress.hasPricingAccepted()).toBeFalsy();

        progress = progress.withPricingAccepted();
        expect(progress.hasPricingRejected()).toBeFalsy();
        expect(progress.hasPricingAccepted()).toBeTruthy();
    });

    test('Progress::hasPricingRejected', () => {
        let progress = Progress.submitted().withPricingAccepted();
        expect(progress.hasPricingRejected()).toBeFalsy();

        progress = progress.withPricingAccepted().withPricingRejected();
        expect(progress.hasPricingAccepted()).toBeFalsy();
        expect(progress.hasPricingRejected()).toBeTruthy();
    });

    test('Progress::hasPooledDoers', () => {
        let progress = Progress.submitted().withDoersUnavailable();
        expect(progress.hasDoersUnavailable()).toBeTruthy();
        expect(progress.hasPooledDoers()).toBeFalsy();

        progress = progress.withDoersUnavailable().withPooledDoers();
        expect(progress.hasDoersUnavailable()).toBeFalsy();
        expect(progress.hasPooledDoers()).toBeTruthy();
    });

    test('Progress::hasMergedDoers', () => {
        let progress = Progress.submitted().withDoersUnavailable();
        expect(progress.hasDoersUnavailable()).toBeTruthy();
        expect(progress.hasMergedDoers()).toBeFalsy();

        progress = progress.withDoersUnavailable().withMergedDoers();
        expect(progress.hasDoersUnavailable()).toBeFalsy();
        expect(progress.hasMergedDoers()).toBeTruthy();
    });

    test('Progress::isAcceptable', () => {
        let progress = Progress.submitted();
        expect(progress.isAcceptable()).toBeFalsy();

        progress =
            progress
                .withPricingAccepted()
                .withPooledDoers()
                .withMergedDoers();

        expect(progress.isAcceptable()).toBeTruthy();
    });

    test('Progress::isMatchable', () => {
        let progress = Progress.submitted();

        expect(progress.isMatchable()).toBeFalsy();

        progress =
            progress
                .withPricingAccepted()
                .withPooledDoers()
                .withMergedDoers()
                .withMatchPending();

        expect(progress.isMatchable()).toBeTruthy();
    });

    test('Progress::isMatched', () => {
        let progress = Progress.submitted();

        expect(progress.isMatched()).toBeFalsy();

        progress =
            progress
                .withPricingAccepted()
                .withPooledDoers()
                .withMergedDoers()
                .withMatchPending()
                .withMatched();

        expect(progress.isMatched()).toBeTruthy();
    });
});
