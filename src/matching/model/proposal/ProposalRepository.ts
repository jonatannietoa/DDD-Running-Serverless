// Copyright © 2012-2023 Vaughn Vernon. All rights reserved.

import { Id } from '../Id'
import { Proposal } from './Proposal'

export interface ProposalRepository {
  proposalOf(id: Id)
  save(proposal: Proposal)
}
