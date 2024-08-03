/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HashMap<T> {
    [key: string]: T;
}

export const nodeAddresses = (): string[] => {
    let target: number = 3000;
    const nodes: string[] = [];
    while (target <= 3011) {

        if (target !== 3007)
            nodes.push(target.toString());
        target++;

    } return nodes;
}

export enum Role { ADMIN, NORMAL }

export type User = {
    id?: number,
    name: string,
    username: string,
    password?: string,
    role: Role,
    photo?: string,
    refreshToken?: string,
    timestamp?: string,
    toast(...params: any[]): void,
    setData?: any,
}

export type Block = {
    id: number,
    hashBlock: string,
    nonce: string,
    numOfTransactions: string,
    dateAndTime: string,
    size: string,
}

export type CandidateResults = {
    id: number,
    candidate: string,
    party: string,
    numVotes: string,
    percentage: string,
    candidadePhoto?: string,
    partyImage?: string,
}


export type PendingTransaction = {
    id: number,
    transactionHash: string,
    identifier: string,
    choiceCode: string,
    voteTime: string,
}


export type Citizen = {
    id: number,
    electoralId: string,
    name: string,
    address: string,
    province: string,
    email: string,
    password: string,
    status: string,
    verification: string,
    operation: string,
    otp: Otp,
    toast(...params: any[]): void,
    setData?: any
}

export type Transaction = {
    id: number,
    transactionHash: string,
    identifier: string,
    choiceCode: string,
    voteTime: string,
}

export type Otp = {
    ascii: string,
    hex: string,
    base32: string,
    otpauth_url: string
}

export type Candidate = {
    id?: number,
    code: number,
    name: string,
    acronym: string,
    candidadePhoto?: string,
    partyImage?: string,
    party: string,
    status: string,
    toast: (...params: unknown[]) => void,
    editCandidate?: any,
    setEditCandidate?: any
}

export type Voter = {
    id: number,
    identifier: string,
    electoralId?: string,
    choiceCode: string;
    state: string;
    secret: string,
    toast?(...params: any[]): void
}


export interface CandidateResult {
    numVotes: number,
    percentage: number,
    candidate: Candidate
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

export interface topVotesPerProvinces {
    id?: number,
    province: string,
    percentage: number,
    number: string
}

export interface CandidateResult {
    numVotes: number,
    percentage: number,
    candidate: Candidate
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

export interface Party {
    url: string;
    name: string;
    number: string;
}

export interface CandidateResult {
    numVotes: number,
    percentage: number,
    candidate: Candidate
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