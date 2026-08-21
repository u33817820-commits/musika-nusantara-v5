import { useState } from 'react'
function App(){
  const [key,setKey]=useState('')
  const [title,setTitle]=useState('Cinta Ditolak Dukun Bertindak')
  const [style,setStyle]=useState('koplo jawa angkringan, cinta ditolak dukun bertindak')
  const [lyrics,setLyrics]=useState('[Verse]\nCinta ditolak di angkringan\nKopi pahit jadi saksi malam\n\n[Chorus]\nDukun bertindak hatiku hancur\nKoplo jawa mengiringi tangisku')
  const [load,setLoad]=useState(false)
  const [songs,setSongs]=useState([])
  const gen=async()=>{
    if(!key){alert('Paste API Key dulu!');return}
    setLoad(true)
    try{
      const r=await fetch('https://api.kie.ai/api/v1/generate',{
        method:'POST',
        headers:{'Authorization':'Bearer '+key.trim(),'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'V4_5', customMode:true, title, styleOfMusic:style, lyrics,
          callBackUrl:'https://example.com/callback',
          vocalGender:'m', instrumental:false
        })
      })
      const d=await r.json()
      console.log(d)
      if(d.code===422){alert('Masih 422! Berarti kode lama! Commit ulang & tunggu Actions ijo!'); setLoad(false); return}
      if(d.data?.taskId){
        let t=0
        while(t<20){
          await new Promise(x=>setTimeout(x,7000))
          const i=await fetch('https://api.kie.ai/api/v1/generate/record-info?taskId='+d.data.taskId,{headers:{'Authorization':'Bearer '+key.trim()}})
          const j=await i.json()
          if(j.data?.state==='SUCCESS' || j.data?.status==='SUCCESS'){ setSongs(j.data.data||j.data.songs||[]); break }
          t++
        }
      } else { setSongs(d.data? [d.data] : []) }
    }catch(e){alert(e.message)}
    setLoad(false)
  }
  return <div style={{background:'black',color:'white',padding:15,minHeight:'100vh'}}>
    <h3>Musika V5 - FINAL FIX 422</h3>
    <input value={key} onChange={e=>setKey(e.target.value)} placeholder="Paste key e658... disini" style={{width:'100%',padding:10,color:'black',marginBottom:8}}/>
    <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:8,color:'black',marginBottom:6}}/>
    <textarea value={style} onChange={e=>setStyle(e.target.value)} style={{width:'100%',height:50,color:'black',marginBottom:6}}/>
    <textarea value={lyrics} onChange={e=>setLyrics(e.target.value)} style={{width:'100%',height:100,color:'black',marginBottom:10}}/>
    <button onClick={gen} style={{width:'100%',background:'#ff0055',color:'white',padding:14,borderRadius:8,border:'none'}}>{load?'GENERATING...':'GENERATE V5.5 FIX'}</button>
    {songs.map((s,i)=><div key={i} style={{marginTop:10,background:'#222',padding:8}}><audio controls src={s.audioUrl||s.audio_url} style={{width:'100%'}}/></div>)}
  </div>
}
export default App
