'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import Link from 'next/link'

interface DataItem {
  title: string
  description: string
  deadline: string
  image_url?: string
}

const API_GATEWAY_ENDPOINT = "https://hqzlbhxd07.execute-api.ap-south-1.amazonaws.com/default"
const S3_BUCKET_NAME = "userdatabucketashish"
const AWS_REGION = "ap-south-1"

const Page: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submissionMessage, setSubmissionMessage, ] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmissionMessage(null)
    setLoading(true)

    let imageUrl: string | undefined = undefined

    if (selectedFile) {
      try {
        const getUrlResponse = await axios.get(
          `${API_GATEWAY_ENDPOINT}/userdata/get-upload-url?fileName=${selectedFile.name}&fileType=${selectedFile.type}` // <--- MODIFIED THIS LINE
        )
        const { uploadUrl, objectKey } = getUrlResponse.data

        await axios.put(uploadUrl, selectedFile, {
          headers: {
            'Content-Type': selectedFile.type,
          },
        })

        imageUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${objectKey}`
      } catch (error) {
        console.error("Image upload failed:", error)
        setSubmissionMessage("Failed to upload image.")
        setLoading(false)
        return
      }
    }

    const newItem: DataItem = {
      title,
      description,
      deadline,
      ...(imageUrl && { image_url: imageUrl }),
    }

    try {
      await axios.post(API_GATEWAY_ENDPOINT, newItem)
      setSubmissionMessage("Item added successfully!")

      // Reset form
      setTitle('')
      setDescription('')
      setDeadline('')
      setSelectedFile(null)
      const fileInput = document.getElementById('imageFile') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err) {
      console.error("Failed to post data:", err)
      setSubmissionMessage("Failed to add item.")
    } finally {
      setLoading(false)
    }
  }

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

      {/* Post Data Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              id="deadline"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Image (Optional)</label>
            <input
              type="file"
              id="imageFile"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
        {submissionMessage && (
          <p className={`mt-4 text-center ${submissionMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {submissionMessage}
          </p>
        )}
      </div>
    </main>
  )
}

export default Page