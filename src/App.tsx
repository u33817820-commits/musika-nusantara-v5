if(list.length>0 && (ij.data?.state==='SUCCESS'||ij.data?.status==='SUCCESS')){
  const finalSongs = Array.isArray(list)? list : (list.songs || list.data || [list])
  setSongs(finalSongs);
  setLog(l=>l+'SUKSES! LAGU JADI! '+finalSongs.length+' lagu\n');
  break
}
