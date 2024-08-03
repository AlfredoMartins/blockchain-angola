/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import { columns, Citizen } from "./columns";
import { DataTable } from "./data-table";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function TablePopulation({ toast }: any) {
    const [data, setData] = useState<Citizen[]>([]);

    const onLoadPopulationData = async () => {
        await axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/registers')
        .then(response => {
            const data = response.data;
            if (data) {
                const registers = data.registers;
                if (registers) {
                    let newData = registers.map((element: any) => ({
                        name: element.name,
                        operation: '',
                        electoralId: element.electoralId,
                        email: element.email,
                        address: element.address,
                        province: element.province,
                        password: element.password,
                        status: element.status,
                        verification: element.verification,
                        otp: element.otp,
                        toast: toast,
                        setData: setData
                    }));

                    newData.sort((a, b) => {
                        const nameA = a.name.toLowerCase();
                        const nameB = b.name.toLowerCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });

                    newData = newData.map((element: any, index: number) => ({
                        id: index + 1,
                        ...element
                    }));

                    setData([...newData]);
                }
            }
        })
        .catch(error => console.error(error));
    }

    useEffect(() => {
        onLoadPopulationData();
    }, []);

    return (
        <section>
            <Button className="max-w-lg" onClick={onLoadPopulationData}>Load / Refresh Data</Button>
            <DataTable columns={columns} data={data} />
        </section>
    );
}

export default TablePopulation;