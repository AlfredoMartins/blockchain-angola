import assert from 'assert';
import { Voter, Candidate, Results, CandidateResult, HashMap } from '../blockchain/data_types';
import CryptoBlockchain from '../crypto/cryptoBlockchain';
import { clearResults, clearVoters, readAnnouncement, readCandidates, readCitizens, readResults, readVoters, writeResults } from '../leveldb';
import { Announcement, Citizen } from '../committee/data_types';

const CryptoBlockIdentifier = new CryptoBlockchain(process.env.SECRET_KEY_IDENTIFIER, process.env.SECRET_IV_IDENTIFIER);
const CryptoBlockVote = new CryptoBlockchain(process.env.SECRET_KEY_VOTES, process.env.SECRET_IV_VOTES);

enum ElectionState {
    Created = 0,
    Announced,
    Started,
    Happening,
    Ended,
}

class SmartContract {
    candidates: Candidate[];
    candidatesTest: Candidate[];

    voters: Voter[];
    votersTest: Voter[];

    citizens: Citizen[];

    hashCandidates: HashMap<Candidate>;
    hashVoters: HashMap<Voter>;

    electionState: ElectionState;
    announcement: Announcement;

    provinces: string[];
    results: Results;

    statsPerProvince: HashMap<HashMap<number>>;

    constructor() {
        this.electionState = ElectionState.Created;
        this.initVariables();
        this.update();
    }

    public update() {
        this.initVariables();
        this.electionState = ElectionState.Started;
    }

    private async initVariables() {
        this.candidates = [];
        this.voters = [];
        this.citizens = [];

        this.provinces = [
            "Bengo",
            "Benguela",
            "Bié",
            "Cabinda",
            "Cuando Cubango",
            "Cuanza Norte",
            "Cuanza Sul",
            "Cunene",
            "Huambo",
            "Huíla",
            "Luanda",
            "Lunda Norte",
            "Lunda Sul",
            "Malanje",
            "Moxico",
            "Namibe",
            "Uíge",
            "Zaire"
        ];     
        
        
        this.hashCandidates = {};
        this.hashVoters = {};
        
        await this.loadCandidates();
        await this.loadVoters();
        await this.loadAnnouncement();
        await this.loadCitizens();
        await this.loadResults();

        this.statsPerProvince = {};
        this.provinces.forEach(p => {
            let map: HashMap<number> = {};

            this.candidates.forEach(c => {
                map[c.party] = 0;
            })

            map['sum'] = 0;

            this.statsPerProvince[p] = map;
        })
    }

    private async loadCitizens() {
        try {
            this.citizens = await readCitizens();
        } catch (error) {}

        return this.announcement;
    }

    private async loadAnnouncement() {
        try {
            this.announcement = await readAnnouncement();
        } catch (error) {}

        return this.announcement;
    }

    private async loadResults() {
        try {
            this.results = await readResults();
        } catch (error) {}

        return this.results;
    }

    private async loadVoters(): Promise<Voter[]> {
        try {
            this.voters = await readVoters();
        } catch (error) {}

        return this.voters;
    }

    private async loadCandidates(): Promise<Candidate[]> {
        try {
            this.candidates = await readCandidates();
        } catch (error) {}

        return this.candidates;
    }

    public async getAnnouncement() {
        try {
            this.announcement = await readAnnouncement();
        } catch (error) {}

        return this.announcement;
    }

    public isValidElectionTime(): boolean {
        let currentTime: number = Date.now();
        return this.isElectionState() && currentTime >= new Date(this.announcement.startTimeVoting).getTime() && currentTime <= new Date(this.announcement.endTimeVoting).getTime();
    }

    private isElectionState(): boolean {
        return this.electionState >= ElectionState.Started && this.electionState <= ElectionState.Ended;
    }

    public async getVoters() {
        try {
            this.votersTest = await readVoters();
        } catch (error) {}

        return this.votersTest;
    }

    public async getCandidates() {
        try {
            this.candidatesTest = await readCandidates();
        } catch (error) { }

        return this.candidatesTest;
    }

    public async eraseVoters() {
        try {
            await clearVoters();
            await this.loadVoters();
        } catch (error) {}
    }

    public async eraseResults() {
        try {
            await clearResults();
            this.results = null;
            await this.loadResults();
        } catch (error) { }
    }

    public revealVoter(voter: Voter) {
        const objData = {
            IV: voter.electoralIV,
            CIPHER_TEXT: voter.electoralId,
        }

        const ans = {
            electoralId: CryptoBlockIdentifier.decryptData(objData),
            identifier: voter.identifier
        }

        return ans;
    }

    private announceElection() {
        this.electionState = ElectionState.Announced;
    }

    private startElection() {
        this.electionState = ElectionState.Started;
    }

    private endElection() {
        this.electionState = ElectionState.Ended;
    }

    private async existsVoter(voter: Voter): Promise<boolean> {
        const res = voter.identifier in this.hashVoters;
        return res;
    }

    private existsCandidate(code: string): boolean {
        return code in this.hashCandidates;
    }

    private async processVotes(): Promise<void> {
        for (const candidate of this.candidates) {
            this.hashCandidates[candidate.code] = candidate;
        }

        let votesProcessed: HashMap<boolean>;
        votesProcessed = {}; // new HashMap<boolean>();

        this.electionState = ElectionState.Ended;

        for (const voter of this.voters) {
            this.hashVoters[voter.identifier] = voter;
            votesProcessed[voter.identifier] = false;
        }

        // console.log("Voters: ", this.voters);

        let counter_votes: number = 0;
        let sum_durations: number = 0;

        for (const voter of this.voters) {

            if (votesProcessed[voter.identifier]) {
                console.log("Voter already voted.");
            }

            if (!voter.state) continue;
            if (voter.identifier === "00000" || voter.identifier === "20000") continue; // It belongs to the first transactions added by default. They mustn't be processes :)

            await this.placeVote(voter);

            // Duration
            const startTime: Date = new Date(this.announcement.startTimeVoting);
            const endTime: Date = new Date(voter.voteTime);

            const duraction = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // In minutes
            sum_durations += duraction;

            if (voter.state) {
                counter_votes++;
                votesProcessed[voter.identifier] = true;
            }
        }

        const duractionPerVote = sum_durations / counter_votes;
        const winner: Candidate = this.winningCandidate();

        let candidate_results: CandidateResult[] = [];
        for (const x of this.candidates) {
            const value = this.hashCandidates[x.code];

            let candidateResult: CandidateResult = {
                numVotes: value.num_votes,
                percentage: (value.num_votes * 100) / this.announcement.numOfVoters,
                candidate: value
            }

            candidate_results.push(candidateResult);
        }

        const startTime: number = new Date(this.announcement.startTimeVoting).getTime(); // .getMilliseconds();
        const endTime: number = new Date(this.announcement.endTimeVoting).getTime(); // .getMilliseconds();

        let sum: number = 0;
        this.provinces.forEach(x => {
            sum += this.statsPerProvince[x]['sum'];
        })

        const averageVotePerProvince = sum / 18;

        let results: Results = {
            startTime: startTime,
            endTime: endTime,
            winner: winner,
            expectedTotalVotes: this.announcement.numOfVoters,
            totalVotesReceived: counter_votes,
            totalCandidates: this.announcement.numOfCandidates,
            averageTimePerVote: duractionPerVote,
            candidatesResult: candidate_results,
            votesPerProvince: this.statsPerProvince,
            averageVotePerProvince: averageVotePerProvince,
            votesPerDay: 0,
            votesPerParty: this.statsPerProvince,
        }

        writeResults(results);
        this.loadResults();
        // console.log("Results: ", results);

        this.results = results;
    }

    private async placeVote(voter: Voter) {
        if (!(await this.existsVoter(voter))) {
            console.log("Voter does not exist.");
            return;
        }

        if (!this.isValidElectionTime()) {
            console.log("Invalid voting time.");
            return;
        }

        const objData = {
            CIPHER_TEXT: voter.choiceCode,
            IV: voter.IV,
        }

        const choice_code: string = CryptoBlockVote.decryptData(objData);

        if (!this.existsCandidate(choice_code)) {
            console.log("Candidate does not exist.");
            return;
        }

        this.hashVoters[voter.identifier].state = true;
        this.hashCandidates[choice_code].num_votes++;

        // Put It in the statistic
        const voterFound = this.revealVoter(voter) ;
        const electoralId: string = voterFound.electoralId;

        const citizen: Citizen = this.citizens.find(x => x.electoralId === electoralId);
        const province: string = citizen.province;

        if (this.provinces.find(x => x === province)) {   
            let currentStatOfPrivince = this.statsPerProvince[province];
            currentStatOfPrivince[this.hashCandidates[choice_code].party]++;
            currentStatOfPrivince['sum']++;
            this.statsPerProvince[province] = currentStatOfPrivince;
        }
    }

    private getProvince(text: string) {
        let array: string[] = text.split('')
        const provinces: string[] = [""];
    }

    public winningCandidate() {
        if (this.candidates === null || this.candidates === undefined || this.candidates.length === 0) return null;

        let winnerCandidate: Candidate = this.candidates.reduce
            (
                (prev, curr) => (prev.num_votes > curr.num_votes) ? prev : curr
            );

        let num_winners = this.candidates.filter(x => x.num_votes === winnerCandidate.num_votes).length;

        if (winnerCandidate.num_votes === 0 || num_winners >= 2) return null; // No winner If candidates tie.

        return winnerCandidate;
    }

    private candidateResults() {
        return this.results.candidatesResult;
    }

    private timestampToDate(timestamp: number): Date {
        return new Date(timestamp * 1000);
    }

    public async getResults(): Promise<Results> {
        await this.initVariables();
        await this.processVotes();
        return this.results;
    }

    public async getResultsComputed(): Promise<Results> {
        await this.initVariables();
        return this.results;
    }
}

export default SmartContract;