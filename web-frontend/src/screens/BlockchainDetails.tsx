/* eslint-disable @typescript-eslint/no-explicit-any */
import BlockList from '@/components/blockchain-list/BlockList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JsonEditor from '@/components/json-editor/JsonEditor';
import EditorRaw from '@/components/json-editor/EditorRaw';
import { useParams } from 'react-router-dom';
import { GLOBAL_VARIABLES } from '@/global/globalVariables';
import { useQuery } from '@tanstack/react-query';
import TableTransactionsBlockDetails from '@/tables/transactions_block_details/page';
import { BlockCopyButton } from '@/components/ui/block-copy-button';
import { useEffect, useState } from 'react';

interface BlockDetailsData {
    // Define the structure of data fetched from API
    blockHeader: {
        version: string;
        blockHash: string;
        previousBlockHash: string;
        merkleRoot: string;
        nonce: number;
        difficultyTarget: number;
        timestamp: number
        // Define other properties here
    };
    blockSize: number;
    transactionCounter: number;
    // Define other properties here
}

function BlockchainDetails() {
    const { id } = useParams();
    const [blockHash, setBlockHash] = useState("");

    const URI = 'http://' + GLOBAL_VARIABLES.LOCALHOST + `/api/blockchain/block-detail/${blockHash}`;
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['block-details'],
        queryFn: () =>
            fetch(URI).then((res) =>
                res.json(),
            ),
    });

    const [blockHeader, setBlockHeader] = useState<BlockDetailsData['blockHeader'] | null>(null);
    const [blockSize, setBlockSize] = useState<number | null>(0);
    const [blockIndex, setBlockIndex] = useState<number | null>(0);
    const [transactionCounter, setTransactionCounter] = useState<number | null>(0);

    useEffect(() => {
        if (data) {
            handleRefresh();
        }
    }, [data]);

    const handleRefresh = () => {
        setBlockHeader(data.blockHeader);
        setBlockSize(data.blockSize);
        setBlockIndex(data.blockIndex);
        setTransactionCounter(data.transactionCounter);
    }

    useEffect(() => {
        console.log("ID changed ...");
        setBlockHash(id ?? '');
        refetch();
    }, [id]);

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    const blockItem = () => {
        const maxSize: number = 300;
        const perc: number = blockSize !== null ? Math.min((blockSize * 100) / maxSize, 100) : 100;

        return (
            <div style={{ width: '160px', height: '100%', flex: '1', flexDirection: 'column', justifyContent: 'center', borderRadius: '0.50rem', alignItems: 'center', alignSelf: 'center', overflow: 'hidden' }}>
                <div className='flex flex-col' style={{ width: '100%', height: '100%', backgroundColor: 'red', justifyContent: 'center', background: 'linear-gradient(to left top, #FFFFFF, #a2d7f6)' }}>
                    <div className='flex' style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', background: 'linear-gradient(to left top, #FFFFFF, #a2d7f6)', alignItems: 'center' }} />
                    <div className='flex' style={{ height: `${perc}%`, backgroundColor: 'red', justifyContent: 'center', background: 'linear-gradient(to left top, #FFFFFF, #2EA8ED)', alignItems: 'center' }} />
                </div>
            </div>
        );

    }

    const getDate = (str: string) => {
        const x: number = parseInt(str);
        return new Date(x).toUTCString();
    }

    const itemStyle = "flex flex-col text-sm font-inria-sans text-gray-600 break-all";

    return (
        <div className='flex gap-2 flex-col '>
            <span className='font-inria-sans text-2xl text-gray-400'>Blockchain</span>
            <div className='flex flex-col gap-1'>
                <span className='font-inria-sans text-md text-gray-400'>Blockchain</span>
                <BlockList />
            </div>

            <div className='grid gap-2 '>
                <div className='flex flex-col'>
                    <span className='font-inria-sans text-md text-gray-400'>Block details</span>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-5 pl-3'>
                    <div className='flex flex-col gap-2 col-span-4'>
                        <div className='flex flex-row gap-3'>
                            <div>
                                {
                                    blockItem()
                                }
                            </div>

                            <div className='flex flex-col'>
                                <div>
                                    <span className='font-inria-sans text-sm text-gray-400'>Broadcasted on 06 Apr 2027 12:19:08 GMT+2</span>
                                </div>

                                <div className='flex flex-col gap-1'>

                                    <div className='grid grid-cols-3 gap-2'>
                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Version:</span>
                                            <span className=''>{blockHeader?.version}</span>
                                        </div>

                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Hash Block:</span>
                                            <div className='flex flex-row justify-center gap-2'>
                                                <span className=''>{blockHeader?.blockHash}</span>

                                                <BlockCopyButton
                                                    event="copy_chunk_code"
                                                    name={blockHeader?.blockHash ?? ''}
                                                    code={blockHeader?.blockHash ?? ''}
                                                    size="icon"
                                                />
                                            </div>
                                        </div>

                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Previous BlockHash:</span>
                                            <span className=''>{blockHeader?.previousBlockHash}</span>
                                        </div>

                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Merkle Root:</span>
                                            <div className='flex flex-row justify-center gap-2'>
                                                <span className=''>{blockHeader?.merkleRoot}</span>

                                                <BlockCopyButton
                                                    event="copy_chunk_code"
                                                    name={blockHeader?.merkleRoot ?? ''}
                                                    code={blockHeader?.merkleRoot ?? ''}
                                                    size="icon"
                                                />
                                            </div>
                                        </div>


                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Timestamp:</span>
                                            <div>
                                                <span className='break-all'>{getDate(blockHeader?.timestamp.toString() ?? '')}</span>
                                            </div>
                                        </div>


                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Difficulty Target:</span>
                                            <span className=''>{blockHeader?.difficultyTarget}</span>
                                        </div>


                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Nonce:</span>
                                            <span className=''>{blockHeader?.nonce}</span>
                                        </div>


                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Block Index:</span>
                                            <span className=''>{blockIndex}</span>
                                        </div>


                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Block Size:</span>
                                            <span className=''>{blockSize} bytes</span>
                                        </div>


                                        <div className={itemStyle}>
                                            <span className='font-inria-sans text-sm text-gray-400'>Transaction Counter:</span>
                                            <span className=''>{transactionCounter}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div>
                            <span className='font-inria-sans text-md text-gray-400'>Transactions</span>
                            <TableTransactionsBlockDetails detail={data} />
                        </div>
                    </div>

                    <div className='flex flex-col col-span-3'>
                        <span className='font-bold font-inria-sans text-lg text-gray-400'>JSON</span>
                        <div>
                            <Tabs defaultValue="pretty" className="w-[500px]">
                                <TabsList>
                                    <TabsTrigger value="pretty">Pretty</TabsTrigger>
                                    <TabsTrigger value="raw">Raw</TabsTrigger>
                                </TabsList>
                                <TabsContent value="pretty">
                                    <JsonEditor data={data} />
                                </TabsContent>
                                <TabsContent value="raw">
                                    <EditorRaw data={data} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BlockchainDetails;
