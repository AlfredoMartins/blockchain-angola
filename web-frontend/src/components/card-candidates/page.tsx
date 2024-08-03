import BottomBackgroundCandidateYellow from '../../assets/candidates/bottom_background_candidates_yellow.svg';
import BottomBackgroundCandidateRed from '../../assets/candidates/bottom_background_candidates_red.svg';
import BottomBackgroundCandidateBlack from '../../assets/candidates/bottom_background_candidates_black.svg';
import TopCountryBackground from '../../assets/candidates/topCountryBackground.svg';
import bottomCountryBackground from '../../assets/candidates/bottomCountryBackground.svg';
import "./style.scss";
import { CandidateResults } from '@/data_types';
import defaultPhoto from '@/assets/candidates/candidateImage.png';

type CardResultProps = {
    data: CandidateResults[],
    animationStyle: string
}

export default function CardCandidates({data, animationStyle}: CardResultProps) {
    const dataOther = data.slice(2);
    const backgroundColor = "#515151";

    const otherCandidates = (item: CandidateResults) => {
        return <div key={item.id} className="">
            <div className="flex flex-col bg-white relative h-max">
                <div className="p-3" style={{ backgroundColor: backgroundColor, width: '100', height: '100%' }}>
                    <img src={TopCountryBackground} alt="TopBackground" />
                </div>

                <div style={{ width: '100', height: '100%' }}>
                    <img src={BottomBackgroundCandidateBlack} alt="BottomBackground" />
                </div>

                <img
                    src={item.candidadePhoto ?? defaultPhoto}
                    alt="Foreground"
                    style={{
                        maxWidth: '65%',
                        height: 'auto',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1
                    }}
                />
            </div>

            <div className="flex flex-row mt-0.5" style={{ backgroundColor: '#515151' }}>
                <div className="flex items-center ml-6 bg-white p-2">
                    <span className="font-bold justify-center items-center" style={{ color: '#515151', fontSize: '1.3rem' }}>{item.percentage}%</span>
                </div>

                <div className="ml-2.5 flex flex-col justify-start">
                    <span className="font-bold" style={{ fontSize: '1rem', color: '#FBFAFA' }}>{item.candidate}</span>
                    <span className="font-bold justify-start" style={{ fontSize: '0.6rem', color: '#FBFAFA' }}>{item.numVotes}</span>
                </div>
            </div>
        </div>
    };

    return (
        <div className="flex flex-col gap-2 bg-red">
            <div className="bg-white">
                <div className="grid grid-cols-2 gap-2">

                <div className={animationStyle} >
                        <div className="flex flex-col bg-white relative">
                            <div className="p-3" style={{ backgroundColor: backgroundColor }}>
                                <img src={TopCountryBackground} alt="TopBackground" />
                            </div>

                            <div>
                                <img src={BottomBackgroundCandidateRed} alt="BottomBackground" />
                            </div>

                            <img
                                src={data[0].candidadePhoto ?? defaultPhoto}
                                alt="Foreground"
                                style={{
                                    maxWidth: '65%',
                                    height: 'auto',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1
                                }}
                            />
                        </div>

                        <div className="flex flex-row mt-0.5" style={{ backgroundColor: '#DF2E2D' }}>
                            <div className="flex items-center ml-6 bg-white p-2">
                                <span className="font-bold justify-center items-center" style={{ color: '#CE2524', fontSize: '1.5rem' }}>{data[0].percentage}%</span>
                            </div>

                            <div className="ml-2.5 flex flex-col justify-start">
                                <span className="font-bold" style={{ fontSize: '1.6rem', color: '#FBFAFA' }}>{data[0].candidate}</span>
                                <span className="font-bold justify-start" style={{ fontSize: '1.2rem', color: '#FBFAFA' }}>{data[0].numVotes}</span>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <div className="flex flex-col bg-white relative">
                            <div className="p-3" style={{ backgroundColor: backgroundColor }}>
                                <img src={TopCountryBackground} alt="TopBackground" />
                            </div>

                            <div>
                                <img src={BottomBackgroundCandidateYellow} alt="BottomBackground" />
                            </div>

                            <img
                                src={data[1].candidadePhoto ?? defaultPhoto}
                                alt="Foreground"
                                style={{
                                    maxWidth: '65%',
                                    height: 'auto',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1
                                }}
                            />
                        </div>

                        <div className="flex flex-row mt-0.5" style={{ backgroundColor: '#F4E16C' }}>
                            <div className="flex items-center ml-6 bg-white p-2">
                                <span className="font-bold justify-center items-center" style={{ color: '#E9D766', fontSize: '1.5rem' }}>{data[1].percentage}%</span>
                            </div>

                            <div className="ml-2.5 flex flex-col justify-start">
                                <span className="font-bold" style={{ fontSize: '1.6rem', color: '#FBFAFA' }}>{data[1].candidate}</span>
                                <span className="font-bold justify-start" style={{ fontSize: '1.2rem', color: '#FBFAFA' }}>{data[1].numVotes}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex flex-row items-center justify-center p-2 gap-5" style={{ backgroundColor: '#515151' }}>
                    <img className="flex" src={bottomCountryBackground} alt="Background" width='30%' height='40%'></img>
                    <span className='font-inria-sans font-bold text-gray-500 justify-center items-center' style={{ fontSize: '1rem', color: '#AFAFAF' }}>DIFFERENCE { Number((data[0].percentage - data[1].percentage).toFixed(2))}%</span>
                    <img className="flex" src={bottomCountryBackground} alt="Background" width='30%' height='40%'></img>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-3 gap-1">
                    {dataOther.map((item) => otherCandidates(item))}
                </div>
            </div>
        </div>
    );
}
