'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface DataItem {
  title: string;
  description: string;
  deadline: string;
  image_url: string;
}

const DisplayPage: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [choice, setChoice] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          'https://16pu8bw887.execute-api.ap-south-1.amazonaws.com/default/userdata'
        );
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    getData();
  }, []);

  const filteredData = data.filter((item) => {
    const deadlineDate = new Date(item.deadline);
    const today = new Date();
    const formattedDeadline = deadlineDate.toISOString().split('T')[0];

    const matchDate = formattedDeadline.includes(search);
    const matchTitle = item.title.toLowerCase().includes(search.toLowerCase());

    const isMatched = matchDate || matchTitle;

    if (choice === 1) {
      return isMatched && deadlineDate < today;
    } else if (choice === 2) {
      return isMatched && deadlineDate >= today;
    } else {
      return isMatched;
    }
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChoice(Number(e.target.value));
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex justify-center gap-8 pt-5 pb-5 bg-red-800 text-white">
        <Link href="/" className="bg-white text-black rounded-xl px-5 py-2 hover:bg-red-500">
          Homepage
        </Link>
        <Link href="/Display" className="bg-white text-black rounded-xl px-5 py-2 hover:bg-red-500">
          Display
        </Link>
        <Link href="/image" className="bg-white text-black rounded-xl px-5 py-2 hover:bg-red-500">
          Upload Image
        </Link>
        <Link href="/Aboutpage" className="bg-white text-black rounded-xl px-5 py-2 hover:bg-red-500">
          Aboutpage
        </Link>
      </div>

      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Search by title or date (YYYY-MM-DD)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 px-4 py-2 border border-gray-400 rounded shadow-md"
        />
      </div>

      <div className="flex justify-center mt-4 gap-8">
        <label>
          <input type="radio" name="choice" value="0" checked={choice === 0} onChange={handleFilterChange} className="mr-1" />
          Default
        </label>
        <label>
          <input type="radio" name="choice" value="1" checked={choice === 1} onChange={handleFilterChange} className="mr-1" />
          Happened
        </label>
        <label>
          <input type="radio" name="choice" value="2" checked={choice === 2} onChange={handleFilterChange} className="mr-1" />
          Upcoming
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredData.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            {item.image_url && (
              <Image
                src={item.image_url}
                alt={item.title}
                width={400}
                height={200}
                className="mb-2 object-cover rounded"
              />
            )}
            <p className="text-gray-700 text-sm mb-2">{item.description}</p>
            <p className="text-xs text-gray-500">Deadline: {item.deadline}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default DisplayPage;
