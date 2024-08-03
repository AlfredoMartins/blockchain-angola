/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import path from "path";
import OpenAI from "openai";
//import 'dotenv/config';

export default async function textToSpeech(str) {
  
    const body = {
      organization: process.env.ORGANIZATION,
      project: process.env.PROJECT_ID,
    };

    console.log(process);

    const speechFile = path.resolve("src/sounds/speech.mp3");
    const openai = new OpenAI(body);
    
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: str,
    });
    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
}

const str = `
Ladies and gentlemen,
Thank you for gathering here today as we announce the results of this closely-watched election. After a thorough and diligent process, we have now counted all the votes. I am honored to share the final results with you.

The voting period started on 09/05/2024 and concluded on 29/06/2024. During this time, we witnessed robust participation across our provinces, reflecting the democratic spirit of our people.
Out of the 67 expected votes, we received a total of 24 votes, ensuring a complete and transparent count. The candidates who are competing for your support were Alfredo Martins, Genilson Araújo, Anete Neto, João Amadeu, Énio Paulo.

The winner of this election, with a significant majority of 9 votes, is Alfredo Martins from Science Development Party. Congratulations, Alfredo Martins, on this remarkable victory. Your verified status and overwhelming support clearly demonstrate the trust and confidence the voters have placed in you.

Genilson Araújo from React Development Party received 8.955223880597014% of the votes, totaling 6 votes. Anete Neto from Education for All Party received 2.985074626865672% of the votes, totaling 2 votes. João Amadeu from Sport Liberal Democratic Party received 4.477611940298507% of the votes, totaling 3 votes. Énio Paulo from Notion Journals Party received 5.970149253731344% of the votes, totaling 4 votes.

This election not only highlights the winning candidate but also emphasizes the importance of each vote and the collective voice of our electorate. We thank all the candidates for their participation and dedication, and we extend our gratitude to the voters who exercised their democratic rights.
Congratulations once again to Alfredo Martins and Science Development Party. We look forward to your leadership and vision for the future.

Last but not least, it is important to mention that this process was executed under the supervision of blockchain technology to enhance the accuracy, efficiency, and integrity of our elections. Thank you all for joining us tonight. As we wrap up our broadcast, let us remember, together we strive for a better Angola. Good night, may peace be upon you!
Thank you !!!
`;

await textToSpeech(str);