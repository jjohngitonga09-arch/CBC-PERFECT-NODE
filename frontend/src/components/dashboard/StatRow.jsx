export default function StatRow({label, value, max=100, color='#6366f1'}) {
 const pct = max>0 ? Math.min(100, Math.round((value/max)*100)) : 0
 return (
 <div style={{marginBottom:'14px'}}>
 <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
 <span style={{fontSize:'.8rem',color:'var(--sub)'}}>{label}</span>
 <span style={{fontSize:'.8rem',fontWeight:700,color:'var(--text)'}}>{value}/{max}</span>
 </div>
 <div style={{height:'6px',background:'var(--surface-hover)',borderRadius:'3px',overflow:'hidden'}}>
 <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:'3px',transition:'width 0.6s ease'}}/>
 </div>
 </div>
 )
}
