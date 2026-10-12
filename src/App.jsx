import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// STYLES
const cardStyle = { background:"#151c2c", borderRadius:16, padding:16, border:"1px solid #1f2937" };
const inputStyle = { background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, padding:"10px 12px", color:"white", outline:"none", fontSize:13, width:"100%", boxSizing:"border-box" };
const btnPrimary = { background:"#0ea5e9", color:"white", border:"none", borderRadius:8, padding:"10px 16px", cursor:"pointer", fontWeight:"bold", fontSize:13, width:"100%" };
const btnSmall = { color:"white", border:"none", borderRadius:6, padding:"6px 10px", cursor:"pointer", fontSize:11, fontWeight:"bold" };
const mutedStyle = { color:"#64748b", fontSize:11 };
const th = { padding:"10px 12px", fontSize:11, color:"#94a3b8" };
const td = { padding:"10px 12px", fontSize:12, borderTop:"1px solid #1f2937" };

// DASHBOARD - shows availability + low stock <2
function Dashboard({ books }) {
  const lowStock = books.filter(b => b.quantity < 2);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:15, marginBottom:20 }}>
        <div style={cardStyle}><small style={mutedStyle}>Total Books</small><h2 style={{margin:"5px 0"}}>{books.length}</h2><small style={mutedStyle}>{books.reduce((a,b)=>a+b.quantity,0)} copies total</small></div>
        <div style={{...cardStyle, border: lowStock.length>0? "1px solid #ef4444":"1px solid #1f2937"}}><small style={mutedStyle}>⚠️ Low Stock Alert (&lt;2)</small><h2 style={{margin:"5px 0", color: lowStock.length>0?"#ef4444":"white"}}>{lowStock.length}</h2><small style={mutedStyle}>Need restock</small></div>
        <div style={cardStyle}><small style={mutedStyle}>📚 Available</small><h2 style={{margin:"5px 0"}}>{books.filter(b=>b.quantity>0).length}</h2><small style={mutedStyle}>In stock now</small></div>
      </div>

      <div style={{...cardStyle, padding:0, overflow:"hidden"}}>
        <div style={{ padding:16 }}><b>Dashboard - Current Availability Table</b></div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead style={{ background:"#0f172a", textAlign:"left" }}><tr><th style={th}>Title</th><th style={th}>Author</th><th style={th}>Genre</th><th style={th}>ISBN</th><th style={th}>Qty</th><th style={th}>Status</th></tr></thead>
          <tbody>
            {books.map(b=>(
              <tr key={b.id} style={{ background: b.quantity<2? "#1f1010":"transparent" }}>
                <td style={td}><b>{b.title}</b></td>
                <td style={td}>{b.author}</td>
                <td style={td}>{b.genre}</td>
                <td style={td}>{b.isbn}</td>
                <td style={td}>{b.quantity}</td>
                <td style={td}><span style={{ background: b.quantity<2?"#ef4444": b.quantity<5?"#f59e0b":"#10b981", padding:"3px 8px", borderRadius:12, fontSize:10, color:"white" }}>{b.quantity<2?"LOW STOCK":"AVAILABLE"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// BOOK MANAGEMENT - Add, Update, Delete with Title, Author, Genre, ISBN, Quantity
function BookManagement({ books, setBooks }) {
  const [form, setForm] = useState({ title:"", author:"", genre:"", isbn:"", quantity:1 });
  const [editId, setEditId] = useState(null);

  // useEffect example - lifecycle
  useEffect(()=>{ console.log("Books updated", books.length); }, [books]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(editId){
      setBooks(books.map(b=> b.id===editId? {...b,...form, quantity: Number(form.quantity)} : b));
      setEditId(null);
    } else {
      setBooks([...books, { id: Date.now(),...form, quantity: Number(form.quantity) }]);
    }
    setForm({ title:"", author:"", genre:"", isbn:"", quantity:1 });
  };

  return (
    <div>
      <div style={{...cardStyle, marginBottom:20}}>
        <b>{editId? "Update Book Details" : "Add New Book - BookNet (Title, Author, Genre, ISBN, Quantity)"}</b>
        <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12 }}>
          <input style={inputStyle} placeholder="Title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <input style={inputStyle} placeholder="Author *" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} required />
          <input style={inputStyle} placeholder="Genre" value={form.genre} onChange={e=>setForm({...form,genre:e.target.value})} />
          <input style={inputStyle} placeholder="ISBN" value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} />
          <input style={inputStyle} type="number" min="0" placeholder="Initial Quantity" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} />
          <button type="submit" style={{...btnPrimary, gridColumn:"span 2"}}>{editId? "Update Book" : "+ Add to BookNet"}</button>
        </form>
      </div>

      <div style={{...cardStyle}}>
        <b>Editable List - Update & Delete Buttons</b>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px,1fr))", gap:12, marginTop:12 }}>
          {books.map(b=>(
            <div key={b.id} style={{ background:"#0f172a", borderRadius:12, padding:12, border:"1px solid #1e293b" }}>
              <b style={{fontSize:13}}>{b.title}</b>
              <div style={{fontSize:11, color:"#94a3b8"}}>{b.author} • {b.genre} • Qty: {b.quantity}</div>
              <div style={{fontSize:10, color:"#64748b"}}>ISBN: {b.isbn}</div>
              <div style={{ display:"flex", gap:8, marginTop:10 }}>
                <button onClick={()=>{setForm(b); setEditId(b.id)}} style={{...btnSmall, background:"#1e293b"}}>Update</button>
                <button onClick={()=>setBooks(books.filter(x=>x.id!==b.id))} style={{...btnSmall, background:"#ef4444"}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// TRANSACTIONS - Add/Deduct stock + history log
function TransactionsPage({ books, setBooks, transactions, setTransactions }) {
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState(1);
  const [type, setType] = useState("add");

  const handleTransaction = () => {
    if(!selected) return alert("Select book first");
    const book = books.find(b=>b.id==selected);
    const newQty = type==="add"? book.quantity + Number(amount) : book.quantity - Number(amount);
    if(newQty <0) return alert("Not enough stock to deduct!");
    setBooks(books.map(b=> b.id==selected? {...b, quantity:newQty} : b));
    setTransactions([{ id:Date.now(), title:book.title, type, amount:Number(amount), date:new Date().toLocaleString(), newQty },...transactions]);
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:16 }}>
      <div style={cardStyle}>
        <b>Availability Management - Add / Deduct</b>
        <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
          <select style={inputStyle} value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Select Book</option>{books.map(b=><option key={b.id} value={b.id}>{b.title} ({b.quantity})</option>)}</select>
          <select style={inputStyle} value={type} onChange={e=>setType(e.target.value)}><option value="add">Add Stock - New Arrivals</option><option value="deduct">Deduct Stock - Borrowed</option></select>
          <input style={inputStyle} type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} />
          <button onClick={handleTransaction} style={btnPrimary}>{type==="add"?"+ Add Stock":"+ Deduct Stock"}</button>
        </div>
      </div>
      <div style={cardStyle}>
        <b>Transaction History Log (localStorage)</b>
        <div style={{ marginTop:12, maxHeight:400, overflowY:"auto" }}>
          {transactions.length===0? <small style={mutedStyle}>No transactions yet - add/deduct stock</small> :
            transactions.map(t=>(
              <div key={t.id} style={{ background:"#0f172a", padding:10, borderRadius:8, marginBottom:8, fontSize:12, borderLeft:`3px solid ${t.type==="add"?"#10b981":"#f59e0b"}` }}>
                <b>{t.title}</b> • {t.type.toUpperCase()} {t.amount} • New Qty: {t.newQty}<br/><small style={mutedStyle}>{t.date}</small>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// USER MANAGEMENT - Login + Add/Update/Delete
function UserManagement({ users, setUsers }) {
  const [form, setForm] = useState({ name:"", membershipId:"", role:"Student" });
  const [login, setLogin] = useState({ id:"", name:"" });
  const [currentUser, setCurrentUser] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const u = users.find(u=>u.membershipId===login.id);
    if(u){ setCurrentUser(u); } else alert("User not found - Please register first");
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if(editId){ setUsers(users.map(u=>u.id===editId?{...u,...form}:u)); setEditId(null); }
    else { setUsers([...users, {id:Date.now(),...form}]); }
    setForm({ name:"", membershipId:"", role:"Student" });
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      <div>
        <div style={{...cardStyle, marginBottom:16}}>
          <b>User Login Form</b>
          <form onSubmit={handleLogin} style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
            <input style={inputStyle} placeholder="Membership ID (e.g. BIT001)" value={login.id} onChange={e=>setLogin({...login,id:e.target.value})} required />
            <input style={inputStyle} placeholder="Name" value={login.name} onChange={e=>setLogin({...login,name:e.target.value})} />
            <button type="submit" style={btnPrimary}>Login</button>
            {currentUser && <small style={{color:"#10b981"}}>Logged in as: {currentUser.name} ({currentUser.role})</small>}
          </form>
        </div>
        <div style={cardStyle}>
          <b>{editId?"Update User":"Add New User - Name, Membership ID, Role"}</b>
          <form onSubmit={handleAddUser} style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
            <input style={inputStyle} placeholder="Full Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            <input style={inputStyle} placeholder="Membership ID * (BIT001)" value={form.membershipId} onChange={e=>setForm({...form,membershipId:e.target.value})} required />
            <select style={inputStyle} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option>Student</option><option>Librarian</option><option>Admin</option><option>Member</option></select>
            <button type="submit" style={btnPrimary}>{editId?"Update User":"+ Add User"}</button>
          </form>
        </div>
      </div>
      <div style={cardStyle}>
        <b>Admin View - Manage Users (Update/Delete)</b>
        <div style={{ marginTop:12 }}>
          {users.map(u=>(
            <div key={u.id} style={{ background:"#0f172a", padding:10, borderRadius:8, marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><b style={{fontSize:12}}>{u.name}</b><br/><small style={mutedStyle}>{u.membershipId} • {u.role}</small></div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>{setForm(u); setEditId(u.id)}} style={{...btnSmall, background:"#1e293b"}}>Update</button>
                <button onClick={()=>setUsers(users.filter(x=>x.id!==u.id))} style={{...btnSmall, background:"#ef4444"}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, label }) {
  const loc = useLocation();
  const active = loc.pathname===to;
  return <Link to={to} style={{ textDecoration:"none", background: active?"#1f2937":"transparent", color: active?"white":"#9ca3af", padding:"10px 12px", borderRadius:8, fontSize:13, borderLeft: active?"3px solid #0ea5e9":"3px solid transparent", display:"block", marginBottom:6 }}>{label}</Link>;
}

// MAIN APP with Router + localStorage + useState + useEffect
export default function App() {
  const [books, setBooks] = useState(()=>{ const s=localStorage.getItem("booknet_books"); return s? JSON.parse(s): [
    { id:1, title:"Things Fall Apart", author:"Chinua Achebe", genre:"Classic", isbn:"978-0385474542", quantity:1 },
    { id:2, title:"Long Walk to Freedom", author:"Nelson Mandela", genre:"Biography", isbn:"978-0316548182", quantity:5 },
    { id:3, title:"Born a Crime", author:"Trevor Noah", genre:"Biography", isbn:"978-0399588174", quantity:0 },
  ]});
  const [transactions, setTransactions] = useState(()=>{ const s=localStorage.getItem("booknet_trans"); return s? JSON.parse(s): [] });
  const [users, setUsers] = useState(()=>{ const s=localStorage.getItem("booknet_users"); return s? JSON.parse(s): [{id:1, name:"Smart Tech", membershipId:"BIT001", role:"Admin"}] });

  useEffect(()=>{ localStorage.setItem("booknet_books", JSON.stringify(books)); }, [books]);
  useEffect(()=>{ localStorage.setItem("booknet_trans", JSON.stringify(transactions)); }, [transactions]);
  useEffect(()=>{ localStorage.setItem("booknet_users", JSON.stringify(users)); }, [users]);

  return (
    <Router>
      <div style={{ background:"#0a0e1a", minHeight:"100vh", color:"white", fontFamily:"Segoe UI, sans-serif", display:"flex" }}>
        <div style={{ width:250, background:"#111827", borderRight:"1px solid #1f2937", padding:20, display:"flex", flexDirection:"column", gap:24, position:"fixed", height:"100vh" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:36, height:36, background:"linear-gradient(135deg,#0ea5e9,#3b82f6)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"bold" }}>B</div><div><b>BOOKNET</b><br/><small style={{fontSize:9, color:"#64748b"}}>LIMKOKWING • BIWA2110</small></div></div>
          <nav><NavLink to="/" label="🏠 Dashboard" /><NavLink to="/books" label="📚 Book Management" /><NavLink to="/transactions" label="🔄 Transactions" /><NavLink to="/users" label="👥 User Management" /></nav>
          <div style={{ marginTop:"auto", background:"#0f172a", borderRadius:12, padding:12, border:"1px solid #1e293b" }}><small style={{color:"#7dd3fc"}}>BookNet System</small><br/><small style={{fontSize:10, color:"#64748b"}}>React Hooks • Router<br/>LocalStorage • Maseru</small></div>
        </div>

        <div style={{ marginLeft:250, flex:1, padding:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
            <div><h2 style={{margin:0, fontWeight:400}}>BookNet Library System</h2><small style={{color:"#94a3b8"}}>Maseru Community Library • {new Date().toDateString()}</small></div>
            <div style={{ background:"#1f2937", padding:"6px 12px", borderRadius:20, fontSize:11 }}>{books.reduce((a,b)=>a+b.quantity,0)} copies • {users.length} users</div>
          </div>

          <Routes>
            <Route path="/" element={<Dashboard books={books} />} />
            <Route path="/books" element={<BookManagement books={books} setBooks={setBooks} />} />
            <Route path="/transactions" element={<TransactionsPage books={books} setBooks={setBooks} transactions={transactions} setTransactions={setTransactions} />} />
            <Route path="/users" element={<UserManagement users={users} setUsers={setUsers} />} />
          </Routes>

          <p style={{ textAlign:"center", color:"#334155", fontSize:10, marginTop:30 }}>BOOKNET • BIWA2110 Individual Assignment 2 • Faculty of ICT • Original Work • 2026</p>
        </div>
      </div>
    </Router>
  );
}