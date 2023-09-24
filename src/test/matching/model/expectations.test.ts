// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Expectations } from '../../../matching/model/expectations';
import {
    expectations,
     tomorrow,
     price,
     higherPrice,
     dayAfterTomorrow } from './fixures';

describe('Expectations class', () => {
    test('Expectations::of', () => {
        expect(expectations).not.toBeNull();
        expect(expectations.summary).not.toBeNull();
        expect(expectations.summary.length).not.toBe(0);
        expect(expectations.description).not.toBeNull();
        expect(expectations.description.length).not.toBeLessThan(expectations.summary.length);
        expect(expectations.keywords.size).toBe(6);
        expect(expectations.keywords.has('window')).toBeTruthy();
        expect(expectations.keywords.has('washing')).toBeTruthy();
        expect(expectations.completedBy).toEqual(tomorrow);
        expect(expectations.price).toEqual(price);
        expect(expectations.hasSuggestedCompletedBy()).toBeFalsy();
        expect(expectations.hasSuggestedPrice()).toBeFalsy();
    });

    test('Expectations::withSuggestedCompletedBy', () => {
        const expectationsWithSuggestions =
            expectations.withSuggestedCompletedBy(dayAfterTomorrow);

        expect(expectationsWithSuggestions.hasSuggestedCompletedBy()).toBeTruthy();
        expect(expectationsWithSuggestions.suggestedCompletedBy).toEqual(dayAfterTomorrow);
    });

    test('Expectations::withSuggestedPrice', () => {
        const expectationsWithSuggestion =
            expectations.withSuggestedPrice(higherPrice);

        expect(expectationsWithSuggestion.hasSuggestedPrice()).toBeTruthy();
        expect(expectationsWithSuggestion.suggestedPrice).toEqual(higherPrice);
    });
});
