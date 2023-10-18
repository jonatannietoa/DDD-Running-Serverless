// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from '../../../matching/model/Id'

describe('Id class', () => {
  test('Id::fromExisting', () => {
    const idValue = Id.unique().value
    const id = Id.fromExisting(idValue)
    expect(id).not.toBeNull()
    expect(id.value).toBe(idValue)
  })

  test('Id::unique', () => {
    const id = Id.unique()
    expect(id).not.toBeNull()
    const idValue = id.value
    expect(idValue).not.toBeNull()
    expect(idValue.length).toBe(id.value.length)
    expect(id.value).toBe(idValue)
  })

  test('Id:equals', () => {
    const id1 = Id.unique()
    const id2 = Id.unique()
    const id3 = Id.fromExisting(id1.value)

    expect(id1.value === id2.value).toBeFalsy()
    expect(id2.value === id3.value).toBeFalsy()
    expect(id1.value === id3.value).toBeTruthy()
    expect(id3.value === id1.value).toBeTruthy()
  })
})
