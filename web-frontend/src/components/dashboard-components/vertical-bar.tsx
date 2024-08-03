/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function VerticalBars() {
    const { topVotesPerProvinces, provinces } = useAuth();

    const [dataset, setDataset] = useState([
        {
            NumberOfVotes: 23,
            province: 'Bengo',
            label: 'BE'
        },
        {
            NumberOfVotes: 28,
            province: 'Benguela',
            label: 'BG'
        },
        {
            NumberOfVotes: 41,
            province: 'Bié',
            label: 'BI'
        },
        {
            NumberOfVotes: 73,
            province: 'Cabinda',
            label: 'CA'
        },
        {
            NumberOfVotes: 99,
            province: 'Cuando Cubango',
            label: 'CC'
        },
        {
            NumberOfVotes: 144,
            province: 'Cunene',
            label: 'CU'
        },
        {
            NumberOfVotes: 150,
            province: 'Luanda',
            label: 'LA'
        },
        {
            NumberOfVotes: 55,
            province: 'Lunda Sul',
            label: 'LS'
        },
        {
            NumberOfVotes: 131,
            province: 'Lunda Norte',
            label: 'LN'
        },
        {
            NumberOfVotes: 48,
            province: 'Malanje',
            label: 'MA'
        },
        {
            NumberOfVotes: 25,
            province: 'Moxico',
            label: 'MO'
        },
        {
            NumberOfVotes: 34,
            province: 'Namibe',
            label: 'N'
        },
        {
            NumberOfVotes: 41,
            province: 'Cuanza Sul',
            label: 'CS'
        },
        {
            NumberOfVotes: 100,
            province: 'Huambo',
            label: 'HU'
        },
        {
            NumberOfVotes: 90,
            province: 'Huíla',
            label: 'HI'
        },
        {
            NumberOfVotes: 24,
            province: 'Uíge',
            label: 'UI'
        },
        {
            NumberOfVotes: 27,
            province: 'Zaire',
            label: 'ZA'
        },
    ]);

    useEffect(() => {
        if (topVotesPerProvinces !== undefined) {
            const val = dataset.map((x, index) => {
                const topVotesProvince = topVotesPerProvinces.find(u => u.province === x.province);
                const numberOfVotes = topVotesProvince ? parseInt(topVotesProvince.number) : 0;

                return {
                    ...x,
                    id: index + 1,
                    NumberOfVotes: numberOfVotes
                };
            });
                    
            setDataset(val);
        }

    }, [topVotesPerProvinces]);

    if (topVotesPerProvinces === undefined) 
        return (
            <div>Loading ...</div>
        );

    return (
        <div style={{ width: 'auto', height: '300px', padding: 0 }}> {/* Container with fixed height */}
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dataset} // Replace data with dataset
                    margin={{
                        top: 5,
                        right: 5,
                        left: 5,
                        bottom: 5,
                    }}
                    barSize={10}
                    barCategoryGap={2}
                    barGap={2}
                >
                    <XAxis dataKey="label" scale="point" spacing={20} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="NumberOfVotes" fill="#DF0031" background={{ fill: '#F29EB0' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}