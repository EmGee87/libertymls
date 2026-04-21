import { useState, useEffect, useRef } from "react";

// ── Sample Data ────────────────────────────────────────────────────────────────
const SEED_LISTINGS = [
  { id:"l1", agentId:"a1", agentName:"Sarah Mitchell", agentEmail:"sarah@libertyrealty.com", agentPhone:"(555) 234-5678", address:"142 Maple Grove Drive", city:"Charleston", state:"SC", zip:"29401", price:485000, bedrooms:4, bathrooms:3, sqft:2450, lotSize:"0.28 acres", yearBuilt:2018, propertyType:"Single Family", status:"Active", description:"Stunning craftsman-style home in historic Charleston. Open-concept kitchen with quartz countertops, hardwood floors, and a wrap-around porch perfect for entertaining. Minutes from King Street restaurants and shops.", features:["Hardwood Floors","Quartz Countertops","Wrap-around Porch","2-Car Garage","Central A/C","Fireplace"], mlsNumber:"MLS-2024-0891", listDate:"2024-11-15", mapX:72, mapY:64, hoa:"$150/mo", parking:"2-Car Garage", basement:"None" },
  { id:"l2", agentId:"a2", agentName:"James Harrington", agentEmail:"james@patriotprop.com", agentPhone:"(555) 876-5432", address:"88 Ocean Bluff Road", city:"Newport Beach", state:"CA", zip:"92663", price:1895000, bedrooms:5, bathrooms:4.5, sqft:4200, lotSize:"0.45 acres", yearBuilt:2021, propertyType:"Single Family", status:"Active", description:"Breathtaking ocean-view estate with panoramic Pacific vistas. Chef's kitchen, home theater, infinity pool, and direct beach access. The pinnacle of California coastal living.", features:["Ocean View","Infinity Pool","Home Theater","Chef's Kitchen","Smart Home","Direct Beach Access"], mlsNumber:"MLS-2024-1042", listDate:"2024-12-01", mapX:9, mapY:38, hoa:"$650/mo", parking:"3-Car Garage", basement:"None" },
  { id:"l3", agentId:"a1", agentName:"Sarah Mitchell", agentEmail:"sarah@libertyrealty.com", agentPhone:"(555) 234-5678", address:"2211 Birchwood Lane", city:"Nashville", state:"TN", zip:"37201", price:349500, bedrooms:3, bathrooms:2, sqft:1875, lotSize:"0.19 acres", yearBuilt:2015, propertyType:"Townhome", status:"Pending", description:"Modern townhome in Nashville's booming East Side. Walking distance to top restaurants and music venues. Open layout, rooftop terrace, and gourmet kitchen.", features:["Rooftop Terrace","Gourmet Kitchen","Walkable Location","Stainless Appliances","Exposed Brick"], mlsNumber:"MLS-2024-0754", listDate:"2024-10-22", mapX:60, mapY:50, hoa:"$225/mo", parking:"1-Car Garage", basement:"None" },
  { id:"l4", agentId:"a3", agentName:"Patricia Lawson", agentEmail:"patricia@eliteestates.com", agentPhone:"(555) 345-6789", address:"54 Evergreen Terrace", city:"Denver", state:"CO", zip:"80202", price:625000, bedrooms:4, bathrooms:3.5, sqft:3100, lotSize:"0.33 acres", yearBuilt:2019, propertyType:"Single Family", status:"Active", description:"Mountain-view masterpiece with Rocky backdrop. Radiant heated floors, floor-to-ceiling windows, and a stunning outdoor living space with firepit. Ski resort 45 min away.", features:["Mountain Views","Heated Floors","Floor-to-Ceiling Windows","Outdoor Firepit","Ski Access","Mudroom"], mlsNumber:"MLS-2024-1188", listDate:"2024-11-30", mapX:30, mapY:35, hoa:"None", parking:"2-Car Attached", basement:"Finished" },
  { id:"l5", agentId:"a2", agentName:"James Harrington", agentEmail:"james@patriotprop.com", agentPhone:"(555) 876-5432", address:"901 Lakeshore Blvd", city:"Chicago", state:"IL", zip:"60611", price:780000, bedrooms:3, bathrooms:2, sqft:2100, lotSize:"N/A", yearBuilt:2022, propertyType:"Condo", status:"Active", description:"Luxury high-rise condo with unobstructed Lake Michigan views from every room. Building amenities include concierge, rooftop pool, fitness center, and private valet parking.", features:["Lake Views","Concierge","Rooftop Pool","Valet Parking","Floor-to-Ceiling Windows","Private Balcony"], mlsNumber:"MLS-2024-1301", listDate:"2024-12-10", mapX:54, mapY:30, hoa:"$895/mo", parking:"1 Included", basement:"None" },
  { id:"l6", agentId:"a3", agentName:"Patricia Lawson", agentEmail:"patricia@eliteestates.com", agentPhone:"(555) 345-6789", address:"3 Harbor View Court", city:"Portland", state:"ME", zip:"04101", price:415000, bedrooms:3, bathrooms:2.5, sqft:1960, lotSize:"0.12 acres", yearBuilt:2010, propertyType:"Townhome", status:"Active", description:"Charming harborside townhome in historic Portland. Walk to Old Port's acclaimed restaurants, galleries, and the working waterfront. Renovated kitchen, private courtyard, and deeded boat slip.", features:["Harbor Views","Boat Slip","Renovated Kitchen","Private Courtyard","Hardwood Floors","Gas Fireplace"], mlsNumber:"MLS-2024-0622", listDate:"2024-09-18", mapX:80, mapY:18, hoa:"$310/mo", parking:"1-Car Garage", basement:"Partial" },
];

const SEED_AGENTS = [
  { id:"a1", name:"Sarah Mitchell", email:"sarah@libertyrealty.com", phone:"(555) 234-5678", company:"Liberty Realty Group", licenseNo:"RE-2019-4521", subscribed:true, joined:"2024-01-15" },
  { id:"a2", name:"James Harrington", email:"james@patriotprop.com", phone:"(555) 876-5432", company:"Patriot Properties", licenseNo:"RE-2018-8832", subscribed:true, joined:"2024-02-03" },
  { id:"a3", name:"Patricia Lawson", email:"patricia@eliteestates.com", phone:"(555) 345-6789", company:"Elite Estates LLC", licenseNo:"RE-2020-1234", subscribed:true, joined:"2024-03-22" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtPrice = (n) => "$" + Number(n).toLocaleString();
const zipToPos = (zip) => {
  const z = zip.replace(/\D/g,"");
  const first = parseInt(z.charAt(0)||5);
  const rest = parseInt(z.slice(1,3)||50);
  const xBase = [78,70,70,62,50,42,37,33,19,8];
  const x = Math.max(5, Math.min(90, xBase[first] + ((parseInt(z.charAt(3)||0)) - 4)));
  const y = Math.max(10, Math.min(82, 15 + (rest % 65)));
  return { mapX: x, mapY: y };
};
const STATUS_COLORS = { Active:"#2D6A4F", Pending:"#B8973E", Sold:"#A63D2F", "Off Market":"#555" };
const TYPE_COLORS = { "Single Family":"#1A3158","Condo":"#2D6A8F","Townhome":"#6B5B95","Multi-Family":"#A63D2F","Land":"#2D6A4F","Commercial":"#444" };
const PROPERTY_TYPES = ["Single Family","Condo","Townhome","Multi-Family","Land","Commercial"];
const STATES_LIST = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

// ── CSS ────────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--navy:#0B1E3D;--navy2:#152d55;--gold:#C4973A;--gold2:#E8C97A;--cream:#F7F3EB;--white:#ffffff;--mid:#8B9BB4;--border:rgba(11,30,61,0.12);--red:#A63D2F;--green:#2D6A4F}
  body{font-family:'DM Sans',sans-serif}
  .serif{font-family:'Cormorant Garamond',Georgia,serif}
  .btn{border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase;transition:all .2s;display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
  .btn-gold{background:var(--gold);color:var(--navy);padding:12px 28px}.btn-gold:hover{background:var(--gold2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(196,151,58,.35)}
  .btn-navy{background:var(--navy);color:#fff;padding:12px 28px}.btn-navy:hover{background:var(--navy2)}
  .btn-ghost{background:transparent;color:var(--navy);border:1.5px solid var(--border);padding:10px 22px}.btn-ghost:hover{background:var(--navy);color:#fff;border-color:var(--navy)}
  .btn-ghost-light{background:transparent;color:rgba(247,243,235,.85);border:1.5px solid rgba(247,243,235,.3);padding:9px 20px;font-size:12px}.btn-ghost-light:hover{background:rgba(247,243,235,.1);color:#fff}
  .btn-sm{padding:7px 16px;font-size:11px}
  .card{background:#fff;border:1px solid var(--border);transition:all .25s;overflow:hidden}
  .card:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(11,30,61,.1);border-color:var(--gold)}
  .tag{display:inline-block;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  .ff{display:flex;flex-direction:column;gap:5px}
  .ff label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--mid)}
  .ff input,.ff select,.ff textarea{padding:10px 13px;border:1.5px solid var(--border);font-family:'DM Sans',sans-serif;font-size:14px;color:var(--navy);outline:none;transition:border .2s;background:#fff;border-radius:2px}
  .ff input:focus,.ff select:focus,.ff textarea:focus{border-color:var(--gold)}
  .nav-btn{background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:rgba(247,243,235,.8);transition:color .2s,opacity .2s}.nav-btn:hover{color:var(--gold2)}
  .nav-btn.active{color:var(--gold2)}
  .overlay{position:fixed;inset:0;background:rgba(11,30,61,.65);backdrop-filter:blur(5px);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
  .fade{animation:fd .35s ease both}
  @keyframes fd{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  .hero-in{animation:hi .7s ease both}
  @keyframes hi{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
  .map-pin{position:absolute;transform:translate(-50%,-100%);cursor:pointer;transition:transform .15s,z-index 0s;z-index:2}
  .map-pin:hover{transform:translate(-50%,-100%) scale(1.25);z-index:20}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--cream)}::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
  .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  @media(max-width:900px){.grid3{grid-template-columns:1fr 1fr}.grid4{grid-template-columns:1fr 1fr}}
  @media(max-width:600px){.grid2,.grid3,.grid4{grid-template-columns:1fr}}
`;

// ── ListingCard ────────────────────────────────────────────────────────────────
function ListingCard({ listing, onClick }) {
  const colors = ["#1A2F52","#1E3D5C","#2D4A6B","#2A3F58","#1F3448"];
  const bg = colors[listing.id.charCodeAt(1) % colors.length];
  return (
    <div className="card" style={{ cursor:"pointer" }} onClick={() => onClick(listing)}>
      <div style={{ height:160, background:`linear-gradient(135deg, ${bg} 0%, ${bg}cc 100%)`, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,.02) 20px, rgba(255,255,255,.02) 40px)" }}/>
        <div style={{ textAlign:"center", zIndex:1 }}>
          <div style={{ fontSize:36 }}>{listing.propertyType === "Condo" ? "🏢" : listing.propertyType === "Land" ? "🌿" : listing.propertyType === "Commercial" ? "🏪" : listing.propertyType === "Multi-Family" ? "🏘" : "🏠"}</div>
          <div style={{ color:"rgba(255,255,255,.5)", fontSize:10, marginTop:6, letterSpacing:".1em", textTransform:"uppercase", fontWeight:600 }}>{listing.propertyType}</div>
        </div>
        <div style={{ position:"absolute", top:10, left:10 }}>
          <span className="tag" style={{ background: STATUS_COLORS[listing.status] || "#555", color:"#fff", borderRadius:2 }}>{listing.status}</span>
        </div>
        <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)", padding:"4px 10px", borderRadius:2 }}>
          <span style={{ color:"var(--gold2)", fontSize:13, fontWeight:700, fontFamily:"'Cormorant Garamond',serif" }}>{fmtPrice(listing.price)}</span>
        </div>
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ fontSize:14, fontWeight:600, color:"var(--navy)", marginBottom:3, lineHeight:1.3 }}>{listing.address}</div>
        <div style={{ fontSize:12, color:"var(--mid)", marginBottom:10 }}>{listing.city}, {listing.state} {listing.zip}</div>
        <div style={{ display:"flex", gap:14, fontSize:12, color:"var(--navy)", marginBottom:12 }}>
          <span>🛏 {listing.bedrooms} bd</span>
          <span>🚿 {listing.bathrooms} ba</span>
          <span>📐 {Number(listing.sqft).toLocaleString()} sf</span>
        </div>
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:11, color:"var(--mid)" }}>
            <span style={{ fontWeight:600, color:"var(--navy)" }}>{listing.agentName}</span>
          </div>
          <div style={{ fontSize:10, color:"var(--mid)", fontFamily:"monospace" }}>{listing.mlsNumber}</div>
        </div>
      </div>
    </div>
  );
}

// ── ListingModal ───────────────────────────────────────────────────────────────
function ListingModal({ listing: l, onClose }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade" style={{ background:"var(--cream)", maxWidth:820, width:"100%", maxHeight:"90vh", overflowY:"auto", position:"relative" }}>
        {/* Header */}
        <div style={{ background:"var(--navy)", padding:"24px 32px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <span className="tag" style={{ background: STATUS_COLORS[l.status]||"#555", color:"#fff" }}>{l.status}</span>
              <span className="tag" style={{ background:"rgba(196,151,58,.15)", color:"var(--gold2)", border:"1px solid rgba(196,151,58,.3)" }}>{l.propertyType}</span>
            </div>
            <div className="serif" style={{ fontSize:28, color:"#fff", fontWeight:700, lineHeight:1.1 }}>{l.address}</div>
            <div style={{ color:"var(--mid)", fontSize:14, marginTop:4 }}>{l.city}, {l.state} {l.zip}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="serif" style={{ fontSize:34, color:"var(--gold2)", fontWeight:700 }}>{fmtPrice(l.price)}</div>
            <div style={{ color:"var(--mid)", fontSize:11, marginTop:2, fontFamily:"monospace" }}>{l.mlsNumber}</div>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding:"28px 32px" }}>
          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24 }}>
            {[["Beds", l.bedrooms], ["Baths", l.bathrooms], ["Sq Ft", Number(l.sqft).toLocaleString()], ["Year Built", l.yearBuilt], ["Lot Size", l.lotSize]].map(([k,v]) => (
              <div key={k} style={{ background:"#fff", border:"1px solid var(--border)", padding:"12px 14px", textAlign:"center" }}>
                <div style={{ fontSize:18, fontWeight:700, color:"var(--navy)", fontFamily:"'Cormorant Garamond',serif" }}>{v}</div>
                <div style={{ fontSize:10, color:"var(--mid)", textTransform:"uppercase", letterSpacing:".08em", marginTop:2 }}>{k}</div>
              </div>
            ))}
          </div>
          {/* Description */}
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:8 }}>Description</div>
            <p style={{ fontSize:14, lineHeight:1.75, color:"#334" }}>{l.description}</p>
          </div>
          {/* Details grid */}
          <div className="grid2" style={{ marginBottom:22 }}>
            <div style={{ background:"#fff", border:"1px solid var(--border)", padding:18 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:12 }}>Property Details</div>
              {[["HOA", l.hoa||"None"], ["Parking", l.parking], ["Basement", l.basement], ["Listed", l.listDate]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                  <span style={{ color:"var(--mid)" }}>{k}</span>
                  <span style={{ fontWeight:500, color:"var(--navy)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:"#fff", border:"1px solid var(--border)", padding:18 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:12 }}>Features & Amenities</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {(l.features||[]).map(f => (
                  <span key={f} style={{ background:"var(--cream)", border:"1px solid var(--border)", padding:"4px 10px", fontSize:11, color:"var(--navy)", fontWeight:500 }}>✓ {f}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Agent */}
          <div style={{ background:"var(--navy)", padding:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"var(--navy)", flexShrink:0 }}>{l.agentName.charAt(0)}</div>
              <div>
                <div style={{ color:"#fff", fontWeight:600, fontSize:15 }}>{l.agentName}</div>
                <div style={{ color:"var(--mid)", fontSize:12, marginTop:2 }}>Listing Agent</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <a href={`mailto:${l.agentEmail}`} className="btn btn-ghost-light" style={{ fontSize:12, padding:"8px 16px" }}>✉ Email</a>
              <a href={`tel:${l.agentPhone}`} className="btn btn-gold btn-sm">{l.agentPhone}</a>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,.1)", border:"none", color:"#fff", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
      </div>
    </div>
  );
}

// ── AuthModal ──────────────────────────────────────────────────────────────────
function AuthModal({ mode, setMode, onClose, onAuth, agents }) {
  const [form, setForm] = useState({ email:"", password:"", name:"", phone:"", company:"", licenseNo:"", cardNum:"", cardExp:"", cardCvc:"" });
  const [err, setErr] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (mode === "login") {
      const a = agents.find(a => a.email.toLowerCase() === form.email.toLowerCase());
      if (!a) { setErr("No account found with that email. Register below."); return; }
      onAuth(form.email, form.password, false, null);
    } else {
      if (!form.name || !form.email || !form.phone || !form.company || !form.licenseNo) { setErr("Please fill in all required fields."); return; }
      if (!form.cardNum || !form.cardExp || !form.cardCvc) { setErr("Please enter payment information."); return; }
      onAuth(form.email, form.password, true, form);
    }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade" style={{ background:"#fff", maxWidth:460, width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ background:"var(--navy)", padding:"24px 32px" }}>
          <div className="serif" style={{ fontSize:24, color:"#fff", fontWeight:700 }}>
            {mode === "login" ? "Agent Login" : "Start Your Subscription"}
          </div>
          {mode === "register" && <div style={{ color:"var(--gold2)", fontSize:13, marginTop:4 }}>$9.99 / month · Cancel anytime</div>}
          <div style={{ display:"flex", gap:0, marginTop:16, background:"rgba(255,255,255,.07)", borderRadius:2 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex:1, background: mode===m ? "var(--gold)" : "transparent", color: mode===m ? "var(--navy)" : "rgba(255,255,255,.6)", border:"none", padding:"9px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", transition:"all .2s" }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:"24px 32px" }}>
          {err && <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", padding:"10px 14px", fontSize:13, color:"#991B1B", marginBottom:16 }}>{err}</div>}

          {mode === "login" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div className="ff"><label>Email Address</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="agent@example.com"/></div>
              <div className="ff"><label>Password</label><input type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••"/></div>
              <div style={{ fontSize:11, color:"var(--mid)", textAlign:"center", padding:"6px 0", background:"var(--cream)", borderRadius:2 }}>Demo: use any email from the sample agents (e.g. sarah@libertyrealty.com)</div>
              <button className="btn btn-navy" style={{ width:"100%", justifyContent:"center", padding:"14px" }} onClick={submit}>Sign In →</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", paddingBottom:4, borderBottom:"1px solid var(--border)" }}>Agent Information</div>
              <div className="grid2"><div className="ff"><label>Full Name *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Jane Smith"/></div>
              <div className="ff"><label>Phone *</label><input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="(555) 000-0000"/></div></div>
              <div className="ff"><label>Email Address *</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@brokerage.com"/></div>
              <div className="grid2"><div className="ff"><label>Brokerage / Company *</label><input value={form.company} onChange={e=>set("company",e.target.value)} placeholder="ABC Realty"/></div>
              <div className="ff"><label>License Number *</label><input value={form.licenseNo} onChange={e=>set("licenseNo",e.target.value)} placeholder="RE-XXXX-XXXX"/></div></div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", paddingBottom:4, borderBottom:"1px solid var(--border)", marginTop:6 }}>Billing — $9.99/month</div>
              <div className="ff"><label>Card Number</label><input value={form.cardNum} onChange={e=>set("cardNum",e.target.value)} placeholder="4242 4242 4242 4242" maxLength={19}/></div>
              <div className="grid2"><div className="ff"><label>Expiration</label><input value={form.cardExp} onChange={e=>set("cardExp",e.target.value)} placeholder="MM/YY"/></div>
              <div className="ff"><label>CVC</label><input value={form.cardCvc} onChange={e=>set("cardCvc",e.target.value)} placeholder="123" maxLength={4}/></div></div>
              <button className="btn btn-gold" style={{ width:"100%", justifyContent:"center", padding:"14px", marginTop:4 }} onClick={submit}>Subscribe & Create Account →</button>
              <p style={{ fontSize:11, color:"var(--mid)", textAlign:"center", lineHeight:1.6 }}>By subscribing you agree to the LibertyMLS Terms of Service. Your card is charged $9.99/month. Cancel anytime from your dashboard.</p>
            </div>
          )}
        </div>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.1)", border:"none", color:"#fff", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:18 }}>×</button>
      </div>
    </div>
  );
}

// ── Landing ────────────────────────────────────────────────────────────────────
function LandingView({ setView, setShowAuth, setAuthMode, listings }) {
  const stats = [
    { n: listings.length + "+", l: "Active Listings" },
    { n: "3", l: "Registered Agents" },
    { n: "$9.99", l: "Per Month, All-In" },
    { n: "∞", l: "Listings Per Agent" },
  ];
  const features = [
    { icon:"🔍", title:"Powerful Search", desc:"Search by address, city, zip code, agent name, price range, bedrooms, property type, and listing status." },
    { icon:"🗺", title:"Map View", desc:"See all active listings plotted on an interactive map. Spot neighborhoods at a glance and click pins for details." },
    { icon:"✏️", title:"Easy Listing Entry", desc:"Agents submit complete listings in minutes — full property details, features, agent contact info, and MLS number." },
    { icon:"🔐", title:"Agent Dashboard", desc:"Each agent manages their own portfolio. Edit, update, or deactivate listings from a personal dashboard." },
    { icon:"🏆", title:"MLS Standard", desc:"Auto-assigned MLS numbers. Status tracking (Active, Pending, Sold). Professional-grade listing profiles." },
    { icon:"📱", title:"Works Everywhere", desc:"Fully responsive for buyers browsing on mobile, and agents adding listings from any device." },
  ];
  return (
    <div>
      {/* Hero */}
      <div style={{ background:"var(--navy)", minHeight:560, display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(196,151,58,.04) 60px, rgba(196,151,58,.04) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(196,151,58,.04) 60px, rgba(196,151,58,.04) 61px)" }}/>
        <div style={{ position:"absolute", right:0, top:0, width:"45%", height:"100%", background:"linear-gradient(135deg, transparent 0%, rgba(196,151,58,.06) 100%)", clipPath:"polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}/>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"80px 40px", width:"100%", position:"relative", zIndex:1 }}>
          <div className="hero-in" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(196,151,58,.12)", border:"1px solid rgba(196,151,58,.3)", padding:"6px 16px", marginBottom:24 }}>
            <span style={{ color:"var(--gold)", fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" }}>🗽 Now Live · libertymls.com</span>
          </div>
          <h1 className="serif hero-in" style={{ fontSize:"clamp(42px, 6vw, 72px)", color:"#fff", fontWeight:700, lineHeight:1.05, maxWidth:620, animationDelay:".1s" }}>
            The MLS Built for<br/><span style={{ color:"var(--gold)" }}>Independent Agents.</span>
          </h1>
          <p className="hero-in" style={{ fontSize:17, color:"var(--mid)", lineHeight:1.75, maxWidth:520, marginTop:20, animationDelay:".2s" }}>
            LibertyMLS gives real estate agents a professional multi-listing platform — search, map view, and agent dashboards — for just $9.99/month.
          </p>
          <div className="hero-in" style={{ display:"flex", gap:12, marginTop:36, flexWrap:"wrap", animationDelay:".3s" }}>
            <button className="btn btn-gold" style={{ fontSize:14, padding:"14px 32px" }} onClick={() => { setAuthMode("register"); setShowAuth(true); }}>Get Started — $9.99/mo</button>
            <button className="btn btn-ghost-light" style={{ fontSize:14, padding:"14px 28px" }} onClick={() => setView("browse")}>Browse Listings →</button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background:"var(--gold)", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
        {stats.map(s => (
          <div key={s.l} style={{ padding:"20px 24px", textAlign:"center", borderRight:"1px solid rgba(11,30,61,.15)" }}>
            <div className="serif" style={{ fontSize:32, fontWeight:700, color:"var(--navy)" }}>{s.n}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(11,30,61,.6)", marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Featured listings */}
      <div style={{ maxWidth:1100, margin:"60px auto", padding:"0 40px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:6 }}>Currently Listed</div>
            <h2 className="serif" style={{ fontSize:34, fontWeight:700, color:"var(--navy)" }}>Featured Properties</h2>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setView("browse")}>View All Listings →</button>
        </div>
        <div className="grid3">
          {listings.filter(l=>l.status==="Active").slice(0,3).map(l => (
            <ListingCard key={l.id} listing={l} onClick={() => setView("browse")} />
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background:"var(--navy)", padding:"64px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Platform Features</div>
            <h2 className="serif" style={{ fontSize:38, color:"#fff", fontWeight:700 }}>Everything You Need to List & Sell</h2>
          </div>
          <div className="grid3">
            {features.map(f => (
              <div key={f.title} style={{ padding:24, border:"1px solid rgba(255,255,255,.07)", background:"rgba(255,255,255,.03)" }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{f.icon}</div>
                <div style={{ fontSize:16, fontWeight:600, color:"#fff", marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:13, color:"var(--mid)", lineHeight:1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing CTA */}
      <div style={{ maxWidth:600, margin:"64px auto", padding:"0 40px", textAlign:"center" }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:8 }}>Simple Pricing</div>
        <h2 className="serif" style={{ fontSize:42, fontWeight:700, color:"var(--navy)", marginBottom:12 }}>$9.99<span style={{ fontSize:20, color:"var(--mid)" }}>/month</span></h2>
        <p style={{ color:"#556", fontSize:15, lineHeight:1.7, marginBottom:28 }}>One flat rate. Unlimited listings. Full access to search, map view, agent dashboard, and auto MLS number assignment. No setup fees. Cancel anytime.</p>
        <div style={{ background:"var(--cream)", border:"1px solid var(--border)", padding:24, marginBottom:28 }}>
          {["Unlimited property listings","Auto-assigned MLS numbers","Map view for all listings","Agent dashboard & profile","Search by address, zip, agent, type","Active / Pending / Sold tracking"].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:13, color:"var(--navy)" }}>
              <span style={{ color:"var(--green)", fontWeight:700 }}>✓</span> {f}
            </div>
          ))}
        </div>
        <button className="btn btn-gold" style={{ fontSize:15, padding:"15px 40px" }} onClick={() => { setAuthMode("register"); setShowAuth(true); }}>Start Your Subscription</button>
      </div>

      {/* Footer */}
      <div style={{ background:"var(--navy)", padding:"32px 40px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"2px solid var(--gold)" }}>
        <div className="serif" style={{ fontSize:20, color:"#fff", fontWeight:700 }}>Liberty<span style={{ color:"var(--gold)" }}>MLS</span></div>
        <div style={{ fontSize:12, color:"var(--mid)" }}>© {new Date().getFullYear()} LibertyMLS · Real Estate Technology Platform</div>
      </div>
    </div>
  );
}

// ── Browse ─────────────────────────────────────────────────────────────────────
function BrowseView({ listings, allListings, searchQuery, setSearchQuery, filters, setFilters, setSelectedListing }) {
  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const agentNames = [...new Set(allListings.map(l => l.agentName))].sort();
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 32px" }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="serif" style={{ fontSize:36, fontWeight:700, color:"var(--navy)", marginBottom:4 }}>Browse Listings</h1>
        <p style={{ color:"var(--mid)", fontSize:14 }}>{listings.length} propert{listings.length !== 1 ? "ies" : "y"} found</p>
      </div>

      {/* Search + Filters */}
      <div style={{ background:"#fff", border:"1px solid var(--border)", padding:20, marginBottom:28 }}>
        <div style={{ display:"flex", gap:12, marginBottom:14 }}>
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search by address, city, zip code, state, or agent name..." style={{ flex:1, padding:"11px 16px", border:"1.5px solid var(--border)", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none", color:"var(--navy)" }} onFocus={e=>e.target.style.borderColor="#C4973A"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
          {searchQuery && <button className="btn btn-ghost btn-sm" onClick={() => setSearchQuery("")}>Clear</button>}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--mid)", marginRight:4 }}>Filters:</span>
          {[
            { key:"type", label:"Type", options:["", ...PROPERTY_TYPES] },
            { key:"status", label:"Status", options:["","Active","Pending","Sold","Off Market"] },
            { key:"beds", label:"Min Beds", options:["","1","2","3","4","5"] },
          ].map(({ key, label, options }) => (
            <select key={key} value={filters[key]} onChange={e=>set(key,e.target.value)} style={{ padding:"8px 12px", border:"1.5px solid var(--border)", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:filters[key]?"var(--navy)":"var(--mid)", cursor:"pointer", outline:"none", background:"#fff" }}>
              <option value="">{label}</option>
              {options.filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <input value={filters.minPrice} onChange={e=>set("minPrice",e.target.value)} placeholder="Min $" style={{ width:90, padding:"8px 12px", border:"1.5px solid var(--border)", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
          <input value={filters.maxPrice} onChange={e=>set("maxPrice",e.target.value)} placeholder="Max $" style={{ width:90, padding:"8px 12px", border:"1.5px solid var(--border)", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none" }}/>
          <select value={filters.agent} onChange={e=>set("agent",e.target.value)} style={{ padding:"8px 12px", border:"1.5px solid var(--border)", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:filters.agent?"var(--navy)":"var(--mid)", cursor:"pointer", outline:"none", background:"#fff" }}>
            <option value="">All Agents</option>
            {agentNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          {Object.values(filters).some(Boolean) && <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ type:"",status:"",minPrice:"",maxPrice:"",beds:"",agent:"" })}>Reset Filters</button>}
        </div>
      </div>

      {/* Grid */}
      {listings.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"var(--mid)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:18, fontWeight:600, color:"var(--navy)", marginBottom:8 }}>No listings found</div>
          <div style={{ fontSize:14 }}>Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div className="grid3 fade">
          {listings.map(l => <ListingCard key={l.id} listing={l} onClick={setSelectedListing}/>)}
        </div>
      )}
    </div>
  );
}

// ── Map View ───────────────────────────────────────────────────────────────────
function MapView({ listings, setSelectedListing, searchQuery, setSearchQuery }) {
  const [hovered, setHovered] = useState(null);
  const regions = [
    { label:"Northeast", x:79, y:22 }, { label:"Southeast", x:68, y:60 },
    { label:"Midwest", x:52, y:28 }, { label:"South", x:52, y:62 },
    { label:"Mountain West", x:28, y:30 }, { label:"Pacific", x:9, y:30 },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 64px)" }}>
      {/* Top bar */}
      <div style={{ background:"var(--navy)", padding:"12px 24px", display:"flex", gap:12, alignItems:"center", borderBottom:"1px solid rgba(255,255,255,.1)" }}>
        <span className="serif" style={{ color:"var(--gold)", fontSize:16, fontWeight:700, whiteSpace:"nowrap" }}>🗺 Map View</span>
        <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Filter listings on map…" style={{ flex:1, maxWidth:360, padding:"8px 14px", border:"1px solid rgba(255,255,255,.2)", background:"rgba(255,255,255,.08)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, outline:"none", borderRadius:2 }}/>
        <span style={{ color:"var(--mid)", fontSize:12 }}>{listings.length} listing{listings.length!==1?"s":""} shown</span>
      </div>

      <div style={{ flex:1, display:"flex" }}>
        {/* Map area */}
        <div style={{ flex:1, position:"relative", background:"#0D2137", overflow:"hidden" }}>
          {/* Grid texture */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)", backgroundSize:"50px 50px" }}/>
          {/* Terrain-like overlay */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 55%, rgba(30,70,40,.25) 0%, transparent 70%)" }}/>
          {/* Simulated US coastline hint */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 85% 70% at 48% 52%, transparent 75%, rgba(13,33,55,.8) 100%)" }}/>
          {/* Region labels */}
          {regions.map(r => (
            <div key={r.label} style={{ position:"absolute", left:`${r.x}%`, top:`${r.y}%`, transform:"translate(-50%,-50%)", color:"rgba(255,255,255,.12)", fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", userSelect:"none", pointerEvents:"none" }}>{r.label}</div>
          ))}
          {/* Pins */}
          {listings.map(l => (
            <div key={l.id} className="map-pin" style={{ left:`${l.mapX}%`, top:`${l.mapY}%` }} onMouseEnter={() => setHovered(l)} onMouseLeave={() => setHovered(null)} onClick={() => setSelectedListing(l)}>
              <div style={{ position:"relative" }}>
                <svg width="28" height="36" viewBox="0 0 28 36">
                  <path d="M14 1 C7.4 1 2 6.4 2 13 C2 22 14 35 14 35 C14 35 26 22 26 13 C26 6.4 20.6 1 14 1Z" fill={STATUS_COLORS[l.status]||"#C4973A"} stroke="#fff" strokeWidth="1.5"/>
                  <circle cx="14" cy="13" r="5" fill="rgba(255,255,255,.9)"/>
                </svg>
                {/* Tooltip */}
                {hovered?.id === l.id && (
                  <div style={{ position:"absolute", bottom:"100%", left:"50%", transform:"translateX(-50%)", marginBottom:8, background:"#fff", boxShadow:"0 8px 24px rgba(0,0,0,.25)", padding:"10px 14px", minWidth:200, zIndex:30, pointerEvents:"none" }}>
                    <div style={{ fontWeight:700, fontSize:12, color:"var(--navy)", marginBottom:2 }}>{l.address}</div>
                    <div style={{ fontSize:11, color:"var(--mid)", marginBottom:4 }}>{l.city}, {l.state}</div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:"var(--gold)" }}>{fmtPrice(l.price)}</div>
                    <div style={{ fontSize:10, color:"#888", marginTop:3 }}>{l.bedrooms}bd · {l.bathrooms}ba · {Number(l.sqft).toLocaleString()} sqft</div>
                    <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)", width:12, height:12, background:"#fff", clipPath:"polygon(0 0, 100% 0, 50% 100%)" }}/>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Legend */}
          <div style={{ position:"absolute", bottom:20, right:20, background:"rgba(11,30,61,.85)", backdropFilter:"blur(8px)", padding:"12px 16px", border:"1px solid rgba(196,151,58,.2)" }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:8 }}>Status</div>
            {Object.entries(STATUS_COLORS).map(([s,c]) => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c }}/>
                <span style={{ color:"rgba(255,255,255,.7)", fontSize:11 }}>{s}</span>
              </div>
            ))}
            <div style={{ borderTop:"1px solid rgba(255,255,255,.1)", marginTop:8, paddingTop:8, fontSize:10, color:"rgba(255,255,255,.3)", lineHeight:1.5 }}>Positions approximate.<br/>Connect Maps API for<br/>precise coordinates.</div>
          </div>
          {listings.length === 0 && (
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ textAlign:"center", color:"rgba(255,255,255,.4)" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>🗺</div>
                <div style={{ fontSize:14 }}>No listings match your search</div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width:300, background:"#fff", borderLeft:"1px solid var(--border)", overflowY:"auto", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", background:"var(--cream)" }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--mid)" }}>Listings ({listings.length})</div>
          </div>
          {listings.map(l => (
            <div key={l.id} onClick={() => setSelectedListing(l)} onMouseEnter={() => setHovered(l)} onMouseLeave={() => setHovered(null)} style={{ padding:"14px 16px", borderBottom:"1px solid var(--border)", cursor:"pointer", background: hovered?.id===l.id ? "var(--cream)" : "#fff", transition:"background .15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--navy)", lineHeight:1.3, flex:1, marginRight:8 }}>{l.address}</div>
                <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", background:STATUS_COLORS[l.status]||"#555", color:"#fff", borderRadius:1, whiteSpace:"nowrap" }}>{l.status}</span>
              </div>
              <div style={{ fontSize:11, color:"var(--mid)", marginBottom:6 }}>{l.city}, {l.state}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:"var(--gold)" }}>{fmtPrice(l.price)}</span>
                <span style={{ fontSize:10, color:"var(--mid)" }}>{l.bedrooms}bd · {l.bathrooms}ba</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Add Listing ────────────────────────────────────────────────────────────────
function AddListingView({ addListing, setView, currentUser }) {
  const blank = { address:"", city:"", state:"", zip:"", price:"", bedrooms:"", bathrooms:"", sqft:"", lotSize:"", yearBuilt:"", propertyType:"Single Family", status:"Active", description:"", features:"", hoa:"", parking:"", basement:"None" };
  const [form, setForm] = useState(blank);
  const [success, setSuccess] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [err, setErr] = useState("");

  const submit = () => {
    if (!form.address || !form.city || !form.state || !form.zip || !form.price || !form.bedrooms || !form.bathrooms || !form.sqft) {
      setErr("Please fill in all required fields (marked with *)."); return;
    }
    const pos = zipToPos(form.zip);
    addListing({
      ...form,
      price: parseFloat(form.price.replace(/[^0-9.]/g,"")),
      bedrooms: parseFloat(form.bedrooms),
      bathrooms: parseFloat(form.bathrooms),
      sqft: parseInt(form.sqft),
      yearBuilt: parseInt(form.yearBuilt)||new Date().getFullYear(),
      features: form.features.split(",").map(f=>f.trim()).filter(Boolean),
      ...pos,
    });
    setSuccess(true);
    setForm(blank);
    setErr("");
  };

  if (success) return (
    <div style={{ maxWidth:560, margin:"80px auto", padding:"0 32px", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
      <h2 className="serif" style={{ fontSize:32, color:"var(--navy)", marginBottom:8 }}>Listing Submitted!</h2>
      <p style={{ color:"var(--mid)", fontSize:14, marginBottom:28 }}>Your property has been added to LibertyMLS and is now searchable. An MLS number has been assigned automatically.</p>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button className="btn btn-gold" onClick={() => { setSuccess(false); }}>Add Another Listing</button>
        <button className="btn btn-navy" onClick={() => setView("dashboard")}>View My Listings</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:900, margin:"40px auto", padding:"0 32px" }}>
      <div style={{ marginBottom:28 }}>
        <h1 className="serif" style={{ fontSize:36, fontWeight:700, color:"var(--navy)", marginBottom:4 }}>Add New Listing</h1>
        <p style={{ color:"var(--mid)", fontSize:14 }}>Listing as <strong>{currentUser.name}</strong> · {currentUser.company}</p>
      </div>
      {err && <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", padding:"12px 16px", fontSize:13, color:"#991B1B", marginBottom:20 }}>{err}</div>}
      
      <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
        {/* Location */}
        <div style={{ background:"#fff", border:"1px solid var(--border)", padding:24 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:16, paddingBottom:8, borderBottom:"1px solid var(--border)" }}>📍 Property Location</div>
          <div className="ff" style={{ marginBottom:14 }}><label>Street Address *</label><input value={form.address} onChange={e=>set("address",e.target.value)} placeholder="123 Main Street"/></div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:14 }}>
            <div className="ff"><label>City *</label><input value={form.city} onChange={e=>set("city",e.target.value)} placeholder="City"/></div>
            <div className="ff"><label>State *</label>
              <select value={form.state} onChange={e=>set("state",e.target.value)}>
                <option value="">Select</option>
                {STATES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="ff"><label>ZIP Code *</label><input value={form.zip} onChange={e=>set("zip",e.target.value)} placeholder="00000" maxLength={5}/></div>
          </div>
        </div>

        {/* Property Details */}
        <div style={{ background:"#fff", border:"1px solid var(--border)", padding:24 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:16, paddingBottom:8, borderBottom:"1px solid var(--border)" }}>🏠 Property Details</div>
          <div className="grid2" style={{ marginBottom:14 }}>
            <div className="ff"><label>Listing Price *</label><input value={form.price} onChange={e=>set("price",e.target.value)} placeholder="450000"/></div>
            <div className="ff"><label>Property Type *</label>
              <select value={form.propertyType} onChange={e=>set("propertyType",e.target.value)}>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:14 }}>
            <div className="ff"><label>Bedrooms *</label><input type="number" value={form.bedrooms} onChange={e=>set("bedrooms",e.target.value)} placeholder="3" min="0"/></div>
            <div className="ff"><label>Bathrooms *</label><input type="number" step="0.5" value={form.bathrooms} onChange={e=>set("bathrooms",e.target.value)} placeholder="2" min="0"/></div>
            <div className="ff"><label>Sq Footage *</label><input type="number" value={form.sqft} onChange={e=>set("sqft",e.target.value)} placeholder="1800"/></div>
            <div className="ff"><label>Year Built</label><input type="number" value={form.yearBuilt} onChange={e=>set("yearBuilt",e.target.value)} placeholder="2015"/></div>
          </div>
          <div className="grid2" style={{ marginBottom:14 }}>
            <div className="ff"><label>Lot Size</label><input value={form.lotSize} onChange={e=>set("lotSize",e.target.value)} placeholder="0.25 acres"/></div>
            <div className="ff"><label>Listing Status</label>
              <select value={form.status} onChange={e=>set("status",e.target.value)}>
                {["Active","Pending","Sold","Off Market"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid3">
            <div className="ff"><label>HOA Fee</label><input value={form.hoa} onChange={e=>set("hoa",e.target.value)} placeholder="$150/mo or None"/></div>
            <div className="ff"><label>Parking</label><input value={form.parking} onChange={e=>set("parking",e.target.value)} placeholder="2-Car Garage"/></div>
            <div className="ff"><label>Basement</label>
              <select value={form.basement} onChange={e=>set("basement",e.target.value)}>
                {["None","Unfinished","Finished","Partial"].map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div style={{ background:"#fff", border:"1px solid var(--border)", padding:24 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)", marginBottom:16, paddingBottom:8, borderBottom:"1px solid var(--border)" }}>📝 Description & Features</div>
          <div className="ff" style={{ marginBottom:14 }}>
            <label>Property Description</label>
            <textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={4} placeholder="Describe the property, neighborhood, highlights…" style={{ resize:"vertical" }}/>
          </div>
          <div className="ff">
            <label>Features & Amenities (comma-separated)</label>
            <input value={form.features} onChange={e=>set("features",e.target.value)} placeholder="Hardwood Floors, Granite Counters, Pool, 2-Car Garage…"/>
          </div>
        </div>

        <div style={{ display:"flex", gap:12, justifyContent:"flex-end", paddingBottom:40 }}>
          <button className="btn btn-ghost" onClick={() => setForm(blank)}>Clear Form</button>
          <button className="btn btn-gold" style={{ fontSize:14, padding:"13px 32px" }} onClick={submit}>Submit Listing →</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function DashboardView({ listings, currentUser, setSelectedListing, setView, setListings }) {
  const remove = (id) => { if (confirm("Remove this listing?")) setListings(prev => prev.filter(l => l.id !== id)); };
  const toggle = (id, status) => setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));

  return (
    <div style={{ maxWidth:1100, margin:"40px auto", padding:"0 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:6 }}>Agent Dashboard</div>
          <h1 className="serif" style={{ fontSize:36, fontWeight:700, color:"var(--navy)" }}>My Listings</h1>
          <p style={{ color:"var(--mid)", fontSize:14, marginTop:4 }}>{currentUser.name} · {currentUser.company} · License {currentUser.licenseNo}</p>
        </div>
        <button className="btn btn-gold" onClick={() => setView("add")}>+ Add New Listing</button>
      </div>

      {/* Stats */}
      <div className="grid4" style={{ marginBottom:28 }}>
        {[
          { label:"Total Listings", value: listings.length },
          { label:"Active", value: listings.filter(l=>l.status==="Active").length, color:"var(--green)" },
          { label:"Pending", value: listings.filter(l=>l.status==="Pending").length, color:"var(--gold)" },
          { label:"Sold", value: listings.filter(l=>l.status==="Sold").length, color:"var(--red)" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", border:"1px solid var(--border)", padding:"16px 20px" }}>
            <div className="serif" style={{ fontSize:32, fontWeight:700, color: s.color||"var(--navy)" }}>{s.value}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".08em", textTransform:"uppercase", color:"var(--mid)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {listings.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", background:"#fff", border:"1px solid var(--border)" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🏠</div>
          <div style={{ fontSize:18, fontWeight:600, color:"var(--navy)", marginBottom:8 }}>No listings yet</div>
          <p style={{ color:"var(--mid)", fontSize:14, marginBottom:24 }}>Add your first property to get started.</p>
          <button className="btn btn-gold" onClick={() => setView("add")}>+ Add Your First Listing</button>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px 130px 160px", gap:0, background:"var(--navy)", padding:"10px 20px" }}>
            {["Property","Price","Status","MLS Number","Actions"].map(h => (
              <div key={h} style={{ fontSize:10, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"var(--mid)" }}>{h}</div>
            ))}
          </div>
          {listings.map((l, i) => (
            <div key={l.id} style={{ display:"grid", gridTemplateColumns:"1fr 140px 120px 130px 160px", gap:0, padding:"14px 20px", background: i%2===0 ? "#fff" : "var(--cream)", borderBottom:"1px solid var(--border)", alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:"var(--navy)" }}>{l.address}</div>
                <div style={{ fontSize:11, color:"var(--mid)" }}>{l.city}, {l.state} {l.zip}</div>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:700, color:"var(--gold)" }}>{fmtPrice(l.price)}</div>
              <div>
                <select value={l.status} onChange={e=>toggle(l.id, e.target.value)} style={{ padding:"5px 10px", border:"1.5px solid var(--border)", fontFamily:"'DM Sans',sans-serif", fontSize:12, color:STATUS_COLORS[l.status]||"#333", cursor:"pointer", outline:"none", fontWeight:700, background:"#fff" }}>
                  {["Active","Pending","Sold","Off Market"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ fontSize:11, color:"var(--mid)", fontFamily:"monospace" }}>{l.mlsNumber}</div>
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedListing(l)} style={{ fontSize:11 }}>View</button>
                <button className="btn btn-sm" onClick={() => remove(l.id)} style={{ background:"#FEE2E2", color:"var(--red)", border:"none", cursor:"pointer", padding:"6px 12px", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:11, letterSpacing:".06em" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Account info */}
      <div style={{ marginTop:40, background:"var(--navy)", padding:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ color:"#fff", fontWeight:600, marginBottom:2 }}>{currentUser.name}</div>
          <div style={{ color:"var(--mid)", fontSize:12 }}>{currentUser.email} · {currentUser.phone}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ background:"rgba(196,151,58,.15)", border:"1px solid rgba(196,151,58,.3)", display:"inline-block", padding:"5px 14px", marginBottom:6 }}>
            <span style={{ color:"var(--gold2)", fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase" }}>✓ Active Subscription · $9.99/mo</span>
          </div>
          <div style={{ color:"var(--mid)", fontSize:11 }}>License: {currentUser.licenseNo}</div>
        </div>
      </div>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
export default function LibertyMLS() {
  const [view, setView] = useState("landing");
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [agents, setAgents] = useState(SEED_AGENTS);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ type:"", status:"", minPrice:"", maxPrice:"", beds:"", agent:"" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = {value: localStorage.getItem("lmls-listings")}; if (r?.value) setListings(JSON.parse(r.value)); } catch {}
      try { const r = {value: localStorage.getItem("lmls-agents")}; if (r?.value) setAgents(JSON.parse(r.value)); } catch {}
      setLoaded(true);
    })();
  }, []);

  useEffect(() => { if (loaded) localStorage.setItem("lmls-listings", JSON.stringify(listings)); }, [listings, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem("lmls-agents", JSON.stringify(agents)); }, [agents, loaded]);

  const addListing = (l) => setListings(prev => [{
    ...l, id:"l"+Date.now(), agentId:currentUser.id, agentName:currentUser.name,
    agentEmail:currentUser.email, agentPhone:currentUser.phone,
    mlsNumber:"MLS-"+new Date().getFullYear()+"-"+Math.floor(1000+Math.random()*9000),
    listDate: new Date().toISOString().split("T")[0],
  }, ...prev]);

  const onAuth = (email, password, isReg, formData) => {
    if (isReg) {
      const newAgent = { id:"a"+Date.now(), name:formData.name, email:formData.email, phone:formData.phone, company:formData.company, licenseNo:formData.licenseNo, subscribed:true, joined:new Date().toISOString().split("T")[0] };
      setAgents(prev => [...prev, newAgent]);
      setCurrentUser(newAgent);
    } else {
      const a = agents.find(a => a.email.toLowerCase() === email.toLowerCase());
      if (a) setCurrentUser(a);
    }
    setShowAuth(false);
    if (isReg) setView("dashboard");
  };

  const filtered = listings.filter(l => {
    if (searchQuery) { const q = searchQuery.toLowerCase(); if (![l.address,l.city,l.zip,l.state,l.agentName].some(s=>s.toLowerCase().includes(q))) return false; }
    if (filters.type && l.propertyType !== filters.type) return false;
    if (filters.status && l.status !== filters.status) return false;
    if (filters.minPrice && l.price < +filters.minPrice) return false;
    if (filters.maxPrice && l.price > +filters.maxPrice) return false;
    if (filters.beds && l.bedrooms < +filters.beds) return false;
    if (filters.agent && !l.agentName.toLowerCase().includes(filters.agent.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:"var(--cream)", minHeight:"100vh", color:"var(--navy)" }}>
      <style>{STYLES}</style>

      {/* ── Navbar ── */}
      <nav style={{ background:"var(--navy)", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 28px", position:"sticky", top:0, zIndex:50, borderBottom:"2px solid var(--gold)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => setView("landing")}>
          <svg width="22" height="28" viewBox="0 0 22 28">
            <path d="M11 1C11 1,7.5 5,7.5 9C7.5 11.5,8.8 12.8,11 13.2C13.2 12.8,14.5 11.5,14.5 9C14.5 5,11 1,11 1Z" fill="#C4973A"/>
            <rect x="9.5" y="13" width="3" height="11" fill="#6b80a0"/>
            <rect x="6" y="22" width="10" height="3" rx="1" fill="#6b80a0"/>
            <circle cx="11" cy="8.5" r="1.8" fill="#FFE0A0" opacity=".9"/>
          </svg>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#fff", letterSpacing:".04em" }}>Liberty<span style={{ color:"var(--gold)" }}>MLS</span></span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <button className={`nav-btn${view==="browse"?" active":""}`} onClick={() => setView("browse")}>Browse</button>
          <button className={`nav-btn${view==="map"?" active":""}`} onClick={() => setView("map")}>Map View</button>
          {currentUser ? (
            <>
              <button className={`nav-btn${view==="add"?" active":""}`} onClick={() => setView("add")}>+ Add Listing</button>
              <button className={`nav-btn${view==="dashboard"?" active":""}`} onClick={() => setView("dashboard")}>Dashboard</button>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:30, height:30, borderRadius:"50%", background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"var(--navy)" }}>{currentUser.name.charAt(0)}</div>
                <button className="nav-btn" style={{ fontSize:11, opacity:.5 }} onClick={() => setCurrentUser(null)}>Sign Out</button>
              </div>
            </>
          ) : (
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn btn-ghost-light" onClick={() => { setAuthMode("login"); setShowAuth(true); }}>Agent Login</button>
              <button className="btn btn-gold" style={{ padding:"8px 18px", fontSize:12 }} onClick={() => { setAuthMode("register"); setShowAuth(true); }}>Subscribe · $9.99/mo</button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Views ── */}
      {view === "landing" && <LandingView setView={setView} setShowAuth={setShowAuth} setAuthMode={setAuthMode} listings={listings}/>}
      {view === "browse" && <BrowseView listings={filtered} allListings={listings} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} setSelectedListing={setSelectedListing}/>}
      {view === "map" && <MapView listings={filtered} setSelectedListing={setSelectedListing} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}
      {view === "add" && (currentUser ? <AddListingView addListing={addListing} setView={setView} currentUser={currentUser}/> : <div style={{ textAlign:"center", padding:80 }}><p style={{ marginBottom:20, color:"var(--mid)" }}>Please sign in to add listings.</p><button className="btn btn-gold" onClick={() => { setShowAuth(true); setAuthMode("login"); }}>Sign In</button></div>)}
      {view === "dashboard" && (currentUser ? <DashboardView listings={listings.filter(l=>l.agentId===currentUser.id)} currentUser={currentUser} setSelectedListing={setSelectedListing} setView={setView} setListings={setListings}/> : <div style={{ textAlign:"center", padding:80 }}><p style={{ marginBottom:20, color:"var(--mid)" }}>Please sign in to view your dashboard.</p><button className="btn btn-gold" onClick={() => { setShowAuth(true); setAuthMode("login"); }}>Sign In</button></div>)}

      {/* ── Modals ── */}
      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)}/>}
      {showAuth && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setShowAuth(false)} onAuth={onAuth} agents={agents}/>}
    </div>
  );
}
