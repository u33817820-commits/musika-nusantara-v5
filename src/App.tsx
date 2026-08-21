import { useState } from 'react'

export default function App(){
  const [apiKey,setApiKey]=useState('e6582322914115525a1a88732d366229')
  const [title,setTitle]=useState('Cinta Ditolak Dukun Bertindak')
  const [style,setStyle]=useState('koplo jawa angkringan, kendang koplo, dangdut modern sedih, male vocal')
  const [lyrics,setLyrics]=useState(`[Verse]
Cinta ditolak di angkringan
Kopi pahit jadi saksi malam
Janji manis tinggal kenangan
Hatiku hancur di ujung jalan

[Chorus]
Dukun bertindak hatiku terluka
Cinta ditolak jiwa merana
Koplo jawa mengiringi duka
Dukun bertindak cinta pun sirna`)

  const [log,setLog]=useState('Siap generate...')
  const [songs,setSongs]=useState([])
  const [loading,setLoading]=useState(false)

  const generate = async () => {
    setLoading(true); setSongs([]); setLog('🚀 Mulai generate V4.5...\n')
    try{
      const res = await fetch('https://api.kie.ai/api/v1/generate',{
        method:'POST',
        headers:{
          'Authorization':'Bearer '+apiKey.trim(),
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          title,
          styleOfMusic: style,
          lyrics,
          model: 'V4_5',
          customMode: true,
          instrumental: false,
          callBackUrl: 'https://example.com/callback'
        })
      })
      const json = await res.json()
      if(!json.data?.taskId){ setLog('❌ Gagal: '+JSON.stringify(json)); setLoading(false); return; }
      const taskId = json.data.taskId
      setLog(l=>l+`✅ TaskID: ${taskId}\nPolling 2 menit...\n`)

      for(let i=1;i<=20;i++){
        await new Promise(r=>setTimeout(r,8000))
        const check = await fetch(`https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`,{
          headers:{'Authorization':'Bearer '+apiKey.trim()}
        })
        const data = await check.json()
        const state = data.data?.state || data.data?.status
        setLog(l=>l+`Cek ${i}: ${state}\n`)

        // AMBIL LAGU - FIX UNTUK HASIL KAYA TADI (2:43 & 2:24)
        let list = data.data?.data || data.data?.response?.data || data.data?.songs || []
        if(list &&!Array.isArray(list) && list.audioUrl) list=[list]

        if(state==='SUCCESS' && list.length>0){
          setSongs(list)
          setLog(l=>l+`🎉 JADI ${list.length} LAGU! Scroll bawah!\n`)
          break
        }
        if(state==='TEXT_SUCCESS'){
          setLog(l=>l+'📝 Lirik jadi, bikin audio...\n')
        }
        if(state==='FAILED' || state==='FAIL'){
          setLog(l=>l+`❌ Failed: ${data.data?.failReason}\n`)
          break
        }
      }
    }catch(e){ setLog(l=>l+'\nError: '+e.message) }
    setLoading(false)
  }

  return (
    <div style={{background:'#0a0a0a',color:'white',minHeight:'100vh',padding:16,fontFamily:'sans-serif'}}>
      <h1 style={{color:'#ff0055'}}>🎵 MUSIKA CANG MAY - V5.5</h1>

      <div style={{background:'#1a1a1a',padding:12,borderRadius:8,marginBottom:12}}>
        <label style={{fontSize:11}}>KIE API KEY</label>
        <input value={apiKey} on
