/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

import { Toaster } from '@/components/toast/toaster';
import { useToast } from "@/components/ui/use-toast"

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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from '@/components/ui/button';
import { GLOBAL_VARIABLES } from '@/global/globalVariables';
import axios from 'axios';
import { DatePickerWithRange } from '@/components/announcement/DateRangePicker';
import { DatePicker } from '@/components/announcement/DatePicker';
import { addDays } from 'date-fns';

interface ErrorHash {
  numCandidates: string,
  numVoters: string,
  resultDate: string,
  electionDuration: string,
}

interface Announcement {
  startTimeVoting: Date,
  endTimeVoting: Date,
  dateResults: Date,
  numOfCandidates: number,
  numOfVoters: number,
  dateCreated?: Date
}

function AnnounceElection() {
  const { authState, isLoggedIn } = useAuth();
  const { dateRange, setDateRange } = useAuth();
  const { toast } = useToast();

  // ==== FIELDS ====
  const [startTimeVoting, setStartTimeVoting] = useState<string>("");
  const [endTimeVoting, setEndTimeVoting] = useState<string>("");
  const [dateResults, setDateResults] = useState<Date>(new Date());

  const [numOfCandidates, setNumOfCandidates] = useState<number>(0);
  const [numOfVoters, setNumOfVoters] = useState<number>(0);
  const [dateCreated, setDateCreated] = useState<string>("");

  // ==== END FIELDS ====

  const [errors, setErrors] = useState<ErrorHash>({});

  const resetValues = () => {
    setStartTimeVoting("");
    setEndTimeVoting("");
    setDateResults(new Date());
    setNumOfCandidates(0);
    setNumOfVoters(0);
    setDateCreated("");

    setErrors({});
  }

  useEffect(() => {
    onPressLoadAnnouncement();
  }, []);

  const formValidation = () => {
    let errorHash: ErrorHash = {};

    if (!startTimeVoting || !endTimeVoting) errorHash.electionDuration = "Election duration required.";
    if (!dateResults.toLocaleString()) errorHash.resultDate = "Election result data required.";
    if (numOfVoters <= 0) errorHash.numVoters = "Number of voters required.";
    if (numOfCandidates <= 0) errorHash.numCandidates = "Number of candidates required.";

    setErrors(errorHash);
    return Object.keys(errorHash).length === 0;
  }

  useEffect(() => {
    setStartTimeVoting(dateRange?.from);
    setEndTimeVoting(dateRange?.to);
  }, [dateRange]);

  useEffect(() => {
    setDateResults(new Date());
    setNumOfCandidates(0);
    setNumOfVoters(0);
    setDateCreated("");
    setStartTimeVoting(dateRange?.from);
    setEndTimeVoting(dateRange?.to);
  }, []);

  const onPressLoadAnnouncement = async () => {
    await axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/announcement')
      .then(response => {
        const announcement = response.data.announcement;
        if (announcement) {
          setStartTimeVoting(announcement.startTimeVoting);
          setEndTimeVoting(announcement.endTimeVoting);
          setDateResults(announcement.dateResults);
          setDateCreated(announcement.dateCreated);
          setNumOfCandidates(announcement.numOfCandidates);
          setNumOfVoters(announcement.numOfVoters);

         setDateRange((prev) => ({
            ...prev,
            from: new Date(announcement.startTimeVoting),
            to: new Date(announcement.endTimeVoting)
          }));

        }
      })
      .catch(error => {
        //console.error(error)
      });
    }

  const onPressDeployAnnouncementBlockchain = async () => {
    if (formValidation()) {
      //resetValues();

      const URL = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/deploy-announcement';

      const body: Announcement = {
        startTimeVoting: dateRange?.from ?? new Date(2027, 4, 20),
        endTimeVoting: dateRange?.to ?? addDays(new Date(2027, 4, 20), 15),
        dateResults: new Date(dateResults),
        numOfCandidates: numOfCandidates,
        numOfVoters: numOfVoters,
      };

      const response = await axios.post(URL, body);
      const statusCode = response.status;

      if (statusCode === 201) {
        toast({
          title: "Feedback",
          description: "Success! Annoucement deployed."
        });

        return;
      }

      toast({
        title: "Feedback",
        description: "Error! Something went wrong."
      });

    } else {
      console.log("Failed to validate!");
    }
  }

  const onPressNotifyVoters = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/registers')
      .then(response => {
        const registers = response.data.registers;
        const receivers = registers.map((element: any, index: number) => ({
          id: index + 1,
          name: element.name,
          email: element.email,
        }));

        receivers.forEach((element): any => {
          const options = {
            email: element.email
          };

          axios.post(`http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/send-email`, options)
            .then(response => {
              if (response.status === 200) {
                const data = response.data;
                console.log("Success response:", data);
              }
            }).catch(error => {
              console.error(error)
            });
        });
      })
      .catch(error => {
        //console.error(error)
      });

    toast({
      title: "Feedback",
      description: "Annoucements sent to the citzens.",
    });
  }

  const openDialog = () => {
    return <AlertDialog>
      <AlertDialogTrigger>
        <span className="max-w-lg inline-block text-md bg-green-900 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800">Deploy to Blockchain</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently erase all data stored in the smart-contract and register the new data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onPressDeployAnnouncementBlockchain}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  }

  return (
    <div className='flex gap-2 flex-col '>
      <span className='font-inria-sans text-2xl text-gray-600'>Announce Election</span>

      <Toaster />

      <div className='md:items-center md:gap-2 w-full bg-red h-screen'>

        <div className='flex flex-col w-auto h-auto'>
          <div className="flex flex-col w-full flex-grow items-center justify-center p-0">

            <div className="flex flex-1 gap-2 justify-between py-4 w-[400px]">
              <Button className="max-w-lg" onClick={onPressLoadAnnouncement}>Load Announcement</Button>
              <Button className="max-w-lg" onClick={onPressNotifyVoters}>Notify all voters by e-mail</Button>
            </div>

            <form>
              <Card className="w-[400px]">

                <CardHeader>
                  <CardTitle>Announcement</CardTitle>
                  <CardDescription>
                    Set the election details here.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">

                  <div className="space-y-1">
                    <Label htmlFor="num-candidates">Number of candidates</Label>
                    <Input id="num-candidates" type="number" value={numOfCandidates} autoComplete="shipping current-password webauthn"
                      onChange={event => setNumOfCandidates(parseInt(event.target.value))}
                    />
                  </div>
                  {errors.numCandidates ? <div style={styles.errorText}>{errors.numCandidates}</div> : null}

                  <div className="space-y-1">
                    <Label htmlFor="num-candidates">Number of voters</Label>
                    <Input id="num-voters" type="number" value={numOfVoters} autoComplete="shipping current-password webauthn"
                      onChange={event => setNumOfVoters(parseInt(event.target.value))}
                    />
                  </div>
                  {errors.numVoters ? <div style={styles.errorText}>{errors.numVoters}</div> : null}

                  <div className="space-y-1">
                    <Label>Results date</Label>
                    <DatePicker date={dateResults} setDate={setDateResults} />
                  </div>
                  {errors.resultDate ? <div style={styles.errorText}>{errors.resultDate}</div> : null}

                  <div className="space-y-1">
                    <Label>Election duration</Label>
                    <DatePickerWithRange />
                  </div>
                  {errors.electionDuration ? <div style={styles.errorText}>{errors.electionDuration}</div> : null}

                </CardContent>
                <CardFooter className="flex justify-center">
                  {openDialog()}
                </CardFooter>
              </Card>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  errorText: {
    color: 'red',
    marginBottom: 5,
  }
};

export default AnnounceElection;