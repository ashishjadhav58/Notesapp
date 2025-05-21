// ./src/app/Display/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component

interface dataa {
    title: string,
    description: string,
    deadline: string
    image_url?: string
}

const DisplayPage: React.FC = () => {
    const [data, setdata] = useState<dataa[]>([]);

    useEffect(() => {
        const getdata = async () => {
            try {
                const response = await axios.get("https://16pu8bw887.execute-api.ap-south-1.amazonaws.com/default/userdata");
                setdata(response.data);
            } catch (_err) {
                // Fix: Actually use the _err variable by logging it
                console.error("Error fetching data:", _err); // THIS LINE IS MODIFIED
            }
        };
        getdata();
    }, []);

    return (
        <main className='min-h-screen bg bg-gray-100'>

            <div className="flex justify-center gap-8 pt-5 pb-5 bg bg-red-800 text">
                <div>
                    <Link href="/" className='bg bg-white rounded-xl pr-5 pl-5 pt-2 pb-2 mt-3 hover:bg-red-500'>Homepage</Link>
                </div>
                <div>
                    <Link href="/Display" className='bg bg-white rounded-xl pr-5 pl-5 pt-2 pb-2 mt-3 hover:bg-red-500'>Display</Link>
                </div>
                <div>
                    <Link href="/Aboutpage" className='bg bg-white rounded-xl pr-5 pl-5 pt-2 pb-2 mt-3 hover:bg-red-500'>Aboutpage</Link>
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {data.map((e) => (
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200" key={e.title}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{e.title}</h3>
                        {e.image_url && (
                            <Image
                                src={e.image_url}
                                alt={e.title}
                                className="w-full h-48 object-cover rounded-md mb-3"
                                width={500}
                                height={300}
                                priority
                            />
                        )}
                        <p className="text-gray-700 text-sm mb-2">{e.description}</p>
                        <p className="text-xs text-gray-500">Deadline: {e.deadline}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
export default DisplayPage;