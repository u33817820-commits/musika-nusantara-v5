import { useState } from 'react';

export default function PlayerScreen() {
  const [prompt, setPrompt] = useState(
    'koplo jawa angkringan, cinta ditolak dukun bertindak, dangdut modern, male vocal'
  );
  const [status, setStatus] = useState('');
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setStatus('Menghubungi Kie AI V4_5 (kualitas V5.5 web)...');
    try {
      const apiKey = import.meta.env.VITE_KIE_API_KEY;
      if (!apiKey) {
        setStatus('API Key belum dipasang!');
        setLoading(false);
        return;
      }
      const res = await fetch('https://api.kie.ai/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt,
          model: 'V4_5',
          customMode: true,
          instrumental: false,
          callBackUrl: 'https://example.com/callback'
        })
      });
      const data = await res.json();
      if (data.code === 402 || data.code === 401) {
        setStatus('Kredit habis! Akun baru Kie AI dapet 100 kredit lagi');
        setLoading(false);
        return;
      }
      const taskId = data.data?.taskId || data.taskId;
      if (!taskId) {
        setStatus('Gagal: ' + JSON.stringify(data));
        setLoading(false);
        return;
      }
      setStatus('Task: ' + taskId + ' - Rendering 60-90 detik...');
      let tries = 0;
      while (tries < 30) {
        await new Promise((r) => setTimeout(r, 5000));
        const check = await fetch(
          `https://api.kie.ai/api/v1/generate/record-info?taskId=${taskId}`,
          { headers: { Authorization: `Bearer ${apiKey}` } }
        );
        const info = await check.json();
        const tracks = info.data?.response?.sunoData || info.data?.data || [];
        if (tracks.length > 0 && tracks[0].audioUrl) {
          setSongs(tracks);
          setStatus('Selesai! Model V4_5 kualitas V5.5 web!');
          break;
        }
        setStatus(`Rendering... ${tries * 5}s`);
        tries++;
      }
    } catch (e: any) {
      setStatus('Error: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>🎵 Musika Nusantara V5</h1>
      <p>V4_5 = V5.5 Web Quality • Kredit: 50 per 2 lagu</p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: 10, borderRadius: 10, color: '#000' }}
      />
      <button
        onClick={generate}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: '12px 20px',
          background: loading ? '#555' : '#ff0055',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          width: '100%',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Generating...' : 'GENERATE V5.5 QUALITY'}
      </button>
      <p style={{ marginTop: 10, color: '#0f0' }}>{status}</p>
      {songs.map((s: any, i: number) => (
        <div
          key={i}
          style={{
            marginTop: 15,
            background: '#222',
            padding: 10,
            borderRadius: 10
          }}
        >
          <p>{s.title || 'Lagu ' + (i + 1)}</p>
          <audio controls src={s.audioUrl} style={{ width: '100%' }} />
          <br />
          <a href={s.audioUrl} download style={{ color: '#ff0' }}>
            Download MP3
          </a>
        </div>
      ))}
    </div>
  );
               }
