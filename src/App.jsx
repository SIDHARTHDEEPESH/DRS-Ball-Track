import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Wand2, 
  Compass, 
  Hourglass, 
  Bell, 
  Flame, 
  Scroll, 
  Feather, 
  Moon, 
  Sun, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Check, 
  ShieldAlert, 
  BookOpen, 
  Star,
  Zap
} from 'lucide-react'

// Wizarding Realms / Locations
const WIZARDING_REALMS = [
  { location: 'Hogwarts Castle', label: 'Hogwarts Astral Clock', tz: 'Europe/London', tag: 'Scotland, UK', house: 'Gryffindor', houseColor: '#740001' },
  { location: 'Diagon Alley & Ministry', label: 'Ministry of Magic (London)', tz: 'Europe/London', tag: 'London, UK', house: 'Hufflepuff', houseColor: '#ecb939' },
  { location: 'Beauxbatons Academy', label: 'Pyrenees Observatory', tz: 'Europe/Paris', tag: 'France', house: 'Ravenclaw', houseColor: '#0e1a40' },
  { location: 'Durmstrang Institute', label: 'Northern Fjord Sanctuary', tz: 'Europe/Oslo', tag: 'Scandinavia', house: 'Slytherin', houseColor: '#1a472a' },
  { location: 'MACUSA & Ilvermorny', label: 'Mount Greylock Timekeeper', tz: 'America/New_York', tag: 'North America', house: 'Gryffindor', houseColor: '#740001' },
  { location: 'Mahoutokoro School', label: 'Minami Iwo Jima Chronometer', tz: 'Asia/Tokyo', tag: 'Japan', house: 'Ravenclaw', houseColor: '#0e1a40' },
  { location: 'Uagadou Academy', label: 'Mountains of the Moon Sphere', tz: 'Africa/Kampala', tag: 'Uganda', house: 'Hufflepuff', houseColor: '#ecb939' },
  { location: 'Castelobruxo Jungle', label: 'Amazonian Sun-Dial', tz: 'America/Manaus', tag: 'Brazil', house: 'Slytherin', houseColor: '#1a472a' },
  { location: 'Hogsmeade Village', label: 'Three Broomsticks Chiming Post', tz: 'Europe/London', tag: 'Highlands', house: 'Hufflepuff', houseColor: '#ecb939' },
]

// Weasley Family Grand Grandfather Clock Statuses
const WEASLEY_LOCATIONS = [
  { name: 'Home (The Burrow)', icon: '🏡', color: 'text-amber-300' },
  { name: 'Hogwarts', icon: '🏰', color: 'text-indigo-300' },
  { name: 'Ministry of Magic', icon: '🏛️', color: 'text-blue-300' },
  { name: 'Quidditch Pitch', icon: '🧹', color: 'text-emerald-300' },
  { name: 'Diagon Alley', icon: '✨', color: 'text-yellow-300' },
  { name: 'Lost in the Woods', icon: '🌲', color: 'text-orange-300' },
  { name: 'Mortal Peril', icon: '⚡', color: 'text-red-500 font-extrabold animate-pulse' },
  { name: 'Traveling by Floo Network', icon: '🔥', color: 'text-green-400' },
  { name: 'Dentist / Muggle World', icon: '🦷', color: 'text-purple-300' },
]

const WEASLEY_MEMBERS = [
  { id: 'arthur', name: 'Arthur Weasley', defaultLoc: 2 },
  { id: 'molly', name: 'Molly Weasley', defaultLoc: 0 },
  { id: 'bill', name: 'Bill Weasley', defaultLoc: 4 },
  { id: 'charlie', name: 'Charlie Weasley', defaultLoc: 5 },
  { id: 'percy', name: 'Percy Weasley', defaultLoc: 2 },
  { id: 'fred_george', name: 'Fred & George', defaultLoc: 4 },
  { id: 'ron', name: 'Ron Weasley', defaultLoc: 1 },
  { id: 'ginny', name: 'Ginny Weasley', defaultLoc: 1 },
  { id: 'harry', name: 'Harry Potter', defaultLoc: 6 },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('clock')
  const [now, setNow] = useState(new Date())
  const [is24Hour, setIs24Hour] = useState(false)
  const [activeHouse, setActiveHouse] = useState('gryffindor') // gryffindor, slytherin, ravenclaw, hufflepuff
  const [lumosGlow, setLumosGlow] = useState(true)

  // World Clocks State
  const [selectedRealms, setSelectedRealms] = useState([
    'Europe/London',
    'America/New_York',
    'Asia/Tokyo',
    'Europe/Paris'
  ])
  const [newRealm, setNewRealm] = useState('Africa/Kampala')

  // Weasley Clock State
  const [familyPositions, setFamilyPositions] = useState(
    WEASLEY_MEMBERS.reduce((acc, member) => {
      acc[member.id] = member.defaultLoc
      return acc
    }, {})
  )

  // Time-Turner (Stopwatch) State
  const [turnerRunning, setTurnerRunning] = useState(false)
  const [turnerTime, setTurnerTime] = useState(0) // ms
  const [hourglassTurns, setHourglassTurns] = useState([])

  // Potion Brewing (Countdown Timer) State
  const [potionRunning, setPotionRunning] = useState(false)
  const [potionInitial, setPotionInitial] = useState(420) // 7 mins for Polyjuice step
  const [potionLeft, setPotionLeft] = useState(420)
  const [potionPreset, setPotionPreset] = useState('Polyjuice Potion: Phase I (7m)')
  const [soundSpells, setSoundSpells] = useState(true)

  // Howler / Alarm Charms State
  const [howlers, setHowlers] = useState([
    { id: 1, time: '06:30', incantation: 'Astronomy Observation Tower', spell: 'Avis & Sonorus', enabled: true, house: 'Ravenclaw' },
    { id: 2, time: '09:00', incantation: 'Defense Against the Dark Arts', spell: 'Expecto Patronum Alert', enabled: true, house: 'Gryffindor' },
    { id: 3, time: '17:30', incantation: 'Quidditch Team Practice', spell: 'Golden Snitch Chime', enabled: false, house: 'Gryffindor' },
  ])
  const [howlerTime, setHowlerTime] = useState('08:00')
  const [howlerLabel, setHowlerLabel] = useState('')

  // Hogwarts Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date()
      setNow(currentDate)

      // Check Howler Alarms
      const currentHHMM = currentDate.toTimeString().slice(0, 5)
      const currentSec = currentDate.getSeconds()
      if (currentSec === 0) {
        howlers.forEach(h => {
          if (h.enabled && h.time === currentHHMM) {
            playSpellChime()
            alert(`📜 HOWLER ENCHANTMENT ACTIVATED!\n\n"${h.incantation}"\nCast with ${h.spell} at ${h.time}`)
          }
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [howlers])

  // Time Turner (Stopwatch) ticker
  useEffect(() => {
    let interval = null
    if (turnerRunning) {
      const start = Date.now() - turnerTime
      interval = setInterval(() => {
        setTurnerTime(Date.now() - start)
      }, 10)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [turnerRunning])

  // Potion Brewing Countdown ticker
  useEffect(() => {
    let interval = null
    if (potionRunning && potionLeft > 0) {
      interval = setInterval(() => {
        setPotionLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setPotionRunning(false)
            if (soundSpells) {
              playSpellChime()
            }
            alert('🧪 POTION BREWING COMPLETE!\nYour cauldron has reached optimal magical distillation!')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [potionRunning, potionLeft, soundSpells])

  // Magical Synthesizer Audio Spell
  const playSpellChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3) // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.7) // D6 (Hedwig style chime)
      gain.gain.setValueAtTime(0.35, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 1.2)
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
    return new Intl.DateTimeFormat('en-GB', options).format(date)
  }

  const formatWizardDate = (date, tz = undefined) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tz
    }
    return new Intl.DateTimeFormat('en-GB', options).format(date)
  }

  const formatStopwatch = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`
  }

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const recordTimeTurn = () => {
    setHourglassTurns(prev => [
      { id: prev.length + 1, time: turnerTime, formatted: formatStopwatch(turnerTime), note: `Turn #${prev.length + 1} Sands of Time Reversed` },
      ...prev
    ])
  }

  // Handle Preset Potions
  const handlePotionPresetChange = (name, seconds) => {
    setPotionPreset(name)
    setPotionInitial(seconds)
    setPotionLeft(seconds)
    setPotionRunning(false)
  }

  // House Themes
  const houseThemes = {
    gryffindor: {
      name: 'Gryffindor',
      crest: '🦁',
      accent: '#d4af37',
      badgeBg: 'bg-[#740001] border-[#eeba30] text-[#f3e5ab]',
      cardBorder: 'border-[#d4af37]/40 hover:border-[#eeba30]',
      glow: 'shadow-[0_0_30px_rgba(212,175,55,0.3)]',
      gradient: 'from-[#740001]/90 via-[#3c0000]/80 to-[#120000]/95',
      motto: 'Fortitudo et Virtus • Where dwell the brave at heart',
    },
    slytherin: {
      name: 'Slytherin',
      crest: '🐍',
      accent: '#2ecc71',
      badgeBg: 'bg-[#1a472a] border-[#aaaaaa] text-[#e8f5e9]',
      cardBorder: 'border-[#2ecc71]/40 hover:border-[#27ae60]',
      glow: 'shadow-[0_0_30px_rgba(46,204,113,0.3)]',
      gradient: 'from-[#1a472a]/90 via-[#0d2616]/80 to-[#051109]/95',
      motto: 'Astutia et Ambitio • Greatness through cunning & ambition',
    },
    ravenclaw: {
      name: 'Ravenclaw',
      crest: '🦅',
      accent: '#64b5f6',
      badgeBg: 'bg-[#0e1a40] border-[#946b2d] text-[#e3f2fd]',
      cardBorder: 'border-[#64b5f6]/40 hover:border-[#42a5f5]',
      glow: 'shadow-[0_0_30px_rgba(100,181,246,0.3)]',
      gradient: 'from-[#0e1a40]/90 via-[#070e24]/80 to-[#020512]/95',
      motto: 'Sapientia et Ingenium • Wit beyond measure is man’s greatest treasure',
    },
    hufflepuff: {
      name: 'Hufflepuff',
      crest: '🦡',
      accent: '#f1c40f',
      badgeBg: 'bg-[#ecb939] border-[#372e29] text-[#1a120b] font-bold',
      cardBorder: 'border-[#f1c40f]/40 hover:border-[#e67e22]',
      glow: 'shadow-[0_0_30px_rgba(241,196,15,0.3)]',
      gradient: 'from-[#8b6914]/90 via-[#42330a]/80 to-[#191404]/95',
      motto: 'Fidelitas et Constantia • Just, loyal, true, and unafraid of toil',
    }
  }

  const currentHouse = houseThemes[activeHouse]

  // Analog angles
  const sec = now.getSeconds()
  const min = now.getMinutes()
  const hr = now.getHours()
  const secDeg = (sec / 60) * 360
  const minDeg = ((min + sec / 60) / 60) * 360
  const hrDeg = (((hr % 12) + min / 60) / 12) * 360

  return (
    <div className={`min-h-screen text-[#f5ebd7] flex flex-col items-center p-3 md:p-6 transition-all duration-700 relative overflow-x-hidden ${lumosGlow ? 'brightness-105' : 'brightness-90'}`}>
      
      {/* Mystical Background Stars & Rune Watermark */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Main Header */}
      <header className={`w-full max-w-6xl relative z-10 flex flex-col md:flex-row items-center justify-between p-6 rounded-3xl border ${currentHouse.cardBorder} bg-gradient-to-r ${currentHouse.gradient} ${currentHouse.glow} backdrop-blur-md mb-6 transition-all duration-500`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#8c6d1f] to-[#42330a] p-0.5 shadow-xl flex items-center justify-center border border-[#f3e5ab]/40">
            <div className="w-full h-full bg-[#0d0a14] rounded-2xl flex items-center justify-center text-2xl">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black font-magical tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fff2cc] via-[#d4af37] to-[#eeba30]">
                Hogwarts Grand Horologium
              </h1>
            </div>
            <p className="text-xs font-parchment text-[#d4af37]/90 tracking-wide">
              {currentHouse.crest} {currentHouse.name} Alignment • {currentHouse.motto}
            </p>
          </div>
        </div>

        {/* House Switcher & Lumos Spell */}
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
          <div className="flex bg-[#07050b]/90 p-1.5 rounded-2xl border border-[#d4af37]/30 shadow-inner">
            {Object.keys(houseThemes).map(hKey => {
              const h = houseThemes[hKey]
              const isSelected = activeHouse === hKey
              return (
                <button
                  key={hKey}
                  onClick={() => setActiveHouse(hKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cinzel transition-all duration-300 flex items-center gap-1.5 ${
                    isSelected 
                      ? `${h.badgeBg} shadow-lg scale-105 border` 
                      : 'text-[#c2b490] hover:text-white hover:bg-[#1a1426]'
                  }`}
                  title={h.motto}
                >
                  <span>{h.crest}</span>
                  <span className="hidden sm:inline">{h.name}</span>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setLumosGlow(!lumosGlow)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-cinzel font-bold transition-all shadow-md ${
              lumosGlow 
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#fff2cc] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                : 'bg-[#0d0a14] border-[#3a2e1e] text-[#8c7b60]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{lumosGlow ? 'Lumos Maxima' : 'Nox'}</span>
          </button>

          <button
            onClick={() => setIs24Hour(!is24Hour)}
            className="px-3.5 py-2 rounded-2xl border border-[#d4af37]/40 bg-[#0d0a14]/80 text-[#d4af37] text-xs font-cinzel font-semibold hover:bg-[#1f172e] transition"
          >
            {is24Hour ? '24-Hour Cycle' : '12-Hour Chime'}
          </button>
        </div>
      </header>

      {/* Navigation Tabs (Marauder & Ministry Aesthetic) */}
      <nav className="w-full max-w-6xl relative z-10 flex items-center justify-center gap-2 md:gap-3 mb-6 overflow-x-auto py-2 px-1">
        {[
          { id: 'clock', label: 'Astral Dial & Time', icon: Compass, spell: 'Tempus Fugit' },
          { id: 'weasley', label: 'Weasley Family Clock', icon: Wand2, spell: 'Locomotor Familia' },
          { id: 'world', label: 'Wizarding Observatories', icon: Sparkles, spell: 'Mundus Visio' },
          { id: 'timeturner', label: 'Hermione’s Time-Turner', icon: Hourglass, spell: 'Chronos Reverto' },
          { id: 'potions', label: 'Cauldron Brewing Timer', icon: Flame, spell: 'Potio Coctio' },
          { id: 'howlers', label: 'Howler Alarms & Charms', icon: Bell, spell: 'Sonorus Evoco' },
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2.5 rounded-2xl font-cinzel font-bold text-xs tracking-wider transition-all duration-300 border ${
                isActive 
                  ? 'bg-gradient-to-r from-[#d4af37]/30 via-[#eeba30]/20 to-[#d4af37]/30 text-[#fff2cc] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.35)] scale-102' 
                  : 'bg-[#0e0a17]/70 text-[#ad9d7b] hover:bg-[#1a1329] hover:text-[#f3e5ab] border-[#2e2316]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#d4af37]" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Content Container */}
      <main className="w-full max-w-6xl relative z-10 flex-1 flex flex-col items-center">
        
        {/* 1. ASTRAL DIAL & DIGITAL TIME */}
        {activeTab === 'clock' && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Wizarding Digital Clock & Moon Phase */}
            <div className="lg:col-span-7 bg-[#100b1d]/80 border-2 border-[#d4af37]/50 rounded-3xl p-6 md:p-8 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between">
              {/* Golden Corner Accents */}
              <div className="absolute top-2 left-2 text-[#d4af37]/60 text-lg font-serif select-none">⚜</div>
              <div className="absolute top-2 right-2 text-[#d4af37]/60 text-lg font-serif select-none">⚜</div>
              <div className="absolute bottom-2 left-2 text-[#d4af37]/60 text-lg font-serif select-none">⚜</div>
              <div className="absolute bottom-2 right-2 text-[#d4af37]/60 text-lg font-serif select-none">⚜</div>

              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#eeba30] text-xs font-cinzel font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Great Hall Tower Celestial Sync
                </div>

                <div className="text-5xl sm:text-7xl font-extrabold font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fff1c2] to-[#d4af37] drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)]">
                  {formatDigitalTime(now)}
                </div>

                <div className="text-xl sm:text-2xl font-parchment italic text-[#e8d7b0] mt-2 font-medium">
                  {formatWizardDate(now)}
                </div>
              </div>

              {/* Astrological & Wizarding Almanac Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-[#d4af37]/20 text-xs font-cinzel">
                <div className="bg-[#08050e]/80 p-3 rounded-2xl border border-[#3b2b18] flex flex-col gap-1">
                  <span className="text-[#998762] text-[10px] uppercase">Moon Phase</span>
                  <span className="font-bold text-[#f3e5ab] flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-[#d4af37]" /> Waxing Gibbous
                  </span>
                </div>
                <div className="bg-[#08050e]/80 p-3 rounded-2xl border border-[#3b2b18] flex flex-col gap-1">
                  <span className="text-[#998762] text-[10px] uppercase">Astral Hour</span>
                  <span className="font-bold text-[#f3e5ab] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Jupiter in Leo
                  </span>
                </div>
                <div className="bg-[#08050e]/80 p-3 rounded-2xl border border-[#3b2b18] flex flex-col gap-1">
                  <span className="text-[#998762] text-[10px] uppercase">Floo Network</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> All Grates Clear
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Golden Hogwarts Dial (Analog Astrolabe) */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-[#1c142b] via-[#0e0917] to-[#06040a] border-4 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center p-2">
                {/* Outer Astrolabe Rune Ring */}
                <div className="absolute inset-1 rounded-full border border-dashed border-[#d4af37]/40 pointer-events-none" />
                
                {/* Roman Numerals */}
                {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((num, i) => (
                  <div
                    key={num}
                    className="absolute font-magical font-bold text-[#d4af37] text-xs sm:text-sm"
                    style={{
                      transform: `rotate(${i * 30}deg) translateY(-120px) rotate(-${i * 30}deg)`,
                      textShadow: '0 0 8px rgba(212,175,55,0.6)'
                    }}
                  >
                    {num}
                  </div>
                ))}

                {/* Star Chart Background inside dial */}
                <div className="w-36 h-36 rounded-full border border-[#d4af37]/20 flex items-center justify-center opacity-40">
                  <div className="w-24 h-24 rounded-full border border-dashed border-[#d4af37]/40" />
                </div>

                {/* Hour Hand (Ornate Antique Bronze Blade) */}
                <div
                  className="absolute w-2 bg-gradient-to-t from-[#8c6d1f] to-[#f3e5ab] rounded-full origin-bottom shadow-lg border border-[#3a290c]"
                  style={{
                    height: '75px',
                    bottom: '50%',
                    transform: `rotate(${hrDeg}deg)`,
                    transition: 'transform 0.05s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                  }}
                />

                {/* Minute Hand (Slender Golden Wand Hand) */}
                <div
                  className="absolute w-1.5 bg-gradient-to-t from-[#d4af37] via-[#fff2cc] to-[#ffffff] rounded-full origin-bottom shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                  style={{
                    height: '105px',
                    bottom: '50%',
                    transform: `rotate(${minDeg}deg)`,
                    transition: 'transform 0.05s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                  }}
                />

                {/* Second Hand (Golden Snitch Needle in Crimson) */}
                <div
                  className="absolute w-0.5 bg-[#e53935] origin-bottom shadow-[0_0_8px_#e53935]"
                  style={{
                    height: '118px',
                    bottom: '50%',
                    transform: `rotate(${secDeg}deg)`,
                    transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                  }}
                />

                {/* Center Golden Boss */}
                <div className="absolute w-5 h-5 bg-gradient-to-tr from-[#8c6d1f] via-[#d4af37] to-[#fff2cc] rounded-full border-2 border-[#12091f] shadow-lg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#740001] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. WEASLEY FAMILY GRAND CLOCK */}
        {activeTab === 'weasley' && (
          <div className="w-full flex flex-col gap-6 py-2">
            <div className="bg-[#100b1d]/80 border-2 border-[#d4af37]/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
                <div>
                  <h2 className="text-xl font-magical font-bold text-[#f3e5ab] flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-[#d4af37]" />
                    The Burrow Multi-Handed Grandfather Clock
                  </h2>
                  <p className="text-xs font-parchment text-[#c4b38d]">
                    Nine golden hands tracking every Weasley family member across the British Isles & Wizarding World.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-cinzel text-red-400 font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/60 border border-red-700/50">
                    <ShieldAlert className="w-4 h-4" /> Threat Gauge: Elevated
                  </span>
                </div>
              </div>

              {/* Family Members Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {WEASLEY_MEMBERS.map(member => {
                  const currentLocIndex = familyPositions[member.id] || 0
                  const loc = WEASLEY_LOCATIONS[currentLocIndex]
                  return (
                    <div 
                      key={member.id}
                      className="p-4 rounded-2xl bg-[#08050e]/90 border border-[#3b2b18] hover:border-[#d4af37]/60 transition-all flex flex-col justify-between shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-cinzel font-bold text-sm text-[#f5ebd7] group-hover:text-[#d4af37] transition">
                          {member.name}
                        </span>
                        <span className="text-lg">{loc.icon}</span>
                      </div>

                      <div className="my-3">
                        <span className="text-[10px] font-cinzel uppercase text-[#8c7b60] block">Current Whereabouts</span>
                        <span className={`text-sm font-cinzel font-bold ${loc.color}`}>
                          {loc.name}
                        </span>
                      </div>

                      {/* Change Location Selector */}
                      <select
                        value={currentLocIndex}
                        onChange={(e) => {
                          const val = Number(e.target.value)
                          setFamilyPositions(prev => ({ ...prev, [member.id]: val }))
                        }}
                        className="w-full bg-[#120d20] border border-[#3b2b18] text-[#e3d5b1] text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-[#d4af37] font-cinzel"
                      >
                        {WEASLEY_LOCATIONS.map((l, idx) => (
                          <option key={l.name} value={idx}>
                            {l.icon} {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. WIZARDING OBSERVATORIES (WORLD CLOCKS) */}
        {activeTab === 'world' && (
          <div className="w-full flex flex-col gap-6 py-2">
            <div className="bg-[#100b1d]/80 border-2 border-[#d4af37]/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[#d4af37]/20">
                <div>
                  <h2 className="text-xl font-magical font-bold text-[#f3e5ab] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#d4af37]" />
                    Global Wizarding Academies & Observatories
                  </h2>
                  <p className="text-xs font-parchment text-[#c4b38d]">
                    Astrological synchronization across magical ministries and international wizarding institutions.
                  </p>
                </div>

                {/* Add Realm Selector */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <select
                    value={newRealm}
                    onChange={(e) => setNewRealm(e.target.value)}
                    className="bg-[#08050e] border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-cinzel rounded-xl px-3 py-2 outline-none"
                  >
                    {WIZARDING_REALMS.map(r => (
                      <option key={r.label} value={r.tz} disabled={selectedRealms.includes(r.tz)}>
                        {r.location} ({r.tag})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!selectedRealms.includes(newRealm)) {
                        setSelectedRealms([...selectedRealms, newRealm])
                      }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#eeba30] text-[#12091f] rounded-xl text-xs font-cinzel font-bold shadow-lg hover:brightness-110 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Enchant
                  </button>
                </div>
              </div>

              {/* Realms Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {selectedRealms.map(tz => {
                  const realmMeta = WIZARDING_REALMS.find(r => r.tz === tz) || { location: tz, tag: 'Magical Realm', label: tz }
                  return (
                    <div 
                      key={tz}
                      className="p-5 rounded-2xl bg-[#08050e]/90 border border-[#3b2b18] hover:border-[#d4af37]/60 transition flex items-center justify-between group relative"
                    >
                      <div>
                        <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#d4af37]">
                          {realmMeta.tag}
                        </span>
                        <h3 className="text-lg font-cinzel font-bold text-[#fff2cc]">
                          {realmMeta.location}
                        </h3>
                        <p className="text-xs font-parchment text-[#ad9d7b] italic mt-0.5">
                          {formatWizardDate(now, tz)}
                        </p>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div className="text-2xl sm:text-3xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-white to-[#d4af37]">
                          {formatDigitalTime(now, tz)}
                        </div>

                        {selectedRealms.length > 1 && (
                          <button
                            onClick={() => setSelectedRealms(selectedRealms.filter(z => z !== tz))}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-[#8c7b60] hover:text-red-400 rounded-lg transition"
                            title="Dispel Observatory"
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
          </div>
        )}

        {/* 4. HERMIONE’S TIME-TURNER (STOPWATCH) */}
        {activeTab === 'timeturner' && (
          <div className="w-full max-w-xl flex flex-col items-center gap-6 py-2">
            <div className="w-full bg-[#100b1d]/80 border-2 border-[#d4af37]/50 rounded-3xl p-8 flex flex-col items-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#eeba30] text-xs font-cinzel font-semibold mb-2">
                <Hourglass className="w-3.5 h-3.5 animate-bounce" />
                Ministry Ministry Department of Mysteries Device
              </div>

              {/* Time Display */}
              <div className="text-6xl sm:text-7xl font-extrabold font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fff1c2] to-[#d4af37] my-6">
                {formatStopwatch(turnerTime)}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {!turnerRunning ? (
                  <button
                    onClick={() => setTurnerRunning(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#eeba30] text-[#12091f] rounded-2xl font-cinzel font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-110 transition transform hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4 fill-[#12091f]" />
                    Turn Hourglass
                  </button>
                ) : (
                  <button
                    onClick={() => setTurnerRunning(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-cinzel font-bold text-sm shadow-lg hover:brightness-110 transition transform hover:-translate-y-0.5"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    Halt Flux
                  </button>
                )}

                <button
                  disabled={!turnerRunning && turnerTime === 0}
                  onClick={recordTimeTurn}
                  className="flex items-center gap-2 px-5 py-3 bg-[#171026] hover:bg-[#23183b] disabled:opacity-40 text-[#f3e5ab] rounded-2xl font-cinzel font-semibold text-sm border border-[#d4af37]/40 transition"
                >
                  <Scroll className="w-4 h-4 text-[#d4af37]" />
                  Log Turn
                </button>

                <button
                  onClick={() => {
                    setTurnerRunning(false)
                    setTurnerTime(0)
                    setHourglassTurns([])
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-[#0a0712] hover:bg-[#140e24] text-[#ad9d7b] rounded-2xl font-cinzel font-semibold text-sm border border-[#3b2b18] transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Sands
                </button>
              </div>
            </div>

            {/* Time Turned History */}
            {hourglassTurns.length > 0 && (
              <div className="w-full bg-[#100b1d]/60 border border-[#d4af37]/30 rounded-2xl p-4 max-h-60 overflow-y-auto">
                <h3 className="text-xs font-cinzel font-bold text-[#d4af37] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Feather className="w-3.5 h-3.5" /> Hourglass Turning Logs
                </h3>
                <div className="space-y-1.5 font-cinzel">
                  {hourglassTurns.map(lap => (
                    <div key={lap.id} className="flex items-center justify-between py-2 px-3 bg-[#08050e]/80 rounded-xl text-xs border border-[#2b1f14]">
                      <span className="text-[#c4b38d]">{lap.note}</span>
                      <span className="font-bold text-[#d4af37]">{lap.formatted}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. POTION BREWING CAULDRON (COUNTDOWN TIMER) */}
        {activeTab === 'potions' && (
          <div className="w-full max-w-xl flex flex-col items-center gap-6 py-2">
            <div className="w-full bg-[#100b1d]/80 border-2 border-[#d4af37]/50 rounded-3xl p-8 flex flex-col items-center shadow-2xl backdrop-blur-xl relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-cinzel font-semibold mb-2">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                {potionPreset}
              </div>

              {/* Progress and Time Display */}
              <div className="text-6xl sm:text-7xl font-extrabold font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-200 to-[#d4af37] my-4">
                {formatTimer(potionLeft)}
              </div>

              <div className="w-full bg-[#08050e] h-2.5 rounded-full overflow-hidden mb-6 border border-[#3b2b18]">
                <div 
                  className="bg-gradient-to-r from-emerald-600 via-[#d4af37] to-amber-500 h-full transition-all duration-300"
                  style={{ width: `${(potionLeft / potionInitial) * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {!potionRunning ? (
                  <button
                    disabled={potionLeft === 0}
                    onClick={() => setPotionRunning(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 disabled:opacity-50 text-white rounded-2xl font-cinzel font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110 transition transform hover:-translate-y-0.5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Light Flame
                  </button>
                ) : (
                  <button
                    onClick={() => setPotionRunning(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-cinzel font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    <Pause className="w-4 h-4 fill-white" />
                    Simmer
                  </button>
                )}

                <button
                  onClick={() => {
                    setPotionRunning(false)
                    setPotionLeft(potionInitial)
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-[#171026] hover:bg-[#23183b] text-[#f3e5ab] rounded-2xl font-cinzel font-semibold text-sm border border-[#d4af37]/40 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  Douse & Reset
                </button>

                <button
                  onClick={() => setSoundSpells(!soundSpells)}
                  className={`p-3 rounded-2xl border transition ${
                    soundSpells 
                      ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' 
                      : 'bg-[#08050e] border-[#3b2b18] text-[#8c7b60]'
                  }`}
                  title="Toggle Spell Audio Chimes"
                >
                  {soundSpells ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Potion Recipe Presets */}
            <div className="w-full bg-[#100b1d]/60 border border-[#d4af37]/30 rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-xs font-cinzel font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Standard Book of Spells & Potions:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {[
                  { name: 'Polyjuice Potion: Phase I (7m)', sec: 420 },
                  { name: 'Felix Felicis: Gold Stir (15m)', sec: 900 },
                  { name: 'Draught of Peace: Simmer (5m)', sec: 300 },
                  { name: 'Pepperup Potion: Rapid Boil (2m)', sec: 120 },
                ].map(recipe => (
                  <button
                    key={recipe.name}
                    onClick={() => handlePotionPresetChange(recipe.name, recipe.sec)}
                    className="text-left px-3 py-2 rounded-xl bg-[#08050e] border border-[#2b1f14] hover:border-[#d4af37]/60 text-xs font-cinzel text-[#e3d5b1] hover:text-[#d4af37] transition"
                  >
                    ✨ {recipe.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. HOWLER ALARMS & INCANTATIONS */}
        {activeTab === 'howlers' && (
          <div className="w-full max-w-xl flex flex-col gap-6 py-2">
            {/* Create Howler Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                if (!howlerTime) return
                const newHowler = {
                  id: Date.now(),
                  time: howlerTime,
                  incantation: howlerLabel.trim() || 'Classroom Charm Alert',
                  spell: 'Sonorus Echo',
                  enabled: true,
                  house: activeHouse
                }
                setHowlers(prev => [...prev, newHowler])
                setHowlerLabel('')
              }}
              className="w-full bg-[#100b1d]/80 border-2 border-[#d4af37]/50 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-3 shadow-xl backdrop-blur-xl"
            >
              <input
                type="time"
                value={howlerTime}
                onChange={e => setHowlerTime(e.target.value)}
                className="bg-[#08050e] border border-[#d4af37]/40 text-[#f3e5ab] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#d4af37] font-cinzel"
                required
              />
              <input
                type="text"
                placeholder="Incantation (e.g. Care of Magical Creatures)"
                value={howlerLabel}
                onChange={e => setHowlerLabel(e.target.value)}
                className="flex-1 bg-[#08050e] border border-[#d4af37]/40 text-[#f3e5ab] placeholder-[#8c7b60] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#d4af37] font-cinzel"
              />
              <button
                type="submit"
                className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-[#740001] via-[#d4af37] to-[#740001] text-white rounded-xl text-xs font-cinzel font-bold shadow-lg hover:brightness-110 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Cast Howler
              </button>
            </form>

            {/* List of Howlers */}
            <div className="space-y-3">
              {howlers.map(howler => (
                <div
                  key={howler.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                    howler.enabled 
                      ? 'bg-[#100b1d]/90 border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                      : 'bg-[#08050e]/50 border-[#2b1f14] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setHowlers(prev => prev.map(h => h.id === howler.id ? { ...h, enabled: !h.enabled } : h))}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition ${
                        howler.enabled
                          ? 'bg-[#d4af37] border-[#fff2cc] text-[#12091f]'
                          : 'bg-[#08050e] border-[#3b2b18] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <div>
                      <div className="text-2xl font-black font-cinzel text-[#fff2cc]">
                        {howler.time}
                      </div>
                      <div className="text-xs font-parchment text-[#d4af37]">
                        {howler.incantation} • <span className="italic text-[#c4b38d]">{howler.spell}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-cinzel font-semibold text-[#d4af37]">
                      {howler.enabled ? 'Enchanted' : 'Silenced'}
                    </span>
                    <button
                      onClick={() => setHowlers(prev => prev.filter(h => h.id !== howler.id))}
                      className="p-1.5 text-[#8c7b60] hover:text-red-400 rounded-lg transition"
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
      <footer className="w-full max-w-6xl py-6 border-t border-[#d4af37]/20 text-center text-xs font-parchment text-[#8c7b60] mt-8">
        Hogwarts School of Witchcraft & Wizardry • Headmaster Approved Horologium • React 19 & Tailwind CSS
      </footer>
    </div>
  )
}
