import Image from "next/image";
import { useState } from 'react'
import { supabase } from './api/supabase'

export default function Home() {

  const [ workoutActivity, setWorkoutActivity ] = useState('')
  const [ reps, setReps ] = useState(0)
  const [ sets, setSets ] = useState(0)

  async function addNewWorkoutEntry(){
    const { data, error } = await supabase
    .from('users')
    .insert([
      { name: workoutActivity, reps: reps, sets: sets }
    ])
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

    return `${month} ${day}, ${year}`
  }
  
  return (
    <div className="px-4 py-8 flex flex-col min-h-screen w-full justify-center items-center">
      <h1 className="text-4xl xl:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 font-bold">Workout Tracker</h1>
      <h2 className="mt-6 text-2xl text-gray-500 font-medium">Fitness Tracking For Workout Enthusiasts 💪</h2>
      <form className="mt-16 border-2 border-gray-800 flex flex-col justify-center rounded-md px-8 py-8 w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <h3 className="text-4xl font-bold mb-3">Log your workout now</h3>
        <h4 className="text-gray-500 font-medium mb-5">{setDate()}</h4>
        <div className="flex flex-col mb-4">
          <label htmlFor="activity" className="text-lg font-medium mb-2">Workout activity:</label>
          <input id="activity" type="text" placeholder="Push-ups, Sit-ups..." className="hidden border-2 outline-none border-gray-500 focus:border-gray-800 rounded-md px-3 py-2 text-xl font-bold" required />
          <select className="rounded-md border-2 border-gray-500 focus:border-gray-800 px-3 py-2 text-xl font-bold">
            <option value="push-ups" className="bg-gray-700 text-gray-50">---</option>
            <option value="push-ups" className="bg-gray-700 text-gray-50">Push-ups</option>
            <option value="sit-ups" className="bg-gray-700 text-gray-50">Sit-ups</option>
            <option value="squats" className="bg-gray-700 text-gray-50">Squats</option>
            <option value="bicep-curls" className="bg-gray-700 text-gray-50">Bicep curls</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
            <label htmlFor="reps" className="text-lg font-medium mb-2">Reps:</label>
            <input id="reps" type="number" min={1} className="border-2 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
        </div>
        <div className="flex flex-col">
            <label htmlFor="sets" className="text-lg font-medium mb-2">Sets:</label>
            <input id="sets" type="number" min={1} className="border-2 border-gray-500 focus:border-gray-800 rounded-md outline-none px-3 py-2 text-xl font-bold" required />
        </div>
        <button type="button" className="focus:ring ring-offset-2 focus:ring-gray-600 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-800 hover:to-gray-600 transition mt-10 text-xl text-gray-50 rounded-md px-5 py-3 font-bold">Add</button>
      </form>
    </div>
  )
}
