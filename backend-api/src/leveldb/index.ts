import { Block, Candidate, Voter } from "../blockchain/data_types";
import { Citizen, User } from "../committee/data_types";

const NODE_ADDRESS = process.argv[2];
const getBlockAddress = (str) => str + NODE_ADDRESS;

const { Level } = require('level')
const db = new Level(getBlockAddress('././db/db'), { valueEncoding: 'json' })

const BLOCK = getBlockAddress("block");
const CHAIN = getBlockAddress("chain");
const USER_COMMITTEE = getBlockAddress("user_committee");
const TRANSACTION = getBlockAddress("transaction");
const CITIZENS = getBlockAddress("citizens");
const CANDIDATES = getBlockAddress("candidates");
const CANDIDATES_TEMP = getBlockAddress("candidates_temp");
const VOTERS = getBlockAddress("voters");
const VOTERS_GENERATED = getBlockAddress("voters_generated");
const ANNOUNCEMENT = getBlockAddress("announcement");
const RESULTS = getBlockAddress("results");
const VOTER_CITIZEN_RELATION = getBlockAddress("voter_citizen_relation");

const blockdb = db.sublevel(BLOCK, { valueEncoding: 'json' })
const chaindb = db.sublevel(CHAIN, { valueEncoding: 'json' })
const transactiondb = db.sublevel(TRANSACTION, { valueEncoding: 'json' })
const citizensdb = db.sublevel(CITIZENS, { valueEncoding: 'json' })
const candidatesdb = db.sublevel(CANDIDATES, { valueEncoding: 'json' })
const votersdb = db.sublevel(VOTERS, { valueEncoding: 'json' })
const votersgenerateddb = db.sublevel(VOTERS_GENERATED, { valueEncoding: 'json' })
const candidatesTempDb = db.sublevel(CANDIDATES_TEMP, { valueEncoding: 'json' })
const userdb = db.sublevel(USER_COMMITTEE, { valueEncoding: 'json' })
const announcementdb = db.sublevel(ANNOUNCEMENT, { valueEncoding: 'json' })
const resultsdb = db.sublevel(RESULTS, { valueEncoding: 'json' })
const votercitizenrelationdb = db.sublevel(VOTER_CITIZEN_RELATION, { valueEncoding: 'json' })

/* 
  INFO ABOUT THE API: https://github.com/Level/level?tab=readme-ov-file
*/

export async function writeTransaction(key, value) {
  await transactiondb.put(key, value)
}

export async function writeChain(value) {
  await chaindb.put(CHAIN, value)

  let chain: Block[] = value;
  chain.forEach(x => {
    writeBlock(x.blockHeader.blockHash, x);
  });
}

export async function writeBlock(key, value) {
  await blockdb.put(key, value)
}

export async function writeCitizen(key, value) {
  await citizensdb.put(key, value)
}

export async function writeUser(key, value) {
  await userdb.put(key, value)
}

export async function writeAnnouncement(value) {
  await announcementdb.put(ANNOUNCEMENT, value)
}

export async function writeResults(value) {
  await resultsdb.put(RESULTS, value)
}

export async function writeVoterGenerated(key, value) {
  await votersgenerateddb.put(key, value)
}

export async function writeVoterCitizenRelation(key, value) {
  await votercitizenrelationdb.put(key, value)
}

export async function writeCandidateTemp(key, value) {
  await candidatesTempDb.put(key, value)
}

export async function updateVoter(key, value) {
  votersdb.put(key, value);
}

export async function deployVotersGenerated() {
  await clearVoters();
  for await (const [key, value] of votersgenerateddb.iterator()) {
    if (value !== undefined)
      votersdb.put(key, value);
      await writeVoterCitizenRelation(value.electoralId, value.identifier);
  }
}

export async function deployCandidates() {
  clearCandidates();
  for await (const [key, value] of candidatesTempDb.iterator()) {
    if (value !== undefined)
      candidatesdb.put(key, value);
  }
}

export async function readVoters() {
  let voters: Voter[] = [];

  for await (const [_, value] of votersdb.iterator()) {
    if (value !== undefined) {
      voters.push(value);
    }
  }

  return voters
}

export async function readCandidatesTemp() {
  let candidates: Candidate[] = [];

  for await (const [_, value] of candidatesTempDb.iterator()) {
    if (value !== undefined) {
      candidates.push(value);
    }
  }

  return candidates
}


export async function readCandidates() {
  let candidates: Candidate[] = [];

  for await (const [_, value] of candidatesdb.iterator()) {
    if (value !== undefined) {
      candidates.push(value);
    }
  }

  return candidates
}

export async function readUsers() {
  let users: User[] = [];

  for await (const [_, value] of userdb.iterator()) {
    if (value !== undefined) {
      users.push(value);
    }
  }

  return users
}

export async function readVoterGenerated() {
  let votersGenerated: Voter[] = [];

  for await (const [_, value] of votersgenerateddb.iterator()) {
    votersGenerated.push(value);
  }

  return votersGenerated
}

export async function readBlock(key) {
  const value = await blockdb.get(key)
  return value;
}

export async function readChain() {
  const value = await chaindb.get(CHAIN)
  return value;
}

export async function readVoterCitizenRelation(key) {
  const value = await votercitizenrelationdb.get(key)
  return value;
}

export async function clearVoterCitizenRelation() {
  return votercitizenrelationdb.clear();
}

export async function readAnnouncement() {
  const value = await announcementdb.get(ANNOUNCEMENT)
  return value;
}

export async function readResults() {
  const value = await resultsdb.get(RESULTS)
  return value;
}

export async function readTransactions() {
  let transactions = []

  for await (const [_, value] of transactiondb.iterator()) {
    transactions.push(value);
  }

  return transactions
}

export async function readCitizen(key) {
  const value = await citizensdb.get(key);
  return value;
}

export async function readUser(key) {
  const value = await userdb.get(key);
  return value;
}

export async function readCitizens() {
  let citizens: Citizen[] = [];
  for await (const [_, value] of citizensdb.iterator()) {
    citizens.push(value);
  }

  return citizens;
}

export async function removeUser(key) {
  return userdb.del(key)
}

export async function removeCitizen(key) {
  return citizensdb.del(key)
}

export async function clearCitizens() {
  return citizensdb.clear();
}

export async function clearChains() {
  return chaindb.clear();
}

export async function clearUsers() {
  return userdb.clear();
}

export async function clearResults() {
  return resultsdb.clear();
}

export async function clearCandidates() {
  return candidatesdb.clear();
}

export async function clearCandidatesTemp() {
  return candidatesTempDb.clear();
}

export async function clearVotersGenerated() {
  return votersgenerateddb.clear();
}

export async function clearVoters() {
  await clearVoterCitizenRelation();
  return votersdb.clear();
}

export async function readBlocks() {
  let blocks = [];
  let stream = blockdb.createReadStream();
  stream.on('data', function (block) {
    blocks.push(block);
  })

  return blocks;
}
