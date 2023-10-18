// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Expectations } from '../../../matching/model/proposal/Expectations'
import { Client } from '../../../matching/model/Client'
import { Doer } from '../../../matching/model/Doer'
import { Id } from '../../../matching/model/Id'
import { Set as OSet } from 'typescript-collections'

export const uniqueId = Id.fromExisting('u123')
export const client = Client.with(uniqueId)
export const doer1 = Doer.with(Id.fromExisting('1'))
export const doer2 = Doer.with(Id.fromExisting('2'))
export const doer3 = Doer.with(Id.fromExisting('3'))
const doers1_2_3 = new OSet<Doer>()
doers1_2_3.add(doer1)
doers1_2_3.add(doer2)
doers1_2_3.add(doer3)
export const recommendedDoers = doers1_2_3
const doers1_3 = new OSet<Doer>()
doers1_3.add(doer1)
doers1_3.add(doer3)
export const availableDoers = doers1_3
export const oneDay = 24 * 60 * 60
export const tomorrow = new Date(Date.now().valueOf() + oneDay)
export const dayAfterTomorrow = new Date(tomorrow.valueOf() + oneDay)
export const keywords = [
  'home',
  'maintenance',
  'window',
  'washing',
  'count35',
  'extratall',
]
export const steps = ['Step1', 'Step2', 'Step3']
export const price = 25000
export const higherPrice = 30000
export const fairPrice = higherPrice
export const expectationsKeywords = new OSet<string>()
keywords.forEach((keyword) => expectationsKeywords.add(keyword))
export const expectationsSteps = new OSet<string>()
steps.forEach((step) => expectationsSteps.add(step))

export const expectations = Expectations.of(
  "A client's expectations",
  "A client's window washing expectations",
  expectationsKeywords,
  expectationsSteps,
  tomorrow,
  price
)
