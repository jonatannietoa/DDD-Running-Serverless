// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Set as OSet } from "typescript-collections";

export class Expectations {
    private _description: string;
    private _completedBy: Date;
    private _keywords: OSet<string>;
    private _suggestedCompletedBy: Date;
    private _summary: string;
    private _steps: OSet<string>;
    private _price: number;
    private _suggestedPrice: number;

    static readonly epoch = new Date(0);
    static readonly noPrice = -1;

    static none(): Expectations {
        return new Expectations("", "", new OSet<string>(), new OSet<string>(), Expectations.epoch, this.noPrice);
    }

    static of(
        summary: string,
        description: string,
        keywords: OSet<string>,
        steps: OSet<string>,
        completedBy: Date,
        price: number,
        suggestedCompletedBy?: Date,
        suggestedPrice?: number): Expectations {
      return new Expectations(summary, description, keywords, steps, completedBy, price, suggestedCompletedBy, suggestedPrice);
    }

    hasSuggestedCompletedBy(): boolean {
        return this.suggestedCompletedBy.getTime() !== Expectations.epoch.getTime();
    }

    hasSuggestedPrice(): boolean {
        return this.suggestedPrice !== -1;
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
            this.suggestedPrice);
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
            suggestedPrice);
    }

    toString(): string {
        return "Expectations[" + JSON.stringify(this) + "]";
    }

    private constructor(
        summary: string,
        description: string,
        keywords: OSet<string>,
        steps: OSet<string>,
        completedBy: Date,
        price: number,
        suggestedCompletedBy?: Date,
        suggestedPrice?: number) {

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

    actualPrice(suggestedPrice?: number): number {
        if (suggestedPrice && suggestedPrice !== Expectations.noPrice) {
            return suggestedPrice;
        }
        return Expectations.noPrice;
    }

    get description(): string {
        return this._description;
    }
    private set description(value: string) {
        this._description = value;
    }
    
    get completedBy(): Date {
        return this._completedBy;
    }
    private set completedBy(value: Date) {
        this._completedBy = value;
    }

    get keywords(): OSet<string> {
        return this._keywords;
    }
    private set keywords(value: OSet<string>) {
        this._keywords = value;
    }

    get suggestedCompletedBy(): Date {
        return this._suggestedCompletedBy;
    }
    private set suggestedCompletedBy(value: Date) {
        this._suggestedCompletedBy = value;
    }

    get summary(): string {
        return this._summary;
    }
    private set summary(value: string) {
        this._summary = value;
    }

    get steps(): OSet<string> {
        return this._steps;
    }
    private set steps(value: OSet<string>) {
        this._steps = value;
    }

    get price(): number {
        return this._price;
    }
    private set price(value: number) {
        this._price = value;
    }

    get suggestedPrice(): number {
        return this._suggestedPrice;
    }
    private set suggestedPrice(value: number) {
        this._suggestedPrice = value;
    }
}
