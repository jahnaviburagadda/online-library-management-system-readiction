import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

// ═══════════════════════════════════════════════════════════════════════
// AUTH CONTEXT
// ═══════════════════════════════════════════════════════════════════════
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('rToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API}/auth/me`)
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('rToken'))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const _save = (token, u) => {
    localStorage.setItem('rToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(u);
  };

  const login    = async (e, p) => { const r = await axios.post(`${API}/auth/login`,    { email: e, password: p }); _save(r.data.token, r.data.user); return r.data.user; };
  const register = async (d)    => { const r = await axios.post(`${API}/auth/register`, d);                         _save(r.data.token, r.data.user); return r.data.user; };
  const logout   = () => { localStorage.removeItem('rToken'); delete axios.defaults.headers.common['Authorization']; setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

// ═══════════════════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════════════════
const RC = createContext();
const useRouter = () => useContext(RC);

const RouterProvider = ({ children }) => {
  const [page,   setPage]   = useState('home');
  const [params, setParams] = useState({});
  const navigate = (p, pr = {}) => { setPage(p); setParams(pr); window.scrollTo(0, 0); };
  return <RC.Provider value={{ page, params, navigate }}>{children}</RC.Provider>;
};

// ═══════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#C9A84C;--gold-l:#E8C97A;--gold-dim:rgba(201,168,76,.14);
  --dk:#0D0A06;--dk2:#131009;--dk3:#1C1710;--dk4:#251E11;--dk5:#2E2514;
  --cr:#F5EDD6;--mu:#7A6A52;
  --rd:#C0392B;--rd-dim:rgba(192,57,43,.14);
  --gn:#27AE60;--gn-dim:rgba(39,174,96,.14);
  --bl:#2980B9;--bl-dim:rgba(41,128,185,.14);
  --br:rgba(201,168,76,.11);--br-h:rgba(201,168,76,.32);
  --sh:0 4px 24px rgba(0,0,0,.4);
}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--dk);color:var(--cr);min-height:100vh}

/* ── NAV ────────────────────────────────────── */
.nav{position:fixed;inset:0 0 auto 0;z-index:900;height:66px;
  background:rgba(13,10,6,.97);backdrop-filter:blur(18px);
  border-bottom:1px solid var(--br);
  display:flex;align-items:center;justify-content:space-between;padding:0 2.2rem;gap:1rem}
.logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:800;
  color:var(--gold);cursor:pointer;letter-spacing:.5px;user-select:none}
.logo span{color:var(--cr)}
.nav-mid{display:flex;align-items:center;gap:.1rem}
.nb{background:none;border:none;color:rgba(245,237,214,.68);font-family:'Inter',sans-serif;
  font-size:.865rem;font-weight:500;cursor:pointer;padding:.42rem .95rem;
  border-radius:7px;transition:all .18s;letter-spacing:.1px}
.nb:hover,.nb.a{color:var(--gold);background:var(--gold-dim)}
.nav-r{display:flex;align-items:center;gap:.7rem}
.btn-g{background:var(--gold);color:var(--dk);font-family:'Inter',sans-serif;
  font-weight:700;font-size:.82rem;padding:.45rem 1.1rem;border:none;
  border-radius:7px;cursor:pointer;transition:all .18s;letter-spacing:.2px}
.btn-g:hover{background:var(--gold-l);transform:translateY(-1px)}
.btn-o{background:transparent;border:1px solid var(--br-h);color:var(--gold);
  font-family:'Inter',sans-serif;font-weight:500;font-size:.82rem;
  padding:.42rem 1rem;border-radius:7px;cursor:pointer;transition:all .18s}
.btn-o:hover{background:var(--gold-dim)}

/* ── HERO ───────────────────────────────────── */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  align-items:center;text-align:center;position:relative;overflow:hidden;
  padding:7rem 2rem 4rem}
.h-bg{position:absolute;inset:0;
  background:linear-gradient(155deg,#0D0A06 0%,#131009 30%,#1C1710 60%,#0D0A06 100%)}
.h-grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(201,168,76,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(201,168,76,.035) 1px,transparent 1px);
  background-size:55px 55px}
.h-glow{position:absolute;top:22%;left:50%;transform:translateX(-50%);
  width:560px;height:260px;pointer-events:none;
  background:radial-gradient(ellipse,rgba(201,168,76,.07) 0%,transparent 70%)}
.h-content{position:relative;z-index:1;max-width:800px}
.h-pill{display:inline-flex;align-items:center;gap:.45rem;
  background:var(--gold-dim);border:1px solid var(--br-h);color:var(--gold);
  font-size:.7rem;letter-spacing:2.8px;text-transform:uppercase;
  padding:.38rem 1.1rem;border-radius:40px;margin-bottom:1.8rem}
.h-title{font-family:'Playfair Display',serif;
  font-size:clamp(2.7rem,6.5vw,5rem);font-weight:800;line-height:1.07;margin-bottom:1.4rem}
.h-title .gd{color:var(--gold)}
.h-sub{font-size:1.05rem;color:rgba(245,237,214,.6);line-height:1.88;
  max-width:540px;margin:0 auto 2.6rem;font-weight:300}
.h-btns{display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap}
.hbtn{padding:.88rem 2.1rem;border-radius:9px;font-size:.96rem;font-weight:700;
  font-family:'Inter',sans-serif;cursor:pointer;transition:all .22s;border:none}
.hbtn-p{background:var(--gold);color:var(--dk)}
.hbtn-p:hover{background:var(--gold-l);transform:translateY(-2px);box-shadow:0 10px 28px rgba(201,168,76,.25)}
.hbtn-s{background:transparent;color:var(--cr);border:1px solid rgba(245,237,214,.22)}
.hbtn-s:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px)}
.h-stats{display:flex;gap:2.8rem;justify-content:center;
  margin-top:3.2rem;padding-top:2.4rem;border-top:1px solid var(--br)}
.st-n{font-family:'Playfair Display',serif;font-size:1.9rem;font-weight:700;color:var(--gold)}
.st-l{font-size:.68rem;color:var(--mu);letter-spacing:1.4px;text-transform:uppercase;margin-top:.18rem}

/* ── SECTION ────────────────────────────────── */
.sec{padding:4.2rem 2rem;max-width:1240px;margin:0 auto}
.sec-hd{text-align:center;margin-bottom:2.8rem}
.sec-t{font-family:'Playfair Display',serif;font-size:2.1rem;
  font-weight:700;color:var(--cr);margin-bottom:.55rem}
.sec-t span{color:var(--gold)}
.sec-s{color:var(--mu);font-size:.88rem;font-weight:300}

/* ── PAGE BAND ──────────────────────────────── */
.pw{min-height:100vh;padding-top:66px}
.pg-band{background:var(--dk2);border-bottom:1px solid var(--br);padding:2.2rem 2.2rem 1.6rem}
.pg-band-in{max-width:1240px;margin:0 auto}
.pg-t{font-family:'Playfair Display',serif;font-size:1.9rem;
  font-weight:700;color:var(--cr);margin-bottom:1.1rem}
.pg-t span{color:var(--gold)}

/* ── SEARCH ─────────────────────────────────── */
.srch{position:relative;margin-bottom:1.2rem}
.srch-i{width:100%;padding:.8rem 1rem .8rem 2.7rem;
  background:var(--dk3);border:1px solid var(--br);border-radius:8px;
  color:var(--cr);font-size:.9rem;font-family:'Inter',sans-serif;outline:none;
  transition:border-color .18s}
.srch-i::placeholder{color:var(--mu)}
.srch-i:focus{border-color:var(--br-h)}
.srch-ico{position:absolute;left:.9rem;top:50%;transform:translateY(-50%);
  color:var(--mu);font-size:.88rem;pointer-events:none}

/* ── CHIPS ──────────────────────────────────── */
.chips{display:flex;gap:.45rem;flex-wrap:wrap;margin-bottom:2rem}
.chip{padding:.33rem .9rem;border-radius:18px;border:1px solid var(--br);
  background:transparent;color:var(--mu);font-family:'Inter',sans-serif;
  font-size:.78rem;cursor:pointer;transition:all .18s;font-weight:500}
.chip:hover{border-color:var(--br-h);color:var(--cr)}
.chip.on{background:var(--gold);border-color:var(--gold);color:var(--dk);font-weight:700}

/* ── BOOKS GRID ─────────────────────────────── */
.bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:1.4rem}

/* ── BOOK CARD ──────────────────────────────── */
.bc{background:var(--dk3);border:1px solid var(--br);border-radius:13px;
  overflow:hidden;transition:all .28s;position:relative;display:flex;flex-direction:column}
.bc:hover{transform:translateY(-5px);border-color:var(--br-h);
  box-shadow:0 16px 38px rgba(0,0,0,.45)}
.bc-img{width:100%;height:230px;object-fit:cover;display:block;flex-shrink:0}
.bc-fb{width:100%;height:230px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,var(--dk4),var(--dk2));font-size:3rem;flex-shrink:0}
.bc-body{padding:.95rem;display:flex;flex-direction:column;gap:.0rem;flex:1}
.bc-lang{font-size:.63rem;letter-spacing:1.8px;text-transform:uppercase;
  color:var(--bl);font-weight:700;margin-bottom:.2rem;
  background:var(--bl-dim);border:1px solid rgba(41,128,185,.2);
  display:inline-block;padding:.1rem .45rem;border-radius:4px}
.bc-genre{font-size:.65rem;letter-spacing:1.5px;text-transform:uppercase;
  color:var(--gold);font-weight:600;margin-bottom:.22rem}
.bc-title{font-family:'Playfair Display',serif;font-size:.93rem;font-weight:600;
  color:var(--cr);margin-bottom:.15rem;line-height:1.3}
.bc-author{font-size:.74rem;color:var(--mu);margin-bottom:.5rem}
.bc-stars{display:flex;align-items:center;gap:.3rem;margin-bottom:.65rem}
.stars{color:var(--gold);font-size:.7rem;letter-spacing:.5px}
.rnum{font-size:.72rem;color:var(--mu)}

/* due-date strip */
.due-strip{border-radius:6px;padding:.35rem .6rem;margin-bottom:.65rem;font-size:.74rem;font-weight:600}
.due-ok   {background:var(--gn-dim); border:1px solid rgba(39,174,96,.25); color:var(--gn)}
.due-warn {background:rgba(230,126,34,.13); border:1px solid rgba(230,126,34,.28); color:#E67E22}
.due-over {background:var(--rd-dim); border:1px solid rgba(192,57,43,.3);  color:#E87070}
.due-none {background:var(--gold-dim);border:1px solid var(--br-h); color:var(--gold)}

/* action row */
.bc-acts{display:flex;gap:.42rem;margin-top:auto}
.btn-rent{flex:1;padding:.4rem 0;background:var(--gold);color:var(--dk);
  border:none;border-radius:6px;font-size:.74rem;font-weight:700;
  font-family:'Inter',sans-serif;cursor:pointer;transition:all .18s;white-space:nowrap}
.btn-rent:hover{background:var(--gold-l)}
.btn-rent.active{background:var(--gn-dim);color:var(--gn);
  border:1px solid rgba(39,174,96,.3);cursor:default}
.btn-rent.overdue{background:var(--rd-dim);color:#E87070;
  border:1px solid rgba(192,57,43,.3)}
.btn-read{padding:.4rem .62rem;background:var(--dk4);border:1px solid var(--br);
  color:var(--cr);border-radius:6px;font-size:.74rem;font-weight:500;
  font-family:'Inter',sans-serif;cursor:pointer;transition:all .18s}
.btn-read:hover{border-color:var(--br-h);color:var(--gold)}
.btn-wl{padding:.4rem .55rem;background:var(--dk4);border:1px solid var(--br);
  color:var(--mu);border-radius:6px;font-size:.8rem;
  font-family:'Inter',sans-serif;cursor:pointer;transition:all .18s;line-height:1}
.btn-wl:hover{border-color:var(--br-h)}
.btn-wl.on{color:#E87070;border-color:rgba(192,57,43,.4);background:var(--rd-dim)}

/* badges */
.badge{position:absolute;top:.55rem;left:.55rem;font-size:.58rem;font-weight:700;
  letter-spacing:.4px;text-transform:uppercase;padding:.18rem .48rem;
  border-radius:4px;line-height:1.4}
.badge-rented {background:var(--gn);   color:#fff}
.badge-overdue{background:var(--rd);   color:#fff}
.badge-lang   {position:absolute;top:.55rem;right:.55rem;background:rgba(13,10,6,.82);
  color:var(--gold);font-size:.62rem;font-weight:700;padding:.18rem .48rem;
  border-radius:4px;letter-spacing:.5px;backdrop-filter:blur(4px)}

/* ── GENRES ─────────────────────────────────── */
.gen-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:1.15rem}
.gen-card{background:var(--dk3);border:1px solid var(--br);border-radius:13px;
  padding:1.9rem 1.1rem 1.5rem;text-align:center;cursor:pointer;transition:all .26s}
.gen-card:hover{border-color:var(--gold);background:rgba(201,168,76,.055);
  transform:translateY(-4px);box-shadow:0 10px 28px rgba(0,0,0,.3)}
.gen-icon{font-size:2.4rem;margin-bottom:.7rem;display:block}
.gen-name{font-family:'Playfair Display',serif;font-size:1.02rem;
  font-weight:700;color:var(--cr);margin-bottom:.28rem}
.gen-cnt{font-size:.74rem;color:var(--mu)}

/* genre-detail hero */
.gd-hero{background:linear-gradient(135deg,var(--dk2),var(--dk3));
  border-bottom:1px solid var(--br);padding:2.8rem 2rem;text-align:center}
.gd-hero h1{font-family:'Playfair Display',serif;font-size:2.5rem;
  font-weight:700;color:var(--cr)}
.gd-hero h1 span{color:var(--gold)}
.gd-hero p{color:var(--mu);margin-top:.45rem;font-size:.9rem}

/* ── READER ─────────────────────────────────── */
.rdr-pg{min-height:100vh;padding-top:66px;background:var(--dk)}
.rdr-hd{background:var(--dk2);border-bottom:1px solid var(--br);
  padding:1.3rem 2rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
.rdr-hd h2{font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--cr)}
.rdr-hd p{color:var(--mu);font-size:.8rem}
.btn-back{background:var(--dk4);border:1px solid var(--br);color:var(--cr);
  padding:.44rem .95rem;border-radius:7px;cursor:pointer;font-family:'Inter',sans-serif;
  font-size:.8rem;font-weight:500;transition:all .18s;white-space:nowrap}
.btn-back:hover{border-color:var(--br-h);color:var(--gold)}
.rdr-body{max-width:750px;margin:0 auto;padding:2.8rem 2rem}
.rdr-paper{background:var(--dk2);border:1px solid var(--br);
  border-radius:14px;padding:2.8rem;min-height:460px}
.rdr-lbl{text-align:center;color:var(--mu);font-size:.7rem;
  letter-spacing:2.4px;text-transform:uppercase;margin-bottom:1.8rem}
.rdr-txt{font-family:'Inter',sans-serif;font-size:1.02rem;line-height:2.05;
  color:rgba(245,237,214,.82);white-space:pre-wrap}
.rdr-nav{display:flex;align-items:center;justify-content:center;gap:.9rem;margin-top:2.2rem}
.rdr-btn{background:var(--dk3);border:1px solid var(--br);color:var(--cr);
  padding:.6rem 1.3rem;border-radius:8px;cursor:pointer;font-family:'Inter',sans-serif;
  font-size:.83rem;font-weight:500;transition:all .18s}
.rdr-btn:hover:not(:disabled){border-color:var(--br-h);color:var(--gold)}
.rdr-btn:disabled{opacity:.28;cursor:not-allowed}
.pg-ind{color:var(--mu);font-size:.85rem;min-width:65px;text-align:center}

/* ── AUTH ───────────────────────────────────── */
.auth-pg{min-height:100vh;display:flex;align-items:center;justify-content:center;
  padding:2rem;background:var(--dk);position:relative;overflow:hidden}
.auth-glow{position:absolute;top:28%;left:50%;transform:translateX(-50%);
  width:480px;height:240px;pointer-events:none;
  background:radial-gradient(ellipse,rgba(201,168,76,.065) 0%,transparent 70%)}
.auth-card{position:relative;z-index:1;background:var(--dk2);
  border:1px solid var(--br);border-radius:16px;padding:2.6rem;
  width:100%;max-width:450px}
.auth-logo{text-align:center;margin-bottom:1.8rem}
.auth-logo h1{font-family:'Playfair Display',serif;font-size:1.9rem;
  font-weight:800;color:var(--gold)}
.auth-logo p{color:var(--mu);font-size:.8rem;margin-top:.28rem}
.a-tabs{display:flex;border:1px solid var(--br);border-radius:8px;
  overflow:hidden;margin-bottom:1.6rem}
.a-tab{flex:1;padding:.65rem;background:none;border:none;color:var(--mu);
  font-family:'Inter',sans-serif;font-size:.85rem;cursor:pointer;transition:all .18s}
.a-tab.on{background:var(--gold-dim);color:var(--gold);font-weight:700}
.role-row{display:flex;gap:.45rem;margin-bottom:1.3rem}
.rtab{flex:1;padding:.55rem;background:none;border:1px solid var(--br);color:var(--mu);
  font-family:'Inter',sans-serif;font-size:.82rem;cursor:pointer;
  border-radius:7px;transition:all .18s}
.rtab.on{background:var(--gold-dim);border-color:var(--gold);color:var(--gold);font-weight:600}
.fg{margin-bottom:1rem}
.fl{display:block;font-size:.73rem;color:var(--mu);margin-bottom:.35rem;
  letter-spacing:.45px;text-transform:uppercase;font-weight:600}
.fi{width:100%;padding:.75rem .95rem;background:rgba(255,255,255,.038);
  border:1px solid var(--br);border-radius:8px;color:var(--cr);
  font-size:.9rem;font-family:'Inter',sans-serif;outline:none;transition:border-color .18s}
.fi:focus{border-color:var(--br-h)}
.fi::placeholder{color:rgba(122,106,82,.5)}
.fi.err-field{border-color:rgba(192,57,43,.5)}
.pw-wrap{position:relative}
.pw-eye{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);
  background:none;border:none;color:var(--mu);cursor:pointer;font-size:.88rem;padding:.2rem}
.pw-eye:hover{color:var(--gold)}
.pw-match{font-size:.72rem;margin-top:.28rem;font-weight:500}
.pw-match.ok{color:var(--gn)}
.pw-match.no{color:#E87070}
.btn-sub{width:100%;padding:.9rem;background:var(--gold);color:var(--dk);
  font-family:'Inter',sans-serif;font-weight:700;font-size:.95rem;border:none;
  border-radius:9px;cursor:pointer;transition:all .18s;margin-top:.35rem}
.btn-sub:hover{background:var(--gold-l);transform:translateY(-1px)}
.btn-sub:disabled{opacity:.52;cursor:not-allowed;transform:none}
.err-msg{background:var(--rd-dim);border:1px solid rgba(192,57,43,.3);
  color:#E87070;padding:.6rem .95rem;border-radius:7px;font-size:.82rem;margin-bottom:.9rem}
.suc-msg{background:var(--gn-dim);border:1px solid rgba(39,174,96,.3);
  color:var(--gn);padding:.6rem .95rem;border-radius:7px;font-size:.82rem;margin-bottom:.9rem}

/* ── PROFILE ────────────────────────────────── */
.prof-pg{min-height:100vh;padding-top:66px}
.prof-body{max-width:1020px;margin:0 auto;padding:2.4rem 2rem}
.card{background:var(--dk2);border:1px solid var(--br);border-radius:14px;
  padding:2.2rem;margin-bottom:1.6rem}
.prof-top{display:flex;gap:1.8rem;align-items:flex-start;flex-wrap:wrap}
.avatar{width:84px;height:84px;border-radius:50%;
  background:linear-gradient(135deg,var(--gold),var(--gold-l));
  display:flex;align-items:center;justify-content:center;
  font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;
  color:var(--dk);flex-shrink:0}
.prof-info{flex:1;min-width:180px}
.prof-name{font-family:'Playfair Display',serif;font-size:1.8rem;
  font-weight:700;color:var(--cr);margin-bottom:.25rem}
.prof-email{color:var(--mu);font-size:.85rem;margin-bottom:.55rem}
.role-badge{display:inline-flex;align-items:center;gap:.3rem;
  padding:.25rem .8rem;border-radius:20px;font-size:.7rem;
  font-weight:700;letter-spacing:.45px;text-transform:uppercase}
.rb-student{background:var(--bl-dim);color:#5DADE2;border:1px solid rgba(41,128,185,.28)}
.rb-admin  {background:var(--gold-dim);color:var(--gold);border:1px solid var(--br-h)}
.pstats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));
  gap:.9rem;margin-top:1.7rem;padding-top:1.7rem;border-top:1px solid var(--br)}
.pstat{text-align:center;padding:.75rem;background:var(--dk3);
  border:1px solid var(--br);border-radius:9px}
.pstat-n{font-family:'Playfair Display',serif;font-size:1.6rem;
  font-weight:700;color:var(--gold);margin-bottom:.15rem}
.pstat-l{font-size:.68rem;color:var(--mu);letter-spacing:.45px;text-transform:uppercase}
.pdetails{display:grid;grid-template-columns:repeat(auto-fill,minmax(185px,1fr));
  gap:.9rem;margin-top:1.4rem}
.pd{background:var(--dk3);border:1px solid var(--br);border-radius:8px;padding:.9rem}
.pd-l{font-size:.68rem;color:var(--mu);letter-spacing:.9px;
  text-transform:uppercase;font-weight:600;margin-bottom:.3rem}
.pd-v{font-size:.88rem;color:var(--cr);font-weight:500}
.divider{height:1px;background:var(--br);margin:1.6rem 0}
.sec-head{font-family:'Playfair Display',serif;font-size:1.35rem;
  font-weight:700;color:var(--cr);margin-bottom:1.3rem}
.sec-head span{color:var(--gold)}
.overdue-alert{background:var(--rd-dim);border:1px solid rgba(192,57,43,.28);
  border-radius:9px;padding:.95rem 1.2rem;margin-bottom:1.3rem}
.overdue-alert h4{color:#E87070;font-weight:700;margin-bottom:.28rem;font-size:.9rem}
.overdue-alert p{color:rgba(232,112,112,.72);font-size:.8rem;line-height:1.55}

/* rental cards */
.rc{background:var(--dk3);border:1px solid var(--br);border-radius:11px;
  padding:1.1rem 1.3rem;display:flex;align-items:flex-start;gap:1.1rem;
  flex-wrap:wrap;margin-bottom:.85rem;transition:border-color .18s}
.rc:hover{border-color:var(--br-h)}
.rc-cov{width:48px;height:63px;object-fit:cover;border-radius:5px;flex-shrink:0}
.rc-fb{width:48px;height:63px;background:var(--dk4);border-radius:5px;
  flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.3rem}
.rc-info{flex:1;min-width:150px}
.rc-title{font-family:'Playfair Display',serif;font-size:.93rem;color:var(--cr);margin-bottom:.12rem}
.rc-meta{font-size:.75rem;color:var(--mu);margin-bottom:.55rem}
.rc-dates{display:flex;gap:1.1rem;flex-wrap:wrap;margin-bottom:.5rem}
.rcd{display:flex;flex-direction:column;gap:.08rem}
.rcd-l{font-size:.63rem;color:var(--mu);letter-spacing:.5px;text-transform:uppercase;font-weight:600}
.rcd-v{font-size:.78rem;color:var(--cr);font-weight:500}
.penalty-row{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;
  background:var(--rd-dim);border:1px solid rgba(192,57,43,.28);
  border-radius:7px;padding:.55rem .85rem;margin-top:.55rem}
.pen-amt{font-size:.97rem;font-weight:700;color:#E87070;font-family:'Playfair Display',serif}
.pen-lbl{font-size:.7rem;color:rgba(232,112,112,.65)}
.btn-pay{background:var(--rd);color:#fff;border:none;padding:.33rem .8rem;
  border-radius:5px;cursor:pointer;font-family:'Inter',sans-serif;
  font-size:.75rem;font-weight:700;transition:all .18s;white-space:nowrap}
.btn-pay:hover{background:#A93226}
.paid-tag{font-size:.67rem;color:var(--gn);font-weight:700;
  letter-spacing:.4px;text-transform:uppercase}
.rc-actions{display:flex;flex-direction:column;gap:.45rem;align-items:flex-end;flex-shrink:0}
.rs{padding:.26rem .75rem;border-radius:18px;font-size:.68rem;
  font-weight:700;letter-spacing:.45px;text-transform:uppercase;white-space:nowrap}
.rs-act{background:var(--gn-dim);color:var(--gn);border:1px solid rgba(39,174,96,.28)}
.rs-ov {background:var(--rd-dim);color:#E87070;border:1px solid rgba(192,57,43,.28)}
.rs-ret{background:var(--gold-dim);color:var(--gold);border:1px solid var(--br-h)}
.btn-ret{background:var(--dk4);border:1px solid var(--br);color:var(--cr);
  padding:.33rem .75rem;border-radius:5px;cursor:pointer;font-family:'Inter',sans-serif;
  font-size:.74rem;font-weight:500;transition:all .18s;white-space:nowrap}
.btn-ret:hover{border-color:var(--br-h);color:var(--gold)}

/* ── ADMIN ──────────────────────────────────── */
.adm-hd{background:var(--dk2);border-bottom:1px solid var(--br);padding:1.7rem 2.2rem}
.adm-hd h1{font-family:'Playfair Display',serif;font-size:1.65rem;color:var(--gold)}
.adm-hd p{color:var(--mu);font-size:.82rem;margin-top:.25rem}
.adm-stat-bar{background:var(--dk2);border-bottom:1px solid var(--br);
  padding:1.1rem 2.2rem;display:flex;gap:1.2rem;flex-wrap:wrap}
.adm-stat{background:var(--dk3);border:1px solid var(--br);border-radius:8px;
  padding:.7rem 1.1rem;min-width:115px}
.adm-stat-n{font-family:'Playfair Display',serif;font-size:1.35rem;
  font-weight:700;color:var(--gold)}
.adm-stat-l{font-size:.66rem;color:var(--mu);text-transform:uppercase;
  letter-spacing:.5px;margin-top:.1rem}
.adm-tabs{display:flex;gap:.4rem;padding:1.1rem 2.2rem;
  background:var(--dk2);border-bottom:1px solid var(--br);flex-wrap:wrap}
.adt{background:none;border:none;color:var(--mu);font-family:'Inter',sans-serif;
  font-size:.83rem;cursor:pointer;padding:.42rem .85rem;border-radius:7px;
  transition:all .18s;font-weight:500}
.adt.on{background:var(--gold-dim);color:var(--gold);font-weight:700}
.adm-body{max-width:1140px;margin:0 auto;padding:2rem 2rem}
.adm-form{background:var(--dk2);border:1px solid var(--br);
  border-radius:12px;padding:1.8rem;margin-bottom:1.8rem}
.adm-form h3{font-family:'Playfair Display',serif;color:var(--cr);
  margin-bottom:1.3rem;font-size:1.1rem}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:.9rem}
.adm-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.9rem}
.adm-item{background:var(--dk2);border:1px solid var(--br);
  border-radius:10px;padding:.95rem;display:flex;gap:.85rem;align-items:flex-start}
.adm-cov{width:54px;height:72px;object-fit:cover;border-radius:5px;flex-shrink:0}
.adm-fb{width:54px;height:72px;background:var(--dk4);border-radius:5px;
  flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.4rem}
.adm-info{flex:1;min-width:0}
.adm-t{font-family:'Playfair Display',serif;font-size:.87rem;color:var(--cr);margin-bottom:.18rem}
.adm-m{font-size:.73rem;color:var(--mu);margin-bottom:.35rem}
.sec-badge{display:inline-block;font-size:.6rem;letter-spacing:.9px;text-transform:uppercase;
  padding:.14rem .42rem;border-radius:4px;font-weight:700;margin-bottom:.45rem}
.sb-br{background:var(--bl-dim);color:#5DADE2;border:1px solid rgba(41,128,185,.22)}
.sb-gn{background:var(--gold-dim);color:var(--gold);border:1px solid var(--br-h)}
.btn-del{background:var(--rd-dim);border:1px solid rgba(192,57,43,.3);
  color:#E87070;padding:.28rem .65rem;border-radius:5px;cursor:pointer;
  font-size:.72rem;font-family:'Inter',sans-serif;transition:all .18s;font-weight:500}
.btn-del:hover{background:rgba(192,57,43,.28)}
.rtable{width:100%;border-collapse:collapse}
.rtable th{text-align:left;font-size:.68rem;letter-spacing:.9px;text-transform:uppercase;
  color:var(--mu);padding:.65rem 1rem;border-bottom:1px solid var(--br);font-weight:600}
.rtable td{padding:.7rem 1rem;border-bottom:1px solid rgba(201,168,76,.055);
  font-size:.81rem;vertical-align:middle}
.rtable tr:last-child td{border-bottom:none}
.rtable tr:hover td{background:rgba(201,168,76,.025)}

/* ── ABOUT ──────────────────────────────────── */
.about-pg{min-height:100vh;padding-top:66px}
.about-body{max-width:900px;margin:0 auto;padding:3.8rem 2rem}
.about-h{font-family:'Playfair Display',serif;font-size:2.7rem;font-weight:700;
  color:var(--cr);line-height:1.22;margin-bottom:1.4rem}
.about-h span{color:var(--gold)}
.about-p{font-size:.98rem;line-height:1.95;color:rgba(245,237,214,.62);margin-bottom:1.3rem}
.about-feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));
  gap:1.2rem;margin-top:2.6rem}
.af{background:var(--dk2);border:1px solid var(--br);border-radius:12px;padding:1.4rem}
.af-ico{font-size:1.8rem;margin-bottom:.65rem}
.af h3{font-family:'Playfair Display',serif;color:var(--gold);
  margin-bottom:.42rem;font-size:.98rem}
.af p{font-size:.82rem;color:var(--mu);line-height:1.62}

/* ── WISHLIST PAGE ──────────────────────────── */
.wl-empty{text-align:center;padding:3.2rem 2rem;color:var(--mu)}
.wl-empty-ico{font-size:2.6rem;margin-bottom:.9rem}

/* ── MISC ───────────────────────────────────── */
.loading{display:flex;justify-content:center;align-items:center;
  padding:5rem;flex-direction:column;gap:1rem;color:var(--mu)}
.spin{width:36px;height:36px;border:3px solid rgba(201,168,76,.14);
  border-top:3px solid var(--gold);border-radius:50%;animation:sp .72s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:3.2rem 2rem;color:var(--mu)}
.empty-ico{font-size:2.6rem;margin-bottom:.9rem}
.fade{animation:fd .3s ease}
@keyframes fd{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.toast{position:fixed;bottom:1.8rem;right:1.8rem;z-index:9999;
  background:var(--dk2);border:1px solid var(--br);border-radius:10px;
  padding:.95rem 1.3rem;font-size:.85rem;box-shadow:var(--sh);
  animation:tst .28s ease;max-width:310px;line-height:1.45}
.toast.ok {border-color:rgba(39,174,96,.38); color:var(--gn)}
.toast.err{border-color:rgba(192,57,43,.38); color:#E87070}
.toast.inf{border-color:var(--br-h); color:var(--cr)}
@keyframes tst{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

@media(max-width:768px){
  .nav{padding:0 1.1rem}
  .nav-mid{display:none}
  .bg{grid-template-columns:repeat(auto-fill,minmax(158px,1fr))}
  .h-stats{gap:1.4rem}
  .form-row{grid-template-columns:1fr}
  .prof-top{flex-direction:column;align-items:center;text-align:center}
  .rc-actions{flex-direction:row;align-items:center}
}
`;

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════
const fmt    = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const dleft  = d => Math.ceil((new Date(d) - new Date()) / 86400000);

const Stars = ({ r = 0 }) => {
  const f = Math.floor(r), h = r % 1 >= 0.5;
  return <span className="stars">{'★'.repeat(f)}{h ? '✦' : ''}{'☆'.repeat(5 - f - (h ? 1 : 0))}</span>;
};

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast ${type}`}>{msg}</div>;
};

// Rent dates block shown on rented book cards
const RentDatesBlock = ({ rentedAt, dueDate, status }) => {
  if (!dueDate || !rentedAt) return null;
  const d = dleft(dueDate);
  const isOver = status === 'overdue' || d < 0;
  const isDueToday = !isOver && d === 0;
  const isDueSoon  = !isOver && d <= 2;

  return (
    <div style={{
      borderRadius: '7px', padding: '7px 9px', marginBottom: '8px', fontSize: '.72rem',
      background: isOver ? 'rgba(192,57,43,.13)' : isDueSoon ? 'rgba(230,126,34,.11)' : 'rgba(39,174,96,.1)',
      border: `1px solid ${isOver ? 'rgba(192,57,43,.3)' : isDueSoon ? 'rgba(230,126,34,.28)' : 'rgba(39,174,96,.22)'}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
        <div>
          <div style={{ color: 'var(--mu)', fontSize: '.62rem', letterSpacing: '.8px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>Rent Start</div>
          <div style={{ color: 'var(--cr)', fontWeight: 600 }}>{fmt(rentedAt)}</div>
        </div>
        <div style={{ color: 'var(--mu)', alignSelf: 'center', fontSize: '.9rem' }}>→</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--mu)', fontSize: '.62rem', letterSpacing: '.8px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>Rent End</div>
          <div style={{ color: isOver ? '#E87070' : isDueSoon ? '#E67E22' : 'var(--gn)', fontWeight: 600 }}>{fmt(dueDate)}</div>
        </div>
      </div>
      <div style={{
        textAlign: 'center', fontWeight: 700, fontSize: '.7rem', letterSpacing: '.3px',
        color: isOver ? '#E87070' : isDueSoon ? '#E67E22' : 'var(--gn)',
        paddingTop: '3px', borderTop: '1px solid rgba(255,255,255,.07)'
      }}>
        {isOver
          ? `⚠ Overdue ${Math.abs(d)} day${Math.abs(d) !== 1 ? 's' : ''} · ₹${Math.abs(d) * 5} penalty`
          : isDueToday ? '⏰ Due today — return now!'
          : isDueSoon  ? `⏳ ${d} day${d !== 1 ? 's' : ''} remaining`
          : `✓ ${d} days remaining`}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BOOK CARD
// ═══════════════════════════════════════════════════════════════════════
const BookCard = ({ book, rental, isWishlisted, onRent, onReturn, onRead, onWishlist }) => {
  const isActive  = rental?.status === 'active';
  const isOverdue = rental?.status === 'overdue';
  const isRented  = isActive || isOverdue;

  const rentLabel = isOverdue ? '⚠ Overdue' : isActive ? '✓ Rented' : '📖 Rent Book';
  const rentClass = isOverdue ? 'btn-rent overdue' : isActive ? 'btn-rent active' : 'btn-rent';

  return (
    <div className="bc fade">
      {/* badges */}
      {isOverdue && <span className="badge badge-overdue">Overdue</span>}
      {isActive  && !isOverdue && <span className="badge badge-rented">Rented</span>}
      {book.language && book.language !== 'English' && <span className="badge-lang">{book.language}</span>}

      {/* cover */}
      {book.coverImage
        ? <img src={book.coverImage} alt={book.title} className="bc-img"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        : null}
      <div className="bc-fb" style={{ display: book.coverImage ? 'none' : 'flex' }}>📖</div>

      <div className="bc-body">
        {book.language && <span className="bc-lang">{book.language}</span>}
        <div className="bc-genre">{book.genre}</div>
        <div className="bc-title">{book.title}</div>
        <div className="bc-author">{book.author}</div>
        <div className="bc-stars"><Stars r={book.rating} /><span className="rnum">{book.rating?.toFixed(1)}</span></div>

        {/* Rent start → end dates — only when rented */}
        {isRented && <RentDatesBlock rentedAt={rental?.rentedAt} dueDate={rental?.dueDate} status={rental?.status} />}

        <div className="bc-acts">
          {isRented
            ? <button className={rentClass} onClick={() => onReturn(rental._id)}>{rentLabel} · Return</button>
            : <button className={rentClass} onClick={() => onRent(book._id)}>{rentLabel}</button>
          }
          <button className="btn-read" onClick={() => onRead(book)} title="Open Book">📖</button>
          <button className={`btn-wl ${isWishlisted ? 'on' : ''}`}
            onClick={() => onWishlist(book)} title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
            {isWishlisted ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════════════════════════════════
const Navbar = ({ cur }) => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();

  // Protected nav click — redirect to auth if not logged in
  const goTo = (p) => {
    if (!user && p !== 'home') {
      navigate('auth', { tab: 'login' });
    } else {
      navigate(p);
    }
  };

  return (
    <nav className="nav">
      <div className="logo" onClick={() => navigate('home')}>Read<span>iction</span></div>
      <div className="nav-mid">
        {/* Home — always accessible */}
        <button className={`nb ${cur === 'home' ? 'a' : ''}`} onClick={() => navigate('home')}>Home</button>
        {/* Protected nav links — show lock hint if not logged in */}
        {['books','genres','about'].map(p => (
          <button key={p} className={`nb ${cur === p ? 'a' : ''}`}
            onClick={() => goTo(p)}
            title={!user ? 'Sign in to access' : ''}
            style={!user ? {opacity: 0.55} : {}}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
            {!user && <span style={{fontSize:'.6rem',marginLeft:'3px',color:'var(--mu)'}}>🔒</span>}
          </button>
        ))}
        {user && (
          <button className={`nb ${['profile','admin','wishlist'].includes(cur) ? 'a' : ''}`}
            onClick={() => navigate(user.role === 'admin' ? 'admin' : 'profile')}>
            {user.role === 'admin' ? '⚙ Admin' : 'Profile'}
          </button>
        )}
        {user && user.role !== 'admin' && (
          <button className={`nb ${cur === 'wishlist' ? 'a' : ''}`} onClick={() => navigate('wishlist')}>
            ♡ Wishlist
          </button>
        )}
      </div>
      <div className="nav-r">
        {user
          ? <><span style={{fontSize:'.8rem',color:'var(--mu)'}}>{user.role==='admin'?'👑':'🎓'} {user.name?.split(' ')[0]}</span>
              <button className="btn-o" onClick={logout}>Logout</button></>
          : <><button className="btn-o" onClick={() => navigate('auth',{tab:'login'})}>Login</button>
              <button className="btn-g" onClick={() => navigate('auth',{tab:'register'})}>Sign Up</button></>
        }
      </div>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════════════
const HomePage = ({ books, rentals, wishlist, onRent, onReturn, onRead, onWishlist }) => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const gList = [
    {n:'Classic',i:'📚'},{n:'Crime',i:'🔍'},{n:'Thriller',i:'⚡'},
    {n:'Mystery',i:'🕵️'},{n:'Fiction',i:'🚀'},{n:'Romance',i:'💕'},
  ];
  const getRental = id => rentals.find(r => (r.book?._id||r.book) === id && r.status !== 'returned');

  return (
    <div className="fade">
      <section className="hero">
        <div className="h-bg"/><div className="h-grid"/><div className="h-glow"/>
        <div className="h-content">
          <div className="h-pill">✦ Your Digital Library ✦</div>
          <h1 className="h-title">Welcome to<br/><span className="gd">Readiction</span></h1>
          <p className="h-sub">Discover multilingual books, rent for 7 days, and read in the browser.
            Late returns incur a ₹5/day penalty — tracked live on your profile.</p>
          <div className="h-btns">
            <button className="hbtn hbtn-p" onClick={() => user ? navigate('books') : navigate('auth',{tab:'register'})}>Explore Book Collection</button>
            <button className="hbtn hbtn-s" onClick={() => user ? navigate('genres') : navigate('auth',{tab:'register'})}>Explore Genres</button>
          </div>
          <div className="h-stats">
            <div><div className="st-n">42</div><div className="st-l">Books</div></div>
            <div><div className="st-n">8+</div><div className="st-l">Languages</div></div>
            <div><div className="st-n">7</div><div className="st-l">Day Rental</div></div>
            <div><div className="st-n">₹5</div><div className="st-l">/ Overdue Day</div></div>
          </div>
        </div>
      </section>
      <div style={{background:'var(--dk)'}}>
        <div className="sec">
          <div className="sec-hd">
            <h2 className="sec-t">Featured <span>Books</span></h2>
            <p className="sec-s">Multilingual collection · Rent → Read → Return</p>
          </div>
          <div className="bg">
            {books.slice(0,6).map(b => (
              <BookCard key={b._id} book={b} rental={getRental(b._id)}
                isWishlisted={wishlist.some(w=>(w._id||w)===b._id)}
                onRent={onRent} onReturn={onReturn} onRead={onRead} onWishlist={onWishlist} />
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'2rem'}}>
            <button className="btn-g" style={{padding:'.72rem 1.9rem',fontSize:'.9rem'}}
              onClick={() => user ? navigate('books') : navigate('auth',{tab:'register'})}>View All Books →</button>
          </div>
        </div>
        <div className="sec" style={{paddingTop:0}}>
          <div className="sec-hd">
            <h2 className="sec-t">Explore <span>Genres</span></h2>
            <p className="sec-s">Each genre features its own unique multilingual catalog</p>
          </div>
          <div className="gen-grid">
            {gList.map(g => (
              <div key={g.n} className="gen-card" onClick={() => user ? navigate('genre',{genre:g.n}) : navigate('auth',{tab:'register'})}>
                <span className="gen-icon">{g.i}</span>
                <div className="gen-name">{g.n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BOOKS PAGE
// ═══════════════════════════════════════════════════════════════════════
const BooksPage = ({ books, rentals, wishlist, onRent, onReturn, onRead, onWishlist }) => {
  const [q,  setQ]  = useState('');
  const [la, setLa] = useState('All');
  const langs  = ['All', ...new Set(books.map(b => b.language).filter(Boolean))];
  const getRental = id => rentals.find(r => (r.book?._id||r.book) === id && r.status !== 'returned');

  const filtered = books.filter(b => {
    const ml = la === 'All' || b.language === la;
    const ms = b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase());
    return ml && ms;
  });

  return (
    <div className="pw fade">
      <div className="pg-band">
        <div className="pg-band-in">
          <h1 className="pg-t">Book <span>Collection</span></h1>
          <div className="srch"><span className="srch-ico">🔍</span>
            <input className="srch-i" placeholder="Search title or author…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          {langs.length > 2 && (
            <div className="chips" style={{marginBottom:0}}>
              {langs.map(l => <button key={l} className={`chip ${la===l?'on':''}`} onClick={()=>setLa(l)}>{l}</button>)}
            </div>
          )}
        </div>
      </div>
      <div className="sec" style={{paddingTop:'2.2rem'}}>
        <p style={{color:'var(--mu)',fontSize:'.8rem',marginBottom:'1.4rem'}}>
          {filtered.length} book{filtered.length!==1?'s':''} · 7-day rental · ₹5/day overdue penalty
        </p>
        {filtered.length === 0
          ? <div className="empty"><div className="empty-ico">📭</div><p>No books match your search.</p></div>
          : <div className="bg">{filtered.map(b => (
              <BookCard key={b._id} book={b} rental={getRental(b._id)}
                isWishlisted={wishlist.some(w=>(w._id||w)===b._id)}
                onRent={onRent} onReturn={onReturn} onRead={onRead} onWishlist={onWishlist} />
            ))}</div>
        }
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// GENRES PAGE
// ═══════════════════════════════════════════════════════════════════════
const GenresPage = ({ genreBooks }) => {
  const { navigate } = useRouter();
  const genres = [
    {n:'Classic',i:'📚',d:'Timeless world literature'},
    {n:'Crime',  i:'🔍',d:'International crime fiction'},
    {n:'Thriller',i:'⚡',d:'Edge-of-your-seat suspense'},
    {n:'Mystery', i:'🕵️',d:'Enigmas across cultures'},
    {n:'Fiction', i:'🚀',d:'Speculative & literary fiction'},
    {n:'Romance', i:'💕',d:'Love stories from around the world'},
  ];
  return (
    <div className="pw fade">
      <div className="gd-hero">
        <div style={{fontSize:'2.4rem',marginBottom:'.7rem'}}>🌍</div>
        <h1>Explore <span>Genres</span></h1>
        <p>Multilingual collections — unique books across 8+ languages</p>
      </div>
      <div className="sec">
        <div className="gen-grid">
          {genres.map(g => (
            <div key={g.n} className="gen-card" onClick={() => navigate('genre',{genre:g.n})}>
              <span className="gen-icon">{g.i}</span>
              <div className="gen-name">{g.n}</div>
              <div className="gen-cnt">{genreBooks.filter(b=>b.genre===g.n).length} books · {g.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// GENRE DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════
const GenreDetailPage = ({ genre, genreBooks, rentals, wishlist, onRent, onReturn, onRead, onWishlist }) => {
  const { navigate } = useRouter();
  const [la, setLa] = useState('All');
  const icons = {Classic:'📚',Crime:'🔍',Thriller:'⚡',Mystery:'🕵️',Fiction:'🚀',Romance:'💕'};
  const getRental = id => rentals.find(r => (r.book?._id||r.book) === id && r.status !== 'returned');

  const gb = genreBooks.filter(b => b.genre === genre);
  const langs = ['All', ...new Set(gb.map(b => b.language).filter(Boolean))];
  const filtered = la === 'All' ? gb : gb.filter(b => b.language === la);

  return (
    <div className="pw fade">
      <div className="gd-hero">
        <div style={{fontSize:'2.4rem',marginBottom:'.7rem'}}>{icons[genre]}</div>
        <h1>{genre} <span>Books</span></h1>
        <p>{gb.length} books across multiple languages</p>
        <button className="btn-o" style={{marginTop:'1rem'}} onClick={() => navigate('genres')}>← All Genres</button>
      </div>
      <div className="sec">
        {langs.length > 2 && (
          <div className="chips">
            {langs.map(l => <button key={l} className={`chip ${la===l?'on':''}`} onClick={()=>setLa(l)}>{l}</button>)}
          </div>
        )}
        {filtered.length === 0
          ? <div className="empty"><div className="empty-ico">📭</div><p>No books found.</p></div>
          : <div className="bg">{filtered.map(b => (
              <BookCard key={b._id} book={b} rental={getRental(b._id)}
                isWishlisted={wishlist.some(w=>(w._id||w)===b._id)}
                onRent={onRent} onReturn={onReturn} onRead={onRead} onWishlist={onWishlist} />
            ))}</div>
        }
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BOOK READER
// ═══════════════════════════════════════════════════════════════════════
const BookReader = ({ book, onBack }) => {
  const [pg, setPg] = useState(0);
  const pages = book?.pages || [];
  return (
    <div className="rdr-pg fade">
      <div className="rdr-hd">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div>
          <h2>{book?.title}</h2>
          <p>{book?.author} · {book?.genre}{book?.language ? ` · ${book.language}` : ''}</p>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'.45rem'}}>
          <Stars r={book?.rating}/><span style={{color:'var(--mu)',fontSize:'.8rem'}}>{book?.rating}</span>
        </div>
      </div>
      <div className="rdr-body">
        <div className="rdr-paper">
          <div className="rdr-lbl">— Page {pg+1} of {pages.length} —</div>
          <div className="rdr-txt">{pages[pg]?.content || '…'}</div>
        </div>
        <div className="rdr-nav">
          <button className="rdr-btn" onClick={()=>setPg(p=>p-1)} disabled={pg===0}>← Previous</button>
          <span className="pg-ind">{pg+1} / {pages.length}</span>
          <button className="rdr-btn" onClick={()=>setPg(p=>p+1)} disabled={pg>=pages.length-1}>Next →</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AUTH PAGE — confirm password, no studentId/department
// ═══════════════════════════════════════════════════════════════════════
const AuthPage = ({ initialTab }) => {
  const { login, register } = useAuth();
  const { navigate } = useRouter();
  const [tab,  setTab]  = useState(initialTab || 'login');
  const [role, setRole] = useState('student');
  const [f, setF] = useState({ name:'', email:'', password:'', confirm:'', phone:'' });
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);

  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));
  const pwMatch = f.confirm && f.password === f.confirm;
  const pwNoMatch = f.confirm && f.password !== f.confirm;

  const submit = async () => {
    setErr('');
    if (!f.email || !f.password) return setErr('Email and password are required.');
    if (tab === 'register') {
      if (!f.name) return setErr('Full name is required.');
      if (f.password.length < 6) return setErr('Password must be at least 6 characters.');
      if (!f.confirm) return setErr('Please confirm your password.');
      if (f.password !== f.confirm) return setErr('Passwords do not match.');
    }
    setBusy(true);
    try {
      const u = tab === 'login'
        ? await login(f.email, f.password)
        : await register({ name: f.name, email: f.email, password: f.password, phone: f.phone, role });
      navigate(u.role === 'admin' ? 'admin' : 'home');
    } catch (e) {
      setErr(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  };

  const switchTab = t => { setTab(t); setErr(''); setF({ name:'', email:'', password:'', confirm:'', phone:'' }); };

  return (
    <div className="auth-pg">
      <div className="auth-glow"/>
      <div className="auth-card fade">
        <div className="auth-logo"><h1>Readiction</h1><p>Your Digital Library</p></div>

        <div className="a-tabs">
          <button className={`a-tab ${tab==='login'?'on':''}`}    onClick={()=>switchTab('login')}>Sign In</button>
          <button className={`a-tab ${tab==='register'?'on':''}`} onClick={()=>switchTab('register')}>Create Account</button>
        </div>

        {tab === 'register' && (
          <>
            <p style={{fontSize:'.7rem',color:'var(--mu)',textTransform:'uppercase',
              letterSpacing:'.45px',marginBottom:'.45rem',fontWeight:600}}>Account Type</p>
            <div className="role-row">
              <button className={`rtab ${role==='student'?'on':''}`} onClick={()=>setRole('student')}>🎓 Student</button>
              <button className={`rtab ${role==='admin'?'on':''}`}   onClick={()=>setRole('admin')}>👑 Admin</button>
            </div>
          </>
        )}

        {err && <div className="err-msg">⚠ {err}</div>}

        {tab === 'register' && (
          <div className="fg">
            <label className="fl">Full Name *</label>
            <input className="fi" placeholder="Your full name"
              value={f.name} onChange={e=>upd('name',e.target.value)} />
          </div>
        )}

        <div className="fg">
          <label className="fl">Email Address *</label>
          <input className="fi" type="email" placeholder="you@example.com"
            value={f.email} onChange={e=>upd('email',e.target.value)} />
        </div>

        <div className="fg">
          <label className="fl">Password *</label>
          <div className="pw-wrap">
            <input className="fi" type={showPw?'text':'password'}
              placeholder={tab==='register'?'Min 6 characters':'••••••••'}
              value={f.password} onChange={e=>upd('password',e.target.value)} />
            <button className="pw-eye" onClick={()=>setShowPw(p=>!p)}>{showPw?'🙈':'👁'}</button>
          </div>
        </div>

        {tab === 'register' && (
          <>
            <div className="fg">
              <label className="fl">Confirm Password *</label>
              <div className="pw-wrap">
                <input className={`fi ${pwNoMatch?'err-field':''}`}
                  type={showCpw?'text':'password'} placeholder="Re-enter password"
                  value={f.confirm} onChange={e=>upd('confirm',e.target.value)} />
                <button className="pw-eye" onClick={()=>setShowCpw(p=>!p)}>{showCpw?'🙈':'👁'}</button>
              </div>
              {pwMatch   && <p className="pw-match ok">✓ Passwords match</p>}
              {pwNoMatch && <p className="pw-match no">✗ Passwords do not match</p>}
            </div>
            <div className="fg">
              <label className="fl">Phone Number</label>
              <input className="fi" placeholder="e.g. 9876543210"
                value={f.phone} onChange={e=>upd('phone',e.target.value)} />
            </div>
          </>
        )}

        <button className="btn-sub" onClick={submit}
          disabled={busy || (tab==='register' && (pwNoMatch || !f.confirm))}>
          {busy ? '…' : tab==='login' ? 'Sign In' : 'Create Account'}
        </button>

        <p style={{textAlign:'center',marginTop:'1.3rem',fontSize:'.8rem',color:'var(--mu)'}}>
          {tab==='login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={()=>switchTab(tab==='login'?'register':'login')}
            style={{background:'none',border:'none',color:'var(--gold)',cursor:'pointer',
              fontSize:'.8rem',fontFamily:'Inter,sans-serif',fontWeight:600}}>
            {tab==='login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════
const ProfilePage = ({ rentals, onReturn, onPay, onRead, books, genreBooks }) => {
  const { user, logout } = useAuth();
  const { navigate } = useRouter();

  if (!user) return (
    <div className="pw" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',padding:'4rem'}}>
        <div style={{fontSize:'2.4rem',marginBottom:'1rem'}}>🔒</div>
        <p style={{color:'var(--mu)',marginBottom:'1.4rem'}}>Please sign in to view your profile.</p>
        <button className="btn-g" onClick={()=>navigate('auth')}>Sign In</button>
      </div>
    </div>
  );

  const active   = rentals.filter(r => r.status === 'active');
  const overdue  = rentals.filter(r => r.status === 'overdue');
  const returned = rentals.filter(r => r.status === 'returned');
  const unpaid   = rentals.reduce((s,r) => s + (!r.penaltyPaid ? (r.currentPenalty||r.penaltyAmount||0) : 0), 0);
  const allBooks = [...books, ...genreBooks];
  const getBook  = r => (typeof r.book === 'object' ? r.book : allBooks.find(b=>b._id===r.book));

  const RCard = ({ r }) => {
    const bk = getBook(r);
    const dl  = dleft(r.dueDate);
    const pen = r.currentPenalty || r.penaltyAmount || 0;
    return (
      <div className="rc fade">
        {bk?.coverImage
          ? <img src={bk.coverImage} alt={bk.title} className="rc-cov"/>
          : <div className="rc-fb">📖</div>}
        <div className="rc-info">
          <div className="rc-title">{bk?.title||'Unknown'}</div>
          <div className="rc-meta">{bk?.author} · {bk?.genre}{bk?.language?` · ${bk.language}`:''}</div>
          {/* Rent start → end date block */}
          <div style={{
            display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap',
            background:'var(--dk4)', border:'1px solid var(--br)', borderRadius:'8px',
            padding:'8px 12px', marginBottom:'8px'
          }}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'.6rem',color:'var(--mu)',textTransform:'uppercase',letterSpacing:'.8px',fontWeight:600,marginBottom:'2px'}}>Rent Start</div>
              <div style={{fontSize:'.82rem',color:'var(--cr)',fontWeight:600}}>{fmt(r.rentedAt)}</div>
            </div>
            <div style={{color:'var(--mu)',fontSize:'1.1rem',padding:'0 4px'}}>→</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:'.6rem',color:'var(--mu)',textTransform:'uppercase',letterSpacing:'.8px',fontWeight:600,marginBottom:'2px'}}>Rent End</div>
              <div style={{fontSize:'.82rem',fontWeight:600,
                color: r.status==='overdue' ? '#E87070' : r.status==='returned' ? 'var(--gold)' : dl<=2 ? '#E67E22' : 'var(--gn)'
              }}>{fmt(r.dueDate)}</div>
            </div>
            {r.returnedAt && <>
              <div style={{color:'var(--mu)',fontSize:'1.1rem',padding:'0 4px'}}>→</div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'.6rem',color:'var(--mu)',textTransform:'uppercase',letterSpacing:'.8px',fontWeight:600,marginBottom:'2px'}}>Returned On</div>
                <div style={{fontSize:'.82rem',color:'var(--gn)',fontWeight:600}}>{fmt(r.returnedAt)}</div>
              </div>
            </>}
            {!r.returnedAt && (
              <div style={{marginLeft:'auto',textAlign:'center'}}>
                <div style={{fontSize:'.6rem',color:'var(--mu)',textTransform:'uppercase',letterSpacing:'.8px',fontWeight:600,marginBottom:'2px'}}>
                  {r.status==='overdue'?'Overdue':'Days Left'}
                </div>
                <div style={{fontSize:'.85rem',fontWeight:700,
                  color: r.status==='overdue' ? '#E87070' : dl<=1 ? '#E67E22' : 'var(--gn)'
                }}>
                  {r.status==='overdue' ? `${Math.abs(dl)}d late` : dl===0 ? 'Today!' : `${dl}d`}
                </div>
              </div>
            )}
          </div>
          {pen > 0 && (
            <div className="penalty-row">
              <div><div className="pen-lbl">{r.returnedAt?'Penalty Charged':'Live Penalty'}</div>
                <div className="pen-amt">₹{pen}</div></div>
              {r.penaltyPaid
                ? <span className="paid-tag">✓ Paid</span>
                : <button className="btn-pay" onClick={()=>onPay(r._id)}>Pay ₹{pen}</button>}
            </div>
          )}
        </div>
        <div className="rc-actions">
          <span className={`rs ${r.status==='active'?'rs-act':r.status==='overdue'?'rs-ov':'rs-ret'}`}>
            {r.status==='active'?'● Active':r.status==='overdue'?'⚠ Overdue':'✓ Returned'}
          </span>
          {r.status !== 'returned' && bk && (
            <button className="btn-read" style={{fontSize:'.74rem'}} onClick={()=>onRead(bk)}>📖 Read</button>
          )}
          {r.status !== 'returned' && (
            <button className="btn-ret" onClick={()=>onReturn(r._id)}>Return</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="prof-pg fade">
      <div className="prof-body">
        {/* ── PROFILE CARD ── */}
        <div className="card">
          <div className="prof-top">
            <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <div className="prof-info">
              <div className="prof-name">{user.name}</div>
              <div className="prof-email">{user.email}</div>
              <span className={`role-badge ${user.role==='admin'?'rb-admin':'rb-student'}`}>
                {user.role==='admin'?'👑 Administrator':'🎓 Student'}
              </span>
            </div>
            <div style={{marginLeft:'auto'}}>
              <button className="btn-o" onClick={()=>{logout();navigate('home');}}>Logout</button>
            </div>
          </div>

          {/* Stats */}
          <div className="pstats">
            {[
              {n:rentals.length,   l:'Total Rentals'},
              {n:active.length,    l:'Currently Active'},
              {n:overdue.length,   l:'Overdue', red:overdue.length>0},
              {n:returned.length,  l:'Returned'},
              {n:`₹${unpaid}`,     l:'Unpaid Dues', red:unpaid>0},
            ].map(s=>(
              <div key={s.l} className="pstat">
                <div className="pstat-n" style={{color:s.red?'#E87070':'var(--gold)'}}>{s.n}</div>
                <div className="pstat-l">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="divider"/>
          <div className="pdetails">
            {[
              {l:'Account Type', v:user.role==='admin'?'👑 Administrator':'🎓 Student'},
              {l:'Full Name',    v:user.name},
              {l:'Email',        v:user.email},
              {l:'Phone',        v:user.phone||'—'},
              {l:'Member Since', v:user.createdAt?fmt(user.createdAt):'—'},
              {l:'Rental Period',v:'7 days per book'},
              {l:'Penalty Rate', v:'₹5 per overdue day'},
              {l:'Total Penalty',v:`₹${rentals.reduce((s,r)=>s+(r.penaltyAmount||r.currentPenalty||0),0)}`,
               red:rentals.some(r=>r.penaltyAmount||r.currentPenalty)},
            ].map(d=>(
              <div key={d.l} className="pd">
                <div className="pd-l">{d.l}</div>
                <div className="pd-v" style={{color:d.red?'#E87070':'var(--cr)'}}>{d.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RENTAL HISTORY ── */}
        <div className="card">
          <h2 className="sec-head">Rental <span>History</span>
            <span style={{fontSize:'.78rem',fontFamily:'Inter,sans-serif',color:'var(--mu)',marginLeft:'.6rem'}}>
              ({rentals.length})
            </span>
          </h2>
          {overdue.length > 0 && (
            <div className="overdue-alert">
              <h4>⚠ {overdue.length} Overdue Rental{overdue.length>1?'s':''}</h4>
              <p>You have ₹{unpaid} in unpaid penalties. New rentals are blocked when dues exceed ₹50.</p>
            </div>
          )}
          {rentals.length === 0
            ? <div className="wl-empty"><div className="wl-empty-ico">📚</div>
                <p>No rentals yet. Start exploring books!</p>
                <button className="btn-g" style={{marginTop:'1.1rem'}} onClick={()=>navigate('books')}>Browse Books</button>
              </div>
            : <>{overdue.map(r=><RCard key={r._id} r={r}/>)}
                {active.map(r=><RCard key={r._id} r={r}/>)}
                {returned.map(r=><RCard key={r._id} r={r}/>)}</>
          }
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// WISHLIST PAGE
// ═══════════════════════════════════════════════════════════════════════
const WishlistPage = ({ wishlist, rentals, onRent, onReturn, onRead, onWishlist }) => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const getRental = id => rentals.find(r => (r.book?._id||r.book) === id && r.status !== 'returned');
  if (!user) return (
    <div className="pw" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',padding:'4rem'}}>
        <p style={{color:'var(--mu)',marginBottom:'1.4rem'}}>Sign in to see your wishlist.</p>
        <button className="btn-g" onClick={()=>navigate('auth')}>Sign In</button>
      </div>
    </div>
  );
  return (
    <div className="pw fade">
      <div className="pg-band">
        <div className="pg-band-in">
          <h1 className="pg-t">My <span>Wishlist</span></h1>
        </div>
      </div>
      <div className="sec" style={{paddingTop:'2.2rem'}}>
        {wishlist.length === 0
          ? <div className="wl-empty">
              <div className="wl-empty-ico">♡</div>
              <p>Your wishlist is empty. Add books using the ♡ button.</p>
              <button className="btn-g" style={{marginTop:'1.1rem'}} onClick={()=>navigate('books')}>Browse Books</button>
            </div>
          : <div className="bg">{wishlist.map(b => (
              <BookCard key={b._id} book={b} rental={getRental(b._id)}
                isWishlisted={true}
                onRent={onRent} onReturn={onReturn} onRead={onRead} onWishlist={onWishlist} />
            ))}</div>
        }
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════
const AdminPage = ({ books, genreBooks, allRentals, onAddBook, onDeleteBook, onReseed }) => {
  const { user, logout } = useAuth();
  const { navigate }     = useRouter();
  const [tab, setTab]    = useState('overview');
  const [f, setF]        = useState({ title:'', author:'', genre:'Classic', rating:4.0, description:'', coverImage:'', section:'browse', language:'English' });
  const [suc, setSuc]    = useState('');
  const [err, setErr]    = useState('');
  const upd = (k,v) => setF(p=>({...p,[k]:v}));

  if (!user || user.role !== 'admin') return (
    <div className="pw" style={{textAlign:'center',paddingTop:'6rem',color:'var(--mu)'}}>Access Denied.</div>
  );

  const overdueCount = allRentals.filter(r=>r.status==='overdue').length;
  const totalPenalty = allRentals.reduce((s,r)=>s+(r.currentPenalty||r.penaltyAmount||0),0);

  const handleAdd = async () => {
    if (!f.title||!f.author) return setErr('Title and author are required');
    setErr('');
    try { await onAddBook(f); setSuc('Book added!'); setF({title:'',author:'',genre:'Classic',rating:4.0,description:'',coverImage:'',section:'browse',language:'English'}); setTimeout(()=>setSuc(''),3000); }
    catch(e){ setErr(e.response?.data?.message||'Failed to add book'); }
  };

  const handleDel = async id => {
    if (!window.confirm('Delete this book?')) return;
    try { await onDeleteBook(id); setSuc('Deleted.'); setTimeout(()=>setSuc(''),2000); }
    catch { setErr('Delete failed'); }
  };

  const LANGS = ['English','French','Spanish','German','Japanese','Russian','Portuguese','Italian','Hindi','Arabic'];

  return (
    <div className="pw fade">
      <div className="adm-hd">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem'}}>
          <div><h1>Admin Dashboard</h1><p>{user.name} · {user.email}</p></div>
          <button className="btn-o" onClick={()=>{logout();navigate('home');}}>Logout</button>
        </div>
      </div>
      <div className="adm-stat-bar">
        {[
          {l:'Total Books', v:books.length+genreBooks.length},
          {l:'Browse Catalog', v:books.length},
          {l:'Genre Catalog',  v:genreBooks.length},
          {l:'All Rentals',    v:allRentals.length},
          {l:'Overdue',        v:overdueCount, red:overdueCount>0},
          {l:'Penalties Due',  v:`₹${totalPenalty}`, red:totalPenalty>0},
        ].map(s=>(
          <div key={s.l} className="adm-stat">
            <div className="adm-stat-n" style={{color:s.red?'#E87070':'var(--gold)'}}>{s.v}</div>
            <div className="adm-stat-l">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="adm-tabs">
        {[['overview','📊 Overview'],['add','➕ Add Book'],['manage','📚 Manage'],['rentals','📋 Rentals']].map(([t,l])=>(
          <button key={t} className={`adt ${tab===t?'on':''}`} onClick={()=>{setTab(t);setErr('');setSuc('');}}>{l}</button>
        ))}
      </div>
      <div className="adm-body">
        {suc && <div className="suc-msg">{suc}</div>}
        {err && <div className="err-msg">{err}</div>}

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            {/* Reseed banner if books missing */}
            {(books.length === 0 || genreBooks.length === 0) && (
              <div style={{background:'var(--rd-dim)',border:'1px solid rgba(192,57,43,.35)',borderRadius:'10px',
                padding:'1rem 1.4rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',
                justifyContent:'space-between',flexWrap:'wrap',gap:'1rem'}}>
                <div>
                  <div style={{color:'#E87070',fontWeight:700,marginBottom:'.25rem'}}>⚠ Books Not Loaded</div>
                  <div style={{color:'rgba(232,112,112,.75)',fontSize:'.82rem'}}>
                    Browse: {books.length} books · Genre: {genreBooks.length} books. Click Reseed to load all 48 books.
                  </div>
                </div>
                <button className="btn-g" onClick={onReseed} style={{background:'#E87070',color:'#fff',whiteSpace:'nowrap'}}>
                  🔄 Reseed Books Now
                </button>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.3rem',flexWrap:'wrap',gap:'1rem'}}>
              <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--cr)',fontSize:'1.1rem'}}>Admin Profile</h3>
              <button className="btn-o" onClick={onReseed} title="Force reload all book data">
                🔄 Reseed Library
              </button>
            </div>
            <div className="pdetails" style={{marginBottom:'2rem'}}>
              {[{l:'Name',v:user.name},{l:'Email',v:user.email},{l:'Role',v:'👑 Administrator'},{l:'Phone',v:user.phone||'—'}].map(d=>(
                <div key={d.l} className="pd"><div className="pd-l">{d.l}</div><div className="pd-v">{d.v}</div></div>
              ))}
            </div>
            <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--cr)',marginBottom:'1rem',fontSize:'1rem'}}>Recent Rentals</h3>
            {allRentals.slice(0,6).map(r=>(
              <div key={r._id} style={{background:'var(--dk3)',border:'1px solid var(--br)',borderRadius:'9px',
                padding:'.9rem 1.1rem',marginBottom:'.65rem',display:'flex',gap:'1rem',
                alignItems:'center',flexWrap:'wrap'}}>
                <div style={{flex:1}}>
                  <div style={{color:'var(--cr)',fontSize:'.88rem',fontFamily:'Playfair Display,serif'}}>{r.book?.title}</div>
                  <div style={{color:'var(--mu)',fontSize:'.74rem',marginTop:'.12rem'}}>{r.user?.name} · Due: {fmt(r.dueDate)}</div>
                </div>
                <span className={`rs ${r.status==='active'?'rs-act':r.status==='overdue'?'rs-ov':'rs-ret'}`}>{r.status}</span>
                {(r.currentPenalty>0||r.penaltyAmount>0) && (
                  <span style={{fontSize:'.74rem',color:'#E87070',fontWeight:700}}>₹{r.currentPenalty||r.penaltyAmount}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ADD BOOK */}
        {tab === 'add' && (
          <div className="adm-form">
            <h3>Add New Book</h3>
            <div className="form-row">
              <div className="fg"><label className="fl">Title *</label>
                <input className="fi" placeholder="Book title" value={f.title} onChange={e=>upd('title',e.target.value)}/></div>
              <div className="fg"><label className="fl">Author *</label>
                <input className="fi" placeholder="Author name" value={f.author} onChange={e=>upd('author',e.target.value)}/></div>
            </div>
            <div className="form-row">
              <div className="fg"><label className="fl">Genre</label>
                <select className="fi" value={f.genre} onChange={e=>upd('genre',e.target.value)} style={{cursor:'pointer'}}>
                  {['Classic','Crime','Thriller','Mystery','Fiction','Romance'].map(g=><option key={g}>{g}</option>)}
                </select></div>
              <div className="fg"><label className="fl">Language</label>
                <select className="fi" value={f.language} onChange={e=>upd('language',e.target.value)} style={{cursor:'pointer'}}>
                  {LANGS.map(l=><option key={l}>{l}</option>)}
                </select></div>
            </div>
            <div className="form-row">
              <div className="fg"><label className="fl">Section</label>
                <select className="fi" value={f.section} onChange={e=>upd('section',e.target.value)} style={{cursor:'pointer'}}>
                  <option value="browse">Books Page</option>
                  <option value="genre">Genres Page</option>
                </select></div>
              <div className="fg"><label className="fl">Rating (0–5)</label>
                <input className="fi" type="number" min="0" max="5" step="0.1"
                  value={f.rating} onChange={e=>upd('rating',parseFloat(e.target.value))}/></div>
            </div>
            <div className="fg"><label className="fl">Cover Image URL</label>
              <input className="fi" placeholder="https://…" value={f.coverImage} onChange={e=>upd('coverImage',e.target.value)}/></div>
            <div className="fg"><label className="fl">Description</label>
              <textarea className="fi" rows="3" placeholder="Brief description…" value={f.description}
                onChange={e=>upd('description',e.target.value)} style={{resize:'vertical'}}/></div>
            <button className="btn-sub" style={{maxWidth:'170px'}} onClick={handleAdd}>Add Book</button>
          </div>
        )}

        {/* MANAGE */}
        {tab === 'manage' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.3rem',flexWrap:'wrap',gap:'1rem'}}>
              <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--cr)',fontSize:'1.1rem'}}>
                All Books <span style={{color:'var(--mu)',fontFamily:'Inter,sans-serif',fontSize:'.78rem'}}>({books.length+genreBooks.length})</span>
              </h3>
              <button className="btn-g" onClick={()=>setTab('add')}>+ Add Book</button>
            </div>
            <div className="adm-list">
              {[...books,...genreBooks].map(b=>(
                <div key={b._id} className="adm-item">
                  {b.coverImage?<img src={b.coverImage} alt={b.title} className="adm-cov"/>:<div className="adm-fb">📖</div>}
                  <div className="adm-info">
                    <div className="adm-t">{b.title}</div>
                    <div className="adm-m">{b.author} · {b.genre}</div>
                    {b.language && <div style={{fontSize:'.68rem',color:'#5DADE2',marginBottom:'.25rem'}}>🌐 {b.language}</div>}
                    <span className={`sec-badge ${b.section==='browse'?'sb-br':'sb-gn'}`}>
                      {b.section==='browse'?'📘 Books':'📗 Genres'}
                    </span>
                    <div style={{display:'flex',alignItems:'center',gap:'.3rem',margin:'.35rem 0'}}>
                      <Stars r={b.rating}/><span style={{fontSize:'.72rem',color:'var(--mu)'}}>{b.rating}</span>
                    </div>
                    <button className="btn-del" onClick={()=>handleDel(b._id)}>🗑 Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* RENTALS TABLE */}
        {tab === 'rentals' && (
          <>
            <h3 style={{fontFamily:'Playfair Display,serif',color:'var(--cr)',marginBottom:'1.3rem',fontSize:'1.1rem'}}>
              All Rentals <span style={{color:'var(--mu)',fontFamily:'Inter,sans-serif',fontSize:'.78rem'}}>({allRentals.length})</span>
            </h3>
            {allRentals.length === 0
              ? <div className="empty"><div className="empty-ico">📋</div><p>No rentals yet.</p></div>
              : <div style={{overflowX:'auto'}}>
                  <table className="rtable">
                    <thead><tr><th>Book</th><th>User</th><th>Rent Start</th><th>Rent End</th><th>Status</th><th>Penalty</th></tr></thead>
                    <tbody>
                      {allRentals.map(r=>(
                        <tr key={r._id}>
                          <td>
                            <div style={{color:'var(--cr)',fontFamily:'Playfair Display,serif',fontSize:'.87rem'}}>{r.book?.title}</div>
                            <div style={{color:'var(--mu)',fontSize:'.7rem'}}>{r.book?.genre}{r.book?.language?` · ${r.book.language}`:''}</div>
                          </td>
                          <td>
                            <div style={{color:'var(--cr)',fontSize:'.83rem'}}>{r.user?.name}</div>
                            <div style={{color:'var(--mu)',fontSize:'.7rem'}}>{r.user?.email}</div>
                          </td>
                          <td style={{color:'var(--mu)',fontSize:'.78rem'}}>{fmt(r.rentedAt)}</td>
                          <td style={{color:r.status==='overdue'?'#E87070':'var(--mu)',fontSize:'.78rem'}}>{fmt(r.dueDate)}</td>
                          <td><span className={`rs ${r.status==='active'?'rs-act':r.status==='overdue'?'rs-ov':'rs-ret'}`}>{r.status}</span></td>
                          <td>
                            {(r.currentPenalty>0||r.penaltyAmount>0)
                              ? <span style={{fontSize:'.78rem',color:'#E87070',fontWeight:700}}>
                                  ₹{r.currentPenalty||r.penaltyAmount} {r.penaltyPaid?'✓':'unpaid'}
                                </span>
                              : <span style={{color:'var(--mu)',fontSize:'.75rem'}}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════════════
const AboutPage = () => {
  const { navigate } = useRouter();
  return (
    <div className="about-pg fade">
      <div className="about-body">
        <h1 className="about-h">World literature,<br/><span>one library.</span></h1>
        <p className="about-p">Readiction is a multilingual digital library management system. Browse two completely separate catalogs — Books (18 titles) and Genres (24 titles) — with zero overlap. Books span English, French, Spanish, Japanese, Russian, German, Portuguese, and more.</p>
        <p className="about-p">Rent any book for 7 days. Return it on time and it's free. Miss the deadline and a ₹5/day penalty accrues automatically — visible live on your card and settled from your Profile.</p>
        <div className="about-feats">
          {[
            {i:'🌍',t:'8+ Languages',d:'Browse books in English, French, Spanish, Japanese, Russian, German and more.'},
            {i:'📖',t:'Open & Read',d:'Read up to 15 pages in-browser with a clean reader — no downloads needed.'},
            {i:'♡',t:'Wishlist',d:'Heart any book to save it for later. Access your wishlist from the nav bar.'},
            {i:'⭐',t:'Ratings',d:'Every book shows a star rating so you can choose the best titles first.'},
            {i:'⏰',t:'Live Due Dates',d:'Due-date countdown strips appear directly on rented cards — green, amber, or red.'},
            {i:'💰',t:'Penalty System',d:'₹5/day for overdue books. Pay from Profile. Unpaid dues over ₹50 block new rentals.'},
          ].map(f=>(
            <div key={f.t} className="af">
              <div className="af-ico">{f.i}</div><h3>{f.t}</h3><p>{f.d}</p>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'2.8rem'}}>
          <button className="hbtn hbtn-p" onClick={()=> user ? navigate('books') : navigate('auth',{tab:'register'})}>Start Reading Today</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════
const AppContent = () => {
  const { page, params, navigate } = useRouter();
  const { user, loading }          = useAuth();
  const [books,      setBooks]      = useState([]);
  const [genreBooks, setGenreBooks] = useState([]);
  const [rentals,    setRentals]    = useState([]);
  const [allRentals, setAllRentals] = useState([]);
  const [wishlist,   setWishlist]   = useState([]);
  const [openBook,   setOpenBook]   = useState(null);
  const [dataLoading,setDataLoading]= useState(true);
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type='inf') => setToast({ msg, type });

  // Load both book catalogs - backend auto-reseeds if counts wrong
  const loadBooks = useCallback(async () => {
    setDataLoading(true);
    try {
      const [b, g] = await Promise.all([
        axios.get(`${API}/books`),
        axios.get(`${API}/books/genre-section`),
      ]);
      setBooks(b.data);
      setGenreBooks(g.data);
    } catch(e) { console.error(e); }
    finally { setDataLoading(false); }
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  // Load user rentals & wishlist
  const fetchRentals = useCallback(async () => {
    if (!user) { setRentals([]); setWishlist([]); return; }
    try {
      const [r, w] = await Promise.all([
        axios.get(`${API}/rentals/my`),
        axios.get(`${API}/wishlist`),
      ]);
      setRentals(r.data);
      setWishlist(w.data);
    } catch(e){ console.error(e); }
  }, [user]);

  useEffect(() => { fetchRentals(); }, [fetchRentals]);

  // Admin: all rentals
  useEffect(() => {
    if (user?.role !== 'admin') return;
    axios.get(`${API}/rentals/all`).then(r => setAllRentals(r.data)).catch(console.error);
  }, [user, rentals]);

  const handleRent = async bookId => {
    if (!user) return navigate('auth');
    try {
      await axios.post(`${API}/rentals/rent/${bookId}`);
      showToast('Book rented for 7 days! Return on time to avoid penalty.', 'ok');
      fetchRentals();
    } catch(e){ showToast(e.response?.data?.message||'Could not rent book', 'err'); }
  };

  const handleReturn = async rentalId => {
    try {
      const r = await axios.put(`${API}/rentals/return/${rentalId}`);
      r.data.penalty > 0
        ? showToast(`Returned with ₹${r.data.penalty} overdue penalty. Pay from Profile.`, 'err')
        : showToast('Book returned — no penalty. Thank you!', 'ok');
      fetchRentals();
    } catch(e){ showToast(e.response?.data?.message||'Return failed', 'err'); }
  };

  const handlePay = async rentalId => {
    try {
      const r = await axios.put(`${API}/rentals/pay-penalty/${rentalId}`);
      showToast(`₹${r.data.rental.penaltyAmount} penalty paid successfully!`, 'ok');
      fetchRentals();
    } catch(e){ showToast(e.response?.data?.message||'Payment failed', 'err'); }
  };

  const handleWishlist = async book => {
    if (!user) return navigate('auth');
    const isIn = wishlist.some(w => (w._id||w) === book._id);
    try {
      if (isIn) {
        await axios.delete(`${API}/wishlist/${book._id}`);
        setWishlist(p => p.filter(w => (w._id||w) !== book._id));
        showToast('Removed from wishlist', 'inf');
      } else {
        await axios.post(`${API}/wishlist/${book._id}`);
        setWishlist(p => [...p, book]);
        showToast('Added to wishlist ♥', 'ok');
      }
    } catch(e){ showToast('Wishlist update failed', 'err'); }
  };

  const handleRead = async book => {
    if (!book.pages?.length) {
      try { const r = await axios.get(`${API}/books/${book._id}`); setOpenBook(r.data); }
      catch { setOpenBook(book); }
    } else setOpenBook(book);
  };

  const handleAddBook = async fd => {
    const r = await axios.post(`${API}/books`, fd);
    if (fd.section === 'genre') setGenreBooks(p => [...p, r.data]);
    else                        setBooks(p => [...p, r.data]);
  };

  const handleDeleteBook = async id => {
    await axios.delete(`${API}/books/${id}`);
    setBooks(p => p.filter(b => b._id !== id));
    setGenreBooks(p => p.filter(b => b._id !== id));
  };

  const handleReseed = async () => {
    try {
      await axios.post(`${API}/books/reseed`);
      showToast('Books reseeded successfully!', 'ok');
      await loadBooks();
    } catch(e) { showToast(e.response?.data?.message || 'Reseed failed', 'err'); }
  };

  if (loading) return <><style>{CSS}</style><div className="loading"><div className="spin"/></div></>;

  if (openBook) return (
    <><style>{CSS}</style>
      <BookReader book={openBook} onBack={()=>setOpenBook(null)}/>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );

  const shared = { rentals, wishlist, onRent:handleRent, onReturn:handleReturn, onRead:handleRead, onWishlist:handleWishlist };

  // Auth guard — redirect unauthenticated users to login
  const requireAuth = (component) => {
    if (!user) {
      return (
        <div className="pw fade" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}>
          <div style={{textAlign:'center',padding:'3rem 2rem',maxWidth:'420px'}}>
            <div style={{fontSize:'3.5rem',marginBottom:'1.2rem'}}>🔒</div>
            <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'1.7rem',color:'var(--cr)',marginBottom:'.7rem'}}>
              Sign In Required
            </h2>
            <p style={{color:'var(--mu)',lineHeight:'1.7',marginBottom:'2rem',fontSize:'.95rem'}}>
              You need an account to access this page. Create one free or sign in to continue.
            </p>
            <div style={{display:'flex',gap:'.8rem',justifyContent:'center',flexWrap:'wrap'}}>
              <button className="btn-g" style={{padding:'.75rem 1.8rem',fontSize:'.95rem'}}
                onClick={() => navigate('auth', { tab: 'register' })}>
                Create Account
              </button>
              <button className="btn-o" style={{padding:'.75rem 1.8rem',fontSize:'.95rem'}}
                onClick={() => navigate('auth', { tab: 'login' })}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }
    return component;
  };

  const render = () => {
    if (dataLoading) return <div className="loading" style={{paddingTop:'120px'}}><div className="spin"/></div>;
    switch(page) {
      case 'home':     return <HomePage books={books} {...shared}/>;
      case 'books':    return requireAuth(<BooksPage books={books} {...shared}/>);
      case 'genres':   return requireAuth(<GenresPage genreBooks={genreBooks}/>);
      case 'genre':    return requireAuth(<GenreDetailPage genre={params.genre} genreBooks={genreBooks} {...shared}/>);
      case 'about':    return requireAuth(<AboutPage/>);
      case 'auth':     return <AuthPage initialTab={params.tab}/>;
      case 'admin':    return requireAuth(<AdminPage books={books} genreBooks={genreBooks} allRentals={allRentals} onAddBook={handleAddBook} onDeleteBook={handleDeleteBook} onReseed={handleReseed}/>);
      case 'profile':  return requireAuth(<ProfilePage {...shared} onPay={handlePay} books={books} genreBooks={genreBooks}/>);
      case 'wishlist': return requireAuth(<WishlistPage wishlist={wishlist} {...shared}/>);
      default:         return <HomePage books={books} {...shared}/>;
    }
  };

  return (
    <><style>{CSS}</style>
      {page !== 'auth' && <Navbar cur={page}/>}
      {render()}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
};

const App = () => (
  <AuthProvider><RouterProvider><AppContent/></RouterProvider></AuthProvider>
);

export default App;
