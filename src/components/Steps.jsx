export default function Steps(){
  const items = [
    {title:'Enter Vehicle No', text:'DL10AB1234 or DL 10 AB 1234'},
    {title:'View Challans', text:'Amount, type, date & status'},
    {title:'Update Status', text:'Mark Paid/Unpaid and see history'},
    {title:'Export', text:'Download CSV/JSON for records'}
  ]
  return (
    <section className="container">
      <div className="panel section-card">
        <div className="list-header"><h2 className="section-title">How it works</h2></div>
        <div className="list" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'12px'}}>
          {items.map((it,i)=> (
            <div key={i} className="card" style={{border:'1px solid #eef0ff'}}>
              <h3 className="item-title">{i+1}. {it.title}</h3>
              <p className="muted" style={{marginTop:6}}>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
