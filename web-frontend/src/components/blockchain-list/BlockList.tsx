/* eslint-disable @typescript-eslint/no-explicit-any */
import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";

interface Block {
  id: number;
  hashBlock: string;
  size: number
}

function getData(start: number, count: number): Block[] {
  const blocks = [];
  for (let id = start; id <= count; id++) {
    const randomSize = Math.floor(Math.random() * 301); // Generates a random integer between 0 and 300 (inclusive)
    blocks.push({ id: id, hashBlock: '', size: randomSize });
  }
  return blocks;
}

const leftItem = () => {
  return <div className='justify-start' style={{ width: '40px', height: '2px', backgroundColor: '#999999' }} />
}

const middleItem = (id: number, hashBlock: string, blockSize: number) => {
  const maxSize: number = 300;
  const perc: number = blockSize !== null ? Math.min((blockSize * 100) / maxSize, 100) : 100;

  return (
    <div style={{
      width: '60px',
      height: '90px',
      flex: '1',
      padding: 4,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      border: '2px solid #999999',
      boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.1)',
      background: '#f9f9f9',
      borderRadius: '0.5rem', // Ensure this is applied correctly
    }}>
      <div className='flex flex-col' style={{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        background: 'linear-gradient(to left top, #FFFFFF, #a2d7f6)',
        boxShadow: 'inset 2px 2px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '0.4rem', // Ensure this is applied correctly
        overflow: 'hidden', // Add this to ensure border radius is applied correctly
      }}>
        <div className='flex' style={{
          flex: 1,
          justifyContent: 'center',
          background: 'linear-gradient(to left top, #FFFFFF, #a2d7f6)',
          alignItems: 'center',
        }} />
        <div className='flex' style={{
          height: `${perc}%`,
          backgroundColor: 'red',
          justifyContent: 'center',
          background: 'linear-gradient(to left top, #FFFFFF, #2EA8ED)',
          alignItems: 'center',
        }} />
      </div>

      <div>
        <Link to={`/blockchain/block-details/${hashBlock}`}>
          <span className='font-inria-sans text-sm text-gray-400 flex justify-center relative bottom-0' style={{paddingTop: '10px'}}>#{id}</span>
        </Link>
      </div>
    </div>


  );

  return <div style={{ width: '60px', height: '70px', flex: '1', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
    <div className='flex' style={{ width: '100%', height: '100%', borderRadius: '0.50rem', display: 'flex', justifyContent: 'center', background: 'linear-gradient(to left top, #FFFFFF, #2EA8ED', alignItems: 'center' }} />

    <Link to={`/blockchain/block-details/${hashBlock}`}>
      <span className='font-inria-sans text-sm text-gray-400 flex  justify-center relative bottom-0'>#{id}</span>
    </Link>
  </div>;
}

const rightItem = () => {
  return <div className='justify-end' style={{ width: '40px', height: '2px', backgroundColor: '#999999' }} />
}

const CardItem = ({ id, hashBlock, index, len, blockSize }: { id: number, hashBlock: string, index: number, len: number, blockSize: number }) => {
  //console.log("Size: ", blockSize);
  
  return (
    <div key={id} className='flex flex-col items-center gap-0.5'>
      <div className='flex flex-row items-center bg-yellow- h-full'>
        {leftItem()}
        {middleItem(id, hashBlock, blockSize)}
        {!(index + 1 < len) ? null : rightItem()}
      </div>
    </div>
  );
};

export default function BlockList() {
  const URI = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/blocks';

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['block-list'],
    queryFn: () =>
      fetch(URI).then((res) =>
        res.json(),
      ),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 10000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(intervalId);
  }, [refetch]);

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div className='flex'>
      <ul className='overflow-y-scroll no-scrollbar' style={{ display: 'flex', flexDirection: 'row', height: 'max', padding: 0, paddingBottom: 25, margin: 0, listStyle: 'none' }}>
        {data.concat(getData(data.length + 1, 100)).flat().map((item: any, index: number) => (
          <li key={item.id}>
            <CardItem id={item.id} hashBlock={item.hashBlock} index={index} len={data.length} blockSize={item.size} />
          </li>
        ))}
      </ul>
    </div>
  );
}