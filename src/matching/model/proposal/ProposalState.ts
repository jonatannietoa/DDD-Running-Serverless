// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client } from "../Client";
import { Doer } from "../Doer";
import { Id } from "../Id";
import { Expectations } from "./Expectations";
import { Progress } from "./Progress";
import { Set as OSet } from 'typescript-collections';

export class ProposalState {
    private readonly _id: Id;
    private readonly _client: Client;
    private readonly _expectations: Expectations;
    private readonly _candidateDoers: OSet<Doer>;
    private readonly _matchedDoer: Doer;
    private readonly _progress: Progress;

    static empty() {
        return new ProposalState(Id.empty(), Client.none(), Expectations.none(), new OSet<Doer>(), Doer.none(), Progress.none());
    }

    constructor(
        id: Id,
        client: Client,
        expectations: Expectations,
        candidateDoers: OSet<Doer>,
        matchedDoer: Doer,
        progress: Progress) {

        this._id = id;
        this._client = client;
        this._expectations = expectations;
        this._candidateDoers = candidateDoers;
        this._matchedDoer = matchedDoer;
        this._progress = progress;
    }

    get id() {
        return this._id;
    }

    get client() {
        return this._client;
    }

    get expectations() {
        return this._expectations;
    }

    get candidateDoers() {
        return this._candidateDoers;
    }

    get matchedDoer() {
        return this._matchedDoer;
    }

    get progress() {
        return this._progress;
    }

    mergeDoers(doers: OSet<Doer>): OSet<Doer> {
        //console.log("AVAILABLE: " + doers);
        const merged = new OSet<Doer>();
        this.candidateDoers.forEach(candidate => {
            //console.log("CANDIDATE: " + candidate);
            if (doers.contains(candidate)) {
                //console.log("MERGING IN: " + candidate);
                merged.add(candidate);
            }
        });
        return merged;
    }

    toString(): string {
        const json = JSON.stringify(this);
        return "ProposalState[".concat(json).concat("]");
    }
}
