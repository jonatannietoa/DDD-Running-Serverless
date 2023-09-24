// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export class Expectations {
    public readonly description: string;
    public readonly completedBy: Date;
    public readonly keywords: Set<string>;
    public readonly suggestedCompletedBy: Date;
    public readonly summary: string;
    public readonly steps: Set<string>;
    public readonly price: bigint;
    public readonly suggestedPrice: bigint;

    static readonly epoch = new Date(0);
    static readonly noPrice = BigInt(-1);

    public static of(
        summary: string,
        description: string,
        keywords: Set<string>,
        steps: Set<string>,
        completedBy: Date,
        price: bigint,
        suggestedCompletedBy?: Date,
        suggestedPrice?: bigint): Expectations {
      return new Expectations(summary, description, keywords, steps, completedBy, price, suggestedCompletedBy, suggestedPrice);
    }

    public hasSuggestedCompletedBy(): boolean {
        return this.suggestedCompletedBy.getTime() !== Expectations.epoch.getTime();
    }

    public hasSuggestedPrice(): boolean {
        return this.suggestedPrice !== BigInt(-1);
    }

    public withSuggestedCompletedBy(suggestedCompletedBy: Date): Expectations {
        return Expectations.of(
            this.summary,
            this.description,
            this.keywords,
            this.steps,
            this.completedBy,
            this.price,
            suggestedCompletedBy,
            this.suggestedPrice);
    }

    public withSuggestedPrice(suggestedPrice: bigint): Expectations {
        return Expectations.of(
            this.summary,
            this.description,
            this.keywords,
            this.steps,
            this.completedBy,
            this.price,
            this.suggestedCompletedBy,
            suggestedPrice);
    }

    private constructor(
        summary: string,
        description: string,
        keywords: Set<string>,
        steps: Set<string>,
        completedBy: Date,
        price: bigint,
        suggestedCompletedBy?: Date,
        suggestedPrice?: bigint) {

        this.summary = summary;
        this.description =  description;
        this.keywords = keywords;
        this.steps = steps;
        this.completedBy = completedBy;
        this.price = price;
        this.suggestedCompletedBy = this.actualDate(suggestedCompletedBy);
        this.suggestedPrice = this.actualPrice(suggestedPrice);
    }

    actualDate(suggestedCompletedBy?: Date): Date {
        if (suggestedCompletedBy) {
            if (suggestedCompletedBy.valueOf() !== Expectations.epoch.valueOf()) {
                return suggestedCompletedBy;
            }
        }
        return Expectations.epoch;
    }

    actualPrice(suggestedPrice?: bigint): bigint {
        if (suggestedPrice && suggestedPrice !== Expectations.noPrice) {
            return suggestedPrice;
        }
        return Expectations.noPrice;
    }
}
