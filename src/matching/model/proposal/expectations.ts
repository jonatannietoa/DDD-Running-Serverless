// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Set as OSet } from 'typescript-collections'

export class Expectations {
  public readonly description: string
  public readonly completedBy: Date
  public readonly keywords: OSet<string>
  public readonly suggestedCompletedBy: Date
  public readonly summary: string
  public readonly steps: OSet<string>
  public readonly price: number
  public readonly suggestedPrice: number

  static readonly epoch = new Date(0)
  static readonly noPrice = -1

  static none(): Expectations {
    return new Expectations(
      '',
      '',
      new OSet<string>(),
      new OSet<string>(),
      Expectations.epoch,
      this.noPrice
    )
  }

  static of(
    summary: string,
    description: string,
    keywords: OSet<string>,
    steps: OSet<string>,
    completedBy: Date,
    price: number,
    suggestedCompletedBy?: Date,
    suggestedPrice?: number
  ): Expectations {
    return new Expectations(
      summary,
      description,
      keywords,
      steps,
      completedBy,
      price,
      suggestedCompletedBy,
      suggestedPrice
    )
  }

  hasSuggestedCompletedBy(): boolean {
    return this.suggestedCompletedBy.getTime() !== Expectations.epoch.getTime()
  }

  hasSuggestedPrice(): boolean {
    return this.suggestedPrice !== -1
  }

  withSuggestedCompletedBy(suggestedCompletedBy: Date): Expectations {
    return Expectations.of(
      this.summary,
      this.description,
      this.keywords,
      this.steps,
      this.completedBy,
      this.price,
      suggestedCompletedBy,
      this.suggestedPrice
    )
  }

  withSuggestedPrice(suggestedPrice: number): Expectations {
    return Expectations.of(
      this.summary,
      this.description,
      this.keywords,
      this.steps,
      this.completedBy,
      this.price,
      this.suggestedCompletedBy,
      suggestedPrice
    )
  }

  toString(): string {
    return 'Expectations[' + JSON.stringify(this) + ']'
  }

  private constructor(
    summary: string,
    description: string,
    keywords: OSet<string>,
    steps: OSet<string>,
    completedBy: Date,
    price: number,
    suggestedCompletedBy?: Date,
    suggestedPrice?: number
  ) {
    this.summary = summary
    this.description = description
    this.keywords = keywords
    this.steps = steps
    this.completedBy = completedBy
    this.price = price
    this.suggestedCompletedBy = this.actualDate(suggestedCompletedBy)
    this.suggestedPrice = this.actualPrice(suggestedPrice)
  }

  actualDate(suggestedCompletedBy?: Date): Date {
    if (suggestedCompletedBy) {
      if (suggestedCompletedBy.valueOf() !== Expectations.epoch.valueOf()) {
        return suggestedCompletedBy
      }
    }
    return Expectations.epoch
  }

  actualPrice(suggestedPrice?: number): number {
    if (suggestedPrice && suggestedPrice !== Expectations.noPrice) {
      return suggestedPrice
    }
    return Expectations.noPrice
  }
}
