import { useState } from 'react'

function App() {
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState('koplo jawa angkringan, cinta ditolak dukun bertindak, dangdut modern')
  const [lyrics, setLyrics] = useState(`[Verse]
Cinta ditolak di angkringan
Kopi pahit jadi saksi malam

[Chorus]
Dukun bertindak hatiku hancur
Koplo jawa mengiringi tangisku`)
  const [vocalGender, setVocalGender] = useState('m')
  const [duration, setDuration] = useState(20)
  const [audioWeight, setAudioWeight] = useState(0.65)
  const [instrumental, setInstrumental] = useState(false)
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState([])

  const generate = async () => {
    setLoading(true)
    const res = await fetch('https://api.kie.ai/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_KIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'V4_5', // ini = V5_5 Web Quality kualitas kesukaan lu!
        customMode: true,
        title: title || 'Koplo Jawa Angkringan',
        styleOfMusic: style,
        lyrics: instrumental ? '' : lyrics,
        vocalGender: vocalGender,
        instrumental: instrumental,
        duration: duration,
        audioWeight: audioWeight
      })
    })
    const data = await res.json()
    setSongs(data.data || [])
    setLoading(false)
  }

  return (
    <div style={{background:'black', color:'white', minHeight:'100vh', padding:20}}>
      <h1>🎵 Musika Nusantara V5</h1>
      <p>V4_5 = V5.5 Web Quality • Kredit: 50 per 2 lagu</p>
      
      <label>Model*</label>
      <select style={{width:'100%', padding:10, marginBottom:10}}><option>V5_5 (V4_5 Quality)</option></select>

      <label>Title *</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter a title" style={{width:'100%', padding:10, marginBottom:10}} />

      <label>Style of Music *</label>
      <textarea value={style} onChange={e=>setStyle(e.target.value)} placeholder="Enter style of music" style={{width:'100%', height:80, padding:10, marginBottom:10}} />

      <label>duration: {duration}</label>
      <input type="range" min="10" max="180" value={duration} onChange={e=>setDuration(e.target.value)} style={{width:'100%'}} />

      <label>Lyrics * {instrumental ? '(Off karena Instrumental)' : ''}</label>
      <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} placeholder="Write your own lyrics, two verses (8 lines) for the best result" style={{width:'100%', height:200, padding:10, marginBottom:10}} />

      <label>vocalGender</label>
      <select value={vocalGender} onChange={e=>setVocalGender(e.target.value)} style={{width:'100%', padding:10, marginBottom:10}}>
        <option value="m">m - Male</option>
        <option value="f">f - Female</option>
      </select>

      <label>audioWeight: {audioWeight}</label>
      <input type="range" min="0" max="1" step="0.05" value={audioWeight} onChange={e=>setAudioWeight(e.target.value)} style={{width:'100%'}} />

      <label><input type="checkbox" checked={instrumental} onChange={e=>setInstrumental(e.target.checked)} /> Instrumental</label>

      <button onClick={generate} style={{width:'100%', background:'#ff0055', color:'white', padding:15, marginTop:15, borderRadius:10, fontWeight:'bold'}}>
        {loading ? 'GENERATING...' : 'GENERATE V5.5 QUALITY'}
      </button>

      {songs.map((s,i)=><div key={i} style={{marginTop:20, background:'#222', padding:10, borderRadius:10}}>
        <p>{s.title}</p>
        <audio controls src={s.audioUrl} style={{width:'100%'}} />
        <a href={s.audioUrl} style={{color:'yellow'}}>Download MP3</a>
      </div>)}
    </div>
  )
}
export default App
