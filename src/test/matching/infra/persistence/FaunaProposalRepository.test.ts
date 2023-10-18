// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from '../../../../matching/model/Id'
import { Proposal } from '../../../../matching/model/proposal/Proposal'
import {
  PricingAccepted,
  ProposalSubmitted,
} from '../../../../matching/model/proposal/events'
import { FaunaProposalRepository } from '../../../../matching/infra/persistence/FaunaProposalRepository'
import { client, expectations } from '../../model/fixures'

let proposalId = Id.empty()

describe('FaunaProposalRepository class', () => {
  test('FaunaProposalRepository::ctor', () => {
    const repository = new FaunaProposalRepository()
    expect(repository).not.toBeNull()
    repository.close()
  })

  test('FaunaProposalRepository::ProposalSubmitted', () => {
    const proposal = Proposal.submitFor(client, expectations)

    expect(proposal).not.toBeNull()
    expect(proposal.applied.length).toBe(1)
    expect(proposal.applied[0].type).toBe(ProposalSubmitted.Type)

    proposalId = proposal.state.id

    const repository = new FaunaProposalRepository()
    const result = repository.save(proposal)

    return result.then((actual) => {
      // console.log('SAVE RESULTS: ' + JSON.stringify(actual));
      expect(actual).not.toBeNull()
      expect(actual[0]).not.toBeNull()
      repository.close()
    })
  })

  test('FaunaProposalRepository::PricingAccepted', () => {
    const stream = [ProposalSubmitted.with(proposalId, client, expectations)]

    const proposal = Proposal.restoreStateWith(stream)

    proposal.acceptPricing()

    expect(proposal.applied.length).toBe(1)
    expect(proposal.applied[0].type).toBe(PricingAccepted.Type)
    expect((proposal.applied[0] as PricingAccepted).proposalId.value).toBe(
      proposalId.value
    )

    const repository = new FaunaProposalRepository()
    const result = repository.save(proposal)

    return result.then((actual) => {
      // console.log('SAVE RESULTS: ' + JSON.stringify(actual));
      expect(actual).not.toBeNull()
      expect(actual[0]).not.toBeNull()
      repository.close()
    })
  })

  test('TEST USERS', () => {
    // const repository = new FaunaProposalRepository();
    // const user = repository.testUsers();
    // return user.then(u => {
    //     console.log("USER TESTED: " + JSON.stringify(u));
    //     repository.close();
    // });
  })

  test('TEST JOURNAL READ', () => {
    // const repository = new FaunaProposalRepository();
    // const event = repository.testJournalRead();
    // return event.then(e => {
    //     console.log("JOURNAL TESTED: " + JSON.stringify(e));
    //     repository.close();
    // });
  })

  test('TEST JOURNAL SAVE', () => {
    // const repository = new FaunaProposalRepository();
    // const event = repository.testJournalSave();
    // return event.then(e => {
    //     console.log("JOURNAL EVENT TESTED: " + JSON.stringify(e));
    //     repository.close();
    // });
  })
})
