export interface BlockHeader {
    version: string,
    blockHash: string, /* Not stored exactly here, but in the detabase index !!! */
    previousBlockHash: string; // ParentBackHash
    merkleRoot: string;
    timestamp: number;
    difficultyTarget: number;
    nonce: number;
}

export interface Block {
    blockIndex: number;
    blockSize: number;
    blockHeader: BlockHeader;
    transactionCounter: number;
    transactions: Transaction[];
}

export interface Transaction {
    data: Voter;
    transactionHash: string;
    /* Credentials */
}

export interface HashMap<T> {
    [key: string]: T;
}

export interface Voter {
    identifier: string,
    electoralId?: string,
    electoralIV?: string,
    choiceCode: string;
    state: boolean;
    secret: string,
    voteTime?: number,
    IV?: string
}

export interface Candidate {
    name: string,
    num_votes: number,
    code: number,
    acronym?: string,
    party: string,
    status?: string, /*"pending" | "processing" | "verified" | "failed"*/
}

export interface Results {
    startTime: number,
    endTime: number,
    winner: Candidate,
    candidatesResult: CandidateResult[],
    expectedTotalVotes: number,
    totalVotesReceived: number,
    totalCandidates: number,
    votesPerProvince: any,
    averageTimePerVote: number, // minutes / vote
    averageVotePerProvince: number, // votes / province
    votesPerDay: any, // 
    votesPerParty: any
}

export interface CandidateResult {
    numVotes: number,
    percentage: number,
    candidate: Candidate
}