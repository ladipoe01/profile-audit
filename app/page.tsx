"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Clipboard, ImagePlus, Instagram, Link2, RefreshCw, Sparkles, X } from "lucide-react";

type AreaKey = "pfp" | "banner" | "bio" | "pinned";
type Rating = 1 | 2 | 3 | 4 | 5;
type AuditArea = { label: string; question: string; low: string; high: string; };
const areas: Record<AreaKey, AuditArea> = {
  pfp: { label: "Profile photo", question: "Does it read clearly at thumbnail size?", low: "Hard to recognise", high: "Instantly recognisable" },
  banner: { label: "Banner", question: "Does it use the space with a clear purpose?", low: "Missed opportunity", high: "Strong visual message" },
  bio: { label: "Bio", question: "Can a visitor quickly understand who they are and what they do?", low: "Unclear positioning", high: "Clear and memorable" },
  pinned: { label: "Pinned post", question: "Does it give visitors a strong reason to stay?", low: "Not doing the job", high: "Excellent first impression" },
};
const initialRatings: Record<AreaKey, Rating> = { pfp: 3, banner: 3, bio: 3, pinned: 3 };
const initialNotes: Record<AreaKey, string> = { pfp: "", banner: "", bio: "", pinned: "" };

function scoreLabel(score: number) {
  if (score >= 90) return "Standout";
  if (score >= 75) return "Looking good";
  if (score >= 60) return "Room to improve";
  if (score >= 40) return "Needs attention";
  return "Start with the basics";
}

export default function Home() {
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [ratings, setRatings] = useState<Record<AreaKey, Rating>>(initialRatings);
  const [notes, setNotes] = useState<Record<AreaKey, string>>(initialNotes);
  const [recommendation, setRecommendation] = useState("");
  const [images, setImages] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const score = useMemo(() => Math.round(Object.values(ratings).reduce((sum, value) => sum + value, 0) / 20 * 100), [ratings]);
  const completed = Object.values(notes).filter((note) => note.trim().length > 0).length;

  function updateRating(key: AreaKey, value: number) {
    setRatings((current) => ({ ...current, [key]: value as Rating }));
  }
  function handleImage(key: string, file?: File) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((current) => ({ ...current, [key]: url }));
  }
  function reportText() {
    const identity = handle.trim() ? (handle.trim().startsWith("@") ? handle.trim() : "@" + handle.trim()) : "Profile review";
    return [
      "PROFILE AUDIT",
      identity + (name.trim() ? " · " + name.trim() : ""),
      "Overall score: " + score + "/100 — " + scoreLabel(score),
      "",
      ...(["pfp", "banner", "bio", "pinned"] as AreaKey[]).flatMap((key) => [
        areas[key].label.toUpperCase() + " — " + ratings[key] + "/5",
        notes[key].trim() || "No written observation yet.",
        "",
      ]),
      "TOP PRIORITY",
      recommendation.trim() || "Add a clear next step for this profile.",
      "",
      "Reviewed with Profile Audit",
    ].join("\n");
  }
  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  function reset() {
    setRatings(initialRatings);
    setNotes(initialNotes);
    setRecommendation("");
    setHandle("");
    setName("");
    setImages({});
  }

  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="#" className="flex items-center gap-2.5 font-semibold tracking-tight"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#171714] text-sm font-bold text-[#d7f36a]">P.</span><span>profile audit</span></a>
        <div className="hidden items-center gap-6 text-xs font-medium text-[#77766f] sm:flex"><span>THE PROFILE REVIEW WORKSPACE</span><span className="rounded-full border border-[#deddd5] px-3 py-1.5 text-[#393932]">Free to use</span></div>
        <a href="#audit" className="rounded-full bg-[#171714] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#37372f]">Start an audit <ArrowRight className="ml-1 inline" size={13}/></a>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-16 lg:pt-20">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#deddd5] bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.14em] text-[#6c6b62]"><Sparkles size={13} className="text-[#8ba52e]"/> A sharper first impression</div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-.065em] sm:text-6xl lg:text-[76px]">Your profile is your <span className="relative inline-block">front door.<span className="absolute -bottom-1 left-0 -z-10 h-3 w-full bg-[#d7f36a] sm:h-4"/></span></h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-[#68675f]">A thoughtful review of the four things people notice first on X. Find what's working, what's getting in the way, and what to fix next.</p>
          <div className="mt-9 flex flex-wrap items-center gap-4"><a href="#audit" className="rounded-full bg-[#171714] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#34342d]">Build a profile audit <ArrowRight className="ml-2 inline" size={15}/></a><span className="text-xs text-[#85847b]">No login. No API key. No nonsense.</span></div>
          <div className="mt-14 grid max-w-md grid-cols-3 border-t border-[#deddd5] pt-5"><div><p className="text-2xl font-semibold tracking-tight">04</p><p className="mt-1 text-[11px] text-[#77766f]">Areas reviewed</p></div><div><p className="text-2xl font-semibold tracking-tight">05<span className="text-[#929188]">/5</span></p><p className="mt-1 text-[11px] text-[#77766f]">Rating scale</p></div><div><p className="text-2xl font-semibold tracking-tight">01</p><p className="mt-1 text-[11px] text-[#77766f]">Clear next step</p></div></div>
        </div>
        <div className="relative">
          <div className="absolute -right-3 -top-5 h-28 w-28 rounded-full bg-[#d7f36a] blur-2xl opacity-60"/>
          <div className="relative rounded-[28px] border border-[#e2e0d7] bg-white p-5 shadow-[0_24px_80px_-45px_rgba(25,25,20,.3)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#efeee9] pb-5"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#99988f]">The first impression</p><p className="mt-1 text-lg font-semibold tracking-tight">A profile, at a glance</p></div><span className="rounded-full bg-[#f2f4e9] px-3 py-1.5 text-[10px] font-semibold text-[#65772a]">4-point check</span></div>
            <div className="mt-6 overflow-hidden rounded-2xl bg-[#22231f]">
              <div className="h-24 bg-[linear-gradient(120deg,#a6b18a,#d7d2b4_48%,#5b6751)]"><div className="flex h-full items-end justify-end p-3"><span className="rounded-full bg-black/20 px-2.5 py-1 text-[9px] text-white/80">BANNER</span></div></div>
              <div className="px-4 pb-4"><div className="-mt-7 flex items-end justify-between"><div className="grid h-14 w-14 place-items-center rounded-full border-4 border-[#22231f] bg-[#d7f36a] text-lg font-bold text-[#22231f]">JD</div><span className="rounded-full border border-white/15 px-3 py-1.5 text-[9px] text-white/70">PINNED POST ↗</span></div><p className="mt-3 text-sm font-semibold text-white">Jane Designer <span className="font-normal text-white/45">@janemakes</span></p><p className="mt-1 text-[11px] text-white/65">Brand designer helping good ideas look the part.</p></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">{(["pfp","banner","bio","pinned"] as AreaKey[]).map((key, i) => <div key={key} className="rounded-xl border border-[#eeede7] p-3"><div className="flex items-center justify-between"><span className="text-xs font-semibold">{areas[key].label}</span><span className="text-[10px] text-[#9a998f]">0{i+1}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeede7]"><div className="h-full rounded-full bg-[#b3ca59]" style={{width: ["82%","65%","91%","48%"][i]}}/></div></div>)}</div>
            <p className="mt-5 flex items-center gap-2 text-[10px] text-[#929188]"><span className="h-1.5 w-1.5 rounded-full bg-[#a8c34b]"/> Good profiles make the next step obvious.</p>
          </div>
        </div>
      </section>

      <section id="audit" className="border-y border-[#e2e0d7] bg-[#eeede7]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#85847b]">The review desk / 001</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Build your audit<span className="text-[#9cad5c]">.</span></h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#77766f]">Enter the profile details, rate each area, and write feedback someone can actually use.</p></div><button onClick={reset} className="inline-flex items-center gap-2 self-start rounded-full border border-[#d6d5cc] bg-transparent px-4 py-2.5 text-xs font-semibold text-[#65645c] transition hover:bg-white"><RefreshCw size={13}/> Reset review</button></div>

          <div className="grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
            <aside className="space-y-5">
              <div className="rounded-2xl border border-[#e1dfd6] bg-white p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#929188]">01 / Who are we reviewing?</p>
                <label className="mt-5 block text-xs font-semibold text-[#44443d]">X handle</label><div className="mt-2 flex items-center rounded-xl border border-[#e5e4dd] bg-[#fafaf8] px-3"><span className="text-sm text-[#929188]">@</span><input value={handle.replace(/^@/,"")} onChange={(e)=>setHandle(e.target.value)} placeholder="username" className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-[#b5b4ac]"/></div>
                <label className="mt-4 block text-xs font-semibold text-[#44443d]">Name (optional)</label><input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Creator or brand name" className="mt-2 w-full rounded-xl border border-[#e5e4dd] bg-[#fafaf8] px-3 py-3 text-sm outline-none placeholder:text-[#b5b4ac] focus:border-[#a9bd5a]"/>
              </div>
              <div className="rounded-2xl border border-[#e1dfd6] bg-white p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#929188]">02 / Overall impression</p>
                <div className="mt-5 flex items-end justify-between"><div><p className="text-5xl font-semibold tracking-[-.07em]">{score}<span className="text-xl text-[#a6a59c]">/100</span></p><p className="mt-1 text-xs font-medium text-[#737268]">{scoreLabel(score)}</p></div><div className="grid h-16 w-16 place-items-center rounded-full border-[5px] border-[#e9eddb]"><span className="text-sm font-semibold">{score}%</span></div></div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eeede7]"><div className="h-full rounded-full bg-[#b5cc5b] transition-all duration-300" style={{width: score+"%"}}/></div>
                <div className="mt-5 flex justify-between text-[10px] text-[#929188]"><span>{completed}/4 written observations</span><span>Live score</span></div>
              </div>
              <div className="rounded-2xl bg-[#20211d] p-5 text-white sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-white/45">03 / The takeaway</p><label className="mt-4 block text-sm font-semibold">What's the one thing they should fix first?</label><textarea value={recommendation} onChange={(e)=>setRecommendation(e.target.value)} rows={4} placeholder="Lead with the biggest improvement. Be specific, be useful." className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[.06] p-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-[#d7f36a]/60"/>
                <button onClick={copyReport} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#d7f36a] px-4 py-3 text-xs font-bold text-[#20211d] transition hover:bg-[#e4fa86]">{copied ? <Check size={14}/> : <Clipboard size={14}/>} {copied ? "Report copied" : "Copy full audit report"}</button>
                <p className="mt-3 text-center text-[10px] leading-4 text-white/35">Your review stays in this browser. Nothing is uploaded.</p>
              </div>
            </aside>

            <div className="space-y-4">
              {(["pfp","banner","bio","pinned"] as AreaKey[]).map((key, index) => (
                <article key={key} className="rounded-2xl border border-[#e1dfd6] bg-white p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#a0a096]">0{index+1} / Profile check</p><h3 className="mt-1.5 text-xl font-semibold tracking-tight">{areas[key].label}</h3><p className="mt-1 text-xs text-[#77766f]">{areas[key].question}</p></div><span className="self-start rounded-full bg-[#f2f4e9] px-3 py-1.5 text-[10px] font-semibold text-[#65772a]">{ratings[key]} / 5</span></div>
                  <div className="mt-5 flex flex-wrap gap-2">{[1,2,3,4,5].map((value)=><button key={value} onClick={()=>updateRating(key,value)} aria-label={"Rate "+areas[key].label+" "+value+" out of 5"} className={"grid h-9 w-9 place-items-center rounded-full text-xs font-semibold transition "+(ratings[key]===value?"bg-[#20211d] text-white":"border border-[#e8e7e0] bg-white text-[#77766f] hover:border-[#a9bd5a]")}>{value}</button>)}</div>
                  <div className="mt-2 flex justify-between text-[10px] text-[#a09f96]"><span>{areas[key].low}</span><span>{areas[key].high}</span></div>
                  <textarea value={notes[key]} onChange={(e)=>setNotes((current)=>({...current,[key]:e.target.value}))} rows={2} placeholder={"What works? What needs fixing? Give a specific example..."} className="mt-4 w-full resize-y rounded-xl border border-[#e9e8e1] bg-[#fafaf8] px-3 py-3 text-sm leading-6 outline-none placeholder:text-[#b5b4ac] focus:border-[#a9bd5a]"/>
                  <div className="mt-3 flex items-center justify-between"><span className="text-[10px] text-[#a09f96]">Reference screenshot (optional)</span><button onClick={()=>fileRefs.current[key]?.click()} className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#68675f] hover:text-black"><ImagePlus size={13}/> {images[key]?"Change image":"Add image"}</button><input ref={(el)=>{fileRefs.current[key]=el}} type="file" accept="image/*" className="hidden" onChange={(e)=>handleImage(key,e.target.files?.[0])}/></div>
                  {images[key] && <div className="relative mt-3 overflow-hidden rounded-xl border border-[#e9e8e1]"><img src={images[key]} alt={areas[key].label+" reference"} className="max-h-48 w-full object-contain bg-[#f6f5f1]"/><button onClick={()=>setImages((current)=>{const next={...current};delete next[key];return next;})} aria-label="Remove screenshot" className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow"><X size={13}/></button></div>}
                </article>
              ))}
              <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-[#d4d2c8] p-5 sm:flex-row"><p className="text-xs text-[#77766f]">A useful critique is honest, specific and kind.</p><button onClick={copyReport} className="rounded-full bg-[#20211d] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#3a3b34]">Copy review <ArrowRight className="ml-2 inline" size={13}/></button></div>
            </div>
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-7 text-[11px] text-[#929188] sm:flex-row sm:items-center sm:px-8"><a href="#" className="font-semibold tracking-tight text-[#34342e]">profile audit<span className="text-[#9cad5c]">.</span></a><p>Made for people who care about the details.</p><p>© {new Date().getFullYear()} Profile Audit</p></footer>
    </main>
  );
}
