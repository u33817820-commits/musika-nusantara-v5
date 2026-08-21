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
  const [result, setResult] = useState(null)

  const generate = async () => {
    if(!apiKey){ alert('Tempel API Key Kie dulu Cang! sk_...'); return }
    if(!style){ alert('Style of Music kosong!'); return }
    setLoading(true)
    setResult(null)
    try{
      // LANGSUNG PAKAI KIE API V4_5 = V5.5 WEB
      const res = await fetch('https://api.kie.ai/api/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'V4_5',
          customMode: true,
          title: title,
          styleOfMusic: style,
          lyrics: lyrics,
          vocalGender: 'm',
          instrumental: false,
          duration: 120
        })
      })
      const data = await res.json()
      console.log('HASIL:', data)
      if(data.code !== 0 && data.code !== 200){
        alert('Error Kie: ' + JSON.stringify(data).slice(0,300))
      } else {
        setResult(data.data)
      }
    }catch(e){
      alert('GAGAL FETCH: ' + e.message + ' - Coba matiin AdBlock!')
    }
    setLoading(false)
  }

  return (
    <div style={{background:'#111', color:'white', minHeight:'100vh', padding:16}}>
      <h2>🎵 Musika Nusantara V5 - FIX TOMBOL</h2>
      
      <div style={{background:'red', padding:10, borderRadius:8, marginBottom:10}}>
        ⚠️ TEMPEL API KEY DISINI (sk_...) - JANGAN DI SECRETS LAGI!
      </div>
      <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Paste sk_... disini" style={{width:'100%', padding:12, marginBottom:12, color:'black', border:'2px solid red'}} />

      <label>Title *</label>
      <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:10, marginBottom:10, color:'black'}} />

      <label>Style of Music *</label>
      <textarea value={style} onChange={e=>setStyle(e.target.value)} style={{width:'100%', height:70, padding:10, marginBottom:10, color:'black'}} />

      <label>Lyrics *</label>
      <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} style={{width:'100%', height:150, padding:10, marginBottom:10, color:'black'}} />

      {/* TOMBOL FIX */}
      <button 
        onClick={()=>{ console.log('KLIK!'); generate(); }} 
        style={{width:'100%', background:'#ff0055', color:'white', padding:18, borderRadius:12, fontWeight:'bold', fontSize:18, border:'none', cursor:'pointer'}}>
        {loading ? '⏳ GENERATING 2 MENIT...' : '🔥 KLIK DISINI GENERATE V5.5'}
      </button>

      {result && <div style={{marginTop:20, background:'#222', padding:12, borderRadius:10}}>
        <p>SUKSES!</p>
        <pre style={{fontSize:10, whiteSpace:'pre-wrap'}}>{JSON.stringify(result, null, 2)}</pre>
      </div>}
    </div>
  )
}
export default App
