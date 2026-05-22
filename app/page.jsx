"use client";
import { useState, useRef, useCallback } from "react";

function parseJSON(txt) {
  try {
    const m = txt.match(/```json\s*([\s\S]*?)```/);
    if (m) return JSON.parse(m[1]);
    const d = txt.match(/\{[\s\S]*\}/);
    if (d) return JSON.parse(d[0]);
  } catch {}
  return null;
}

function printPDF(r) {
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${r.name || "Resume"} – ApplyReady</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',sans-serif;color:#0A1628;background:#fff;font-size:10.5pt;line-height:1.55}
.pg{padding:.65in .75in;max-width:8.5in;margin:0 auto}
.name{font-family:'Cormorant Garamond',serif;font-size:22pt;font-weight:700;color:#0A1628}
.titl{font-size:8pt;color:#C49A3C;text-transform:uppercase;letter-spacing:2.5px;font-weight:600;margin:4px 0 8px}
.contact{font-size:8.5pt;color:#4A5568;display:flex;gap:14px;flex-wrap:wrap;padding-bottom:9px;border-bottom:2pt solid #C49A3C;margin-bottom:16px}
.sec{margin-bottom:15px}
.sec-ttl{font-size:7.5pt;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#0A1628;border-bottom:.75pt solid #D8D0C0;padding-bottom:4px;margin-bottom:9px}
.entry{margin-bottom:9px}
.eh{display:flex;justify-content:space-between;align-items:flex-start}
.role{font-size:10.5pt;font-weight:600}
.dates{font-size:8.5pt;color:#7A8BA0}
.org{font-size:10pt;color:#C49A3C;font-weight:500;margin:2px 0 4px}
ul{padding-left:13px}
li{font-size:9.5pt;color:#3D4F6B;margin-bottom:2px}
.summ{font-size:9.5pt;color:#3D4F6B;line-height:1.7}
.skills{display:flex;flex-wrap:wrap;gap:5px}
.sk{background:#F0EDE6;padding:2px 9px;border-radius:3px;font-size:8.5pt}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:0;size:letter}}
</style></head><body><div class="pg">
<div class="name">${r.name||""}</div>
${r.targetTitle?`<div class="titl">${r.targetTitle}</div>`:""}
<div class="contact">${[r.email,r.phone,r.location].filter(Boolean).map(c=>`<span>${c}</span>`).join("")}</div>
${r.summary?`<div class="sec"><div class="sec-ttl">Professional Summary</div><p class="summ">${r.summary}</p></div>`:""}
${r.experience?.length?`<div class="sec"><div class="sec-ttl">Experience</div>${r.experience.map(e=>`<div class="entry"><div class="eh"><span class="role">${e.role}</span><span class="dates">${e.dates}</span></div><div class="org">${e.organization}${e.location?` · ${e.location}`:""}</div><ul>${(e.bullets||[]).map(b=>`<li>${b}</li>`).join("")}</ul></div>`).join("")}</div>`:""}
${r.education?.length?`<div class="sec"><div class="sec-ttl">Education</div>${r.education.map(e=>`<div class="entry"><div class="eh"><span class="role">${e.degree}</span><span class="dates">${e.year||""}</span></div><div class="org">${e.institution}</div></div>`).join("")}</div>`:""}
${r.skills?.length?`<div class="sec"><div class="sec-ttl">Skills &amp; Competencies</div><div class="skills">${r.skills.map(s=>`<span class="sk">${s}</span>`).join("")}</div></div>`:""}
</div><script>window.onload=()=>window.print();<\/script></body></html>`);
  w.document.close();
}

const RESOURCES = [
  { ico:"🏛️", ttl:"USAJobs.gov", txt:"The official federal job board. Search GS positions, set alerts, and upload your optimized resume directly." },
  { ico:"📋", ttl:"Federal Resume Format", txt:"Federal resumes run 3–5 pages. Every bullet needs context: what you did, for whom, with what result, at what scale." },
  { ico:"🎯", ttl:"KSA Language", txt:"Most GS postings score on Knowledge, Skills & Abilities. Mirror the posting's exact language in your bullets and summary." },
  { ico:"⭐", ttl:"Veterans Preference", txt:"If you served, you may qualify for 5-point or 10-point preference on every federal application." },
  { ico:"🏝️", ttl:"Hawaii State Jobs", txt:"ApplyReady works for state civil service too. Visit Hawaii's jobs portal for DOH, DOE, and county openings." },
  { ico:"📊", ttl:"GS Pay Scale 2025", txt:"Most professional roles fall between GS-7 and GS-13. Know your grade before you apply." },
];

const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0A1628;--navy:#0F2549;--navy2:#162D50;
  --gold:#C49A3C;--gold2:#E8C96B;--goldlt:rgba(196,154,60,0.12);
  --cream:#F6F3EC;--parchment:#EDE8DE;--white:#fff;
  --slate:#3D4F6B;--muted:#7A8BA0;--border:#D8D0C0;
  --green:#2D6A4F;--red:#B03A2E;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--cream);color:var(--ink);min-height:100vh;overflow-x:hidden}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,22,40,0.96);backdrop-filter:blur(12px);border-bottom:1px solid rgba(196,154,60,0.25);padding:0 40px;height:64px;display:flex;align-items:center;justify-content:space-between}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer}
.nav-badge-box{width:36px;height:36px;background:var(--gold);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:700;color:var(--ink);font-size:15px;letter-spacing:-1px}
.nav-name{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:#fff;letter-spacing:.5px}
.nav-tag{font-size:10px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;margin-top:1px}
.nav-pill{background:rgba(196,154,60,0.15);border:1px solid rgba(196,154,60,0.4);color:var(--gold);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:5px 14px;border-radius:20px}
.hero{min-height:100vh;background:linear-gradient(160deg,var(--ink) 0%,var(--navy) 55%,#1A3A60 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:120px 24px 80px;position:relative;overflow:hidden}
.hero-orb1{position:absolute;top:-100px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(196,154,60,0.1) 0%,transparent 65%);pointer-events:none}
.hero-orb2{position:absolute;bottom:-80px;left:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(196,154,60,0.07) 0%,transparent 65%);pointer-events:none}
.hero-lines{position:absolute;inset:0;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.015) 0,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 60px);pointer-events:none}
.hero-eye{font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:20px;opacity:0;animation:fadeUp .6s .2s ease forwards}
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(40px,6vw,72px);font-weight:700;color:#fff;line-height:1.1;margin-bottom:20px;opacity:0;animation:fadeUp .6s .4s ease forwards}
.hero-h1 em{color:var(--gold);font-style:normal}
.hero-sub{font-size:clamp(14px,2vw,18px);color:rgba(255,255,255,0.55);max-width:560px;line-height:1.7;font-weight:300;margin-bottom:40px;opacity:0;animation:fadeUp .6s .6s ease forwards}
.hero-cta{display:inline-flex;align-items:center;gap:10px;background:var(--gold);color:var(--ink);font-size:14px;font-weight:600;padding:16px 32px;border-radius:8px;border:none;cursor:pointer;letter-spacing:.5px;opacity:0;animation:fadeUp .6s .8s ease forwards;transition:all .25s}
.hero-cta:hover{background:var(--gold2);transform:translateY(-2px);box-shadow:0 12px 32px rgba(196,154,60,0.3)}
.hero-stats{display:flex;gap:40px;margin-top:64px;opacity:0;animation:fadeUp .6s 1s ease forwards;flex-wrap:wrap;justify-content:center}
.stat-n{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:var(--gold);line-height:1}
.stat-l{font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;margin-top:4px;text-align:center}
.how-bg{background:#fff}
.section{padding:80px 40px;max-width:960px;margin:0 auto}
.sec-eye{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
.sec-h2{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,4vw,42px);font-weight:700;color:var(--ink);line-height:1.2;margin-bottom:8px}
.sec-sub{font-size:15px;color:var(--muted);line-height:1.7;max-width:540px;margin-bottom:40px;font-weight:300}
.steps-row{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.step-card{border:1px solid var(--border);border-radius:16px;padding:28px;position:relative;overflow:hidden;transition:all .3s}
.step-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 16px 40px rgba(10,22,40,0.08)}
.step-card::before{content:attr(data-n);position:absolute;top:-10px;right:16px;font-family:'Cormorant Garamond',serif;font-size:80px;font-weight:700;color:rgba(196,154,60,0.07);line-height:1;pointer-events:none}
.step-ico{width:44px;height:44px;background:var(--goldlt);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px}
.step-ttl{font-size:16px;font-weight:600;color:var(--ink);margin-bottom:8px}
.step-txt{font-size:13px;color:var(--muted);line-height:1.6}
.app-bg{background:var(--parchment)}
.app-wrap{max-width:900px;margin:0 auto;padding:0 40px 80px}
.progress-bar{display:flex;align-items:stretch;background:#fff;border:1px solid var(--border);border-radius:12px;padding:6px;margin-bottom:32px;gap:4px}
.pb-step{flex:1;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;transition:all .3s}
.pb-step.act{background:var(--navy)}
.pb-step.done{background:rgba(45,106,79,0.07)}
.pb-num{width:26px;height:26px;border-radius:50%;background:var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--muted);flex-shrink:0;transition:all .3s}
.pb-step.act .pb-num{background:var(--gold);color:var(--ink)}
.pb-step.done .pb-num{background:var(--green);color:#fff}
.pb-lbl{font-size:12px;font-weight:500;color:var(--muted)}
.pb-step.act .pb-lbl{color:#fff}
.pb-step.done .pb-lbl{color:var(--green)}
.card{background:#fff;border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:20px}
.card-head{padding:18px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
.card-ico{width:38px;height:38px;background:rgba(10,22,40,0.05);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.card-ttl{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink)}
.card-dsc{font-size:11px;color:var(--muted);margin-top:1px}
.card-body{padding:24px}
.dz{border:2px dashed var(--border);border-radius:12px;padding:48px 24px;text-align:center;cursor:pointer;transition:all .3s;background:var(--cream)}
.dz:hover,.dz.over{border-color:var(--gold);background:rgba(196,154,60,0.04)}
.dz.got{border-color:var(--green);background:rgba(45,106,79,0.04);cursor:default}
.dz-ico{font-size:44px;margin-bottom:12px;display:block}
.dz-ttl{font-size:16px;font-weight:600;color:var(--ink);margin-bottom:6px}
.dz-sub{font-size:13px;color:var(--muted)}
.dz-tags{margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.dz-tag{background:var(--parchment);color:var(--slate);font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;border-radius:4px;font-weight:500}
.file-row{display:flex;align-items:center;gap:12px;background:rgba(45,106,79,0.08);border:1px solid rgba(45,106,79,0.25);border-radius:10px;padding:14px 18px;margin-top:16px;text-align:left}
.file-nm{font-size:14px;font-weight:600;color:var(--green)}
.file-sz{font-size:12px;color:var(--muted);margin-top:2px}
.rm-btn{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--muted);font-size:20px;line-height:1;transition:color .2s;padding:2px 6px}
.rm-btn:hover{color:var(--red)}
.fg{margin-bottom:18px}
.fl{display:block;font-size:12px;font-weight:600;color:var(--ink);margin-bottom:7px;letter-spacing:.3px}
.fl span{color:var(--gold);margin-left:4px;font-weight:400}
.fh{font-size:11px;color:var(--muted);margin-top:5px;line-height:1.5}
.fi{width:100%;padding:11px 15px;border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--ink);background:var(--cream);transition:border-color .2s;outline:none}
.fi:focus{border-color:var(--navy);box-shadow:0 0 0 3px rgba(15,37,73,0.07);background:#fff}
.fi::placeholder{color:var(--muted)}
.fi.url{padding-right:44px}
.iw{position:relative}
.iw-ic{position:absolute;right:13px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none}
textarea.fi{resize:vertical;min-height:88px;line-height:1.6}
select.fi{cursor:pointer}
.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.go-btn{width:100%;padding:17px;background:var(--navy);color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;cursor:pointer;letter-spacing:.5px;transition:all .3s;display:flex;align-items:center;justify-content:center;gap:10px;margin-top:4px;position:relative;overflow:hidden}
.go-btn::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--gold);transition:width .4s ease}
.go-btn:hover::after{width:100%}
.go-btn:hover{background:var(--navy2);transform:translateY(-1px);box-shadow:0 10px 28px rgba(10,22,40,0.18)}
.go-btn:disabled{background:var(--muted);cursor:not-allowed;transform:none;box-shadow:none}
.go-btn:disabled::after{display:none}
.loading{text-align:center;padding:56px 32px}
.spin{width:50px;height:50px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .75s linear infinite;margin:0 auto 24px}
@keyframes spin{to{transform:rotate(360deg)}}
.load-ttl{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--ink);margin-bottom:8px}
.load-sub{font-size:13px;color:var(--muted);line-height:1.6;max-width:360px;margin:0 auto}
.load-steps{margin:28px auto 0;display:flex;flex-direction:column;gap:10px;max-width:320px}
.ls{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted);opacity:0;animation:fadeUp .4s ease forwards;text-align:left}
.ls:nth-child(1){animation-delay:.4s}.ls:nth-child(2){animation-delay:1.4s}.ls:nth-child(3){animation-delay:2.6s}.ls:nth-child(4){animation-delay:3.8s}
.ls-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);flex-shrink:0}
.err{background:rgba(176,58,46,0.06);border:1px solid rgba(176,58,46,0.2);border-radius:10px;padding:14px 18px;display:flex;align-items:flex-start;gap:10px;margin-top:14px}
.err-txt{font-size:13px;color:var(--red);line-height:1.5}
.score-row{display:flex;gap:14px;margin-bottom:22px;flex-wrap:wrap}
.sc{flex:1;min-width:140px;background:#fff;border:1px solid var(--border);border-radius:12px;padding:18px;text-align:center}
.sc-n{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:var(--ink);line-height:1;margin-bottom:4px}
.sc-n.hi{color:var(--green)}.sc-n.md{color:var(--gold)}
.sc-l{font-size:10px;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase}
.kw-card{flex:2;min-width:220px;background:#fff;border:1px solid var(--border);border-radius:12px;padding:18px}
.kw-ttl{font-size:12px;font-weight:600;color:var(--ink);margin-bottom:10px}
.kw-chips{display:flex;gap:6px;flex-wrap:wrap}
.kw-chip{background:var(--goldlt);color:var(--ink);font-size:11px;padding:3px 10px;border-radius:4px;border:1px solid rgba(196,154,60,0.3)}
.act-row{display:flex;gap:10px;margin-bottom:22px;flex-wrap:wrap}
.btn-p{padding:12px 22px;background:var(--navy);color:#fff;border:none;border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s}
.btn-p:hover{background:var(--navy2);transform:translateY(-1px)}
.btn-s{padding:12px 22px;background:#fff;color:var(--ink);border:1.5px solid var(--border);border-radius:8px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s}
.btn-s:hover{border-color:var(--navy)}
.resume-shell{background:#fff;border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 6px 32px rgba(10,22,40,0.08)}
.rp-bar{background:var(--navy);padding:13px 20px;display:flex;align-items:center;justify-content:space-between}
.rp-lbl{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--gold)}
.rp-dots{display:flex;gap:6px}
.rp-dot{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.15)}
.resume-body{padding:44px 52px;max-height:640px;overflow-y:auto}
.r-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--ink);margin-bottom:3px}
.r-title{font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
.r-contact{font-size:11px;color:var(--muted);display:flex;gap:16px;flex-wrap:wrap;padding-bottom:14px;border-bottom:2px solid var(--gold);margin-bottom:22px}
.r-sec{margin-bottom:22px}
.r-sec-ttl{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--ink);border-bottom:1px solid var(--border);padding-bottom:5px;margin-bottom:12px}
.r-entry{margin-bottom:12px}
.r-eh{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}
.r-role{font-size:13px;font-weight:600;color:var(--ink)}
.r-dates{font-size:11px;color:var(--muted);white-space:nowrap;margin-left:8px}
.r-org{font-size:12px;color:var(--gold);font-weight:500;margin-bottom:5px}
.r-buls{padding-left:15px}
.r-buls li{font-size:12px;color:var(--slate);margin-bottom:3px;line-height:1.55}
.r-summary{font-size:12px;color:var(--slate);line-height:1.75}
.r-skills{display:flex;flex-wrap:wrap;gap:7px}
.r-skill{background:rgba(10,22,40,0.05);color:var(--ink);font-size:11px;padding:3px 11px;border-radius:4px;border:1px solid rgba(10,22,40,0.09)}
.res-bg{background:#fff}
.res-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.res-card{border:1px solid var(--border);border-radius:14px;padding:24px;transition:all .3s}
.res-card:hover{border-color:var(--gold);transform:translateY(-3px);box-shadow:0 12px 32px rgba(10,22,40,0.07)}
.res-ico{font-size:28px;margin-bottom:12px;display:block}
.res-ttl{font-size:15px;font-weight:600;color:var(--ink);margin-bottom:6px}
.res-txt{font-size:12px;color:var(--muted);line-height:1.6}
.footer{background:var(--ink);padding:40px;text-align:center;border-top:1px solid rgba(196,154,60,0.2)}
.footer-logo{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:#fff;margin-bottom:6px}
.footer-sub{font-size:12px;color:rgba(255,255,255,0.3)}
.footer-sub span{color:var(--gold)}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:640px){
  .nav{padding:0 16px}.hero{padding:100px 20px 60px}
  .section{padding:56px 20px}.app-wrap{padding:0 16px 60px}
  .steps-row{grid-template-columns:1fr}.two{grid-template-columns:1fr}
  .resume-body{padding:24px 20px}.progress-bar{flex-direction:column}
}
`;

export default function ApplyReady() {
  const [step, setStep] = useState(1);
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeTxt, setResumeTxt] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [agency, setAgency] = useState("");
  const [series, setSeries] = useState("");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);
  const [scores, setScores] = useState(null);
  const fileRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.name.match(/\.(pdf|docx|txt)$/i)) { setErr("Upload a PDF, DOCX, or TXT file."); return; }
    setErr(""); setFile(f);
    if (f.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = e => setResumeTxt(e.target.result);
      reader.readAsText(f);
    } else {
      setResumeTxt(`[Uploaded: ${f.name} — ${(f.size/1024).toFixed(0)} KB]`);
    }
  }, []);

  const onDrop = useCallback(e => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const buildPrompt = () => `You are an expert federal resume writer specializing in USAJobs and state civil service applications.

RESUME CONTENT:
${resumeTxt}

TARGET JOB:
${jobUrl ? `Posting URL: ${jobUrl}` : ""}
${jobTitle ? `Title: ${jobTitle}` : ""}
${agency ? `Agency: ${agency}` : ""}
${series ? `GS Series: ${series}` : ""}
${notes ? `Notes: ${notes}` : ""}

INSTRUCTIONS:
- Rewrite and optimize this resume for federal/state government hiring
- Use strong action verbs and quantify all accomplishments
- Apply federal hiring terminology: specialized experience, KSAs, demonstrated proficiency
- If a job URL or title was provided, align bullets tightly to its requirements
- Format for USAJobs compatibility — no tables, no graphics, clear sections
- Summary must address "Specialized Experience" standards
- Estimate job match score (0-100) and ATS compatibility score (0-100)

Respond ONLY with valid JSON, no markdown fences:
{"name":"Candidate Name","targetTitle":"Target Job Title","email":"email@example.com","phone":"(808) 000-0000","location":"City, State","summary":"Optimized federal summary...","experience":[{"role":"Job Title","organization":"Agency/Employer","location":"City, State","dates":"MM/YYYY – Present","bullets":["Action verb + accomplishment + quantified result"]}],"education":[{"degree":"Degree","institution":"School","year":"YYYY"}],"skills":["Skill 1","Skill 2"],"matchScore":88,"atsScore":92,"keywordsAdded":["keyword1","keyword2","keyword3"]}`;

  const optimize = async () => {
    if (!file && !resumeTxt.trim()) { setErr("Upload your resume first."); return; }
    setErr(""); setStep(2);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }]
        })
      });
      const data = await res.json();
      const raw = (data.content || []).map(b => b.text || "").join("");
      const parsed = parseJSON(raw);
      if (parsed) {
        setResult(parsed);
        setScores({ match: parsed.matchScore, ats: parsed.atsScore, kw: parsed.keywordsAdded || [] });
      } else {
        setResult({ name: "Your Name", targetTitle: jobTitle || "Federal Position", email: "", phone: "", location: "", summary: raw.slice(0, 500), experience: [], education: [], skills: [] });
      }
      setStep(3);
    } catch {
      setErr("Something went wrong. Please try again.");
      setStep(1);
    }
  };

  const reset = () => { setStep(1); setFile(null); setResumeTxt(""); setJobUrl(""); setJobTitle(""); setAgency(""); setSeries(""); setNotes(""); setResult(null); setScores(null); setErr(""); };

  return (
    <>
      <style>{G}</style>

      <nav className="nav">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="nav-badge-box">AR</div>
          <div>
            <div className="nav-name">ApplyReady</div>
            <div className="nav-tag">.work</div>
          </div>
        </div>
        <div className="nav-pill">Federal Resume AI</div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-lines" /><div className="hero-orb1" /><div className="hero-orb2" />
        <div className="hero-eye">Federal · State · Civil Service</div>
        <h1 className="hero-h1">Your Resume,<br /><em>Ready to Apply</em></h1>
        <p className="hero-sub">Upload your resume, paste a USAJobs posting, and get an AI-optimized federal resume — formatted and ready to upload in minutes.</p>
        <button className="hero-cta" onClick={() => document.getElementById("app")?.scrollIntoView({ behavior: "smooth" })}>
          ✦ Start Optimizing Free
        </button>
        <div className="hero-stats">
          {[["3–5×","Longer Fed Resumes"],["USAJobs","Compatible Output"],["KSA","Aligned Language"],["PDF","Ready to Upload"]].map(([n,l],i) => (
            <div key={i}><div className="stat-n">{n}</div><div className="stat-l">{l}</div></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="how-bg">
        <div className="section">
          <div className="sec-eye">Simple Process</div>
          <h2 className="sec-h2">Three Steps to Your Federal Resume</h2>
          <p className="sec-sub">AI does the heavy lifting — you review and download.</p>
          <div className="steps-row">
            {[
              { n:"01", ico:"📄", ttl:"Upload Your Resume", txt:"Drag and drop your current resume in PDF, Word, or text format. Any version works — even a rough draft." },
              { n:"02", ico:"🔗", ttl:"Paste a Job Posting", txt:"Copy the URL from USAJobs or any state jobs site. AI reads the requirements and tailors your resume to match." },
              { n:"03", ico:"⬇️", ttl:"Download Your PDF", txt:"Get a clean, professionally formatted federal resume — optimized for ATS and ready to upload directly." },
            ].map(s => (
              <div key={s.n} className="step-card" data-n={s.n}>
                <div className="step-ico">{s.ico}</div>
                <div className="step-ttl">{s.ttl}</div>
                <div className="step-txt">{s.txt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* APP */}
      <div className="app-bg" id="app">
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="sec-eye">Resume Optimizer</div>
          <h2 className="sec-h2">Optimize Your Resume Now</h2>
          <p className="sec-sub">Free. No account required. AI-powered federal resume optimization in under two minutes.</p>
        </div>
        <div className="app-wrap">
          <div className="progress-bar">
            {[{n:1,l:"Upload & Configure"},{n:2,l:"AI Processing"},{n:3,l:"Download PDF"}].map(s => (
              <div key={s.n} className={`pb-step ${step===s.n?"act":step>s.n?"done":""}`}>
                <div className="pb-num">{step>s.n?"✓":s.n}</div>
                <div className="pb-lbl">{s.l}</div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="card">
                <div className="card-head"><div className="card-ico">📄</div><div><div className="card-ttl">Upload Your Resume</div><div className="card-dsc">PDF, Word, or plain text</div></div></div>
                <div className="card-body">
                  <div className={`dz ${drag?"over":""} ${file?"got":""}`} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>!file&&fileRef.current?.click()}>
                    <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
                    {!file ? (
                      <><span className="dz-ico">📂</span><div className="dz-ttl">Drop your resume here</div><div className="dz-sub">or click to browse</div><div className="dz-tags"><span className="dz-tag">PDF</span><span className="dz-tag">DOCX</span><span className="dz-tag">TXT</span></div></>
                    ) : (
                      <div className="file-row"><span style={{fontSize:24}}>✅</span><div><div className="file-nm">{file.name}</div><div className="file-sz">{(file.size/1024).toFixed(1)} KB · Ready</div></div><button className="rm-btn" onClick={e=>{e.stopPropagation();setFile(null);setResumeTxt("")}}>×</button></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head"><div className="card-ico">🎯</div><div><div className="card-ttl">Target Job Details</div><div className="card-dsc">Paste a posting URL to tailor your resume to that specific role</div></div></div>
                <div className="card-body">
                  <div className="fg">
                    <label className="fl">Job Posting URL <span>— USAJobs, State, or any posting</span></label>
                    <div className="iw"><input className="fi url" type="url" placeholder="https://www.usajobs.gov/job/..." value={jobUrl} onChange={e=>setJobUrl(e.target.value)} /><span className="iw-ic">🔗</span></div>
                    <div className="fh">AI reads this posting and aligns your resume to its exact requirements and keywords</div>
                  </div>
                  <div className="two">
                    <div className="fg"><label className="fl">Job Title</label><input className="fi" type="text" placeholder="e.g. HR Specialist" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} /></div>
                    <div className="fg"><label className="fl">Agency / Department</label><input className="fi" type="text" placeholder="e.g. Dept. of Veterans Affairs" value={agency} onChange={e=>setAgency(e.target.value)} /></div>
                  </div>
                  <div className="fg">
                    <label className="fl">GS Series / Job Code <span>— Optional</span></label>
                    <input className="fi" type="text" placeholder="e.g. GS-0201 or 0343" value={series} onChange={e=>setSeries(e.target.value)} />
                    <div className="fh">Helps target specialized experience language for that pay series</div>
                  </div>
                  <div className="fg">
                    <label className="fl">Additional Notes <span>— Optional</span></label>
                    <textarea className="fi" placeholder="Certifications, clearances, veteran preference, skills to highlight..." value={notes} onChange={e=>setNotes(e.target.value)} />
                  </div>
                </div>
              </div>

              {err && <div className="err"><span>⚠️</span><div className="err-txt">{err}</div></div>}
              <button className="go-btn" onClick={optimize} disabled={!file && !resumeTxt.trim()}>✦ Optimize My Resume</button>
            </>
          )}

          {step === 2 && (
            <div className="card"><div className="card-body"><div className="loading">
              <div className="spin" />
              <div className="load-ttl">Optimizing Your Resume</div>
              <div className="load-sub">AI is analyzing your background and aligning it to federal hiring standards.</div>
              <div className="load-steps">
                <div className="ls"><div className="ls-dot"/>Parsing resume content and structure</div>
                <div className="ls"><div className="ls-dot"/>{jobUrl?"Analyzing job posting requirements":"Applying federal resume standards"}</div>
                <div className="ls"><div className="ls-dot"/>Rewriting with KSA language and action verbs</div>
                <div className="ls"><div className="ls-dot"/>Formatting for USAJobs compatibility</div>
              </div>
            </div></div></div>
          )}

          {step === 3 && result && (
            <>
              {scores && (
                <div className="score-row">
                  {scores.match && <div className="sc"><div className={`sc-n ${scores.match>=80?"hi":"md"}`}>{scores.match}%</div><div className="sc-l">Job Match</div></div>}
                  {scores.ats && <div className="sc"><div className={`sc-n ${scores.ats>=80?"hi":"md"}`}>{scores.ats}%</div><div className="sc-l">ATS Score</div></div>}
                  {scores.kw?.length > 0 && <div className="kw-card"><div className="kw-ttl">Keywords Added</div><div className="kw-chips">{scores.kw.slice(0,7).map((k,i)=><span key={i} className="kw-chip">{k}</span>)}</div></div>}
                </div>
              )}
              <div className="act-row">
                <button className="btn-p" onClick={()=>printPDF(result)}>📥 Download PDF</button>
                <button className="btn-s" onClick={reset}>↩ Start Over</button>
              </div>
              <div className="resume-shell">
                <div className="rp-bar"><span className="rp-lbl">Optimized Resume Preview</span><div className="rp-dots"><div className="rp-dot"/><div className="rp-dot"/><div className="rp-dot"/></div></div>
                <div className="resume-body">
                  <div className="r-name">{result.name}</div>
                  {result.targetTitle && <div className="r-title">{result.targetTitle}</div>}
                  <div className="r-contact">
                    {result.email&&<span>✉ {result.email}</span>}
                    {result.phone&&<span>☎ {result.phone}</span>}
                    {result.location&&<span>📍 {result.location}</span>}
                  </div>
                  {result.summary && <div className="r-sec"><div className="r-sec-ttl">Professional Summary</div><p className="r-summary">{result.summary}</p></div>}
                  {result.experience?.length > 0 && <div className="r-sec"><div className="r-sec-ttl">Experience</div>{result.experience.map((e,i)=><div key={i} className="r-entry"><div className="r-eh"><span className="r-role">{e.role}</span><span className="r-dates">{e.dates}</span></div><div className="r-org">{e.organization}{e.location?` · ${e.location}`:""}</div><ul className="r-buls">{(e.bullets||[]).map((b,j)=><li key={j}>{b}</li>)}</ul></div>)}</div>}
                  {result.education?.length > 0 && <div className="r-sec"><div className="r-sec-ttl">Education</div>{result.education.map((e,i)=><div key={i} className="r-entry"><div className="r-eh"><span className="r-role">{e.degree}</span><span className="r-dates">{e.year}</span></div><div className="r-org">{e.institution}</div></div>)}</div>}
                  {result.skills?.length > 0 && <div className="r-sec"><div className="r-sec-ttl">Skills &amp; Competencies</div><div className="r-skills">{result.skills.map((s,i)=><span key={i} className="r-skill">{s}</span>)}</div></div>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RESOURCES */}
      <div className="res-bg">
        <div className="section">
          <div className="sec-eye">Federal Job Prep</div>
          <h2 className="sec-h2">Resources to Get You Hired</h2>
          <p className="sec-sub">Everything you need to navigate federal and state hiring.</p>
          <div className="res-grid">
            {RESOURCES.map((r,i) => <div key={i} className="res-card"><span className="res-ico">{r.ico}</span><div className="res-ttl">{r.ttl}</div><div className="res-txt">{r.txt}</div></div>)}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-logo">ApplyReady.work</div>
        <div className="footer-sub">A <span>Brownefield Holdings</span> product · Built for federal and state job seekers</div>
      </footer>
    </>
  );
}
