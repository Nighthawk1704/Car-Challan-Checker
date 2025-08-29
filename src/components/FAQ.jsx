export default function FAQ(){
  const faqs = [
    {q:'Is this connected to government databases?', a:'No, this demo uses mock data for challans and a free IP API (ipapi.co) to show location.'},
    {q:'Why status history?', a:'Your changes are saved locally (browser localStorage) so you can track Paid/Unpaid updates per challan.'},
    {q:'Which formats can I export?', a:'CSV and JSON from the Status History panel. You can also print the page.'},
    {q:'What formats of vehicle numbers are accepted?', a:'Common Indian formats such as DL10AB1234 and DL 10 AB 1234.'},
  ]
  return (
    <section className="container" style={{marginTop: '22px'}}>
      <div className="panel section-card">
        <h2 className="section-title">FAQs</h2>
        <div>
          {faqs.map((f,i)=> (
            <details key={i} className="card" style={{marginBottom:10, border:'1px solid #eef0ff'}}>
              <summary style={{cursor:'pointer', fontWeight:600}}>{f.q}</summary>
              <p className="muted" style={{marginTop:8}}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
