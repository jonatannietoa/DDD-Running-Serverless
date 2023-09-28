// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

export interface Equality<T> {
    equals(other: T): boolean;
}
