import React, { useState, useEffect } from 'react'
import { 
  Clock, 
  Globe, 
  Timer, 
  Hourglass, 
  Bell, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react'

const WORLD_ZONES = [
  { city: 'New York', label: 'New York (EDT/EST)', tz: 'America/New_York', country: 'US' },
  { city: 'London', label: 'London (BST/GMT)', tz: 'Europe/London', country: 'UK' },
  { city: 'Paris', label: 'Paris (CEST/CET)', tz: 'Europe/Paris', country: 'FR' },
  { city: 'Dubai', label: 'Dubai (GST)', tz: 'Asia/Dubai', country: 'UAE' },
  { city: 'Tokyo', label: 'Tokyo (JST)', tz: 'Asia/Tokyo', country: 'JP' },
  { city: 'Sydney', label: 'Sydney (AEST/AEDT)', tz: 'Australia/Sydney', country: 'AU' },
  { city: 'Singapore', label: 'Singapore (SGT)', tz: 'Asia/Singapore', country: 'SG' },
  { city: 'Los Angeles', label: 'Los Angeles (PDT/PST)', tz: 'America/Los_Angeles', country: 'US' },
  { city: 'San Francisco', label: 'San Francisco (PDT/PST)', tz: 'America/Los_Angeles', country: 'US' },
  { city: 'Mumbai', label: 'Mumbai / New Delhi (IST)', tz: 'Asia/Kolkata', country: 'IN' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('clock')
  const [now, setNow] = useState(new Date())
  const [is24Hour, setIs24Hour] = useState(false)
  const [showAnalog, setShowAnalog] = useState(true)

  // World Clocks State
  const [selectedZones, setSelectedZones] = useState([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Asia/Dubai'
  ])
  const [newZone, setNewZone] = useState('Asia/Kolkata')

  // Stopwatch State
  const [stopwatchRunning, setStopwatchRunning] = useState(false)
  const [stopwatchTime, setStopwatchTime] = useState(0) // in ms
  const [laps, setLaps] = useState([])

  // Timer State
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerInitial, setTimerInitial] = useState(300) // 5 mins in seconds
  const [timerLeft, setTimerLeft] = useState(300)
  const [timerInputH, setTimerInputH] = useState(0)
  const [timerInputM, setTimerInputM] = useState(5)
  const [timerInputS, setTimerInputS] = useState(0)
  const [timerSoundAlert, setTimerSoundAlert] = useState(true)

  // Alarms State
  const [alarms, setAlarms] = useState([
    { id: 1, time: '07:30', label: 'Morning Routine', enabled: true },
    { id: 2, time: '14:00', label: 'Daily Standup', enabled: false }
  ])
  const [alarmInputTime, setAlarmInputTime] = useState('08:00')
  const [alarmInputLabel, setAlarmInputLabel] = useState('')

  // Ticker for current time
  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date()
      setNow(currentDate)

      // Alarm checker (minute precision)
      const currentHHMM = currentDate.toTimeString().slice(0, 5)
      const currentSec = currentDate.getSeconds()
      if (currentSec === 0) {
        alarms.forEach(a => {
          if (a.enabled && a.time === currentHHMM) {
            playBeep()
            alert(`⏰ Alarm Triggered: ${a.label || 'Alarm'} (${a.time})`)
          }
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [alarms])

  // Stopwatch ticker
  useEffect(() => {
    let interval = null
    if (stopwatchRunning) {
      const startTime = Date.now() - stopwatchTime
      interval = setInterval(() => {
        setStopwatchTime(Date.now() - startTime)
      }, 10)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [stopwatchRunning])

  // Timer ticker
  useEffect(() => {
    let interval = null
    if (timerRunning && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setTimerRunning(false)
            if (timerSoundAlert) {
              playBeep()
            }
            alert('⏳ Timer Finished!')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerRunning, timerLeft, timerSoundAlert])

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch (e) {
      console.error(e)
    }
  }

  // Format Helpers
  const formatDigitalTime = (date, tz = undefined) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour,
      timeZone: tz
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }

  const formatFullDate = (date, tz = undefined) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: tz
    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
  }

  const formatStopwatch = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
  }

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Stopwatch actions
  const handleStopwatchLap = () => {
    setLaps(prev => [
      { id: prev.length + 1, time: stopwatchTime, formatted: formatStopwatch(stopwatchTime) },
      ...prev
    ])
  }

  // Timer actions
  const handleSetCustomTimer = (e) => {
    e.preventDefault()
    const total = Number(timerInputH) * 3600 + Number(timerInputM) * 60 + Number(timerInputS)
    if (total > 0) {
      setTimerInitial(total)
      setTimerLeft(total)
      setTimerRunning(false)
    }
  }

  // Alarm actions
  const handleAddAlarm = (e) => {
    e.preventDefault()
    if (!alarmInputTime) return
    const newAlarm = {
      id: Date.now(),
      time: alarmInputTime,
      label: alarmInputLabel.trim() || 'Alarm',
      enabled: true
    }
    setAlarms(prev => [...prev, newAlarm])
    setAlarmInputLabel('')
  }

  const toggleAlarm = (id) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a))
  }

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(a => a.id !== id))
  }

  // Analog Clock angles calculation
  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours()
  const secondDeg = (seconds / 60) * 360
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 selection:bg-indigo-500 selection:text-white">
      {/* App Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between py-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <Clock className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-400">
              ChronoCraft
            </h1>
            <p className="text-xs text-slate-400">Precision React Timepiece & Utility Suite</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 shadow-inner">
          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              is24Hour 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24H Mode: {is24Hour ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setShowAnalog(!showAnalog)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showAnalog 
                ? 'bg-slate-800 text-indigo-300' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analog Dial: {showAnalog ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="w-full max-w-5xl flex items-center justify-center gap-2 md:gap-4 my-6 overflow-x-auto pb-2">
        {[
          { id: 'clock', label: 'Local Clock', icon: Clock },
          { id: 'world', label: 'World Zones', icon: Globe },
          { id: 'stopwatch', label: 'Stopwatch', icon: Timer },
          { id: 'timer', label: 'Countdown', icon: Hourglass },
          { id: 'alarm', label: 'Alarms', icon: Bell },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                isActive 
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center">
        {/* LOCAL CLOCK TAB */}
        {activeTab === 'clock' && (
          <div className="w-full flex flex-col items-center gap-8 py-4">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
              {/* Digital Section */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Local System Synchronized
                </div>
                
                <div className="text-5xl md:text-7xl font-extrabold tracking-tight font-mono-numbers text-white drop-shadow-md">
                  {formatDigitalTime(now)}
                </div>

                <div className="text-lg text-slate-400 font-medium">
                  {formatFullDate(now)}
                </div>

                <div className="pt-4 border-t border-slate-800/60 w-full flex flex-wrap gap-4 text-xs text-slate-500">
                  <div>Timezone: <span className="text-slate-300 font-mono">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span></div>
                  <div>Format: <span className="text-slate-300 font-mono">{is24Hour ? '24 Hours' : '12 Hours (AM/PM)'}</span></div>
                </div>
              </div>

              {/* Analog Section */}
              {showAnalog && (
                <div className="flex justify-center items-center">
                  <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-b from-slate-850 to-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
                    {/* Dial markings */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 bg-slate-600 rounded"
                        style={{
                          height: (i + 1) % 3 === 0 ? '12px' : '6px',
                          transform: `rotate(${(i + 1) * 30}deg) translateY(-120px)`,
                          opacity: (i + 1) % 3 === 0 ? 0.9 : 0.4
                        }}
                      />
                    ))}

                    {/* Hour Hand */}
                    <div
                      className="absolute w-1.5 bg-slate-200 rounded-full origin-bottom shadow"
                      style={{
                        height: '65px',
                        bottom: '50%',
                        transform: `rotate(${hourDeg}deg)`,
                        transition: 'transform 0.05s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                      }}
                    />

                    {/* Minute Hand */}
                    <div
                      className="absolute w-1 bg-indigo-400 rounded-full origin-bottom shadow"
                      style={{
                        height: '90px',
                        bottom: '50%',
                        transform: `rotate(${minuteDeg}deg)`,
                        transition: 'transform 0.05s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                      }}
                    />

                    {/* Second Hand */}
                    <div
                      className="absolute w-0.5 bg-rose-500 rounded-full origin-bottom shadow"
                      style={{
                        height: '105px',
                        bottom: '50%',
                        transform: `rotate(${secondDeg}deg)`,
                        transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                      }}
                    />

                    {/* Center Pin */}
                    <div className="absolute w-4 h-4 bg-white rounded-full border-2 border-rose-500 shadow-md" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORLD CLOCKS TAB */}
        {activeTab === 'world' && (
          <div className="w-full flex flex-col gap-6 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  World Time Zones
                </h2>
                <p className="text-xs text-slate-400">Track real-time global time across major financial and tech hubs</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
                >
                  {WORLD_ZONES.map(z => (
                    <option key={z.tz} value={z.tz} disabled={selectedZones.includes(z.tz)}>
                      {z.city} ({z.tz})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (!selectedZones.includes(newZone)) {
                      setSelectedZones([...selectedZones, newZone])
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Hub
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedZones.map(tz => {
                const zoneMeta = WORLD_ZONES.find(z => z.tz === tz) || { city: tz.split('/')[1] || tz, country: 'World' }
                return (
                  <div 
                    key={tz} 
                    className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition relative group"
                  >
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        {zoneMeta.country}
                      </div>
                      <div className="text-xl font-bold text-white">
                        {zoneMeta.city}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {formatFullDate(now, tz)}
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-4">
                      <div className="text-2xl md:text-3xl font-extrabold font-mono-numbers text-slate-100">
                        {formatDigitalTime(now, tz)}
                      </div>
                      {selectedZones.length > 1 && (
                        <button
                          onClick={() => setSelectedZones(selectedZones.filter(z => z !== tz))}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition"
                          title="Remove Timezone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STOPWATCH TAB */}
        {activeTab === 'stopwatch' && (
          <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4">
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-xl">
              <div className="text-6xl md:text-7xl font-extrabold font-mono-numbers text-white tracking-wider my-6">
                {formatStopwatch(stopwatchTime)}
              </div>

              <div className="flex items-center gap-4 mt-2">
                {!stopwatchRunning ? (
                  <button
                    onClick={() => setStopwatchRunning(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => setStopwatchRunning(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    Pause
                  </button>
                )}

                <button
                  disabled={!stopwatchRunning && stopwatchTime === 0}
                  onClick={handleStopwatchLap}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-2xl font-semibold text-sm border border-slate-700 transition"
                >
                  <Flag className="w-4 h-4" />
                  Lap
                </button>

                <button
                  onClick={() => {
                    setStopwatchRunning(false)
                    setStopwatchTime(0)
                    setLaps([])
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-2xl font-semibold text-sm border border-slate-800 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Laps Table */}
            {laps.length > 0 && (
              <div className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-4 max-h-60 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lap Splits</h3>
                <div className="space-y-1.5">
                  {laps.map(lap => (
                    <div key={lap.id} className="flex items-center justify-between py-1.5 px-3 bg-slate-950/60 rounded-xl text-xs font-mono">
                      <span className="text-slate-400">Lap #{lap.id}</span>
                      <span className="font-bold text-slate-200">{lap.formatted}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COUNTDOWN TIMER TAB */}
        {activeTab === 'timer' && (
          <div className="w-full max-w-xl flex flex-col items-center gap-6 py-4">
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center shadow-xl">
              {/* Progress Ring / Display */}
              <div className="text-6xl md:text-7xl font-extrabold font-mono-numbers text-white tracking-wider my-4">
                {formatTimer(timerLeft)}
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 h-full transition-all duration-300"
                  style={{ width: `${(timerLeft / timerInitial) * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {!timerRunning ? (
                  <button
                    disabled={timerLeft === 0}
                    onClick={() => setTimerRunning(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={() => setTimerRunning(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-600/30 transition transform hover:-translate-y-0.5"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    Pause
                  </button>
                )}

                <button
                  onClick={() => {
                    setTimerRunning(false)
                    setTimerLeft(timerInitial)
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-2xl font-semibold text-sm border border-slate-700 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                <button
                  onClick={() => setTimerSoundAlert(!timerSoundAlert)}
                  className={`p-3 rounded-2xl border transition ${
                    timerSoundAlert 
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' 
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Toggle Audio Alert"
                >
                  {timerSoundAlert ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Set Custom Timer Form */}
            <form onSubmit={handleSetCustomTimer} className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-400">Set Interval:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={timerInputH}
                  onChange={e => setTimerInputH(e.target.value)}
                  className="w-14 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-center text-xs text-white"
                  placeholder="HH"
                />
                <span className="text-slate-500 text-xs">h</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerInputM}
                  onChange={e => setTimerInputM(e.target.value)}
                  className="w-14 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-center text-xs text-white"
                  placeholder="MM"
                />
                <span className="text-slate-500 text-xs">m</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerInputS}
                  onChange={e => setTimerInputS(e.target.value)}
                  className="w-14 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-center text-xs text-white"
                  placeholder="SS"
                />
                <span className="text-slate-500 text-xs">s</span>
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-lg text-xs font-bold transition"
              >
                Apply
              </button>
            </form>
          </div>
        )}

        {/* ALARMS TAB */}
        {activeTab === 'alarm' && (
          <div className="w-full max-w-xl flex flex-col gap-6 py-4">
            {/* Create Alarm Card */}
            <form onSubmit={handleAddAlarm} className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-3 shadow-lg">
              <input
                type="time"
                value={alarmInputTime}
                onChange={e => setAlarmInputTime(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 font-mono"
                required
              />
              <input
                type="text"
                placeholder="Alarm Label (e.g. Meeting, Workout)"
                value={alarmInputLabel}
                onChange={e => setAlarmInputLabel(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
              >
                <Plus className="w-4 h-4" />
                Add Alarm
              </button>
            </form>

            {/* Alarm List */}
            <div className="space-y-3">
              {alarms.map(alarm => (
                <div
                  key={alarm.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                    alarm.enabled 
                      ? 'bg-slate-900/80 border-indigo-500/30 shadow-md' 
                      : 'bg-slate-900/30 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        alarm.enabled
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div className="text-2xl font-black font-mono-numbers text-white">
                        {alarm.time}
                      </div>
                      <div className="text-xs text-slate-400">
                        {alarm.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-indigo-400">
                      {alarm.enabled ? 'Active' : 'Muted'}
                    </span>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-6 border-t border-slate-800/80 text-center text-xs text-slate-500 mt-8">
        Built with React 19, Vite & Tailwind CSS • Integrated with GitHub & Vercel Preview
      </footer>
    </div>
  )
}
