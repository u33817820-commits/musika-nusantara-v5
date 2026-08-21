import { useState } from 'react'
function App(){
  const [key,setKey]=useState('e6582322914115525a1a88732d366229')
  const [title,setTitle]=useState('Cinta Ditolak Dukun Bertindak')
  const [style,setStyle]=useState('koplo jawa angkringan, cinta ditolak dukun bertindak, dangdut modern')
  const [lyrics,setLyrics]=useState('[Verse]\nCinta ditolak di angkringan\nKopi pahit jadi saksi malam\n\n[Verse 2]\nJanji manis hilang di jalan\nAngkringan sepi aku sendirian\n\n[Chorus]\nDukun bertindak hatiku hancur\nKoplo jawa mengiringi tangisku')
  const [log,setLog]=useState('')
  const [songs,setSongs]=useState([])
  const [load,setLoad]=useState(false)

  const gen=async()=>{
    setLoad(true); setLog('Mulai generate...\n'); setSongs([])
    try{
      const r=await fetch('https://api.kie.ai/api/v1/generate',{
        method:'POST',
        headers:{'Authorization':'Bearer '+key.trim(),'Content-Type':'application/json'},
        body:JSON.stringify({title, styleOfMusic:style, lyrics, model:'V4', customMode:true, callBackUrl:'https://example.com/cb', instrumental:false})
      })
      const d=await r.json()
      setLog(l=>l+ 'RESPON AWAL: '+JSON.stringify(d).slice(0,500)+'\n')
      const taskId=d.data?.taskId||d.data?.task_id
      if(!taskId){ setLog(l=>l+'GAGAL: Tidak ada taskId! Kredit mungkin habis!\n'); setLoad(false); return }
      setLog(l=>l+'TaskID: '+taskId+' - Polling 90 detik...\n')
      for(let i=0;i<12;i++){
        await new Promise(x=>setTimeout(x,7000))
        const ir=await fetch('https://api.kie.ai/api/v1/generate/record-info?taskId='+taskId,{headers:{'Authorization':'Bearer '+key.trim()}})
        const ij=await ir.json()
        setLog(l=>l+ `Cek ${i+1}: ${ij.data?.state||ij.data?.status}\n`)
        const list=ij.data?.data||ij.data?.songs||[]
        if(list.length>0 && (ij.data?.state==='SUCCESS'||ij.data?.status==='SUCCESS')){ setSongs(list); setLog(l=>l+'SUKSES! LAGU JADI!\n'); break }
        if(ij.data?.state==='FAILED'||ij.data?.status==='FAILED'){ setLog(l=>l+'FAILED: '+JSON.stringify(ij).slice(0,500)); break }
      }
    }catch(e){ setLog(l=>l+'ERROR: '+e.message) }
    setLoad(false)
  }
  return <div style={{background:'black',color:'white',padding:12,minHeight:'100vh',fontFamily:'monospace'}}>
    <h3>MUSIKA DEBUG LOG</h3>
    <input value={key} onChange={e=>setKey(e.target.value)} style={{width:'100%',padding:8,color:'black',marginBottom:4}}/>
    <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:6,color:'black',marginBottom:4}}/>
    <textarea value={style} onChange={e=>setStyle(e.target.value)} style={{width:'100%',height:40,color:'black'}}/>
    <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} style={{width:'100%',height:80,color:'black',marginBottom:6}}/>
    <button onClick={gen} style={{width:'100%',background:'#ff0055',color:'white',padding:12,border:'none'}}>{load?'GENERATING... LIHAT LOG DI BAWAH':'GENERATE V4 TEST'}</button>
    <pre style={{background:'#111',padding:8,marginTop:10,whiteSpace:'pre-wrap',fontSize:11,border:'1px solid #333',minHeight:100}}>{log || 'Log akan muncul disini...'}</pre>
    {songs.map((s,i)=><div key={i} style={{background:'#222',padding:8,marginTop:8}}><audio controls src={s.audioUrl||s.audio_url||s.audio} style={{width:'100%'}}/><br/><a href={s.audioUrl||s.audio_url||s.audio} download style={{color:'yellow'}}>Download MP3</a></div>)}
  </div>
}
export default App
