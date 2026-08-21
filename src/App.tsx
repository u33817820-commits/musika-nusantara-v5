import { useState } from 'react'
function App(){
  const [key,setKey]=useState('e6582322914115525a1a88732d366229')
  const [title,setTitle]=useState('Cinta Ditolak Dukun Bertindak')
  const [style,setStyle]=useState('koplo jawa angkringan')
  const [lyrics,setLyrics]=useState('[Verse]\nCinta ditolak di angkringan\nKopi pahit jadi saksi malam\n[Chorus]\nDukun bertindak hatiku hancur')
  const [log,setLog]=useState('')
  const [songs,setSongs]=useState([])
  const [load,setLoad]=useState(false)

  const gen=async()=>{
    setLoad(true); setLog('Generate...\n'); setSongs([])
    try{
      const r=await fetch('https://api.kie.ai/api/v1/generate',{
        method:'POST',
        headers:{'Authorization':'Bearer '+key.trim(),'Content-Type':'application/json'},
        body:JSON.stringify({title, styleOfMusic:style, lyrics, model:'V4_5', customMode:true, callBackUrl:'https://example.com/cb', instrumental:false})
      })
      const d=await r.json()
      const taskId=d.data?.taskId
      setLog(l=>l+`Task ${taskId}\n`)
      if(!taskId) return
      for(let i=0;i<15;i++){
        await new Promise(x=>setTimeout(x,8000))
        const ir=await fetch('https://api.kie.ai/api/v1/generate/record-info?taskId='+taskId,{headers:{'Authorization':'Bearer '+key.trim()}})
        const ij=await ir.json()
        setLog(l=>l+`${i+1}. ${ij.data?.state} - ${ij.data?.failReason||''}\n`)
        // FIX AMBIL LAGU - SEMUA KEMUNGKINAN FIELD
        let arr = ij.data?.data || ij.data?.songs || ij.data?.response?.data || ij.data?.response?.songs || []
        if(Array.isArray(arr) && arr.length>0){
          // kalo arr isinya object ada audioUrl
          setSongs(arr)
          setLog(l=>l+`JADI ${arr.length} LAGU! CEK BAWAH!\n`)
          break
        }
        if(ij.data?.state==='SUCCESS' && ij.data?.data){
           const finalArr = Array.isArray(ij.data.data)? ij.data.data : [ij.data.data]
           if(finalArr[0]?.audioUrl || finalArr[0]?.audio_url || finalArr[0]?.url){
             setSongs(finalArr); break
           }
        }
      }
    }catch(e){ setLog(l=>l+e.message) }
    setLoad(false)
  }
  return <div style={{background:'black',color:'white',padding:12,minHeight:'100vh'}}>
    <h3>MUSIKA V5 FINAL PLAYER</h3>
    <input value={key} onChange={e=>setKey(e.target.value)} style={{width:'100%',padding:8,color:'black',marginBottom:6}}/>
    <button onClick={gen} style={{width:'100%',background:'#ff0055',color:'white',padding:12,border:'none'}}>{load?'GENERATING...':'GENERATE V5.5'}</button>
    <pre style={{background:'#111',padding:8,marginTop:8,whiteSpace:'pre-wrap',fontSize:10}}>{log}</pre>
    {songs.map((s,i)=><div key={i} style={{background:'#222',padding:10,marginTop:10,borderRadius:8}}>
      <b>{s.title||title}</b><br/>
      <audio controls src={s.audioUrl||s.audio_url||s.url||s.audio} style={{width:'100%',marginTop:6}}/>
      <a href={s.audioUrl||s.audio_url||s.url||s.audio} target="_blank" style={{color:'yellow',display:'block',marginTop:6}}>⬇️ DOWNLOAD MP3</a>
      <div style={{fontSize:9,color:'#aaa',wordBreak:'break-all'}}>{s.audioUrl||s.audio_url}</div>
    </div>)}
    <div style={{marginTop:15,background:'#003',padding:8}}><a href="https://kie.ai/logs" target="_blank" style={{color:'cyan'}}>📂 BUKA KIE.AI/LOGS UNTUK DOWNLOAD SEMUA LAGU LAMA</a></div>
  </div>
}
export default App
