/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import TableCandidates from '@/tables/candidates_table/page';
import { useToast } from '@/components/toast/use-toast';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { GLOBAL_VARIABLES } from "@/global/globalVariables";

import axios from "axios";

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
import { useAuth } from '@/context/AuthContext';
import { CandidadeModal } from '@/tables/candidates_table/operation-candidate';
import { Toaster } from '@/components/toast/toaster';
import { Candidate } from '@/data_types';

function Candidates() {
  const { toast } = useToast();
  const [data, setData] = useState<Candidate[]>([]);
  const [editCandidate, setEditCandidate] = useState<Candidate>({});
  const { imageList, setImageList, updateImages } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    onPressLoadCandidates();
  }, []);

  const onPressLoadCandidates = () => {
    if (!imageList) return;

    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/candidates')
      .then(response => {
        const candidates = response.data.candidates;
        if (candidates) {
          const newData = candidates.map((element: any, index: number) => {

            const candidatePhotoName = element.name.toLowerCase().split(' ').join('.');
            const partyPhotoName = element.party.toLowerCase().split(' ').join('.');
            
            return ({
              id: index + 1,
              code: element.code.toString(),
              name: element.name,
              party: element.party,
              acronym: element.acronym,
              candidadePhoto: imageList[candidatePhotoName] ?? 'default',
              partyImage: imageList[partyPhotoName] ?? 'default',
              status: element.status,
              toast: toast,
              editCandidate: editCandidate,
              setEditCandidate: setEditCandidate
            })
          });

          setData(newData);
        }
      })
      .catch(error => { });
  }

  const onPressLoadCandidatesNotDeployed = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/candidates')
      .then(response => {
        const candidates = response.data.candidates;
        if (candidates) {
          const newData = candidates.map((element: any, index: number) => {

            const candidatePhotoName = element.name.toLowerCase().split(' ').join('.');
            const partyPhotoName = element.party.toLowerCase().split(' ').join('.');

            return ({
              id: index + 1,
              code: element.code.toString(),
              name: element.name,
              party: element.party,
              acronym: element.acronym,
              candidadePhoto: imageList[candidatePhotoName],
              partyImage: imageList[partyPhotoName],
              status: element.status,
              toast: toast,
              editCandidate: editCandidate,
              setEditCandidate: setEditCandidate
            })
          });

          setData(newData);
        }
      })
      .catch(error => { });
  }

  const onPressDeployBlockchain = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/deploy-candidates')
      .then(response => {
        const candidates = response.data.candidates;
        if (candidates) {
          const newData = candidates.map((element: any, index: number) => {

            const candidatePhotoName = element.name.toLowerCase().split(' ').join('.');
            const partyPhotoName = element.party.toLowerCase().split(' ').join('.');

            return ({
              id: index + 1,
              code: element.code,
              name: element.name,
              party: element.party,
              acronym: element.acronym,
              candidadePhoto: imageList[candidatePhotoName],
              partyImage: imageList[partyPhotoName],
              status: element.status,
              toast: toast,
              editCandidate: editCandidate,
              setEditCandidate: setEditCandidate
            })
          });

          setData(newData);

          toast({
            title: "Feedback",
            description: "Success! Data deployed successfully ..."
          });
        }
      })
      .catch(error => {
        toast({
          title: "Feedback",
          description: "Error! Something went wrong."
        });
      });
  }

  const onPressDeleteFromBlockchain = () => {
    axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/clear-candidates')
      .then(response => {
        const candidates = response.data.candidates;
        if (candidates) {
          const newData: Candidate[] = [];
          setData([...newData]);

          toast({
            title: "Feedback",
            description: "Success! Data deployed successfully ..."
          });
        }
      })
      .catch(error => {
        toast({
          title: "Feedback",
          description: "Error! Something went wrong."
        });
      });
  }

  const openDialogDeploy = () => {
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
          <AlertDialogAction onClick={onPressDeployBlockchain}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  }

  const openDialogDelete = () => {
    return <AlertDialog>
      <AlertDialogTrigger>
        <span className="max-w-lg inline-block text-md bg-red-900 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800">Delete from Blockchain</span>
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
          <AlertDialogAction onClick={onPressDeleteFromBlockchain}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  }

  return (
    <div className='flex gap-2 flex-col '>
      <span className='font-inria-sans text-2xl text-gray-400'>Candidates</span>
      <Toaster />
      <div className='md:items-center md:gap-2 w-full bg-red h-screen'>
        <div className="flex flex-col md:flex-row gap-2 py-4">
          <CandidadeModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} setData={setData} toast={toast} defaultValues={null} mode={true} />

          <div className="flex flex-col md:flex-row gap-2">
            <Button className="max-w-lg md:w-auto" onClick={() => {
              setIsAddModalOpen(true);
            }}>Add Candidate</Button>

            <Button className="max-w-lg md:w-auto" onClick={() => {
              updateImages();
              onPressLoadCandidates();
            }}>Load Candidates</Button>
            <Button className="max-w-lg md:w-auto" onClick={onPressLoadCandidatesNotDeployed}>Load Candidates [Not Deployed]</Button>
          </div>

          {openDialogDeploy()}
          {openDialogDelete()}
        </div>
        <TableCandidates data={data} setData={setData} toast={toast} />
      </div>
    </div>
  )
}

export default Candidates;