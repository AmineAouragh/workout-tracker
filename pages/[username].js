import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function UserPage(){

    const router = useRouter()
    const [ workoutActivity, setWorkoutActivity ] = useState('')
    const [ activities, setActivities ] = useState([])

    return (
        <>
          <Head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet" />
            <title>Workout Tracker</title>
          </Head>
          <div className="px-4 py-8 flex flex-col min-h-screen w-full justify-center items-center">
            <h1 className="text-4xl xl:text-8xl text-transparent font-poppins bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 font-bold">Workout Tracker</h1>
            <h2 className="mt-6 text-2xl text-gray-500 font-poppins text-center font-medium">Fitness Tracking For Workout Enthusiasts 💪</h2>
            
          </div>
        </>
    )
}