/* eslint-disable @typescript-eslint/no-unused-vars */
import BlockList from '@/components/blockchain-list/BlockList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import LineChartCustomized from '@/tables/blocks_table/LineChartCustomized';
import TableBlocks from '@/tables/blocks_table/page';
import TablePendingTransactions from '@/tables/pending_transactions_table/page';
import TableTransactions from '@/tables/transactions_table/page';
import axios from 'axios';
import { useState } from 'react';

function Blockchain() {
  const { toast } = useToast();
  const [range, setRange] = useState<string>("3010-3010");
  const [start, setStart] = useState<number>(3010);
  const [end, setEnd] = useState<number>(3010);

  const createListRange = (start: number, finish: number) => {
    return Array.from({ length: finish - start + 1 }, (_, i) => start + i);
  }

  const getRange = () => {
    if (range.length == 0) return false;

    const array = range.trim().split('-');

    if (array.length >= 1) {
      setStart(parseInt(array[0]));
      if (array.length >= 2) setEnd(parseInt(array[1]));
      else setEnd(parseInt(array[0]));

      return true;
    }

    if (end < start) {
      return false;
    }

    if ((end - start) >= 18) {
      return false;
    }

    return true;
  }

  const onPressMineBlocks = () => {
    if (!getRange()) return false;

    const nodeAddress = createListRange(start, end);

    const requests = nodeAddress.map(url => {
      const URI = 'http://localhost:' + url + '/api/blockchain/mine'; // + endpoint
      return axios.get(URI);
    });

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    // Set up an interceptor to check for network errors
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.code === 'ERR_NETWORK') {
          source.cancel('Request canceled due to network error');
        }
        return Promise.reject(error);
      }
    );

    Promise.allSettled(requests)
      .then(results => {
        if (results) {
          const res = results.filter(result => result.status === 'fulfilled' && result.value.status === 200);
          if (res) {
            if (res.length > 0) {
              toast({
                title: "Feedback",
                description: "Success! Block mined successfully ..."
              });
            } else {
              toast({
                title: "Feedback",
                description: "Success, however, there was no block to mine unfortunately ..."
              });
            }
          } else {
            toast({
              title: "Feedback",
              description: "Error! Something went wrong."
            });
          }
        }
      }).catch(_ => { });
  }

  return (
    <div className='flex flex-col gap-2'>
      <Toaster />

      <span className='font-inria-sans text-2xl text-gray-400'>Blockchain</span>

      <div className='flex flex-col gap-1'>
        <span className='font-inria-sans text-md text-gray-400'>Blockchain</span>
        <BlockList />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div>

          <div className='flex flex-col'>
            <div className='flex flex-col'>
              <span className='font-inria-sans text-md text-gray-400'>Blocks</span>
              <TableBlocks />
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='flex flex-col'>
              <span className='font-inria-sans text-md text-gray-400'>Block time</span>
              <LineChartCustomized />
            </div>
          </div>
        </div>

        <div>
          <div className='flex flex-col sm:col-span-2 gap-2'>
            <div className='flex flex-col'>
              <span className='font-inria-sans text-md text-gray-400'>Transactions</span>
              <TableTransactions />
            </div>

            <div className='flex flex-col'>

              <div className='flex flex-col items-center md:flex-row justify-between'>
                <span className='font-inria-sans text-md text-gray-400'>Pending Transactions</span>

                <div className='flex flex-row items-center gap-2'>
                  <Input
                    value={range}
                    className="col-span-3"
                    onChange={event => setRange(event.target.value)}
                  />
                  <Button
                    className="max-w-xs inline-block text-xs bg-green-900 text-white px-2 py-1 m-1 rounded-md cursor-pointer hover:bg-gray-800"
                    onClick={onPressMineBlocks}
                  >
                    Mine Block
                  </Button>
                </div>
              </div>

              <TablePendingTransactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blockchain;
