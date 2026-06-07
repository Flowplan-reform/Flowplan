import { useState, useEffect, useRef } from "react";

// ─── CONFIG – ersetze diese Werte mit deinen Supabase-Daten ──────────────────
const SUPABASE_URL = "https://umrjlwcfonibaauqzkem.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtcmpsd2Nmb25pYmFhdXF6a2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3OTE0NTYsImV4cCI6MjA5NjM2NzQ1Nn0.dYIZUyljyv8zqe4qD5gnjtzM36xDWUa_PrU6DiaDFkI";
const ADMIN_EMAIL = "Romy.dimitrijevic@outlook.com";
// Supabase REST (kein npm)
const supabase = {
  auth: {
    signInWithPassword: async({email,password})=>{
      const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(d.error)throw new Error(d.error_description||d.error);
      return {data:{user:{email:d.user?.email}}};
    },
    signUp: async({email,password})=>{
      const r=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON_KEY},body:JSON.stringify({email,password})});
      const d=await r.json();
      if(d.error)throw new Error(d.error_description||d.error);
      return {data:d};
    },
    signOut: async()=>{},
  }
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#FAF7F2;color:#2C1F14;min-height:100vh;}
  .app{max-width:430px;margin:0 auto;min-height:100vh;background:#FAF7F2;position:relative;}

  /* LOGIN */
  .login-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 32px;background:linear-gradient(160deg,#FAF7F2 0%,#F2EDE4 60%,#E8DDD0 100%);position:relative;overflow:hidden;}
  .login-screen::before{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,#E8C4A844 0%,transparent 70%);top:-80px;right:-80px;}
  .login-logo{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:300;letter-spacing:6px;color:#4A3728;margin-bottom:4px;}
  .login-tagline{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C4B5A5;margin-bottom:48px;}
  .login-card{width:100%;background:#FFFFFFdd;backdrop-filter:blur(20px);border-radius:24px;padding:32px 26px;border:1px solid #E8DDD0;box-shadow:0 8px 40px #8B735518;z-index:1;}
  .login-title{font-family:'Cormorant Garamond',serif;font-size:24px;color:#4A3728;margin-bottom:20px;}
  .lbl{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7A6858;margin-bottom:7px;display:block;}
  .ifield{width:100%;padding:13px 15px;background:#FAF7F2;border:1px solid #E8DDD0;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;color:#2C1F14;outline:none;transition:border-color 0.2s;margin-bottom:14px;}
  .ifield:focus{border-color:#C9956B;}
  .btn{width:100%;padding:15px;background:#4A3728;color:#FAF7F2;border:none;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s;}
  .btn:hover{background:#8B7355;}
  .btn:disabled{background:#C4B5A5;cursor:not-allowed;}
  .btn.accent{background:#C9956B;}
  .btn.accent:hover{background:#8B7355;}
  .btn.outline{background:transparent;color:#4A3728;border:1.5px solid #C4B5A5;}
  .btn.outline:hover{border-color:#4A3728;}
  .btn.sm{width:auto;padding:9px 18px;font-size:13px;}
  .btn.danger{background:#E07070;}
  .err{font-size:12px;color:#E07070;margin-top:8px;text-align:center;}

  /* HEADER */
  .hdr{padding:50px 22px 13px;background:#FAF7F2;border-bottom:1px solid #E8DDD0;position:sticky;top:0;z-index:100;}
  .hdr-top{display:flex;align-items:center;justify-content:space-between;}
  .hdr-logo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;letter-spacing:4px;color:#4A3728;}
  .hdr-sub{font-size:11px;color:#7A6858;margin-top:3px;}
  .avatar{width:34px;height:34px;background:#4A3728;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#FAF7F2;font-size:12px;font-weight:500;cursor:pointer;flex-shrink:0;}
  .avatar.admin{background:#C9956B;}
  .sbar{display:flex;align-items:center;gap:8px;background:#FFF;border:1px solid #E8DDD0;border-radius:11px;padding:9px 13px;margin-top:10px;}
  .sinp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;color:#2C1F14;outline:none;}

  /* NAV */
  .bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#FFF;border-top:1px solid #E8DDD0;display:flex;padding:10px 0 24px;z-index:200;}
  .ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:4px 0;transition:all 0.2s;}
  .ni-icon{font-size:17px;}
  .ni-lbl{font-size:10px;color:#C4B5A5;}
  .ni.active .ni-lbl{color:#4A3728;font-weight:500;}
  .ni.active .ni-icon{transform:scale(1.1);}

  /* CONTENT */
  .pg{padding:16px 18px 110px;}
  .ptitle{font-family:'Cormorant Garamond',serif;font-size:28px;color:#4A3728;margin-bottom:3px;}
  .psub{font-size:12px;color:#7A6858;margin-bottom:14px;}

  /* CHIPS */
  .frow{display:flex;gap:6px;overflow-x:auto;padding-bottom:3px;margin-bottom:10px;scrollbar-width:none;}
  .frow::-webkit-scrollbar{display:none;}
  .chip{padding:6px 13px;border-radius:20px;font-size:12px;white-space:nowrap;cursor:pointer;border:1px solid #E8DDD0;background:#FFF;color:#7A6858;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
  .chip.on{background:#4A3728;color:#FAF7F2;border-color:#4A3728;}
  .chip.acc{background:#C9956B;color:#FFF;border-color:#C9956B;}

  /* EXERCISE CARDS */
  .exc{background:#FFF;border-radius:13px;padding:15px;margin-bottom:9px;border:1px solid #E8DDD0;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 8px #8B735506;}
  .exc:hover{transform:translateY(-1px);box-shadow:0 5px 16px #8B735510;}
  .exc.fav{border-color:#C9956B44;background:#FFFAF6;}
  .exc-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
  .exc-name{font-family:'Cormorant Garamond',serif;font-size:18px;color:#4A3728;flex:1;line-height:1.2;}
  .lbadge{font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:3px 8px;border-radius:20px;flex-shrink:0;}
  .lb{background:#7A9E7E22;color:#7A9E7E;} .li{background:#C9956B22;color:#C9956B;} .la{background:#8B735522;color:#8B7355;}
  .catb{display:inline-block;font-size:10px;padding:2px 7px;border-radius:6px;background:#F2EDE4;color:#7A6858;margin-top:4px;}
  .emeta{display:flex;gap:8px;margin-top:5px;flex-wrap:wrap;}
  .etag{font-size:11px;color:#7A6858;}
  .srow{display:flex;gap:3px;margin-top:6px;align-items:center;}
  .sd{width:8px;height:8px;border-radius:50%;}
  .slbl{font-size:11px;color:#7A6858;margin-left:3px;}

  /* MODAL */
  .overlay{position:fixed;inset:0;background:#2C1F1450;backdrop-filter:blur(4px);z-index:300;display:flex;align-items:flex-end;}
  .modal{background:#FAF7F2;border-radius:22px 22px 0 0;width:100%;max-height:90vh;overflow-y:auto;padding:22px 20px 36px;animation:su 0.3s ease;}
  @keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
  .mhandle{width:34px;height:3px;background:#E8DDD0;border-radius:2px;margin:0 auto 16px;}
  .mtitle{font-family:'Cormorant Garamond',serif;font-size:24px;color:#4A3728;margin-bottom:3px;}
  .msec{margin-top:15px;}
  .msec-t{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C4B5A5;margin-bottom:7px;}
  .vcard{background:#FFF;border-radius:10px;padding:11px 13px;margin-bottom:7px;border:1px solid #E8DDD0;}
  .vtype{font-size:11px;font-weight:500;color:#C9956B;margin-bottom:3px;}
  .vdesc{font-size:13px;color:#7A6858;}
  .vidph{background:#E8DDD0;border-radius:10px;height:140px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin:12px 0;gap:6px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;}
  .vidph:hover{background:#DDD0C4;}
  .vidph video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:10px;}

  /* PLAN BUILDER */
  .pitem{background:#FFF;border-radius:11px;padding:12px 13px;margin-bottom:7px;border:1px solid #E8DDD0;display:flex;align-items:center;gap:9px;}
  .pnum{width:22px;height:22px;background:#4A3728;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#FAF7F2;font-size:10px;flex-shrink:0;}
  .pinfo{flex:1;min-width:0;}
  .pname{font-family:'Cormorant Garamond',serif;font-size:15px;color:#4A3728;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .pmeta{font-size:11px;color:#7A6858;margin-top:1px;}
  .drow{display:flex;align-items:center;gap:5px;flex-shrink:0;}
  .dbtn{width:24px;height:24px;border-radius:50%;border:1px solid #E8DDD0;background:#FAF7F2;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;color:#4A3728;}
  .dbtn:hover{background:#4A3728;color:#FAF7F2;border-color:#4A3728;}
  .dval{font-size:12px;font-weight:500;color:#4A3728;min-width:36px;text-align:center;}
  .rmv{width:24px;height:24px;border-radius:50%;border:none;background:#FFE8E8;color:#E07070;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .tbar{background:#4A3728;border-radius:11px;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
  .addbtn{width:100%;padding:12px;background:#FFF;border:1.5px dashed #C4B5A5;border-radius:11px;color:#7A6858;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;margin-bottom:11px;transition:all 0.2s;}
  .addbtn:hover{border-color:#4A3728;color:#4A3728;}
  .savbtn{width:100%;padding:14px;background:#C9956B;color:#FFF;border:none;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s;}
  .savbtn:hover{background:#8B7355;}
  .savbtn:disabled{background:#C4B5A5;cursor:not-allowed;}

  /* PROGRAMME */
  .pcard{border-radius:17px;padding:19px;margin-bottom:11px;position:relative;overflow:hidden;transition:all 0.2s;cursor:pointer;}
  .pcard:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15);}
  .pcard::after{content:'';position:absolute;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.07);top:-30px;right:-30px;}
  .pcard-title{font-family:'Cormorant Garamond',serif;font-size:22px;margin-bottom:3px;}
  .pcard-meta{font-size:11px;opacity:0.75;margin-bottom:11px;}
  .ptags{display:flex;gap:6px;flex-wrap:wrap;}
  .ptag{font-size:10px;padding:3px 9px;border-radius:20px;background:rgba(255,255,255,0.2);}
  .pbtns{display:flex;gap:7px;margin-top:12px;}
  .pbtn{padding:8px 15px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.35);border-radius:8px;color:white;font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;}
  .pbtn:hover{background:rgba(255,255,255,0.35);}
  .pbtn.del{background:rgba(220,60,60,0.25);border-color:rgba(220,60,60,0.4);}

  /* TIMER */
  .tscreen{min-height:calc(100vh - 165px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;}
  .tex{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:#4A3728;text-align:center;margin-bottom:5px;}
  .tnext{font-size:12px;color:#7A6858;text-align:center;margin-bottom:32px;}
  .tring{width:196px;height:196px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
  .tinner{width:170px;height:170px;border-radius:50%;background:#FAF7F2;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 4px 18px #8B735512;}
  .ttime{font-family:'Cormorant Garamond',serif;font-size:50px;font-weight:300;color:#4A3728;line-height:1;}
  .tlbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C4B5A5;margin-top:3px;}
  .tctrl{display:flex;gap:11px;margin-top:24px;}
  .tbtn{padding:12px 24px;border-radius:50px;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;}
  .tbp{background:#4A3728;color:#FAF7F2;}
  .tbs{background:#E8DDD0;color:#2C1F14;}

  /* AI */
  .achat{display:flex;flex-direction:column;gap:11px;padding:16px 18px 150px;overflow-y:auto;max-height:calc(100vh - 170px);}
  .amsg{padding:13px 15px;border-radius:13px;font-size:14px;line-height:1.6;max-width:88%;white-space:pre-wrap;}
  .amsg.bot{background:#FFF;color:#2C1F14;border:1px solid #E8DDD0;border-radius:13px 13px 13px 3px;align-self:flex-start;}
  .amsg.user{background:#4A3728;color:#FAF7F2;border-radius:13px 13px 3px 13px;align-self:flex-end;}
  .abar{position:fixed;bottom:66px;left:50%;transform:translateX(-50%);width:calc(100% - 26px);max-width:404px;display:flex;gap:7px;background:#FFF;border:1px solid #E8DDD0;border-radius:50px;padding:7px 7px 7px 14px;box-shadow:0 4px 18px #8B735510;z-index:150;}
  .ainp{flex:1;border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:14px;color:#2C1F14;outline:none;}
  .asend{width:33px;height:33px;background:#4A3728;border:none;border-radius:50%;color:#FAF7F2;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .asugg{padding:9px 13px;background:#F2EDE4;border:1px solid #E8DDD0;border-radius:10px;font-size:13px;color:#2C1F14;cursor:pointer;text-align:left;font-family:'DM Sans',sans-serif;width:100%;}
  .asugg:hover{background:#E8DDD0;}
  .ldots{display:flex;gap:4px;align-items:center;}
  .ldot{width:5px;height:5px;background:#C4B5A5;border-radius:50%;animation:bounce 1.2s infinite;}
  .ldot:nth-child(2){animation-delay:.2s}.ldot:nth-child(3){animation-delay:.4s}
  @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}

  /* ADMIN */
  .admin-section{background:#FFF;border-radius:14px;padding:18px;margin-bottom:14px;border:1px solid #E8DDD0;}
  .admin-section-title{font-family:'Cormorant Garamond',serif;font-size:20px;color:#4A3728;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .upload-area{border:2px dashed #C4B5A5;border-radius:12px;padding:30px 20px;text-align:center;cursor:pointer;transition:all 0.2s;background:#FAF7F2;}
  .upload-area:hover{border-color:#C9956B;background:#FFF8F4;}
  .upload-icon{font-size:32px;margin-bottom:8px;}
  .upload-text{font-size:13px;color:#7A6858;}
  .edit-form{display:flex;flex-direction:column;gap:10px;}
  .erow{display:flex;gap:8px;}
  .erow .ifield{margin-bottom:0;}
  .tag-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;}
  .tag-opt{padding:5px 11px;border-radius:20px;font-size:11px;cursor:pointer;border:1px solid #E8DDD0;background:#FFF;color:#7A6858;transition:all 0.2s;}
  .tag-opt.on{background:#4A3728;color:#FAF7F2;border-color:#4A3728;}

  /* PROFILE */
  .prof-card{background:#FFF;border-radius:14px;padding:20px;margin-bottom:12px;border:1px solid #E8DDD0;}
  .prof-name{font-family:'Cormorant Garamond',serif;font-size:22px;color:#4A3728;margin-bottom:4px;}
  .prof-email{font-size:12px;color:#7A6858;margin-bottom:14px;}
  .stat-row{display:flex;gap:10px;}
  .stat{flex:1;background:#FAF7F2;border-radius:10px;padding:12px;text-align:center;}
  .stat-val{font-family:'Cormorant Garamond',serif;font-size:26px;color:#4A3728;}
  .stat-lbl{font-size:10px;color:#7A6858;letter-spacing:1px;text-transform:uppercase;margin-top:2px;}

  /* TOAST */
  .toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);background:#4A3728;color:#FAF7F2;padding:11px 22px;border-radius:50px;font-size:13px;z-index:999;animation:fio 2.5s ease forwards;white-space:nowrap;pointer-events:none;}
  @keyframes fio{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}75%{opacity:1}100%{opacity:0}}

  .divider{height:1px;background:#E8DDD0;margin:14px 0;}
  .empty{text-align:center;padding:50px 20px;color:#C4B5A5;}
  .empty-icon{font-size:36px;margin-bottom:10px;}
  .picker-modal{background:#FAF7F2;border-radius:22px 22px 0 0;width:100%;height:82vh;display:flex;flex-direction:column;animation:su 0.3s ease;}
  .picker-hdr{padding:18px 18px 10px;border-bottom:1px solid #E8DDD0;flex-shrink:0;}
  .picker-list{flex:1;overflow-y:auto;padding:10px 15px 20px;}
  .note-card{background:#FFF;border-radius:12px;padding:14px;margin-bottom:9px;border:1px solid #E8DDD0;}
  .note-date{font-size:11px;color:#C4B5A5;margin-bottom:4px;}
  .note-text{font-size:13px;color:#2C1F14;line-height:1.5;}
  .prog-badge{display:inline-block;font-size:10px;padding:2px 8px;border-radius:6px;background:#C9956B22;color:#C9956B;margin-top:4px;}
`;

// ─── STATIC EXERCISE DATA ─────────────────────────────────────────────────────
const DEFAULT_EXERCISES = [
  {id:"e1",  name:"Footwork – Parallel",      cat:"Unterkörper", subcat:"Beine & Gesäß",      muscle:"Quadrizeps, Gesäß",             level:"beginner",     springs:["red","red","blue","blue"], duration:120, box:false, prenatal:true,  postnatal:true,  desc:"Grundübung. Rücken flach, Füße parallel auf der Fußstange.", progr:"Einbeinig",regr:"Halbe Amplitude"},
  {id:"e2",  name:"Footwork – V-Position",    cat:"Unterkörper", subcat:"Beine & Gesäß",      muscle:"Adduktoren, Quadrizeps",         level:"beginner",     springs:["red","red","blue","blue"], duration:120, box:false, prenatal:true,  postnatal:true,  desc:"Füße in V-Stellung, Fersen zusammen.",progr:"Pulsieren",regr:"Füße höher"},
  {id:"e3",  name:"Footwork – Heels",         cat:"Unterkörper", subcat:"Beine & Gesäß",      muscle:"Hamstrings, Waden",              level:"beginner",     springs:["red","red","blue","blue"], duration:120, box:false, prenatal:true,  postnatal:true,  desc:"Fersen auf der Stange, Zehen oben.",progr:"Einbeinig",regr:"Mehr Federn"},
  {id:"e4",  name:"Side Lying Leg Series",    cat:"Unterkörper", subcat:"Gesäß & Hüfte",      muscle:"Gluteus, Abduktoren",            level:"beginner",     springs:["blue","yellow"],          duration:120, box:false, prenatal:true,  postnatal:true,  desc:"Seitlage, Beinkreise und Auf-Ab.",progr:"Mit Straps",regr:"Kleinere Amplitude"},
  {id:"e5",  name:"Kneeling Lunge",           cat:"Unterkörper", subcat:"Gesäß & Hüfte",      muscle:"Hüftbeuger, Quadrizeps, Gesäß",  level:"intermediate", springs:["red","blue"],             duration:90,  box:false, prenatal:false, postnatal:true,  desc:"Ein Bein auf Wagen, Ausfallschritt.",progr:"Arme über Kopf",regr:"Hände am Rahmen"},
  {id:"e6",  name:"The Hundred",              cat:"Core",        subcat:"Bauch",               muscle:"Bauch, Hüftbeuger",              level:"intermediate", springs:["red","blue"],             duration:90,  box:false, prenatal:false, postnatal:false, desc:"Klassiker: Beine ausgestreckt, Arme pumpen.",progr:"Beine tiefer",regr:"Tischposition"},
  {id:"e7",  name:"Short Box – Round",        cat:"Core",        subcat:"Wirbelsäule",         muscle:"Bauch, Rücken",                  level:"intermediate", springs:["red"],                    duration:120, box:true,  prenatal:false, postnatal:true,  desc:"Auf kurzer Box, Wirbelsäule runden nach hinten.",progr:"Mit Rotation",regr:"Kleinere Amplitude"},
  {id:"e8",  name:"Short Box – Rotation",     cat:"Core",        subcat:"Wirbelsäule",         muscle:"Schräge Bauchmuskeln",           level:"intermediate", springs:["red"],                    duration:90,  box:true,  prenatal:false, postnatal:false, desc:"Auf kurzer Box, Rotation links/rechts.",progr:"Mit Seitneigung",regr:"Hände an Schläfen"},
  {id:"e9",  name:"Teaser",                   cat:"Core",        subcat:"Bauch",               muscle:"Bauch, Hüftbeuger",              level:"advanced",     springs:["blue","yellow"],          duration:90,  box:false, prenatal:false, postnatal:false, desc:"V-Sit: Beine und Oberkörper gleichzeitig heben.",progr:"Einbeinig",regr:"Beine gebeugt"},
  {id:"e10", name:"Rowing – Front",           cat:"Oberkörper",  subcat:"Rücken & Schultern",  muscle:"Rücken, Schultern",              level:"intermediate", springs:["blue"],                   duration:120, box:true,  prenatal:true,  postnatal:true,  desc:"Sitzend, Arme ziehen Straps nach vorne, öffnen seitlich.",progr:"Langsamer",regr:"Kürzerer Hebel"},
  {id:"e11", name:"Rowing – Back",            cat:"Oberkörper",  subcat:"Rücken & Schultern",  muscle:"Rücken, Schulterblätter",        level:"intermediate", springs:["blue"],                   duration:120, box:true,  prenatal:true,  postnatal:true,  desc:"Rückwärtiges Rudern: Arme hinter dem Körper.",progr:"Langsamer",regr:"Arme gebeugt"},
  {id:"e12", name:"Chest Expansion",          cat:"Oberkörper",  subcat:"Brust & Schultern",   muscle:"Brust, vordere Schulter",        level:"beginner",     springs:["red","blue"],             duration:90,  box:false, prenatal:true,  postnatal:true,  desc:"Kniend, Arme ziehen Straps nach hinten, Brustkorb öffnet.",progr:"Mit Rotation",regr:"Sitzend"},
  {id:"e13", name:"Swan",                     cat:"Oberkörper",  subcat:"Rücken",               muscle:"Rückenstrecker, Schultern",      level:"advanced",     springs:["red"],                    duration:60,  box:true,  prenatal:false, postnatal:false, desc:"Bauchlage, Extension der Wirbelsäule.",progr:"Mit Rotation",regr:"Kleinere Amplitude"},
  {id:"e14", name:"Mermaid",                  cat:"Oberkörper",  subcat:"Seitliche Rumpf",      muscle:"Seitliche Rumpfmuskulatur",      level:"beginner",     springs:["red","blue"],             duration:60,  box:false, prenatal:true,  postnatal:true,  desc:"Seitlich sitzend, Seitneigung mit Arm-Extension.",progr:"Arm in Rotation",regr:"Hand am Rahmen"},
  {id:"e15", name:"Long Stretch",             cat:"Full Body",   subcat:"Plank-Serie",          muscle:"Core, Schultern, Beine",         level:"advanced",     springs:["red"],                    duration:90,  box:false, prenatal:false, postnatal:false, desc:"Plank auf Reformer, Schulterblatt-Stabilisierung.",progr:"Füße auf Box",regr:"Knie auf Wagen"},
  {id:"e16", name:"Elephant",                 cat:"Full Body",   subcat:"Plank-Serie",          muscle:"Hamstrings, Core",               level:"intermediate", springs:["red","red"],              duration:90,  box:false, prenatal:false, postnatal:false, desc:"Stehend auf Wagen, vorgebeugt, Beinstreckung.",progr:"Einbeinig",regr:"Knie gebeugt"},
  {id:"e17", name:"Prenatal – Side Lying",    cat:"Prenatal",    subcat:"Unterkörper",          muscle:"Gluteus, Adduktoren",            level:"beginner",     springs:["blue","yellow"],          duration:120, box:false, prenatal:true,  postnatal:false, desc:"Seitlage, ideal für Schwangere, sanfte Beinarbeit.",progr:"Mit Rotation",regr:"Ohne Straps"},
  {id:"e18", name:"Prenatal – Cat Stretch",   cat:"Prenatal",    subcat:"Wirbelsäule",          muscle:"Rücken, Bauch",                  level:"beginner",     springs:["red"],                    duration:60,  box:false, prenatal:true,  postnatal:false, desc:"Katzenbuckel auf dem Reformer, entlastet Wirbelsäule.",progr:"Mit Seitneigung",regr:"Kleinerer Bereich"},
  {id:"e19", name:"Postnatal – Core Rebuild", cat:"Prenatal",    subcat:"Core",                 muscle:"Tiefe Bauchmuskulatur",           level:"beginner",     springs:["yellow"],                 duration:90,  box:false, prenatal:false, postnatal:true,  desc:"Sanfte Core-Aktivierung, Fokus auf Beckenboden.",progr:"Füße anheben",regr:"Nur Atemübungen"},
  {id:"e20", name:"Hamstring Stretch",        cat:"Dehnung",     subcat:"Beine",                muscle:"Hamstrings, Waden",               level:"beginner",     springs:["red"],                    duration:60,  box:false, prenatal:true,  postnatal:true,  desc:"Rückenlage, Bein in Strap dehnen.",progr:"Bein zur Seite",regr:"Knie gebeugt"},
  {id:"e21", name:"Spine Twist",              cat:"Dehnung",     subcat:"Wirbelsäule",          muscle:"Schräge Bauchmuskeln, Rücken",   level:"beginner",     springs:["red"],                    duration:60,  box:true,  prenatal:true,  postnatal:true,  desc:"Sitzend auf Box, Rotation links/rechts.",progr:"Arme seitlich",regr:"Hände vor Brust"},
  {id:"e22", name:"Child's Pose",             cat:"Dehnung",     subcat:"Rücken",               muscle:"Rücken, Gesäß, Schultern",        level:"beginner",     springs:["red","blue"],             duration:60,  box:false, prenatal:true,  postnatal:true,  desc:"Kindshaltung, entspannende Enddehnung.",progr:"Arme weit vorne",regr:"Polster unter Knie"},
];

const SC={red:"#E07070",blue:"#7090C0",yellow:"#D4B840",green:"#7A9E7E"};
const LM={beginner:"Anfänger",intermediate:"Mittel",advanced:"Fortgeschritten"};
const LC={beginner:"lb",intermediate:"li",advanced:"la"};
const CATS=["Alle","Unterkörper","Oberkörper","Core","Full Body","Prenatal","Dehnung"];
const LEVELS=["Alle Level","Anfänger","Mittel","Fortgeschritten"];
const SPRING_OPTS=["red","blue","yellow","green"];
const PRESET_PROGRAMS=[
  {id:"p1",name:"Full Body Flow",      variant:"dark",    tags:["Full Body","Alle Level"],   items:[{exId:"e1",dur:120},{exId:"e6",dur:90},{exId:"e10",dur:120},{exId:"e15",dur:90},{exId:"e20",dur:60}]},
  {id:"p2",name:"Prenatal Gentle",     variant:"green",   tags:["Prenatal","Sanft"],         items:[{exId:"e17",dur:120},{exId:"e18",dur:60},{exId:"e12",dur:90},{exId:"e22",dur:60}]},
  {id:"p3",name:"Upper Body Sculpt",   variant:"accent",  tags:["Oberkörper","Kraft"],       items:[{exId:"e10",dur:120},{exId:"e11",dur:120},{exId:"e13",dur:60},{exId:"e12",dur:90}]},
  {id:"p4",name:"Core & Posture",      variant:"dark",    tags:["Core","Haltung"],           items:[{exId:"e6",dur:90},{exId:"e7",dur:120},{exId:"e8",dur:90},{exId:"e9",dur:90}]},
  {id:"p5",name:"Lower Body Burn",     variant:"blue",    tags:["Unterkörper","Kraft"],      items:[{exId:"e1",dur:120},{exId:"e2",dur:120},{exId:"e3",dur:120},{exId:"e4",dur:120}]},
  {id:"p6",name:"Postnatal Recovery",  variant:"green",   tags:["Postnatal","Sanft"],        items:[{exId:"e19",dur:90},{exId:"e4",dur:120},{exId:"e20",dur:60},{exId:"e22",dur:60}]},
];
const CARD_STYLES={
  dark:"background:linear-gradient(135deg,#4A3728,#8B7355);color:#FAF7F2;",
  accent:"background:linear-gradient(135deg,#C9956B,#E8C4A8);color:#FFF;",
  green:"background:linear-gradient(135deg,#7A9E7E,#5a8a5e);color:#FFF;",
  blue:"background:linear-gradient(135deg,#6B8CAE,#4A6B8C);color:#FFF;",
  purple:"background:linear-gradient(135deg,#9B7EBD,#7B5EA7);color:#FFF;",
};

function fmtDur(s){const m=Math.floor(s/60),r=s%60;return r>0?`${m}:${String(r).padStart(2,"0")}`:`${m}:00`;}
function totalMin(items){return Math.round(items.reduce((a,i)=>a+i.dur,0)/60);}
function Springs({springs}){return(<div className="srow"><span style={{fontSize:10,color:"#7A6858",marginRight:3}}>Federn:</span>{springs.map((s,i)=><div key={i} className="sd" style={{background:SC[s]||"#ccc"}}/>)}<span className="slbl">{springs.join("+")}</span></div>);}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [mode,setMode]=useState("login");

  const handle=async()=>{
    setErr(""); setLoading(true);
    try{
      if(SUPABASE_URL==="DEINE_SUPABASE_URL"){
        // Demo mode ohne Supabase
        onLogin({email:"demo@flowplan.ch",isAdmin:true});
        return;
      }
      if(mode==="login"){
        const {data,error}=await supabase.auth.signInWithPassword({email,password:pw});
        if(error) throw error;
        onLogin({email:data.user.email,isAdmin:data.user.email===ADMIN_EMAIL});
      } else {
        const {error}=await supabase.auth.signUp({email,password:pw});
        if(error) throw error;
        setErr("Bestätigungs-E-Mail gesendet! Bitte prüfe dein Postfach.");
      }
    } catch(e){ setErr(e.message||"Fehler aufgetreten"); }
    setLoading(false);
  };

  return(
    <div className="login-screen">
      <div className="login-logo">FLOWPLAN</div>
      <div className="login-tagline">Reformer Pilates Planer</div>
      <div className="login-card">
        <div className="login-title">{mode==="login"?"Anmelden":"Registrieren"}</div>
        <label className="lbl">E-Mail</label>
        <input className="ifield" type="email" placeholder="trainer@studio.ch" value={email} onChange={e=>setEmail(e.target.value)}/>
        <label className="lbl">Passwort</label>
        <input className="ifield" type="password" placeholder="••••••••" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        {err&&<div className="err">{err}</div>}
        <button className="btn" style={{marginTop:8}} onClick={handle} disabled={loading}>{loading?"Laden...":(mode==="login"?"Anmelden →":"Registrieren →")}</button>
        <div style={{textAlign:"center",marginTop:14,fontSize:12,color:"#7A6858",cursor:"pointer"}} onClick={()=>setMode(m=>m==="login"?"register":"login")}>
          {mode==="login"?"Noch kein Konto? Registrieren":"Bereits registriert? Anmelden"}
        </div>
        {SUPABASE_URL==="DEINE_SUPABASE_URL"&&<div style={{marginTop:14,padding:"10px 14px",background:"#FFF8E8",borderRadius:10,fontSize:12,color:"#8B7355",textAlign:"center"}}>⚙️ Demo-Modus – Supabase noch nicht verbunden</div>}
      </div>
    </div>
  );
}

// ─── EXERCISE DETAIL MODAL ────────────────────────────────────────────────────
function ExModal({ex,onClose,onAdd,onFav,isFav}){
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mhandle"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><div className="mtitle">{ex.name}</div><div style={{fontSize:11,color:"#7A6858"}}>{ex.cat} · {ex.subcat}</div></div>
          <div style={{display:"flex",gap:8}}>
            {onFav&&<button onClick={()=>onFav(ex.id)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer"}}>{isFav?"⭐":"☆"}</button>}
            <button onClick={onClose} style={{background:"#E8DDD0",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:13}}>✕</button>
          </div>
        </div>
        {ex.videoUrl?(
          <div className="vidph" style={{marginTop:12}}>
            <video src={ex.videoUrl} controls playsInline style={{width:"100%",height:"100%",borderRadius:10,objectFit:"cover"}}/>
          </div>
        ):(
          <div className="vidph" style={{marginTop:12}}>
            <div style={{fontSize:28}}>▶</div>
            <div style={{fontSize:11,color:"#7A6858"}}>Noch kein Video</div>
          </div>
        )}
        <div style={{fontSize:13,color:"#7A6858",lineHeight:1.6}}>{ex.desc}</div>
        <div className="msec"><div className="msec-t">Federeinstellung</div><Springs springs={ex.springs}/></div>
        <div className="msec"><div className="msec-t">Muskelgruppen</div><div style={{fontSize:13,color:"#2C1F14"}}>{ex.muscle}</div></div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10}}>
          {ex.prenatal&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:"#7A9E7E22",color:"#7A9E7E"}}>🤰 Prenatal</span>}
          {ex.postnatal&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:"#C9956B22",color:"#C9956B"}}>👶 Postnatal</span>}
          {ex.box&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:8,background:"#E8DDD0",color:"#7A6858"}}>📦 Box</span>}
        </div>
        <div className="msec"><div className="msec-t">Variationen</div>
          <div className="vcard"><div className="vtype">Progression ↑</div><div className="vdesc">{ex.progr}</div></div>
          <div className="vcard"><div className="vtype">Regression ↓</div><div className="vdesc">{ex.regr}</div></div>
        </div>
        {onAdd&&<button className="btn accent" style={{marginTop:16}} onClick={()=>{onAdd(ex);onClose();}}>+ Zum Plan hinzufügen</button>}
        <button className="btn outline" style={{marginTop:8}} onClick={onClose}>Schließen</button>
      </div>
    </div>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
function LibraryScreen({exercises,favs,onFav}){
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("Alle");
  const [level,setLevel]=useState("Alle Level");
  const [onlyFav,setOnlyFav]=useState(false);
  const [sel,setSel]=useState(null);

  const filtered=exercises.filter(ex=>{
    const ms=!search||[ex.name,ex.muscle||"",ex.subcat||""].some(s=>s.toLowerCase().includes(search.toLowerCase()));
    const mc=cat==="Alle"||ex.cat===cat;
    const ml=level==="Alle Level"||LM[ex.level]===level;
    const mf=!onlyFav||favs.includes(ex.id);
    return ms&&mc&&ml&&mf;
  });

  return(<>
    <div className="hdr">
      <div className="hdr-top"><div className="hdr-logo">FLOWPLAN</div><div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>setOnlyFav(f=>!f)} style={{background:onlyFav?"#C9956B22":"none",border:"none",fontSize:18,cursor:"pointer",borderRadius:8,padding:"4px 8px"}}>{onlyFav?"⭐":"☆"}</button></div></div>
      <div className="hdr-sub">Übungsbibliothek ✦</div>
      <div className="sbar">
        <span style={{color:"#C4B5A5"}}>🔍</span>
        <input className="sinp" placeholder="Übung, Muskel suchen..." value={search} onChange={e=>setSearch(e.target.value)}/>
        {search&&<span style={{cursor:"pointer",color:"#C4B5A5",fontSize:13}} onClick={()=>setSearch("")}>✕</span>}
      </div>
    </div>
    <div className="pg">
      <div className="frow">{CATS.map(c=><div key={c} className={`chip ${cat===c?"on":""}`} onClick={()=>setCat(c)}>{c}</div>)}</div>
      <div className="frow">{LEVELS.map(l=><div key={l} className={`chip ${level===l?"on":""}`} onClick={()=>setLevel(l)}>{l}</div>)}</div>
      <div style={{fontSize:11,color:"#C4B5A5",marginBottom:10}}>{filtered.length} Übungen {onlyFav?"(Favoriten)":""}</div>
      {filtered.length===0?<div className="empty"><div className="empty-icon">🔍</div><div style={{fontSize:13}}>Keine Übungen gefunden</div></div>
        :filtered.map(ex=>(
        <div key={ex.id} className={`exc ${favs.includes(ex.id)?"fav":""}`} onClick={()=>setSel(ex)}>
          <div className="exc-top">
            <div className="exc-name">{ex.name}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              {favs.includes(ex.id)&&<span style={{fontSize:14}}>⭐</span>}
              <span className={`lbadge ${LC[ex.level]}`}>{LM[ex.level]}</span>
            </div>
          </div>
          <div className="catb">{ex.subcat}</div>
          <div className="emeta">
            <span className="etag">⏱ {fmtDur(ex.duration)}</span>
            {ex.box&&<span className="etag">📦 Box</span>}
            {ex.prenatal&&<span className="etag" style={{color:"#7A9E7E"}}>🤰</span>}
            {ex.postnatal&&<span className="etag" style={{color:"#C9956B"}}>👶</span>}
            {ex.videoUrl&&<span className="etag" style={{color:"#7090C0"}}>🎬 Video</span>}
          </div>
          <Springs springs={ex.springs}/>
        </div>
      ))}
    </div>
    {sel&&<ExModal ex={sel} onClose={()=>setSel(null)} onAdd={null} onFav={onFav} isFav={favs.includes(sel.id)}/>}
  </>);
}

// ─── EXERCISE PICKER ──────────────────────────────────────────────────────────
function ExPicker({exercises,onAdd,onClose}){
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("Alle");
  const filtered=exercises.filter(ex=>{
    const ms=!search||ex.name.toLowerCase().includes(search.toLowerCase())||ex.subcat.toLowerCase().includes(search.toLowerCase());
    return ms&&(cat==="Alle"||ex.cat===cat);
  });
  return(
    <div className="overlay" onClick={onClose}>
      <div className="picker-modal" onClick={e=>e.stopPropagation()}>
        <div className="picker-hdr">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#4A3728"}}>Übung wählen</div>
            <button onClick={onClose} style={{background:"#E8DDD0",border:"none",borderRadius:"50%",width:29,height:29,cursor:"pointer",fontSize:13}}>✕</button>
          </div>
          <div className="sbar" style={{marginTop:0}}>
            <span style={{color:"#C4B5A5"}}>🔍</span>
            <input className="sinp" placeholder="Suchen..." value={search} onChange={e=>setSearch(e.target.value)} autoFocus/>
          </div>
          <div className="frow" style={{marginTop:8}}>{CATS.map(c=><div key={c} className={`chip ${cat===c?"on":""}`} onClick={()=>setCat(c)}>{c}</div>)}</div>
        </div>
        <div className="picker-list">
          {filtered.map(ex=>(
            <div key={ex.id} className="exc" onClick={()=>{onAdd(ex);onClose();}}>
              <div className="exc-top"><div className="exc-name">{ex.name}</div><span className={`lbadge ${LC[ex.level]}`}>{LM[ex.level]}</span></div>
              <div className="catb">{ex.subcat}</div>
              <div className="emeta"><span className="etag">⏱ {fmtDur(ex.duration)}</span>{ex.box&&<span className="etag">📦</span>}</div>
              <Springs springs={ex.springs}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PLAN BUILDER ─────────────────────────────────────────────────────────────
function PlanBuilder({exercises,initial,onSave,onCancel}){
  const [name,setName]=useState(initial?.name||"");
  const [items,setItems]=useState(initial?.items?.map(i=>({...i,uid:Math.random()}))||[]);
  const [picker,setPicker]=useState(false);
  const addEx=(ex)=>setItems(it=>[...it,{exId:ex.id,dur:ex.duration,uid:Math.random()}]);
  const remove=(uid)=>setItems(it=>it.filter(i=>i.uid!==uid));
  const adjDur=(uid,d)=>setItems(it=>it.map(i=>i.uid===uid?{...i,dur:Math.max(15,i.dur+d)}:i));
  const move=(idx,dir)=>setItems(it=>{const a=[...it];const t=idx+dir;if(t<0||t>=a.length)return a;[a[idx],a[t]]=[a[t],a[idx]];return a;});
  const canSave=name.trim()&&items.length>0;
  return(
    <div style={{minHeight:"100vh",background:"#FAF7F2"}}>
      <div className="hdr">
        <div className="hdr-top">
          <button onClick={onCancel} style={{background:"#E8DDD0",border:"none",borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:13,color:"#4A3728"}}>← Zurück</button>
          <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#C9956B"}}>{initial?"Bearbeiten":"Neuer Plan"}</div>
        </div>
      </div>
      <div className="pg">
        <input className="ifield" style={{fontFamily:"Cormorant Garamond,serif",fontSize:22,marginBottom:16}} placeholder="Plan benennen..." value={name} onChange={e=>setName(e.target.value)}/>
        {items.length>0&&(
          <div className="tbar">
            <span style={{fontSize:11,color:"#C4B5A580",letterSpacing:1,textTransform:"uppercase"}}>Gesamtdauer</span>
            <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#FAF7F2"}}>{totalMin(items)} Min · {items.length} Übungen</span>
          </div>
        )}
        {items.length===0&&<div className="empty"><div className="empty-icon">✦</div><div style={{fontSize:13}}>Noch keine Übungen</div></div>}
        {items.map((item,idx)=>{
          const ex=exercises.find(e=>e.id===item.exId);
          if(!ex) return null;
          return(
            <div key={item.uid} className="pitem">
              <div style={{display:"flex",flexDirection:"column",gap:1}}>
                <button onClick={()=>move(idx,-1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:idx===0?"#E8DDD0":"#C4B5A5",padding:"1px 3px"}}>▲</button>
                <button onClick={()=>move(idx,1)} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:idx===items.length-1?"#E8DDD0":"#C4B5A5",padding:"1px 3px"}}>▼</button>
              </div>
              <div className="pnum">{idx+1}</div>
              <div className="pinfo">
                <div className="pname">{ex.name}</div>
                <div className="pmeta">{ex.subcat} · {ex.springs.join("+")}</div>
              </div>
              <div className="drow">
                <button className="dbtn" onClick={()=>adjDur(item.uid,-15)}>−</button>
                <span className="dval">{fmtDur(item.dur)}</span>
                <button className="dbtn" onClick={()=>adjDur(item.uid,15)}>+</button>
              </div>
              <button className="rmv" onClick={()=>remove(item.uid)}>✕</button>
            </div>
          );
        })}
        <button className="addbtn" onClick={()=>setPicker(true)}>+ Übung hinzufügen</button>
        <button className="savbtn" disabled={!canSave} onClick={()=>onSave({name:name.trim(),items:items.map(i=>({exId:i.exId,dur:i.dur}))})}>
          {canSave?`„${name}" speichern →`:"Name + Übungen eingeben"}
        </button>
      </div>
      {picker&&<ExPicker exercises={exercises} onAdd={addEx} onClose={()=>setPicker(false)}/>}
    </div>
  );
}

// ─── TIMER ────────────────────────────────────────────────────────────────────
function TimerScreen({program,exercises,onBack,onComplete}){
  const items=program.items.map(i=>({...i,ex:exercises.find(e=>e.id===i.exId)})).filter(i=>i.ex);
  const [idx,setIdx]=useState(0);
  const [left,setLeft]=useState(items[0]?.dur||60);
  const [running,setRunning]=useState(true);
  const [done,setDone]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(running&&!done){
      ref.current=setInterval(()=>{
        setLeft(t=>{
          if(t<=1){const nx=idx+1;if(nx<items.length){setIdx(nx);return items[nx].dur;}else{setRunning(false);setDone(true);clearInterval(ref.current);onComplete&&onComplete(program.name);return 0;}}
          return t-1;
        });
      },1000);
    }
    return()=>clearInterval(ref.current);
  },[running,idx,done]);
  const cur=items[idx];const nxt=items[idx+1];
  const prog=cur?((cur.dur-left)/cur.dur)*360:0;
  if(done)return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,background:"#FAF7F2"}}>
      <div style={{fontSize:56,marginBottom:14}}>🎉</div>
      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:34,color:"#4A3728",marginBottom:6}}>Geschafft!</div>
      <div style={{fontSize:13,color:"#7A6858",marginBottom:28}}>{program.name} · {items.length} Übungen absolviert</div>
      <button className="btn" style={{maxWidth:240}} onClick={onBack}>← Zurück zu Programmen</button>
    </div>
  );
  return(<>
    <div className="hdr">
      <div className="hdr-top">
        <button onClick={onBack} style={{background:"#E8DDD0",border:"none",borderRadius:8,padding:"7px 13px",cursor:"pointer",fontSize:13}}>✕ Abbrechen</button>
        <div style={{fontSize:12,color:"#7A6858"}}>{idx+1}/{items.length}</div>
      </div>
      <div style={{marginTop:10,height:3,background:"#E8DDD0",borderRadius:2}}>
        <div style={{height:"100%",background:"#C9956B",borderRadius:2,width:`${(idx/items.length)*100}%`,transition:"width 0.5s"}}/>
      </div>
    </div>
    <div className="tscreen">
      {cur&&<>
        <div className="tex">{cur.ex.name}</div>
        {nxt?<div className="tnext">Nächste: {nxt.ex.name}</div>:<div className="tnext">Letzte Übung 🌿</div>}
        <div className="tring" style={{background:`conic-gradient(#C9956B ${prog}deg,#E8DDD0 0deg)`}}>
          <div className="tinner">
            <div className="ttime">{Math.floor(left/60)}:{String(left%60).padStart(2,"0")}</div>
            <div className="tlbl">verbleibend</div>
          </div>
        </div>
        <div style={{marginBottom:24}}><Springs springs={cur.ex.springs}/></div>
        <div className="tctrl">
          <button className="tbtn tbs" onClick={()=>setRunning(r=>!r)}>{running?"⏸ Pause":"▶ Weiter"}</button>
          <button className="tbtn tbp" onClick={()=>{const nx=idx+1;if(nx<items.length){setIdx(nx);setLeft(items[nx].dur);}else{setDone(true);setRunning(false);onComplete&&onComplete(program.name);}}}>Nächste →</button>
        </div>
      </>}
    </div>
  </>);
}

// ─── PROGRAMMES ───────────────────────────────────────────────────────────────
function ProgramsScreen({exercises,user,showToast}){
  const [customs,setCustoms]=useState(()=>{try{return JSON.parse(localStorage.getItem("fp_customs")||"[]");}catch{return[];}});
  const [building,setBuilding]=useState(false);
  const [editing,setEditing]=useState(null);
  const [timer,setTimer]=useState(null);
  const [log,setLog]=useState(()=>{try{return JSON.parse(localStorage.getItem("fp_log")||"[]");}catch{return[];}});

  const saveCustoms=(c)=>{setCustoms(c);try{localStorage.setItem("fp_customs",JSON.stringify(c));}catch{}};
  const saveLog=(l)=>{setLog(l);try{localStorage.setItem("fp_log",JSON.stringify(l));}catch{}};

  const saveCustom=(data)=>{
    const updated=editing?customs.map(c=>c.id===editing.id?{...c,...data}:c):[...customs,{id:"c"+Date.now(),...data,variant:"purple",tags:["Eigener Plan"]}];
    saveCustoms(updated);
    showToast(`„${data.name}" gespeichert ✓`);
    setBuilding(false);setEditing(null);
  };
  const onComplete=(name)=>{
    const entry={id:Date.now(),name,date:new Date().toLocaleDateString("de-CH"),time:new Date().toLocaleTimeString("de-CH",{hour:"2-digit",minute:"2-digit"})};
    saveLog([entry,...log].slice(0,20));
  };

  if(timer)return<TimerScreen program={timer} exercises={exercises} onBack={()=>setTimer(null)} onComplete={onComplete}/>;
  if(building||editing)return<PlanBuilder exercises={exercises} initial={editing} onSave={saveCustom} onCancel={()=>{setBuilding(false);setEditing(null);}}/>;

  return(<>
    <div className="hdr">
      <div className="hdr-top"><div className="hdr-logo">FLOWPLAN</div><div className="avatar">{user?.email?.[0]?.toUpperCase()||"T"}</div></div>
      <div className="hdr-sub">Programme & Planung ✦</div>
    </div>
    <div className="pg">
      {customs.length>0&&<>
        <div className="ptitle">Eigene Pläne</div>
        <div className="psub">Von dir erstellt</div>
        {customs.map(p=>(
          <div key={p.id} className="pcard" style={{...(Object.fromEntries((CARD_STYLES[p.variant]||CARD_STYLES.dark).split(";").filter(Boolean).map(s=>{const[k,v]=s.split(":");return[k.trim().replace(/-([a-z])/g,(_,l)=>l.toUpperCase()),v?.trim()];}).filter(([k])=>k)))}}>
            <div className="pcard-title">{p.name}</div>
            <div className="pcard-meta">{totalMin(p.items)} Min · {p.items.length} Übungen</div>
            <div className="ptags">{p.tags.map(t=><span key={t} className="ptag">{t}</span>)}</div>
            <div className="pbtns">
              <button className="pbtn" onClick={()=>setTimer(p)}>▶ Starten</button>
              <button className="pbtn" onClick={()=>setEditing(p)}>✏ Bearbeiten</button>
              <button className="pbtn del" onClick={()=>saveCustoms(customs.filter(c=>c.id!==p.id))}>🗑</button>
            </div>
          </div>
        ))}
        <div className="divider"/>
      </>}
      <div className="ptitle">Fertige Programme</div>
      <div className="psub">Bereit zum Starten · tippe zum Kopieren & Anpassen</div>
      {PRESET_PROGRAMS.map(p=>(
        <div key={p.id} className="pcard" style={{...(Object.fromEntries((CARD_STYLES[p.variant]||CARD_STYLES.dark).split(";").filter(Boolean).map(s=>{const[k,v]=s.split(":");return[k.trim().replace(/-([a-z])/g,(_,l)=>l.toUpperCase()),v?.trim()];}).filter(([k])=>k)))}}>
          <div className="pcard-title">{p.name}</div>
          <div className="pcard-meta">{totalMin(p.items)} Min · {p.items.length} Übungen</div>
          <div className="ptags">{p.tags.map(t=><span key={t} className="ptag">{t}</span>)}</div>
          <div className="pbtns">
            <button className="pbtn" onClick={()=>setTimer(p)}>▶ Starten</button>
            <button className="pbtn" onClick={()=>setEditing({...p,id:undefined,variant:"purple",tags:["Eigener Plan"]})}>📋 Kopieren</button>
          </div>
        </div>
      ))}
      {log.length>0&&<><div className="divider"/>
        <div className="ptitle">Verlauf</div>
        <div className="psub">Zuletzt durchgeführte Stunden</div>
        {log.slice(0,5).map(l=><div key={l.id} className="note-card"><div className="note-date">{l.date} · {l.time}</div><div className="note-text">✦ {l.name}</div></div>)}
      </>}
    </div>
    <button style={{position:"fixed",bottom:88,right:"calc(50% - 215px + 14px)",width:50,height:50,background:"#4A3728",color:"#FAF7F2",borderRadius:"50%",border:"none",fontSize:22,cursor:"pointer",boxShadow:"0 4px 18px #8B735540",zIndex:99,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setBuilding(true)}>+</button>
  </>);
}

// ─── AI ───────────────────────────────────────────────────────────────────────
function AIScreen({exercises}){
  const [msgs,setMsgs]=useState([{role:"bot",text:"Hallo! 🌿 Ich bin dein KI-Assistent für Reformer Pilates.\n\nBeschreib mir deine Stunde – Zielgruppe, Dauer, Fokus – und ich stelle dir ein individuelles Programm aus der Bibliothek zusammen."}]);
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollTo(0,ref.current.scrollHeight);},[msgs]);
  const send=async(t)=>{
    const msg=t||inp;if(!msg.trim())return;
    setInp("");setMsgs(m=>[...m,{role:"user",text:msg}]);setLoading(true);
    try{
      const exList=exercises.map(e=>`- ${e.name} (${e.cat}, ${LM[e.level]}, Federn:${e.springs.join("+")}, ${e.duration}s${e.box?" Box":""}${e.prenatal?" Prenatal":""}${e.postnatal?" Postnatal":""})`).join("\n");
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:`Du bist ein erfahrener Reformer Pilates Experte und Trainer. Hilf beim Stundenplanen.\nÜbungsbibliothek:\n${exList}\n\nAntworte auf Deutsch, strukturiert und praxisnah. Bei Programmen: liste Übungen mit Dauer und Federeinstellung auf. Beachte: kein Bauchlage bei Prenatal, sanftere Federn für Anfänger, Aufwärmen am Anfang, Dehnung am Ende.`,messages:[{role:"user",content:msg}]})});
      const data=await res.json();
      setMsgs(m=>[...m,{role:"bot",text:data.content?.map(c=>c.text||"").join("")||"Fehler"}]);
    }catch{setMsgs(m=>[...m,{role:"bot",text:"Verbindungsfehler. Bitte erneut versuchen."}]);}
    setLoading(false);
  };
  const suggs=["50-min Prenatal Programm, Anfänger","Full Body, Fortgeschrittene, 45 Min","Oberkörper ohne Box, 30 Min","Postnatal Core-Aufbau, 35 Min","Was sind die besten Aufwärmübungen?"];
  return(<>
    <div className="hdr">
      <div className="hdr-top"><div className="hdr-logo">FLOWPLAN</div><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#C9956B"}}>KI Assistent</div></div>
    </div>
    <div ref={ref} className="achat">
      {msgs.map((m,i)=><div key={i} className={`amsg ${m.role}`}>{m.text}</div>)}
      {loading&&<div className="amsg bot"><div className="ldots"><div className="ldot"/><div className="ldot"/><div className="ldot"/></div></div>}
      {msgs.length===1&&<div style={{display:"flex",flexDirection:"column",gap:7,marginTop:4}}>{suggs.map((s,i)=><button key={i} className="asugg" onClick={()=>send(s)}>{s}</button>)}</div>}
    </div>
    <div className="abar">
      <input className="ainp" placeholder="Programm beschreiben..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
      <button className="asend" onClick={()=>send()}>→</button>
    </div>
  </>);
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminScreen({exercises,onExercisesChange,showToast}){
  const [tab,setTab]=useState("upload");
  const [editEx,setEditEx]=useState(null);
  const [uploading,setUploading]=useState(false);
  const fileRef=useRef(null);

  const handleVideoUpload=async(file)=>{
    if(!file)return;
    setUploading(true);
    const newEx={
      id:"custom_"+Date.now(),
      name:file.name.replace(/\.[^.]+$/,"").replace(/_/g," "),
      cat:"Unterkörper",subcat:"Beine & Gesäß",muscle:"",level:"beginner",
      springs:["red"],duration:90,box:false,prenatal:false,postnatal:false,
      desc:"",progr:"",regr:"",
      videoUrl:URL.createObjectURL(file),
      isCustom:true,
    };
    onExercisesChange([...exercises,newEx]);
    setEditEx(newEx);
    setTab("edit");
    showToast("Video hochgeladen – jetzt bearbeiten ✓");
    setUploading(false);
  };

  const saveEdit=(updated)=>{
    onExercisesChange(exercises.map(e=>e.id===updated.id?updated:e));
    setEditEx(null);
    showToast(`„${updated.name}" gespeichert ✓`);
  };

  const deleteEx=(id)=>{
    onExercisesChange(exercises.filter(e=>e.id!==id));
    showToast("Übung gelöscht");
  };

  return(<>
    <div className="hdr">
      <div className="hdr-top"><div className="hdr-logo">FLOWPLAN</div><div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#C9956B"}}>Admin</div></div>
      <div className="frow" style={{marginTop:10}}>
        {["upload","library","stats"].map(t=><div key={t} className={`chip ${tab===t?"on":""}`} onClick={()=>{setTab(t);setEditEx(null);}}>{t==="upload"?"📤 Upload":t==="library"?"📚 Bibliothek":"📊 Stats"}</div>)}
      </div>
    </div>
    <div className="pg">

      {tab==="upload"&&<>
        <div className="ptitle">Video Upload</div>
        <div className="psub">Lade eine Übung hoch und bearbeite sie danach</div>
        <div className="upload-area" onClick={()=>fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="video/*" style={{display:"none"}} onChange={e=>handleVideoUpload(e.target.files[0])}/>
          <div className="upload-icon">{uploading?"⏳":"📤"}</div>
          <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#4A3728",marginBottom:4}}>{uploading?"Wird hochgeladen...":"Video hochladen"}</div>
          <div className="upload-text">MP4, MOV · Tippe hier zum Auswählen</div>
        </div>
        <div style={{marginTop:20,padding:"14px 16px",background:"#FFF",borderRadius:12,border:"1px solid #E8DDD0"}}>
          <div style={{fontSize:12,fontWeight:500,color:"#4A3728",marginBottom:8}}>So funktioniert es:</div>
          <div style={{fontSize:12,color:"#7A6858",lineHeight:1.8}}>
            1. Video auswählen<br/>
            2. Name, Kategorie, Federn etc. bearbeiten<br/>
            3. Speichern – Übung erscheint sofort in der Bibliothek
          </div>
        </div>
      </>}

      {tab==="library"&&<>
        <div className="ptitle">Übungen verwalten</div>
        <div className="psub">{exercises.length} Übungen total · {exercises.filter(e=>e.isCustom).length} eigene</div>
        {editEx?<ExerciseEditForm ex={editEx} onSave={saveEdit} onCancel={()=>setEditEx(null)}/>
          :exercises.map(ex=>(
          <div key={ex.id} className="exc">
            <div className="exc-top">
              <div className="exc-name">{ex.name}</div>
              <div style={{display:"flex",gap:6}}>
                {ex.isCustom&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:"#C9956B22",color:"#C9956B"}}>Eigene</span>}
                <button onClick={()=>setEditEx({...ex})} style={{background:"#F2EDE4",border:"none",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:12,color:"#4A3728"}}>✏</button>
                {ex.isCustom&&<button onClick={()=>deleteEx(ex.id)} style={{background:"#FFE8E8",border:"none",borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:12,color:"#E07070"}}>🗑</button>}
              </div>
            </div>
            <div className="catb">{ex.subcat}</div>
            <div className="emeta"><span className="etag">{LM[ex.level]}</span>{ex.videoUrl&&<span className="etag" style={{color:"#7090C0"}}>🎬 Video</span>}</div>
            <Springs springs={ex.springs}/>
          </div>
        ))}
      </>}

      {tab==="stats"&&<>
        <div className="ptitle">Statistiken</div>
        <div className="psub">Übersicht der Bibliothek</div>
        <div className="prof-card">
          <div className="stat-row">
            <div className="stat"><div className="stat-val">{exercises.length}</div><div className="stat-lbl">Übungen</div></div>
            <div className="stat"><div className="stat-val">{exercises.filter(e=>e.videoUrl).length}</div><div className="stat-lbl">Mit Video</div></div>
            <div className="stat"><div className="stat-val">{exercises.filter(e=>e.prenatal).length}</div><div className="stat-lbl">Prenatal</div></div>
          </div>
        </div>
        {CATS.filter(c=>c!=="Alle").map(cat=>(
          <div key={cat} style={{background:"#FFF",borderRadius:12,padding:"13px 15px",marginBottom:8,border:"1px solid #E8DDD0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,color:"#2C1F14"}}>{cat}</span>
            <span style={{fontSize:13,color:"#7A6858"}}>{exercises.filter(e=>e.cat===cat).length} Übungen</span>
          </div>
        ))}
      </>}
    </div>
  </>);
}

// ─── EXERCISE EDIT FORM ───────────────────────────────────────────────────────
function ExerciseEditForm({ex,onSave,onCancel}){
  const [d,setD]=useState({...ex});
  const toggleSpring=(s)=>setD(x=>({...x,springs:x.springs.includes(s)?x.springs.filter(i=>i!==s):[...x.springs,s]}));
  const f=(k,v)=>setD(x=>({...x,[k]:v}));
  return(
    <div style={{background:"#FFF",borderRadius:14,padding:18,border:"1px solid #E8DDD0",marginBottom:14}}>
      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,color:"#4A3728",marginBottom:14}}>Übung bearbeiten</div>
      {d.videoUrl&&<div style={{marginBottom:12}}><video src={d.videoUrl} controls style={{width:"100%",borderRadius:10,maxHeight:160,objectFit:"cover"}}/></div>}
      <div className="edit-form">
        <div><div className="msec-t">Name</div><input className="ifield" style={{marginBottom:0}} value={d.name} onChange={e=>f("name",e.target.value)} placeholder="Übungsname"/></div>
        <div className="erow">
          <div style={{flex:1}}><div className="msec-t">Kategorie</div>
            <select className="ifield" style={{marginBottom:0}} value={d.cat} onChange={e=>f("cat",e.target.value)}>
              {CATS.filter(c=>c!=="Alle").map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{flex:1}}><div className="msec-t">Level</div>
            <select className="ifield" style={{marginBottom:0}} value={d.level} onChange={e=>f("level",e.target.value)}>
              <option value="beginner">Anfänger</option><option value="intermediate">Mittel</option><option value="advanced">Fortgeschritten</option>
            </select>
          </div>
        </div>
        <div><div className="msec-t">Unterkategorie</div><input className="ifield" style={{marginBottom:0}} value={d.subcat||""} onChange={e=>f("subcat",e.target.value)} placeholder="z.B. Beine & Gesäß"/></div>
        <div><div className="msec-t">Muskelgruppen</div><input className="ifield" style={{marginBottom:0}} value={d.muscle||""} onChange={e=>f("muscle",e.target.value)} placeholder="z.B. Quadrizeps, Gesäß"/></div>
        <div><div className="msec-t">Federn</div>
          <div className="tag-row">
            {SPRING_OPTS.map(s=><div key={s} className={`tag-opt ${d.springs.includes(s)?"on":""}`} style={d.springs.includes(s)?{background:SC[s],borderColor:SC[s],color:"#FFF"}:{}} onClick={()=>toggleSpring(s)}>{s}</div>)}
          </div>
        </div>
        <div><div className="msec-t">Dauer (Sekunden)</div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <input type="range" min={15} max={300} step={15} value={d.duration} onChange={e=>f("duration",+e.target.value)} style={{flex:1,accentColor:"#C9956B"}}/>
            <span style={{fontSize:14,color:"#4A3728",minWidth:50}}>{fmtDur(d.duration)}</span>
          </div>
        </div>
        <div><div className="msec-t">Beschreibung</div><textarea className="ifield" style={{marginBottom:0,resize:"vertical",minHeight:70}} value={d.desc||""} onChange={e=>f("desc",e.target.value)} placeholder="Kurze Beschreibung der Übung..."/></div>
        <div className="erow">
          <div style={{flex:1}}><div className="msec-t">Progression</div><input className="ifield" style={{marginBottom:0}} value={d.progr||""} onChange={e=>f("progr",e.target.value)} placeholder="Schwerer..."/></div>
          <div style={{flex:1}}><div className="msec-t">Regression</div><input className="ifield" style={{marginBottom:0}} value={d.regr||""} onChange={e=>f("regr",e.target.value)} placeholder="Leichter..."/></div>
        </div>
        <div><div className="msec-t">Spezial</div>
          <div className="tag-row">
            {[["box","📦 Box"],["prenatal","🤰 Prenatal"],["postnatal","👶 Postnatal"]].map(([k,l])=>(
              <div key={k} className={`tag-opt ${d[k]?"on":""}`} onClick={()=>f(k,!d[k])}>{l}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:16}}>
        <button className="btn accent sm" onClick={()=>onSave(d)}>Speichern ✓</button>
        <button className="btn outline sm" onClick={onCancel}>Abbrechen</button>
      </div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────
function ProfileScreen({user,onLogout}){
  const log=JSON.parse(localStorage.getItem("fp_log")||"[]");
  const customs=JSON.parse(localStorage.getItem("fp_customs")||"[]");
  return(<>
    <div className="hdr">
      <div className="hdr-top"><div className="hdr-logo">FLOWPLAN</div><div className={`avatar ${user.isAdmin?"admin":""}`}>{user.email?.[0]?.toUpperCase()||"T"}</div></div>
    </div>
    <div className="pg">
      <div className="prof-card">
        <div className="prof-name">{user.isAdmin?"Super Admin":"Trainer"}</div>
        <div className="prof-email">{user.email}</div>
        {user.isAdmin&&<div style={{fontSize:11,padding:"4px 10px",borderRadius:8,background:"#C9956B22",color:"#C9956B",display:"inline-block",marginBottom:12}}>⚙️ Admin-Zugang</div>}
        <div className="stat-row">
          <div className="stat"><div className="stat-val">{customs.length}</div><div className="stat-lbl">Eigene Pläne</div></div>
          <div className="stat"><div className="stat-val">{log.length}</div><div className="stat-lbl">Stunden</div></div>
        </div>
      </div>
      {log.length>0&&<>
        <div className="ptitle">Letzten Stunden</div>
        <div className="psub">Dein Trainingsprotokoll</div>
        {log.slice(0,8).map(l=>(
          <div key={l.id} className="note-card">
            <div className="note-date">📅 {l.date} · {l.time}</div>
            <div className="note-text">✦ {l.name}</div>
          </div>
        ))}
      </>}
      <div className="divider"/>
      <button className="btn outline" style={{marginTop:8}} onClick={onLogout}>Abmelden</button>
      <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"#C4B5A5",letterSpacing:1}}>FLOWPLAN · Reformer Pilates Planer<br/>Version 2.0</div>
    </div>
  </>);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [tab,setTab]=useState("programs");
  const [exercises,setExercises]=useState(DEFAULT_EXERCISES);
  const [favs,setFavs]=useState(()=>{try{return JSON.parse(localStorage.getItem("fp_favs")||"[]");}catch{return[];}});
  const [toast,setToast]=useState("");

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(""),2600);};
  const toggleFav=(id)=>{const n=favs.includes(id)?favs.filter(f=>f!==id):[...favs,id];setFavs(n);try{localStorage.setItem("fp_favs",JSON.stringify(n));}catch{}};
  const logout=()=>{supabase.auth.signOut();setUser(null);};

  if(!user)return<><style>{styles}</style><div className="app"><LoginScreen onLogin={setUser}/></div></>;

  const tabs=[
    {id:"library",icon:"✦",label:"Bibliothek"},
    {id:"programs",icon:"▦",label:"Programme"},
    {id:"ai",icon:"◈",label:"KI"},
    ...(user.isAdmin?[{id:"admin",icon:"⚙",label:"Admin"}]:[]),
    {id:"profile",icon:"◉",label:"Profil"},
  ];

  return(<><style>{styles}</style>
    <div className="app">
      {toast&&<div className="toast">{toast}</div>}
      {tab==="library"&&<LibraryScreen exercises={exercises} favs={favs} onFav={toggleFav}/>}
      {tab==="programs"&&<ProgramsScreen exercises={exercises} user={user} showToast={showToast}/>}
      {tab==="ai"&&<AIScreen exercises={exercises}/>}
      {tab==="admin"&&user.isAdmin&&<AdminScreen exercises={exercises} onExercisesChange={setExercises} showToast={showToast}/>}
      {tab==="profile"&&<ProfileScreen user={user} onLogout={logout}/>}
      <div className="bnav">{tabs.map(t=><div key={t.id} className={`ni ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}><span className="ni-icon">{t.icon}</span><span className="ni-lbl">{t.label}</span></div>)}</div>
    </div>
  </>);
}
