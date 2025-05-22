'use client';
import React, { FormEvent, useState } from "react";
import axios from 'axios';
import Link from 'next/link';

interface DataItem {
  title: string;
  description: string;
  deadline: string;
  uploadedUrl: string;
}

const API_GATEWAY_ENDPOINT = "https://16pu8bw887.execute-api.ap-south-1.amazonaws.com/default/userdata";

const Page: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const uploadFileToS3 = async (file: File): Promise<string | null> => {
    try {
      const res = await fetch(`/api/postPhoto?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
      if (!res.ok) throw new Error("Failed to get pre-signed URL");

      const { url, fields } = await res.json();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      return `${url}/${fields.key}`;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSubmissionMessage(null);

    if (!file) {
      setSubmissionMessage("Please select a file.");
      setUploading(false);
      return;
    }

    const uploadedUrl = await uploadFileToS3(file);
    if (!uploadedUrl) {
      setSubmissionMessage("File upload failed.");
      setUploading(false);
      return;
    }

    const newItem: DataItem = {
      title,
      description,
      deadline,
      uploadedUrl
    };

    try {
      await axios.post(API_GATEWAY_ENDPOINT, newItem);
      setSubmissionMessage("Item added successfully!");
      setTitle('');
      setDescription('');
      setDeadline('');
      setFile(null);
    } catch (err) {
      console.error("Failed to post data:", err);
      setSubmissionMessage("Failed to add item.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-100'>
      <div className="flex justify-center gap-8 pt-5 pb-5 bg-red-800 text-white">
        {["/", "/Display", "/image", "/Aboutpage"].map((path, idx) => (
          <Link key={idx} href={path} className='bg-white rounded-xl px-5 py-2 hover:bg-red-500 text-black'>
            {path === "/" ? "Homepage" : path.replace("/", "")}
          </Link>
        ))}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Item with Image</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input type="text" id="title" required className="w-full rounded-md border-gray-300" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea id="description" rows={3} required className="w-full rounded-md border-gray-300" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium">Deadline</label>
            <input type="date" id="deadline" required className="w-full rounded-md border-gray-300" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium">Upload Image</label>
            <input type="file" accept="image/*" required className="w-full" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
          </div>

          {submissionMessage && (
            <p className={`text-center ${submissionMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{submissionMessage}</p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-red-800 text-white py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;
