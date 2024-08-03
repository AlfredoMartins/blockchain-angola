/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

import CardCandidates from '@/components/card-candidates/page';
import SoundButton from '@/tables/election_results_table/SoundButton';
import { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { GLOBAL_VARIABLES, TOKEN_KEY } from '@/global/globalVariables';
import axios from 'axios';
import '../style.css';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { getItemAsync } from '@/context/SecureStore';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Howl } from 'howler';
import { GiSoundWaves } from "react-icons/gi";

import speech from '@/sounds/speech.mp3';
import Waveform from '@/tables/election_results_table/Waveform';
import textToSpeech from '@/services/textToSpeech';
import { UltimateSpeech } from '@/services/speeches';
import { CandidateResults, Results } from '@/data_types';
import TableElectionResultsPublic from '@/tables/election_results_table/page-public';

const soundSpeech = new Howl({
  src: [speech],
  autoplay: false,
  loop: false,
  volume: 1,
  onend: function () {
    // console.log('Finished!');
  }
});

function PublicAnnouncement() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const [animationStyle, setAnimationStyle] = useState<string>("");
  const { imageList } = useAuth();

  useEffect(() => {
    onPressLoadResultsComputed();
  }, []);

  const [data, setData] = useState<CandidateResults[]>();
  const [results, setResults] = useState<Results>();

  const onPressLoadResultsComputed = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/get-results-computed')
      .then(response => {
        const results = response.data;

        if (results !== undefined && results.candidatesResult) {
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
            
            console.log("data: ", results);

            newData.sort((a: any, b: any) => b.percentage - a.percentage);

            newData = newData.map((x: any, index: any) => {
              return {
                ...x,
                id: index + 1
              };
            });

            setData([...newData]);
            setResults(results);
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

        if (results !== undefined && results.candidatesResult) {
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
          setResults(results);
        }
      })
      .catch(_ => 0);
  }

  const [clicked, setClicked] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter >= 100) {
      setClicked(false);
      onPressLoadResults();
      setAnimationStyle("bright glow");
    }
  }, [counter, onPressLoadResults]);

  const handleClick = () => {
    setClicked(true);
    setCounter(0);
    setAnimationStyle("");

    setInterval(() => {
      if (counter < 100) {
        setCounter(x => Math.min(x + Math.floor((Math.random() * 50) + 5), 100));
      } else {
        return;
      }
    }, 1000);
  };

  const onClearResults = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/clear-results')
      .then(response => {
        const results = response.data;

        if (results !== undefined) {
          toast({
            title: "Feedback",
            description: "Success! Computed results erased ..."
          });

          setResults(null);
        }
      })
      .catch(error => console.error(error));
  }

  const onGenerateSpeech = async () => {
    try {
      if (results) {
        await UltimateSpeech(results);
        toast({
          title: "Feedback",
          description: "Success! New speech has been generated. Please play It ..."
        });
        // await textToSpeech();
      }
    } catch (e) { console.log(e); }
  };

  const onPlaySpeech = () => {
    if (!isPlaying) {
      soundSpeech.play();
      setIsPlaying(true);
    } else {
      soundSpeech.pause();
      setIsPlaying(false);
    }
  }

  const openDialogPlaySpeech = () => {
    return <AlertDialog>
      <AlertDialogTrigger>
        <div className='flex items-center bg-gray-200 p-2 pl-3 pr-3 rounded-sm hover:bg-gray-300'>
          <div>
            <GiSoundWaves color='#6B7280' />
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will generate a speech based on the current election's result and be charged about $1. Please, double check your action!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className=''>
          <div className='flex flex-col w-full gap-2'>
            <div className='flex flex-row gap-2 justify-between'>
              <AlertDialogCancel className='w-full'>Cancel</AlertDialogCancel>
              <AlertDialogAction className='w-full' onClick={onPlaySpeech}>Play Old Speech</AlertDialogAction>
            </div>
            <div className='flex items-center justify-center'>
              <AlertDialogAction className='bg-red-800 w-auto' onClick={onGenerateSpeech}>
                Generate and Play New Speech
              </AlertDialogAction>
            </div>

          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  }

  return (
    <div className='flex gap-2 flex-col h-full'>
      <span className='font-inria-sans text-2xl text-gray-400'>Election Public Announcement</span>
      <div className='md:items-center md:gap-2 md:flex-col w-full bg-red h-screen'>
        <div className='flex justify-between mb-1'>
          <span className='font-inria-sans text-xl text-gray-400'>2027 Election Results</span>
          <div className='flex gap-10 items-center'>
            <SoundButton type="on" />
            <SoundButton type="off" />
            {openDialogPlaySpeech()}
          </div>

        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 xl:grid-cols-7 2xl:grid-cols-7 gap-3'>

          <div className='col-span-3 flex flex-col gap-5 md:flex-col '>
            <div className='flex flex-col md:gap-2 w-full bg-red gap-2 '>
              <div className="flex flex-row gap-2 py-1 sm:flex-row md:flex-row">

                <Button className="max-w-lg " onClick={onClearResults} >Dump</Button>

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

              {data && <TableElectionResultsPublic data={data} />}
            </div>
            <div className='grid grid-cols-2 h-full'>
              <div className='flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 items-center justify-center'>
                <span className='font-inria-sans text-base sm:text-lg md:text-xl lg:text-2xl text-gray-500'>Progress</span>
                <span className='font-bold font-inria-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-600'>{counter}%</span>
              </div>
              <div className='p-l'>
                <Waveform audio={speech} isPlaying={isPlaying} setIsPlaying={setIsPlaying} soundSpeech={soundSpeech} />
              </div>
            </div>

          </div>

          <div className='col-span-4'>
            {data && data.length >= 2 && <CardCandidates data={data} animationStyle={animationStyle} />}
            {!data && <span>Loading ...</span>}
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  )
}

export default PublicAnnouncement;