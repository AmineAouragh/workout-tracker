import Image from "next/image";
import { useState, useEffect } from 'react'
import { supabase } from './api/supabase'
import Head from 'next/head'

export default function Home() {

  const [ workoutActivity, setWorkoutActivity ] = useState('')
  const [ workoutDay, setWorkoutDay ] = useState('')
  const [ reps, setReps ] = useState(0)
  const [ sets, setSets ] = useState(0)
  const [ duration, setDuration ] = useState(0)
  const [ distance, setDistance ] = useState(0)
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  async function addNewWorkoutEntry(){
    const { data, error } = await supabase
    .from('activities')
    .insert([
      { name: workoutActivity, day: workoutDay, reps: reps, sets: sets }
    ])
  }

  let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.?*$&!_'
  let length = 12

  function generatePassword(characters, length){
    let password = ""
    for (let i = 0; i < length; i++){
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password
  }

  function setDate(){
    let day = new Date().getDate()
    let month = ''
    switch(new Date().getMonth()){
      case 0:
        month = "January"
        break
      case 1:
        month = "February"
        break
      case 2:
        month = "March"
        break
      case 3:
        month = "April"
        break
      case 4:
        month = "May"
        break
      case 5:
        month = "June"
        break
      case 6:
        month = "July"
        break
      case 7:
        month = "August"
        break
      case 8:
        month = "September"
        break
      case 9:
        month = "October"
        break
      case 10:
        month = "November"
        break
      case 11:
        month = "December"
        break
      default:
        month = ""
        break
    }

    let year = new Date().getFullYear()
    setWorkoutDay(`${month} ${day}, ${year}`)
    return `${month} ${day}, ${year}`
  }

  useEffect(() => {
    setDate()
  }, [])
  
  return (
    <>
      <Head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet" />
            <title>Workout Tracker</title>
      </Head>
      <div className="px-4 py-8 flex flex-col min-h-screen w-full justify-center items-center">
      <h1 className="text-4xl xl:text-8xl text-transparent font-poppins bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 font-bold">Workout Tracker</h1>
      <h2 className="mt-6 text-2xl text-gray-500 font-poppins text-center font-medium">Fitness Tracking For Workout Enthusiasts 💪</h2>
      <form className="mt-10 border-4 border-gray-500 flex flex-col justify-center rounded-md px-8 py-8 w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <h3 className="text-2xl font-bold mb-5 font-poppins">What did you do today?</h3>
        <div className="flex flex-col mb-4">
          <label htmlFor="activity" className="text-lg font-medium mb-2">Workout activity <span className="text-2xl">🏋</span></label>
          <input id="activity" type="text" placeholder="Push-ups, Sit-ups..." className="hidden border-2 outline-none border-gray-500 focus:border-gray-800 rounded-md px-3 py-2 text-xl font-bold" required />
          <select value={workoutActivity} onChange={e => setWorkoutActivity(e.target.value)} className="font-poppins rounded-md text-gray-700 border-4 border-gray-500 focus:border-gray-800 px-2 py-2 text-xl font-bold">
            <option value="" className="bg-gray-700 text-gray-50">---</option>
            <option value="push-ups" className="bg-gray-700 text-gray-50">Push-ups</option>
            <option value="sit-ups" className="bg-gray-700 text-gray-50">Sit-ups</option>
            <option value="squats" className="bg-gray-700 text-gray-50">Squats 🦵</option>
            <option value="bicep-curls" className="bg-gray-700 text-gray-50">Bicep curls 💪</option>
            <option value="skipping-rope" className="bg-gray-700 text-gray-50">Skipping rope ➰</option>
            <option value="running" className="bg-gray-700 text-gray-50">Running 🏃</option>
            <option value="cycling" className="bg-gray-700 text-gray-50">Cycling 🚴</option>
          </select>
        </div>
        {
          workoutActivity == "running" || workoutActivity == "cycling"
          ?
          <>
            <div className="flex flex-col mb-4">
              <label htmlFor="duration" className="text-lg font-medium mb-2">Duration <span className="text-gray-700">in minutes</span><span className="text-2xl"> ⌛</span></label>
              <input id="duration" value={duration} onChange={e => setDuration(e.target.value)} type="number" min={1} className="font-poppins text-gray-700 border-4 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="distance" className="text-lg font-medium mb-2">Distance <span className="text-gray-700">in meters</span><span className="text-2xl"> 🏃</span> (Optional)</label>
              <input id="distance" value={distance} onChange={e => setDistance(e.target.value)} type="number" min={1} className="font-poppins text-gray-700 border-4 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" />
            </div>
          </>
          :
          <div>
            <div className="flex flex-col mb-4">
              <label htmlFor="reps" className="text-lg font-medium mb-2">Reps:</label>
              <input id="reps" value={reps} onChange={e => setReps(e.target.value)} type="number" min={1} className="font-poppins text-gray-700 border-4 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="sets" className="text-lg font-medium mb-2">Sets:</label>
              <input id="sets" value={sets} onChange={e => setSets(e.target.value)} type="number" min={1} className="font-poppins text-gray-700 border-4 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
            </div>
          </div>
        }
        <div className="flex flex-col hidden mb-4">
          <label htmlFor="username" className="text-lg font-medium mb-2">Username:</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)} type="text" className="font-poppins text-gray-700 border-2 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
        </div>
        <div className="flex flex-col hidden">
          <label htmlFor="password" className="text-lg font-medium mb-2">Password:</label>
          <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="text" className="font-poppins text-gray-700 border-2 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
        </div>
        <p className="font-medium">You can&apos;t find a workout activity in the list? <button type="button" className="font-bold underline">Create it here.</button></p>
        <button type="button" onClick={addNewWorkoutEntry} className="focus:ring ring-offset-2 focus:ring-gray-600 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-800 hover:to-gray-600 transition mt-6 text-xl text-gray-50 rounded-md px-5 py-3 font-bold">Add</button>
      </form>
      <p className="bottom-2 absolute font-medium text-gray-700">Made by <span className="text-blue-500">@TheAmineAouragh</span></p>
      </div>
    </>
  )
}
