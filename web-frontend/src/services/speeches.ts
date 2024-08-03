/* eslint-disable @typescript-eslint/no-explicit-any */

import { CandidateResult, Results } from "@/data_types";

/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { Buffer } from 'buffer';
// import 'dotenv/config';

export const UltimateSpeech = async (results: Results) => {
    if (results.candidatesResult.length === 0) return;

    const winnerResult: CandidateResult | undefined = results.candidatesResult.find(x => x.candidate.name === results.winner.name);
    if (!winnerResult) {
        console.error('Winner not found in candidatesResult');
        return;
    }

    const str = `
        Ladies and gentlemen,
        Thank you for gathering here today as we announce the results of this closely-watched election. After a thorough and diligent process, we have now counted all the votes. I am honored to share the final results with you.
        
        The voting period started on ${new Date(results.startTime).toLocaleDateString()} and concluded on ${new Date(results.endTime).toLocaleDateString()}. During this time, we witnessed robust participation across our provinces, reflecting the democratic spirit of our people.
        Out of the ${results.expectedTotalVotes} expected votes, we received a total of ${results.totalVotesReceived} votes, ensuring a complete and transparent count. The candidates who are competing for your support were ${results.candidatesResult.map(cr => cr.candidate.name).join(', ')}.

        The winner of this election, with a significant majority of ${winnerResult.numVotes} votes, is ${results.winner.name} from ${results.winner.party}. Congratulations, ${results.winner.name}, on this remarkable victory. Your verified status and overwhelming support clearly demonstrate the trust and confidence the voters have placed in you.
        
        ${results.candidatesResult.filter(x => x.candidate.name !== winnerResult.candidate.name).map(cr => `${cr.candidate.name} from ${cr.candidate.party} received ${cr.percentage}% of the votes, totaling ${cr.numVotes} vote${cr.numVotes > 1 ? 's' : ''}.`).join(' ')}

        This election not only highlights the winning candidate but also emphasizes the importance of each vote and the collective voice of our electorate. We thank all the candidates for their participation and dedication, and we extend our gratitude to the voters who exercised their democratic rights.
        Congratulations once again to ${results.winner.name} and ${results.winner.party}. We look forward to your leadership and vision for the future.

        Last but not least, it is important to mention that this process was executed under the supervision of blockchain technology to enhance the accuracy, efficiency, and integrity of our elections. Thank you all for joining us tonight. As we wrap up our broadcast, let us remember, together we strive for a better Angola. Good night, may peace be upon you!
        Thank you !!!
    `;

    console.log(str);

    return str;
}

// Example usage with mock data
export const Mockresults: Results = {
    startTime: new Date("2024-05-16").getTime(),
    endTime: new Date("2024-06-16").getTime(),
    winner: {
        id: 2,
        code: 1,
        name: "Alfredo Martins",
        acronym: "AM",
        party: "Party B",
        status: "verified",
        toast: () => { }
    },
    candidatesResult: [
        { numVotes: 1, percentage: 3.33, candidate: { id: 1, code: 1, name: "Genilson Araújo", acronym: "GA", party: "Party A", status: "verified", toast: () => { } } },
        { numVotes: 20, percentage: 66.67, candidate: { id: 2, code: 2, name: "Alfredo Martins", acronym: "AM", party: "Party B", status: "verified", toast: () => { } } },
        { numVotes: 3, percentage: 10, candidate: { id: 3, code: 3, name: "Carla Silva", acronym: "CS", party: "Party C", status: "verified", toast: () => { } } },
        { numVotes: 2, percentage: 6.67, candidate: { id: 4, code: 4, name: "Diego Santos", acronym: "DS", party: "Party D", status: "verified", toast: () => { } } },
        { numVotes: 1, percentage: 3.33, candidate: { id: 5, code: 5, name: "Elena Costa", acronym: "EC", party: "Party E", status: "verified", toast: () => { } } },
        { numVotes: 2, percentage: 6.67, candidate: { id: 6, code: 6, name: "Felipe Almeida", acronym: "FA", party: "Party F", status: "verified", toast: () => { } } },
        { numVotes: 1, percentage: 3.33, candidate: { id: 7, code: 7, name: "Gabriela Souza", acronym: "GS", party: "Party G", status: "verified", toast: () => { } } }
    ],
    expectedTotalVotes: 60,
    totalVotesReceived: 30,
    totalCandidates: 7,
    votesPerProvince: {},
    averageTimePerVote: 1,
    averageVotePerProvince: 1,
    votesPerDay: {},
    votesPerParty: {}
};

//UltimateSpeech(Mockresults);