'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [show, setShow] = useState<string>('hidden');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');

  const uploadFileToS3 = async (file: File): Promise<{ success: boolean; message: string; url?: string }> => {
    try {
      const response = await fetch(
        `/api/postPhoto?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`
      );

      if (!response.ok) return { success: false, message: 'Failed to get pre-signed URL.' };

      const { url, fields } = await response.json();
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) return { success: false, message: 'Upload failed.' };

      return { success: true, message: 'Upload successful!', url: `${url}/${fields.key}` };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, message: 'An error occurred during upload.' };
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      setShow('block');
      return;
    }

    setUploading(true);
    setMessage('');
    setUploadedUrl('');

    const result = await uploadFileToS3(file);

    setMessage(result.message);
    if (result.success && result.url) setUploadedUrl(result.url);
    setShow('block');
    setUploading(false);
  };

  useEffect(() => {
    if (message.length > 0) setShow('block');
  }, [message]);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <nav className="flex gap-4 mb-8">
        <Link href="/" className="bg-white rounded-xl px-5 py-2 hover:bg-red-500 transition-colors">Homepage</Link>
        <Link href="/Display" className="bg-white rounded-xl px-5 py-2 hover:bg-red-500 transition-colors">Display</Link>
        <Link href="/image" className="bg-white rounded-xl px-5 py-2 hover:bg-red-500 transition-colors">Upload Image</Link>
        <Link href="/Aboutpage" className="bg-white rounded-xl px-5 py-2 hover:bg-red-500 transition-colors">Aboutpage</Link>
      </nav>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Upload a File to S3</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            id="file"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                setFile(files[0]);
                setMessage('');
                setUploadedUrl('');
                setShow('hidden');
              }
            }}
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-red-800 text-white rounded-md py-2 font-semibold hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        <div className={`mt-4 p-4 rounded-md bg-red-100 text-red-900 ${show}`}>
          {message}
          {uploadedUrl && (
            <div className="mt-2">
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                View Uploaded File
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
