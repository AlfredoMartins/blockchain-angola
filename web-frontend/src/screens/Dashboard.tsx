/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleMap from '@/geomap/GoogleMap';
import CircularProgress from '@mui/joy/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaUserClock } from "react-icons/fa";
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext';
import { GLOBAL_VARIABLES } from '@/global/globalVariables';

import VerticalBars from '@/components/dashboard-components/vertical-bar';
import LineChartDemo from '@/components/dashboard-components/line-chart';
import { Results } from '@/data_types';

const themeLinearProgressBar = createTheme({
  palette: {
    primary: {
      light: '#DDD2D4',
      main: '#DE0031',
      dark: '#DE0031',
    },
  },
});

function Dashboard() {
  const value2: number = 10;

  const { setMapData, setPartiesData, provinces, topVotesPerProvinces, setTopVotesPerProvinces } = useAuth();
  const [data, setData] = useState<any[]>();
  const [percentage, setPercentage] = useState<number>();

  const { imageList } = useAuth();

  const [dataResults, setDataResults] = useState<Results>({
    totalVotesReceived: 0,
    averageTimePerVote: 0,
    averageVotePerProvince: 0,
    candidatesResult: [],
    endTime: 0,
    startTime: 0,
    expectedTotalVotes: 0,
    totalCandidates: 0,
    votesPerDay: 0,
    votesPerParty: 0,
    votesPerProvince: 0,
    winner: {
      code: 0,
      name: '',
      acronym: '',
      party: '',
      status: '',
      toast: function (...params: any[]): void {
        throw new Error('Function not implemented.');
      }
    }
  });

  useEffect(() => {
    onPressLoadResultsComputed();
  }, []);

  const onPressLoadResultsComputed = async () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/get-results-computed')
      .then(response => {
        const results = response.data;

        if (results !== undefined && results.candidatesResult) {
            let newDataCandidates = results.candidatesResult.map((x: any, index: any) => {
              const candidateName = x.candidate.name.toLowerCase().split(' ').join('.');
              const partyName = x.candidate.party.toLowerCase().split(' ').join('.');

              return ({
                id: index + 1,
                numVotes: x.numVotes.toString(),
                percentage: x.percentage.toString(),
                party: x.candidate.party,
                acronym: x.candidate.acronym,
                candidate: x.candidate.name,
                candidatePhoto: imageList ? imageList[candidateName] ?? '' : '',
                partyImage: imageList ? imageList[partyName] ?? '' : ''
              });
            });

            newDataCandidates = newDataCandidates.sort((a, b) => b.percentage - a.percentage);

            setData(newDataCandidates);

            const newParties = results.candidatesResult.map((x: any) => (x.candidate.party));

            const total_expected: number = results.expectedTotalVotes;
            const total_received: number = results.totalVotesReceived;
            let perc: number = (total_received * 100) / total_expected;
            perc = Number(perc.toFixed(2));

            setPercentage(perc);

            setDataResults(results);
            setMapData(results.votesPerProvince);
            setPartiesData(newParties);

            let newsTopVotesPerProvinces = provinces.map((x: any, index: any) => ({
              id: index + 1,
              province: x,
              percentage: (100 * results.votesPerProvince[x]['sum']) / parseInt(results.totalVotesReceived),
              number: `${results.votesPerProvince[x]['sum']}K`
            }))

            newsTopVotesPerProvinces = newsTopVotesPerProvinces.sort((a, b) => b.percentage - a.percentage);

            setTopVotesPerProvinces(newsTopVotesPerProvinces);
        }
      }).catch(error => { });
  }

  const iconStyle = "w-100 h-100 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white";

  if (!dataResults || !percentage) {
    return (
      <div>
        Loading ...
      </div>
    )
  }

  return (
    <div className='flex h-full w-full'>
      <div className='grid grid-cols-4 gap-3'>
        <div className='flex flex-col gap-3 col-span-1'>
          <div className='bg-white rounded-xl p-5'>
            <span className='font-inria-sans text-xl text-gray-400'>Votes Received</span>
            <div className="flex items-center justify-between gap-2 pt-2">
              <CircularProgress size="lg" color="danger" variant="solid" determinate value={value2 as number}>
                <span className='text-xs text-gray-400'>{percentage}%</span>
              </CircularProgress>
              {dataResults?.totalVotesReceived && <span className='text-4xl text-gray-400'>{100 - percentage}%</span>}
            </div>
            <div className='pt-2'>
              {dataResults?.totalVotesReceived && <span className='text-gray-400'>{dataResults?.totalVotesReceived} Votes</span>}
            </div>
          </div>

          <div className='bg-white flex flex-row gap-2 rounded-xl p-4 justify-between'>
            <div className='flex flex-col justify-center items-center' >
              <span className='font-inria-sans text-xl text-gray-400'>Total voters</span>
              {dataResults?.totalCandidates && <span className='text-xl text-gray-400'>{dataResults?.expectedTotalVotes} M</span>}
            </div>
            <div className='flex flex-col justify-center items-center'>
              <span className='font-inria-sans text-xl text-gray-400'>Total Candidates</span>
              {dataResults?.totalCandidates && <span className='text-xl text-gray-400'>{dataResults?.candidatesResult.length}</span>}
            </div>
          </div>

          <div className='bg-whtie flex flex-col bg-white gap-2 rounded-xl p-4'>
            <span className='font-inria-sans text-xl text-gray-400'>Top Party</span>

            <div className='gap-1'>

              {data && data.slice(0, 5).map(party => (
                <div key={party.party} className="grid grid-cols-3 sm:grid-cols-3 gap-3 p-0.5">
                  <div className="col-span-1">
                    <img src={party.partyImage ?? ''} alt={party.name} width="32" height="32" />
                  </div>
                  <div className="col-span-1">
                    <span className="font-inria-sans text-sm">{party.acronym}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="font-inria-sans text-sm">{party.numVotes} K votes</span>
                  </div>
                </div>

              ))}

            </div>

          </div>

          <div className='bg-white flex flex-col gap-5 rounded-xl p-4'>
            <span className='font-inria-sans text-xl text-gray-400'>Top votes by province</span>

            <div className='flex flex-col gap-2 justify-start'>
              {topVotesPerProvinces && topVotesPerProvinces.slice(0, 5).map((provinceData: any) => (
                <div className='grid grid-cols-6 items-center gap-2' key={provinceData.province}>
                  <span className='flex justify-end col-span-2 font-inria-sans text-sm'>{provinceData.province}</span>
                  <div className='col-span-3'>
                    <ThemeProvider theme={themeLinearProgressBar}>
                      <Stack sx={{ width: '100%' }} spacing={2}>
                        <LinearProgress
                          variant="determinate"
                          value={provinceData.percentage}
                          sx={{
                            height: 25,
                            borderRadius: 1
                          }}
                        />
                      </Stack>
                    </ThemeProvider>
                  </div>
                  <span className='flex justify-start'>{provinceData.number}</span>
                </div>
              ))}
            </div>


          </div>
          <div className='grid grid-cols-2 bg-white gap-2 rounded-xl p-4 justify-between'>

            <div className='grid grid-row-2 gap-2'>
              <div className='flex flex-col'>
                <span className='font-inria-sans text-xl text-gray-400'>Average time</span>
                {dataResults.averageTimePerVote && <span className='font-inria-sans text-sm text-gray-400'>{Number(dataResults.averageTimePerVote.toFixed(2))} min / vote</span>}
              </div>

              <div className='flex flex-col'>
                <span className='font-inria-sans text-xl text-gray-400'>Average vote</span>
                {dataResults.averageVotePerProvince && <span className='font-inria-sans text-sm text-gray-400'>{Number(dataResults.averageVotePerProvince.toFixed(2))}  votes / prov.</span>}
              </div>
            </div>

            <div className='flex justify-center items-center '>
              <FaUserClock className={iconStyle} size={100} />
            </div>
          </div>
        </div>

        <div className='col-span-3'>
          <div className='h-max'>
            <div className='grid grid-cols-5 gap-2'>
              <div className='col-span-2 bg-white rounded-xl p-5'>
                <div className='flex flex-col '>
                  <span className='font-inria-sans text-xl text-gray-400'>Daily increment in vote</span>
                  <span className='font-inria-sans text-sm text-gray-300'>Last day x Today</span>
                </div>
                <div>
                  <LineChartDemo />
                </div>
              </div>
              <div className='col-span-3 bg-white rounded-xl pl-4 pr-4 pt-4'>
                <span className='font-inria-sans text-xl text-gray-400'>Statistics</span>

                <VerticalBars />

              </div>
            </div>

            <div className='cols-span-3 flex-col rounded-xl p-4 mt-3 flex-1'>
              <span className='font-inria-sans text-xl text-gray-400'>Coverage Region</span>
              <div className='items-center justify-center'>
                {dataResults.votesPerProvince && <GoogleMap />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;