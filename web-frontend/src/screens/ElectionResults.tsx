import { Button } from '@/components/ui/button';
import { GLOBAL_VARIABLES, TOKEN_KEY } from '@/global/globalVariables';
import { CandidateResults } from '@/tables/election_results_table/columns';
import TableElectionResults from '@/tables/election_results_table/page';
import axios from 'axios';
import '../style.css';

import { useEffect, useState } from 'react'
import { getItemAsync } from '@/context/SecureStore';
import { useAuth } from '@/context/AuthContext';

function ElectionResults() {

  useEffect(() => {
    onPressLoadResultsComputed();
  }, []);

  const [data, setData] = useState<CandidateResults[]>();
  const { imageList, setImageList } = useAuth();

  const onPressLoadResultsComputed = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/get-results-computed')
      .then(response => {
        const results = response.data;

        if (results !== undefined) {
          let newData = results.candidatesResult.map((x: any, index: any) => {

            const candidatePhotoName = x.candidate.name.toLowerCase().split(' ').join('.');
            const partyPhotoName = x.candidate.party.toLowerCase().split(' ').join('.');

            return ({
              id: index + 1,
              numVotes: x.numVotes.toString(),
              percentage: Number(x.percentage.toFixed(2)),
              party: x.candidate.party,
              candidadePhoto: imageList[candidatePhotoName],
              partyImage: imageList[partyPhotoName],
              candidate: x.candidate.name
            })
          });

          newData.sort((a: any, b: any) => b.percentage - a.percentage);

          newData = newData.map((x: any, index: any) => {
            return {
              ...x,
              id: index + 1
            };
          });

          setData([...newData]);
        }
      })
      .catch(error => console.error(error));
  }

  const onPressLoadResults = async () => {

    const token = await getItemAsync(TOKEN_KEY);
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/get-results', { withCredentials: true })
      .then(response => {
        const results = response.data;

        if (results !== undefined) {
          let newData = results.candidatesResult.map((x: any, index: any) => {

            const candidatePhotoName = x.candidate.name.toLowerCase().split(' ').join('.');
            const partyPhotoName = x.candidate.party.toLowerCase().split(' ').join('.');

            return ({
              id: index + 1,
              numVotes: x.numVotes.toString(),
              percentage: Number(x.percentage.toFixed(2)),
              party: x.candidate.party,
              candidadePhoto: imageList[candidatePhotoName],
              partyImage: imageList[partyPhotoName],
              candidate: x.candidate.name
            })
          });

          newData.sort((a: any, b: any) => b.percentage - a.percentage);

          newData = newData.map((x: any, index: any) => {
            return {
              ...x,
              id: index + 1
            };
          });

          setData([...newData]);
        }
      })
      .catch(_ => 0);
  }

  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    onPressLoadResults();
    setTimeout(() => {
      setClicked(false);
    }, 10000);
  };

  return (
    <div className='flex gap-2 flex-col '>
      <span className='font-inria-sans text-2xl text-gray-400'>Election Results</span>
      <div className='md:items-center md:gap-2 w-full bg-red h-screen'>
        <div className="flex gap-2 py-4">
          <Button className="max-w-lg" onClick={onPressLoadResults}>Load / Refresh Results</Button>

          <button
            className={`max-w-lg inline-block text-md text-white px-4 py-2 rounded-md cursor-pointer ${clicked ? 'animate-explode' : 'hover:shadow-lg animate-gradient'
              }`}
            onClick={handleClick}
            style={{
              background: 'linear-gradient(to right, #262626, #949435, #b72424)',
              border: 'none',
              color: 'white', // Adjusted text color to white
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)', // Increased shadow for more depth
              transform: 'translateY(0)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Added transition for hover effect
            }}
          >
            {clicked ? 'Processing...' : 'Process Results'}
          </button>

        </div>

        {data && <TableElectionResults data={data} />}
      </div>
    </div>
  )
}

export default ElectionResults;