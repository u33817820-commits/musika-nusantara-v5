import { useState } from 'react'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [title, setTitle] = useState('Cinta Ditolak Dukun Bertindak')
  const [style, setStyle] = useState('koplo jawa angkringan, cinta ditolak dukun bertindak, dangdut modern, male vocal')
  const [lyrics, setLyrics] = useState(`[Verse]
Cinta ditolak di angkringan
Kopi pahit jadi saksi malam

[Chorus]
Dukun bertindak hatiku hancur
Koplo jawa mengiringi tangisku`)
  const [loading, setLoading] = useState(false)
  const [songs, setSongs] = useState([])

  const generate = async () => {
    if(!apiKey.startsWith('sk_')){ alert('API Key salah! Harus sk_... dari kie.ai Dashboard > API Keys'); return }
    setLoading(true)
    setSongs([])
    try{
      // 1. GENERATE
      const res = await fetch('https://api.kie.ai/api/v1/suno/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          style: style,
          lyrics: lyrics,
          model: 'V4_5',
          customMode: true,
          instrumental: false,
          callBackUrl: 'https://api.kie.ai/api/v1/callback', // WAJIB INI FIX 422
          vocalGender: 'm'
        })
      })
      const data = await res.json()
      console.log(data)
      if(data.code !== 0 && data.code !== 200){
        alert('Error Generate: ' + JSON.stringify(data))
        setLoading(false)
        return
      }
      const taskId = data.data.taskId
      alert('Task dibuat: ' + taskId + ' - Tunggu 2 menit polling...')

      // 2. POLLING HASIL
      let tries = 0
      while(tries < 30){
        await new Promise(r=>setTimeout(r, 8000))
        const infoRes = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`, {
          headers: { 'Authorization': `Bearer ${apiKey.trim()}` }
        })
        const info = await infoRes.json()
        console.log('poll', info)
        if(info.data?.status === 'SUCCESS' || info.data?.state === 'SUCCESS'){
          setSongs(info.data?.songs || info.data?.data || [])
          alert('JADI! V5.5 Quality!')
          break
        }
        tries++
      }
    }catch(e){
      alert('Error: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{background:'#111', color:'white', minHeight:'100vh', padding:16}}>
      <h2>🎵 Musika V5 - FIX 422 FINAL</h2>
      <p style={{color:'yellow'}}>Paste API Key sk_... yang bener!</p>
      <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Paste sk_... disini" style={{width:'100%', padding:12, marginBottom:12, color:'black', border:'3px solid yellow'}} />
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" style={{width:'100%', padding:10, marginBottom:8, color:'black'}} />
      <textarea value={style} onChange={e=>setStyle(e.target.value)} style={{width:'100%', height:60, padding:8, color:'black', marginBottom:8}} />
      <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} style={{width:'100%', height:120, padding:8, color:'black', marginBottom:10}} />
      <button onClick={generate} style={{width:'100%', background:'#ff0055', color:'white', padding:16, borderRadius:10, fontWeight:'bold', border:'none'}}>
        {loading ? '⏳ GENERATING TUNGGU...' : '🔥 GENERATE V5.5'}
      </button>
      {songs.map((s,i)=><div key={i} style={{marginTop:12, background:'#222', padding:10}}><p>{s.title}</p><audio controls src={s.audioUrl || s.audio_url} style={{width:'100%'}} /><a href={s.audioUrl || s.audio_url} style={{color:'yellow'}}>Download MP3</a></div>)}
    </div>
  )
}
export default App
