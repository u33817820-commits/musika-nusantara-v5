import {useState} from 'react'
function App(){
  const [key,setKey]=useState('e6582322914115525a1a88732d366229')
  const [songs,setSongs]=useState([])
  const [log,setLog]=useState('')
  const gen=async()=>{
    setLog('generate...');
    const r=await fetch('https://api.kie.ai/api/v1/generate',{method:'POST',headers:{'Authorization':'Bearer '+key.trim(),'Content-Type':'application/json'},body:JSON.stringify({title:'Cinta Ditolak Dukun Bertindak',styleOfMusic:'koplo jawa angkringan, cinta ditolak dukun bertindak, dangdut modern',lyrics:'[Verse]\nCinta ditolak di angkringan\nKopi pahit jadi saksi malam\n[Chorus]\nDukun bertindak hatiku hancur\nKoplo jawa mengiringi tangisku',model:'V4_5',customMode:true,callBackUrl:'https://example.com/cb',instrumental:false})})
    const d=await r.json(); const taskId=d.data?.taskId; setLog('Task '+taskId)
    for(let i=0;i<20;i++){await new Promise(x=>setTimeout(x,8000)); const ir=await fetch('https://api.kie.ai/api/v1/generate/record-info?taskId='+taskId,{headers:{'Authorization':'Bearer '+key.trim()}}); const ij=await ir.json(); setLog(l=>l+`\n${i+1}: ${ij.data?.state}`); let arr=ij.data?.data||ij.data?.response?.data||[]; if(arr.length>0 && ij.data?.state==='SUCCESS'){ setSongs(arr); setLog(l=>l+'\nJADI!'); break; }}
  }
  return <div style={{background:'black',color:'white',padding:12}}><button onClick={gen} style={{width:'100%',background:'#ff0055',color:'white',padding:12}}>GENERATE V5.5</button><pre style={{background:'#111',padding:8,marginTop:8,fontSize:10}}>{log}</pre>{songs.map((s,i)=><div key={i} style={{background:'#222',padding:8,marginTop:8}}><audio controls src={s.audioUrl||s.audio_url} style={{width:'100%'}}/><a href={s.audioUrl||s.audio_url} download style={{color:'yellow'}}>DOWNLOAD MP3 {i+1}</a></div>)}</div>
}
export default App
