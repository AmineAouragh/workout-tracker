import Image from "next/image";
import { useState, useEffect } from 'react'
import { supabase } from './api/supabase'
import Head from 'next/head'

export default function Home() {

  const [ workoutActivity, setWorkoutActivity ] = useState('')
  const [ workoutDay, setWorkoutDay ] = useState('')
  const [ reps, setReps ] = useState(0)
  const [ sets, setSets ] = useState(1)
  const [ duration, setDuration ] = useState(0)
  const [ distance, setDistance ] = useState(0)
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ createButtonClicked, setCreateButtonClicked ] = useState(false)
  const [ addButtonClicked, setAddButtonClicked ] = useState(false)
  const [ activities, setActivities ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ showForm, setShowForm ] = useState(false)
  const [ showLogin, setShowLogin ] = useState(false)
  const [ showProfile, setShowProfile ] = useState(false)
  const [ loginButtonClicked, setLoginButtonClicked ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ statsDay, setStatsDay ] = useState('')
  const [ totalReps, setTotalReps ] = useState(0)

  const TRAINED_MUSCLES_PER_WORKOUT = {
    "push-ups": {
       "chest": 1,
       "triceps": 1,
       "shoulders": 3
    },
    "sit-ups": {
       "core": 1,
       "hip flexors": 2,
       "chest": 3
    },
    "planks": {
       "core": 1,
       "shoulders": 1,
       "back": 2
    },
    "squats": {
       "legs": 1,
       "glutes": 1,
       "core": 2
    },
    "bicep curls": {
       "biceps": 1,
       "forearms": 2,
       "shoulders": 3
    }
  }

  async function fetchActivities(id){
    let { data: activities, error } = await supabase
    .from('activities')
    .select('name, reps, sets, day, duration, distance')
    .eq('user_id', id)
    .eq('day', workoutDay)
    console.log(activities)
    setActivities(activities)
    let total_reps = totalReps
    for (let activity of activities){
      total_reps += activity.reps
    }
    setTotalReps(total_reps)
    console.log(total_reps)
  }

  async function fetchActivityByIdAndUpdate(user_id, reps, sets, duration, distance){

    let { data: activities, error } = await supabase
    .from('activities')
    .select('name, reps, sets, duration, distance, day, user_id')
    .eq('user_id', user_id)
    .eq('name', workoutActivity)
    .eq('day', workoutDay)

    if (error) {
      console.error("Error fetching the existing activities: ", error.message)
    }

    if (activities.length > 0){
      
      const new_reps = activities[0].reps + parseInt(reps)
      const new_sets = activities[0].sets + sets 
      const new_duration = parseInt(activities[0].duration) + parseInt(duration)
      const new_distance = activities[0].distance + parseInt(distance)

      const { data, error: updateError } = await supabase
      .from('activities')
      .update({ 
        reps: new_reps,
        sets: new_sets,
        duration: new_duration,
        distance: new_distance
      })
      .eq('user_id', user_id)
      .eq('name', workoutActivity)
      .eq('day', workoutDay)

      if (updateError){
        console.error("Error updating activity: ", updateError.message)
      } else {
        console.log("Activity updated successfully!")
      }

    } else {
      const { data, error } = await supabase
      .from('activities')
      .insert([
        { 
          name: workoutActivity, 
          day: workoutDay, 
          reps: reps, 
          sets: sets, 
          duration: duration, 
          distance: distance,
          user_id: user_id
        }
      ])
    }
  }

  async function fetchStats(){
    let user_id = await getUserId()
    const { data: activities, error } = await supabase
    .from('activities')
    .select('name, reps, sets, day')
    .eq('user_id', user_id)
    .eq('day', statsDay)
    console.log(activities)
    setWorkoutDay(activities[0].day)
    setActivities(activities)
    let total_reps = 0
    for (let activity of activities){
      total_reps += activity.reps
    }
    setTotalReps(total_reps)
    console.log(total_reps)
  }

  function resetFields(){
    setReps(0)
    setDuration(0)
    setDistance(0)
    setWorkoutActivity("")
  }

  async function addNewWorkoutEntry(){
    if ((workoutActivity.length > 0 && reps > 0 && username.length > 0 && password.length > 0) || (workoutActivity.length > 0 && duration > 0 && username.length > 0 && password.length > 0)) {
      setAddButtonClicked(true)
      setLoading(true)
      setTimeout(() => setLoading(false), 3000)
      let exists = await checkIfUserExists()
      if (exists) {
        let userId = await getUserId()
        await fetchActivityByIdAndUpdate(userId, reps, sets, duration, distance)
        await fetchActivities(userId)
        //resetFields()
      } else {
        await addNewUser()
        let userId = await getUserId()
        const { data, error } = await supabase
        .from('activities')
        .insert([
          { 
            name: workoutActivity, 
            day: workoutDay, 
            reps: reps, 
            sets: sets, 
            duration: duration, 
            distance: distance,
            user_id: userId
          }
        ])
        await fetchActivities(userId)
      }
      //resetFields()
    } else {
      console.log("Enter all fields")
    }
  }

  async function checkIfUserExists(){
    let { data: users, error } = await supabase
    .from('users')
    .select('id, username, password')
    let exists = false
    for (let user of users){
      if (user.username == username && user.password == password){
        exists = true
        break
      } 
    }
    return exists
  }

  async function addNewUser(){
    const { data, error } = await supabase
    .from('users')
    .insert([
      { 
        username: username,
        password: password
      }
    ])
  }

  async function getUserId(){
    let { data: users, error } = await supabase
    .from('users')
    .select('id')
    .eq('password', password)
    return users[0].id
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

  function handleCreateWorkoutActivity(){
    setCreateButtonClicked(true)
  }

  useEffect(() => {
    setDate()
  }, [])

  function handleAddNewButton(){
    setAddButtonClicked(false)
    setShowForm(true)
    resetFields()
  }

  async function handleShowProfile(){
    if (username.length > 0 && password.length > 0){
      let exists = await checkIfUserExists()
      if (exists) {
        setShowForm(false)
        setShowLogin(false)
        setShowProfile(true)
        let userId = await getUserId()
        await fetchActivities(userId)
        //resetFields()
      } else {
        setMessage("Wrong credentials! Try again.")
      }
    } else {
      setMessage("Fill out all fields please.")
    }
  }
  
  return (
    <>
      <Head>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&family=Rubik+Doodle+Shadow&display=swap" rel="stylesheet" />
            <title>Workout Tracker</title>
      </Head>
      <div className="py-8 flex flex-col min-h-screen w-full justify-center items-center">
      <h1 className="text-4xl xl:text-8xl text-transparent font-poppins bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 font-bold">Workout Tracker</h1>
      <h2 className="mt-12 text-2xl text-gray-500 font-poppins text-center font-medium">Fitness Tracking For Workout Enthusiasts 💪</h2>
      <p className="mt-12 font-medium text-green-600 hidden">Coming soon: Weekly Stats, Monthly Stats, Streak Counter</p>
      <p className="mt-12 font-medium text-gray-50 text-center px-2 bg-green-600 hidden">Coming soon: Workout Activity Distribution</p>
      <div className={`mt-12 flex flex-col lg:flex-row justify-center lg:justify-between items-center ${showForm || showLogin || showProfile ? "hidden" : ""}`}>
        <button type="button" onClick={() => setShowForm(true)} className="mb-8 lg:mb-0 lg:mr-16 text-2xl bg-gray-700 font-poppins text-gray-50 px-5 py-4 rounded-lg">Start tracking</button>
        <button type="button" onClick={() => setShowLogin(true)} className="text-2xl font-medium font-poppins px-5 py-4 bg-gray-200 rounded-lg text-gray-800">Log in</button>
      </div>
      <form className={`mt-10 border-4 border-gray-500 flex flex-col justify-center rounded-md px-8 py-8 w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 ${addButtonClicked ? "hidden" : ""} ${!showForm ? "hidden" : ""}`}>
        <h3 className="text-2xl font-bold mb-5 font-poppins">What did you do today?</h3>
        <div className="flex flex-col mb-4">
          <label htmlFor="activity" className="text-lg font-medium mb-2">Workout activity <span className="text-2xl">🏋</span></label>
          <input id="activity" name="activity" value={workoutActivity} onChange={e => setWorkoutActivity(e.target.value)} type="text" placeholder="Enter a workout activity" className={`border-4 outline-none border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl px-3 py-2 text-xl text-gray-700 font-bold ${createButtonClicked ? '' : 'hidden'}`} required />
          <select value={workoutActivity} name="workoutActivity" onChange={e => setWorkoutActivity(e.target.value)} className={`font-poppins rounded-xl text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 px-2 py-2 text-xl font-bold ${createButtonClicked ? "hidden" : ""}`}>
            <option value="" className="bg-gray-700 text-gray-50">---</option>
            <option value="push-ups" className="bg-gray-700 text-gray-50">Push-ups</option>
            <option value="sit-ups" className="bg-gray-700 text-gray-50">Sit-ups</option>
            <option value="squats" className="bg-gray-700 text-gray-50">Squats 🦵</option>
            <option value="planks" className="bg-gray-700 text-gray-50">Planks</option>
            <option value="bicep-curls" className="bg-gray-700 text-gray-50">Bicep curls 💪</option>
            <option value="skipping-rope" className="bg-gray-700 text-gray-50">Skipping rope ➰</option>
            <option value="running" className="bg-gray-700 text-gray-50">Running 🏃</option>
            <option value="cycling" className="bg-gray-700 text-gray-50">Cycling 🚴</option>
          </select>
        </div>
        {
          workoutActivity == "running" || workoutActivity == "cycling" || workoutActivity == "planks"
          ?
          <>
            <div className="flex flex-col mb-3">
              <label htmlFor="duration" className="text-lg font-medium mb-2">Duration <span className="text-gray-700">in minutes</span><span className="text-2xl"> ⌛</span></label>
              <input id="duration" value={duration} onChange={e => setDuration(e.target.value)} type="text" className="font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold" required />
            </div>
            <div className={`flex flex-col mb-3 ${workoutActivity == "planks" ? "hidden" : ""}`}>
              <label htmlFor="distance" className="text-lg font-medium mb-2">Distance <span className="text-gray-700">in meters</span><span className="text-2xl"> 🏃</span> (Optional)</label>
              <input id="distance" value={distance} onChange={e => setDistance(e.target.value)} type="number" min={1} className="font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold" />
            </div>
          </>
          :
            <div className="flex flex-col mb-3">
              <label htmlFor="reps" className="text-lg font-medium mb-2">Reps:</label>
              <input id="reps" value={reps} onChange={e => setReps(e.target.value)} type="number" min={1} className="font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold" required />
            </div>
        }
        <div className={`flex flex-col mb-3`}>
          <label htmlFor="username" className="text-lg font-medium mb-2">Username:</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)} type="text" className="font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold" required />
        </div>
        <div className={`flex flex-col mb-3`}>
          <label htmlFor="password" className="text-lg font-medium mb-2">Password:</label>
          <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" className="font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold" required />
        </div>
        <p className={`font-medium ${createButtonClicked ? "hidden" : ""}`}>
          You can&apos;t find a workout activity in the list?
        <button type="button" onClick={handleCreateWorkoutActivity} className={`font-bold underline`}>Create it here.</button>
        </p>
        <button type="button" onClick={addNewWorkoutEntry} className="focus:ring ring-offset-2 focus:ring-gray-600 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-800 hover:to-gray-600 transition mt-6 text-xl text-gray-50 rounded-md px-5 py-3 font-bold">Add</button>
      </form>
      <form className={`mt-10 border-4 border-gray-500 flex flex-col justify-center rounded-md px-8 py-8 w-full sm:w-2/3 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 ${loginButtonClicked ? "hidden" : ""} ${!showLogin ? "hidden" : ""}`}>
        <p className="text-center text-2xl font-medium font-poppins mb-8">Log In</p>
        <div className={`flex flex-col mb-3`}>
          <label htmlFor="username" className="text-lg font-medium mb-2">Username:</label>
          <input id="username" value={username} onChange={e => setUsername(e.target.value)} type="text" className={`font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold ${message.length > 0 && "border-red-400"}`} required />
        </div>
        <div className={`flex flex-col mb-3`}>
          <label htmlFor="password" className="text-lg font-medium mb-2">Password:</label>
          <input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" className={`font-poppins text-gray-700 border-4 border-gray-700 focus:shadow-lg focus:border-gray-800 rounded-xl outline-none px-3 py-2 text-xl font-bold ${message.length > 0 && "border-red-400"}`} required />
        </div>
        <p className="font-semibold text-red-400">{message}</p>
        <button type="button" onClick={handleShowProfile} className="bg-gray-700 mt-8 text-2xl px-5 py-4 rounded-lg text-gray-50 font-poppins">Login</button>
      </form>
     
      {
        (addButtonClicked || showProfile) &&
        <>
        <div className="flex hidden flex-row items-center justify-between border-4 border-gray-700 rounded-md w-full md:w-3/4 lg:w-1/3 mt-16">
        <input type="text" value={statsDay} onChange={e => setStatsDay(e.target.value)} id="search" className="font-poppins rounded-xl px-3 py-2 text-xl font-medium outline-none mr-2 w-3/4" placeholder="Search for your workout stats by date..." />
        <button type="button" onClick={fetchStats} className="font-poppins px-5 py-3 text-2xl text-gray-700 bg-gray-200 hover:bg-gray-300">🔎</button>
        </div>
        <p className="text-gray-600 mt-2 hidden">Dates should respect this format: MM DD, YYYY</p>
        <hr className="h-2 w-full md:w-3/4 xl:w-1/2 mt-12" />
        <div className="mt-12 w-full md:w-3/4 xl:w-1/2">
          <h3 className="text-4xl mb-8 font-medium">Hi, {username} 👋</h3>
          { loading == false &&
          <>
          <div className="flex flex-row justify-between items-center mb-4">
            <h3 className="text-xl font-medium font-poppins">Today&apos;s Stats 🚀</h3>
            <button type="button" onClick={handleAddNewButton} className="hidden lg:flex rounded-xl px-5 py-3 text-2xl bg-gradient-to-r hover:from-gray-600 hover:to-gray-800 from-gray-800 to-gray-600 font-bold shadow-xl text-gray-50 font-poppins">+ Add new activity</button>
            <button type="button" onClick={handleAddNewButton} className="lg:hidden rounded-xl px-5 py-3 text-2xl bg-gradient-to-r from-gray-600 to-gray-800 font-bold shadow-xl text-gray-50">+</button>
          </div>
          <h4 className="font-medium text-lg text-gray-600">{workoutDay}</h4>
          <div className="grid grid-cols-3 gap-8 mt-6">
            {
              activities.map(
                activity => (
                  <>
                  <div key={activity.id} id={activity.id} className="rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 p-4 md:px-8 md:py-8">
                    <p className="text-2xl lg:text-3xl font-bold text-gray-700 font-poppins">{activity.name}</p>
                    <p className="text-2xl font-bold mt-2 font-poppins text-orange-500">{(activity.name == "running" || activity.name == "cycling" || activity.name == "planks") ? activity.duration + " mins" : activity.reps + " reps"}</p>
                    <p className="text-md md:text-xl font-medium text-gray-700 mt-2">{activity.sets} sets</p>
                  </div>
                  </>
                )
              )
            }
          </div>
          </>
         }
         {
          loading == true &&
          <div className="mt-24">
            <p className="font-medium font-poppins text-2xl">Your workout activities are being updated now.</p>
          </div>
         }
        </div>
          
        </>
      }
      <p className="bottom-2 hidden absolute font-medium text-gray-700">Made by <span className="text-blue-500">@TheAmineAouragh</span></p>
      </div>
    </>
  )
}
