// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Expectations } from "../../../matching/model/expectations";
import { Client } from '../../../matching/model/client';
import { Doer } from '../../../matching/model/doer';
import { Id } from '../../../matching/model/id';

export const uniqueId = Id.unique();
export const client = Client.with(uniqueId);
export const doer1 = Doer.with(Id.unique());
export const doer2 = Doer.with(Id.unique());
export const doer3 = Doer.with(Id.unique());
export const recommendedDoers = new Set<Doer>([doer1, doer2, doer3]);
export const availableDoers = new Set<Doer>([doer1, doer3]);
export const oneDay = 24 * 60 * 60;
export const tomorrow = new Date(Date.now().valueOf() + oneDay);
export const dayAfterTomorrow = new Date(tomorrow.valueOf() + oneDay);
export const keywords = ['home', 'maintenance', 'window', 'washing', 'count=35', 'extra-tall'];
export const steps = ['Step1', 'Step2', 'Step3'];
export const price = BigInt(25000);
export const higherPrice = BigInt(30000);

export const expectations =
    Expectations.of(
        "A client's expectations",
        "A client's window washing expectations",
        new Set<string>(keywords),
        new Set<string>(steps),
        tomorrow,
        price);
