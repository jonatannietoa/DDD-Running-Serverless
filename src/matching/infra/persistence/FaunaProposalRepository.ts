// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Client, query as qf } from 'faunadb'
import { dbAccess, dbEndpoint } from '../../../private'
import { Id } from '../../model/Id'
import { Proposal } from '../../model/proposal/Proposal'
import { ProposalRepository } from '../../model/proposal/ProposalRepository'
import { DomainEvent } from '../../../common/DomainEvent'

const client = new Client({
  secret: dbAccess,
  domain: dbEndpoint,
  keepAlive: true,
})

export class FaunaProposalRepository implements ProposalRepository {
  constructor() {}

  close(): void {
    try {
      // client.close();
    } catch (error) {
      // already closed
    }
  }

  async proposalOf(id: Id) {
    // const result = client.query(qf.SelectAll());

    return null
  }

  async save(proposal: Proposal) {
    try {
      var nextVersion = proposal.nextVersion

      const newIds = await this.cacheNewIds(proposal.applied.length)

      let index = 0
      const eventsData = (proposal.applied as Array<DomainEvent>).map(
        (event) => {
          const streamId = this.streamId(event.id, nextVersion)
          const eventData = {
            id: newIds[index++],
            document: {
              streamId: streamId,
              streamName: event.id,
              streamVersion: nextVersion++,
              eventData: event,
            },
          }
          return JSON.parse(JSON.stringify(eventData))
        }
      )

      // something weird about the eventData object...
      const payload = JSON.parse(JSON.stringify(eventsData[0]))

      return client.query(
        qf.Create(qf.Ref(qf.Collection('journal'), payload.id), {
          data: payload.document,
        })
      )
    } catch (error) {
      console.log('SAVE ERROR: ' + error.message)
      throw error
    }
  }

  protected async cacheNewIds(count: number) {
    const newIds = []
    for (let idx = 0; idx < count; idx++) {
      const newId = await client.query(qf.NewId())
      newIds.push(newId)
    }
    return newIds
  }
  protected streamId(streamId: string, sequence: number): string {
    let zeroedSequence = sequence.toString()
    while (zeroedSequence.length < 6) {
      zeroedSequence = '0' + zeroedSequence
    }

    return streamId + ':' + zeroedSequence
  }

  // flat for Map(Do(Lambda(Create())))
  // const eventData = { id: newIds[index++], streamId: streamId, streamName: event.id, streamVersion: nextVersion++, eventData: event };
  //
  // const results = client.query(
  //     qf.Map(eventsData,
  //         qf.Do(
  //             qf.Lambda(
  //                 ['id', 'streamId', 'streamSequence', 'eventData'],
  //                 qf.Create(
  //                     qf.Ref(qf.Collection('journal'), Var('id')), {
  //                     data: { streamId: Var('streamId'), streamSequence: Var('streamSequence'), eventData: Var('eventData') }
  //                 })
  //             )
  //         )
  // ));
}
