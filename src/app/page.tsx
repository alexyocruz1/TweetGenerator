'use client'

import { useState, useMemo } from 'react'
import html2canvas from 'html2canvas'
import Select from 'react-select'

type Match = {
  id: number
  home: string
  away: string
  competitionEmoji: string
  competitionName: string
  flagInputValue: string
  selectedFlag: { value: string, label: string } | null
  bet: string
  odds: string
  description: string
  confidence: number
}

type Competition = {
  emoji: string
  name: string
}

type FlagOption = {
  emoji: string
  country: string
}

const flagOptions: FlagOption[] = [
  { emoji: '🗺️', country: 'Mundial' },
  { emoji: '🇪🇺', country: 'Europa' },
  { emoji: '🌎', country: 'América' },
  { emoji: '🌏', country: 'Asia' },
  { emoji: '🌍', country: 'África' },
  { emoji: '🇨🇴', country: 'Colombia' },
  { emoji: '🇪🇸', country: 'Spain' },
  { emoji: '🇬🇧', country: 'England' },
  { emoji: '🇮🇹', country: 'Italy' },
  { emoji: '🇫🇷', country: 'France' },
  { emoji: '🇩🇪', country: 'Germany' },
  { emoji: '🇦🇷', country: 'Argentina' },
  { emoji: '🇧🇷', country: 'Brazil' },
  { emoji: '🇲🇽', country: 'Mexico' },
  { emoji: '🇺🇸', country: 'USA' },
  { emoji: '🇯🇵', country: 'Japan' },
  { emoji: '🇰🇷', country: 'South Korea' },
  { emoji: '🇨🇳', country: 'China' },
  { emoji: '🇷🇺', country: 'Russia' },
  { emoji: '🇵🇹', country: 'Portugal' },
  { emoji: '🇳🇱', country: 'Netherlands' },
  { emoji: '🇧🇪', country: 'Belgium' },
  { emoji: '🇨🇭', country: 'Switzerland' },
  { emoji: '🇦🇹', country: 'Austria' },
  { emoji: '🇹🇷', country: 'Turkey' },
  { emoji: '🇸🇦', country: 'Saudi Arabia' },
  { emoji: '🇦🇺', country: 'Australia' },
  { emoji: '🇿🇦', country: 'South Africa' },
  { emoji: '🇪🇬', country: 'Egypt' },
  { emoji: '🇲🇦', country: 'Morocco' },
  { emoji: '🇨🇱', country: 'Chile' },
  { emoji: '🇵🇪', country: 'Peru' },
  { emoji: '🇺🇾', country: 'Uruguay' },
  { emoji: '🇪🇨', country: 'Ecuador' },
  { emoji: '🇻🇪', country: 'Venezuela' },
  { emoji: '🇵🇾', country: 'Paraguay' },
  { emoji: '🇧🇴', country: 'Bolivia' },
  { emoji: '🇭🇳', country: 'Honduras' },
  { emoji: '🇨🇷', country: 'Costa Rica' },
  { emoji: '🇸🇻', country: 'El Salvador' },
  { emoji: '🇬🇹', country: 'Guatemala' },
  { emoji: '🇵🇦', country: 'Panama' },
  { emoji: '🇯🇲', country: 'Jamaica' },
  { emoji: '🇭🇹', country: 'Haiti' },
]

function generateHashtag(teamName: string): string {
  const words = teamName.split(/\s+/).filter(w => w.length > 0)
  if (words.length === 1) {
    return '#' + words[0]
  }
  if (words.length === 2 && words[0].length >= 4 && words[1].length >= 4) {
    return '#' + words[0] + words[1]
  }
  const longWords = words.filter(w => w.length >= 3).sort((a, b) => b.length - a.length)
  return longWords.length > 0 ? '#' + longWords[0] : '#' + words[0]
}

function toTitleCase(str: string): string {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function generateTweet(match: Match, index: number, total: number): string {
  const homeHashtag = generateHashtag(match.home)
  const awayHashtag = generateHashtag(match.away)
  return `⚽ TIPS DEL DÍA | ADN Futbolero ${index}/${total}

${match.competitionEmoji} ${toTitleCase(match.home)} vs ${toTitleCase(match.away)}
🏆 ${toTitleCase(match.competitionName)}
🎯 ${toTitleCase(match.bet)} @ ${match.odds}
💡 ${toTitleCase(match.description)}

${homeHashtag} ${awayHashtag}`
}

type ResultsTweetTemplate = {
  title: string
  matchStatus: string
  dayLabel: string
  daySuffix: string
  recapSuffix: string
  hashtag: string
}

function generateResultsTweet(matches: Match[], template: ResultsTweetTemplate): string {
  const total = matches.length
  const matchesLines = matches.length > 0
    ? matches
      .map((match, index) => `${toTitleCase(match.home)} vs ${toTitleCase(match.away)} → ${index % 2 === 0 ? template.matchStatusWon : template.matchStatusLost}`)
      .join('\n')
    : 'Sin partidos cargados'

  return `${template.title}

${matchesLines}

${template.dayLabel} ${total}/${total}${template.daySuffix}

${total} ${total === 1 ? template.recapSuffix : template.recapSuffixPlural}

${template.hashtag}`
}

async function generateImage(match: Match, theme: 'light' | 'dark', template: 'standard' | 'split' | 'minimal'): Promise<string> {
  const div = document.createElement('div')
  div.style.width = '1080px'
  div.style.height = '1920px'
  div.style.background = theme === 'light' 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
  div.style.color = 'white'
  div.style.display = 'flex'
  div.style.flexDirection = 'column'
  div.style.justifyContent = 'center'
  div.style.alignItems = 'center'
  div.style.padding = '60px'
  div.style.fontFamily = 'Arial, sans-serif'
  div.style.textAlign = 'center'
  div.style.position = 'relative'
  div.style.overflow = 'hidden'

  // Add some decorative elements
  div.innerHTML = `
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
    
    <div style="position: relative; z-index: 1; background: rgba(0,0,0,0.3); border-radius: 20px; padding: 40px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.3); max-width: 800px; width: 100%;">
      ${template === 'minimal' ? `
        <div style="font-size: 28px; margin-bottom: 15px; opacity: 0.9;">⚽ ADN FUTBOLERO</div>
        
        <h1 style="font-size: 64px; font-weight: bold; margin-bottom: 25px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); line-height: 1.1;">
          ${toTitleCase(match.home)}<br><span style="font-size: 40px; color: #ffd700;">VS</span><br>${toTitleCase(match.away)}
        </h1>
        
        <div style="font-size: 32px; line-height: 1.3; margin-bottom: 25px; font-style: italic;">
          "${toTitleCase(match.description)}"
        </div>
        
        <div style="font-size: 22px; opacity: 0.8;">
          #ADNFutbolero
        </div>
      ` : `
        <div style="font-size: 24px; margin-bottom: 15px; opacity: 0.9; background: rgba(255,215,0,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block; border: 1px solid rgba(255,215,0,0.3);">🔥 PREDICCIÓN DEL DÍA 🔥</div>
        
        <div style="font-size: 32px; margin-bottom: 20px; opacity: 0.9;">⚽ ADN FUTBOLERO</div>
        
        ${template === 'split' ? `
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 30px;">
            <div style="flex: 1; text-align: right; padding-right: 20px;">
              <div style="font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); line-height: 1.1;">${toTitleCase(match.home)}</div>
            </div>
            <div style="font-size: 64px; color: #ffd700; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); margin: 0 15px;">VS</div>
            <div style="flex: 1; text-align: left; padding-left: 20px;">
              <div style="font-size: 48px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); line-height: 1.1;">${toTitleCase(match.away)}</div>
            </div>
          </div>
        ` : `
          <h1 style="font-size: 72px; font-weight: bold; margin-bottom: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); line-height: 1.1;">
            ${toTitleCase(match.home)}<br><span style="font-size: 48px; color: #ffd700;">VS</span><br>${toTitleCase(match.away)}
          </h1>
        `}
        
        <div style="font-size: 44px; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <span>${match.competitionEmoji}</span>
          <span>${toTitleCase(match.competitionName)}</span>
        </div>
        
        ${match.confidence > 0 && (template === 'standard' || template === 'split') ? `
          <div style="margin-bottom: 30px;">
            <div style="font-size: 26px; margin-bottom: 10px; opacity: 0.9;">Confianza:</div>
            <div style="font-size: 36px;">${'⭐'.repeat(match.confidence)}${'☆'.repeat(5 - match.confidence)}</div>
          </div>
        ` : ''}
        
        <div style="font-size: 36px; line-height: 1.4; margin-bottom: 30px; font-style: italic;">
          "${toTitleCase(match.description)}"
        </div>
        
        <div style="font-size: 26px; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 20px; margin-bottom: 20px;">
          #ADNFutbolero #Predicciones
        </div>
        
        ${(template === 'standard' || template === 'split') ? `
          <div style="font-size: 20px; opacity: 0.7; text-align: center;">
            ¡Sigue @adn_futbolero_ en X para más predicciones! 💬
          </div>
        ` : ''}
      `}
    </div>
  `
  document.body.appendChild(div)
  const canvas = await html2canvas(div, { width: 1080, height: 1920, backgroundColor: null })
  document.body.removeChild(div)
  return canvas.toDataURL('image/png')
}

function downloadImage(dataUrl: string, filename: string) {
  // Convert data URL to blob
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const blob = new Blob([u8arr], { type: mime })

  // Check if Web Share API is available and can share files
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: mime })] })) {
    const file = new File([blob], filename, { type: mime })
    navigator.share({
      files: [file],
      title: 'Imagen de predicción ADN Futbolero'
    }).catch(err => {
      console.log('Error sharing:', err)
      mobileFallback(blob, filename)
    })
  } else {
    mobileFallback(blob, filename)
  }
}

function mobileFallback(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)

  // Check if it's iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  if (isIOS && isSafari) {
    // For iOS Safari, create a temporary page with the image and instructions
    const imageWindow = window.open('', '_blank')
    if (imageWindow) {
      imageWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Guardar Imagen - ADN Futbolero</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f5f5f5;
                text-align: center;
              }
              .instructions {
                background: white;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
              }
              .steps {
                text-align: left;
                max-width: 300px;
                margin: 0 auto;
              }
              .steps ol {
                padding-left: 20px;
              }
              .steps li {
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <div class="instructions">
              <h2>💾 Guardar Imagen</h2>
              <p><strong>Toca y mantén presionada la imagen abajo, luego selecciona "Guardar imagen"</strong></p>
              <div class="steps">
                <ol>
                  <li>Toca la imagen con un dedo</li>
                  <li>Mantén presionado hasta que aparezca el menú</li>
                  <li>Selecciona "Guardar imagen"</li>
                  <li>¡Listo! La imagen se guardará en tu galería</li>
                </ol>
              </div>
            </div>
            <img src="${url}" alt="Imagen de predicción ADN Futbolero" />
          </body>
        </html>
      `)
      imageWindow.document.close()
    } else {
      // If popup blocked, show instructions
      alert('Para guardar la imagen: activa popups para este sitio, o copia la imagen manualmente.')
    }
  } else {
    // For Android and other mobile browsers, try standard download
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Clean up the object URL after a delay
  setTimeout(() => URL.revokeObjectURL(url), 60000) // Keep for 1 minute in case user needs it
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([])
  const [nextId, setNextId] = useState(1)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [tweets, setTweets] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [copiedTweetIndex, setCopiedTweetIndex] = useState<number | null>(null)
  const [template, setTemplate] = useState<'standard' | 'split' | 'minimal'>('standard')
  const [resultsTweetTemplate, setResultsTweetTemplate] = useState<ResultsTweetTemplate>({
    title: '✅ RESULTADOS DEL DIA | ADN Futbolero',
    matchStatusWon: '✅GANADA',
    matchStatusLost: '❎PERDIDA',
    dayLabel: '📊Día:',
    daySuffix: '✅',
    recapSuffix: 'victoria el dia de hoy 💸⚽️',
    recapSuffixPlural: 'victorias el dia de hoy 💸⚽️',
    hashtag: '#ADNFutbolero'
  })

  const flagSelectOptions = useMemo(() => flagOptions.map(f => ({ value: `${f.emoji} ${f.country}`, label: `${f.emoji} ${f.country}` })), [])

  const addMatch = () => {
    const defaultFlag = flagOptions[0];
    setMatches([...matches, { id: nextId, home: '', away: '', competitionEmoji: defaultFlag.emoji, competitionName: '', flagInputValue: `${defaultFlag.emoji} ${defaultFlag.country}`, selectedFlag: flagSelectOptions.find(o => o.value === `${defaultFlag.emoji} ${defaultFlag.country}`) || null, bet: '', odds: '', description: '', confidence: 3 }])
    setNextId(nextId + 1)
  }

  const updateMatch = (id: number, field: keyof Match, value: string) => {
    setMatches(matches.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const deleteMatch = (id: number) => {
    setMatches(matches.filter(m => m.id !== id))
  }

  const duplicateMatch = (id: number) => {
    const match = matches.find(m => m.id === id)
    if (match) {
      setMatches([...matches, { ...match, id: nextId }])
      setNextId(nextId + 1)
    }
  }

  const generate = async () => {
    const matchTweets = matches.map((m, i) => generateTweet(m, i + 1, matches.length))
    const resultsTweet = generateResultsTweet(matches, resultsTweetTemplate)
    const newTweets = [...matchTweets, resultsTweet]
    setTweets(newTweets)
    const newImages = await Promise.all(matches.map(m => generateImage(m, theme, template)))
    setImages(newImages)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-200 to-teal-300 p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-6xl">⚽</div>
        <div className="absolute top-20 right-20 text-4xl">🏆</div>
        <div className="absolute bottom-20 left-20 text-5xl">🎯</div>
        <div className="absolute bottom-10 right-10 text-3xl">💡</div>
      </div>
      <div className="relative z-10">
        <header className="text-center mb-8 md:mb-12 px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 drop-shadow-lg mb-2">⚽ ADN Futbolero Generador</h1>
          <p className="text-gray-600 text-base md:text-lg">Crea contenido de predicciones futboleras en segundos</p>
        </header>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex justify-center">
            <button
              onClick={addMatch}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              ➕ Agregar Partido
            </button>
          </div>
          <div className="grid gap-4 md:gap-6 md:grid-cols-2 mb-8 px-4">
            {matches.map(match => (
              <div key={match.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">⚽</span>
                  <h3 className="text-lg font-semibold text-gray-800">Partido {match.id}</h3>
                </div>
                <input
                  type="text"
                  placeholder="Equipo Local"
                  value={match.home}
                  onChange={e => updateMatch(match.id, 'home', e.target.value)}
                  className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Equipo Visitante"
                  value={match.away}
                  onChange={e => updateMatch(match.id, 'away', e.target.value)}
                  className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                />
                <div className="flex gap-2 mb-3">
                  <Select
                    key={`flag-${match.id}`}
                    options={flagSelectOptions}
                    value={match.selectedFlag}
                    onChange={(selected) => {
                      setMatches(matches.map(m => m.id === match.id ? { 
                        ...m, 
                        selectedFlag: selected, 
                        flagInputValue: selected ? selected.value : '', 
                        competitionEmoji: selected ? flagOptions.find(f => `${f.emoji} ${f.country}` === selected.value)?.emoji || '' : '' 
                      } : m))
                    }}
                    placeholder="Bandera"
                    className="w-1/2"
                    isClearable={true}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        border: '2px solid #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        borderColor: state.isFocused ? '#10b981' : '#d1d5db',
                        '&:hover': {
                          borderColor: '#10b981',
                        },
                        boxShadow: 'none',
                        minHeight: 'auto',
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: '#9ca3af',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: '#111827',
                      }),
                      input: (provided) => ({
                        ...provided,
                        color: '#111827',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        borderRadius: '0.5rem',
                        border: '1px solid #d1d5db',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f3f4f6' : 'white',
                        color: state.isSelected ? 'white' : '#111827',
                        '&:active': {
                          backgroundColor: '#10b981',
                          color: 'white',
                        },
                      }),
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Liga/Competición"
                    value={match.competitionName}
                    onChange={e => updateMatch(match.id, 'competitionName', e.target.value)}
                    className="w-1/2 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Apuesta"
                  value={match.bet}
                  onChange={e => updateMatch(match.id, 'bet', e.target.value)}
                  className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Cuota"
                  value={match.odds}
                  onChange={e => updateMatch(match.id, 'odds', e.target.value)}
                  className="w-full mb-3 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="Descripción de la predicción"
                  value={match.description}
                  onChange={e => updateMatch(match.id, 'description', e.target.value)}
                  className="w-full mb-4 p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors resize-none"
                  rows={4}
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confianza en la predicción</label>
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateMatch(match.id, 'confidence', star.toString())}
                        className={`text-2xl p-1 rounded hover:bg-gray-100 transition-colors ${star <= match.confidence ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                        title={`${star} estrella${star !== 1 ? 's' : ''}`}
                      >
                        ⭐
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {match.confidence > 0 ? `${match.confidence} estrella${match.confidence !== 1 ? 's' : ''}` : 'Sin calificar'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => duplicateMatch(match.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
                  >
                    Duplicar
                  </button>
                  <button
                    onClick={() => deleteMatch(match.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-lg">
              <label className="text-gray-700 font-medium">Tema de Imagen:</label>
              <select
                value={theme}
                onChange={e => setTheme(e.target.value as 'light' | 'dark')}
                className="p-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors bg-white"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Plantilla de Imagen</label>
              <select
                value={template}
                onChange={e => setTemplate(e.target.value as 'standard' | 'split' | 'minimal')}
                className="bg-white border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition-colors"
              >
                <option value="standard">Estándar</option>
                <option value="split">Dividida</option>
                <option value="minimal">Minimalista</option>
              </select>
            </div>            <button
              onClick={generate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 md:py-4 px-8 md:px-12 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm md:text-base"
            >
              🚀 Generar Contenido
            </button>
          </div>
          {tweets.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6 md:mb-8 drop-shadow-lg px-4">Resultados Generados</h2>
              <div className="grid gap-6 md:gap-8 md:grid-cols-2 px-4">
                {tweets.map((tweet, i) => (
                  <div key={i} className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🐦</span> Tweet {i + 1}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
                      {i === tweets.length - 1 ? (
                        <textarea
                          value={tweet}
                          onChange={(e) => {
                            const updatedTweets = [...tweets]
                            updatedTweets[i] = e.target.value
                            setTweets(updatedTweets)
                          }}
                          className="w-full min-h-[280px] p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors resize-y bg-white text-gray-700 font-mono text-sm leading-relaxed"
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">{tweet}</pre>
                      )}
                    </div>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(tweet)
                          setCopiedTweetIndex(i)
                          setTimeout(() => setCopiedTweetIndex(null), 2000)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                      >
                        {copiedTweetIndex === i ? '✅ Copiado!' : '📋 Copiar Tweet'}
                      </button>
                    </div>
                    {images[i] && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-2xl">📸</span> Imagen para TikTok
                        </h4>
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={images[i]}
                            alt="Match image"
                            className="w-40 md:w-48 h-56 md:h-64 object-cover rounded-lg shadow-lg border-2 border-gray-300"
                          />
                          <button
                            onClick={() => downloadImage(images[i], `partido-${i + 1}.png`)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                          >
                            ⬇️ Descargar Imagen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
