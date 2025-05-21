// ./src/app/Aboutpage/page.tsx
import React from 'react'
import Link from 'next/link';

const AboutPage: React.FC = () => { // Changed 'page' to 'AboutPage'
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
            <div className="flex justify-center">
                <div className="max-w-xl w-full text-center p-4">
                    <h1 className='text-red-800 pt-10 text-3xl'>About us</h1>
                    <p className='pt-10 text-red-800 '>
                        Welcome to NotesApp – your personal space to capture thoughts, ideas, and important reminders effortlessly. Whether you&apos;re managing tasks, journaling daily insights, or organizing your study notes, NotesApp makes it fast and simple. With a clean interface and secure cloud backup, you&apos;ll never lose track of what matters most. Write freely, stay organized, and sync your notes across all devices – anytime, anywhere.
                    </p>
                    <ul className='pt-5 list-disc text-xl'>
                        <li>Rich Text Editing
                            Format your notes with headings, bold/italic text, bullet lists, code blocks, and more.
                        </li><li>
                            Cloud Sync
                            Access your notes from any device, anywhere, with automatic cloud synchronization.
                        </li><li>
                            Search & Filter
                            Quickly find notes using powerful keyword search and tag-based filtering.
                        </li><li>
                            Dark Mode
                            Enjoy a sleek and comfortable user interface day or night with built-in dark mode.</li>
                        <li>
                            Secure & Private
                            Your data is encrypted and only accessible by you – privacy is our top priority.</li>
                    </ul>
                </div>
            </div>
        </main>
    )
}
export default AboutPage; // Changed 'page' to 'AboutPage'