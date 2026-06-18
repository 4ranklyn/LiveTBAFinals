'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  BookOpen,
  Award,
  Terminal,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  CheckCircle,
  Hash,
  ArrowRight,
  Maximize2,
  Minimize2,
  Menu,
  X
} from 'lucide-react';

// === DATA TYPES & SCHEMAS ===
interface Slide {
  id: number;
  section: string;
  title: string;
  subtitle?: string;
  notes: string; // Advisor Grade tips (Indonesian)
  category: 'intro' | 'section' | 'content' | 'outro';
}

const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    section: "MASTERCLASS OVERVIEW",
    title: "Teori Komputasi: UAS Masterclass",
    subtitle: "Navigating Automata, Grammars, and Turing Machines",
    notes: "UAS sering kali menguji transisi formal dan pemahaman mekanis. Selalu mulai jawaban Anda dengan mendefinisikan tuple mesin secara formal untuk mengamankan poin awal 10-15%!",
    category: 'intro'
  },
  {
    id: 2,
    section: "RUMPUN 1: CFG & CNF",
    title: "Rumpun 1: CFG & Chomsky Normal Form (CNF)",
    subtitle: "Standardisasi Penulisan Aturan Produksi Tata Bahasa Bebas Konteks",
    notes: "Chomsky Normal Form membatasi ruas kanan aturan produksi hanya boleh tepat berisi 2 Variabel (A -> BC) atau tepat berisi 1 Terminal (A -> a). Di luar pola ini, nilai UAS Anda langsung nol!",
    category: 'section'
  },
  {
    id: 3,
    section: "RUMPUN 1: CFG & CNF",
    title: "SOP Penyederhanaan CNF",
    subtitle: "Alur Pembongkaran Aturan Produksi Secara Sistematis",
    notes: "Urut-urutan SOP ini adalah hukum mutlak! Jangan sekali-kali menukar posisi langkah eliminasi. Contoh: Jika Anda menghapus Useless sebelum Unit, variabel yang tidak aktif bisa lolos.",
    category: 'content'
  },
  {
    id: 4,
    section: "RUMPUN 2: PUSHDOWN AUTOMATA",
    title: "Rumpun 2: Pushdown Automata (PDA)",
    subtitle: "Menembus Batas Finite Automata Menggunakan Stack",
    notes: "PDA adalah mesin penganalisis Context-Free Language. Mengapa FA tidak mampu? Karena FA tidak memiliki memori penampung tak terhingga untuk membandingkan jumlah simbol berpasangan.",
    category: 'section'
  },
  {
    id: 5,
    section: "RUMPUN 2: PUSHDOWN AUTOMATA",
    title: "Konsep Kantong Semen (Stack)",
    subtitle: "Mengapa Stack PDA Diibaratkan Tumpukan Semen?",
    notes: "Visualisasikan LIFO: Semen yang masuk paling belakang wajib dikorek paling awal. Di PDA, Anda hanya boleh me-read simbol teratas stack (Top of Stack). Tidak boleh mencongkel bawahnya!",
    category: 'content'
  },
  {
    id: 6,
    section: "RUMPUN 2: PUSHDOWN AUTOMATA",
    title: "Strategi State PDA",
    subtitle: "Manajemen Siklus Hidup Membaca String & Aktivitas Stack",
    notes: "Dalam lembar jawaban UAS, bedakan state q0 (fokus memasukkan data), transisi epsilon (pintu masuk pemrosesan), dan q1 (aktivitas pencocokan & reduksi). Penggabungan state rawan memicu loop tak terhingga.",
    category: 'content'
  },
  {
    id: 7,
    section: "RUMPUN 2: PUSHDOWN AUTOMATA",
    title: "Benchmark Case: aⁿ bⁿ vs aⁿ b²ⁿ",
    subtitle: "Rasio Kecepatan Pengisian & Pengurasan Memori Stack",
    notes: "Kunci menjawab variasi b^2n di ujian: Untuk setiap pembacaan huruf 'a', push DUA buah 'a' ke stack. Sehingga jumlah semen di tumpukan siap di-pop satu per satu oleh setiap 'b' yang datang kemudian.",
    category: 'content'
  },
  {
    id: 8,
    section: "RUMPUN 3: TURING MACHINE",
    title: "Rumpun 3: Turing Machine (TM)",
    subtitle: "Puncak Hierarki Mesin Logika dengan Pita Tak Terhingga",
    notes: "Mesin Turing melambangkan batas tertinggi daya komputasi. Di UAS, rancanglah diagram transisi TM dengan rapi. Setiap busur wajib mencantumkan label (Read -> Write, Move) yang presisi.",
    category: 'section'
  },
  {
    id: 9,
    section: "RUMPUN 3: TURING MACHINE",
    title: "Metode Coret-Pasangkan",
    subtitle: "Algoritma Pencocokan Multigrup Menggunakan Pita Infinite",
    notes: "Metode coret-pasangkan adalah algoritma standar memeriksa string berimbang (e.g. aⁿ bⁿ cⁿ). Gunakan tanda penanda (X, Y, Z) agar kepala baca mesin tahu simbol mana yang sudah diproses.",
    category: 'content'
  },
  {
    id: 10,
    section: "RUMPUN 3: TURING MACHINE",
    title: "Aturan Tracing ID",
    subtitle: "SOP Penulisan Deskripsi Sesaat (Instantaneous Description) Formal",
    notes: "Kesalahan sepele penyusunan posisi q di kiri simbol yang dibaca bisa menggagalkan seluruh jawaban tracing. Pastikan state q berpindah tepat searah gerakan pita L (kiri) atau R (kanan).",
    category: 'content'
  },
  {
    id: 11,
    section: "RUMPUN 4: DECIDABILITY & PUMPING LEMMA",
    title: "Rumpun 4: Decidability & Pumping Lemma",
    subtitle: "Membuktikan Limitasi Logis Komputasi dan Teorema Kontradiksi",
    notes: "Ingat! Pumping Lemma HANYA digunakan untuk membuktikan bahwa suatu bahasa ADALAH BUKAN bahasa reguler/CFL. Pumping Lemma tidak pernah bisa membuktikan suatu bahasa POSITIF CFL.",
    category: 'content'
  },
  {
    id: 12,
    section: "Q&A & CLOSING STATEMENT",
    title: "Good Luck on Your UAS!",
    subtitle: "Mastery, Focus, and Absolute Academic Domination",
    notes: "Periksa kembali berkas lembar jawaban Anda sebelum diserahkan: 1. Definisi formal 7-tuple PDA / 7-tuple TM. 2. Keberadaan state final (F). 3. Penulisan blank symbol yang konsisten.",
    category: 'outro'
  }
];

// Reusable custom MathML safe injector Component
const SafeMathML = ({ html, className = "text-center my-1 select-all" }: { html: string; className?: string }) => {
  return (
    <div 
      className={`font-mono text-xs flex justify-center items-center ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default function Page() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Simulation states
  // Slide 5: Cement Stack Simulator
  const [cementStack, setCementStack] = useState<string[]>(['Z₀', 'a', 'a']);
  const maxStackHeight = 7;

  // Slide 9: Turing Machine Tape Simulator
  const [tmTape, setTmTape] = useState<string[]>(['a', 'a', 'b', 'b', 'c', 'c', 'B', 'B', 'B']);
  const [headPos, setHeadPos] = useState<number>(0);
  const [tmState, setTmState] = useState<string>('q0');
  const [tmHistory, setTmHistory] = useState<string[]>([]);
  const [isTmAutoRunning, setIsTmAutoRunning] = useState<boolean>(false);
  const tmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation handlers
  const handleNext = () => {
    if (currentIdx < SLIDES_DATA.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleJump = (index: number) => {
    setCurrentIdx(index);
    setSidebarOpen(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Stack operation simulation
  const pushCement = (symbol: string) => {
    if (cementStack.length < maxStackHeight) {
      setCementStack((prev) => [...prev, symbol]);
    }
  };

  const popCement = () => {
    if (cementStack.length > 1) {
      setCementStack((prev) => prev.slice(0, -1));
    }
  };

  const resetCement = () => {
    setCementStack(['Z₀', 'a', 'a']);
  };

  // Turing simulation algorithms (Coret-Pasangkan a^n b^n c^n)
  const stepTm = () => {
    const newTape = [...tmTape];
    const currentSymbol = newTape[headPos];

    if (tmState === 'q0') {
      // Look for first 'a' to rewrite as 'X'
      if (currentSymbol === 'a') {
        newTape[headPos] = 'X';
        setTmTape(newTape);
        setTmState('q1');
        setHeadPos((p) => p + 1);
        setTmHistory((h) => [...h, `Read 'a', write 'X', move Right (State: q0 -> q1)`]);
      } else if (currentSymbol === 'Y') {
        // All a's have been processed, head reads Y. Check if everything is balanced
        setHeadPos((p) => p + 1);
        setTmState('q4');
        setTmHistory((h) => [...h, `Read 'Y', skip Right. Validating remaining cells (State: q0 -> q4)`]);
      } else if (currentSymbol === 'X') {
        setHeadPos((p) => p + 1);
        setTmHistory((h) => [...h, `Read 'X', skip Right`]);
      } else {
        setIsTmAutoRunning(false);
        setTmHistory((h) => [...h, `Error: unexpected symbol '${currentSymbol}' in state q0`]);
      }
    } 
    else if (tmState === 'q1') {
      // Fast-forward past remaining 'a's and 'Y's to find first 'b'
      if (currentSymbol === 'a' || currentSymbol === 'Y') {
        setHeadPos((p) => p + 1);
      } else if (currentSymbol === 'b') {
        newTape[headPos] = 'Y';
        setTmTape(newTape);
        setTmState('q2');
        setHeadPos((p) => p + 1);
        setTmHistory((h) => [...h, `Read 'b', write 'Y', move Right (State: q1 -> q2)`]);
      } else {
        setIsTmAutoRunning(false);
        setTmHistory((h) => [...h, `Error: expected 'b', found '${currentSymbol}'`]);
      }
    } 
    else if (tmState === 'q2') {
      // Fast-forward past remaining 'b's and 'Z's to find first 'c'
      if (currentSymbol === 'b' || currentSymbol === 'Z') {
        setHeadPos((p) => p + 1);
      } else if (currentSymbol === 'c') {
        newTape[headPos] = 'Z';
        setTmTape(newTape);
        setTmState('q3');
        setHeadPos((p) => p - 1);
        setTmHistory((h) => [...h, `Read 'c', write 'Z', move Left (State: q2 -> q3)`]);
      } else {
        setIsTmAutoRunning(false);
        setTmHistory((h) => [...h, `Error: expected 'c', found '${currentSymbol}'`]);
      }
    } 
    else if (tmState === 'q3') {
      // Return Left to find newest processed checkpoint (X)
      if (currentSymbol === 'a' || currentSymbol === 'b' || currentSymbol === 'Y' || currentSymbol === 'Z') {
        setHeadPos((p) => p - 1);
      } else if (currentSymbol === 'X') {
        setHeadPos((p) => p + 1);
        setTmState('q0');
        setTmHistory((h) => [...h, `Returned to 'X' checkpoint, search next right. (State: q3 -> q0)`]);
      }
    } 
    else if (tmState === 'q4') {
      // Validation state
      if (currentSymbol === 'Y' || currentSymbol === 'Z') {
        setHeadPos((p) => p + 1);
      } else if (currentSymbol === 'B') {
        setTmState('qAccept');
        setIsTmAutoRunning(false);
        setTmHistory((h) => [...h, `Success! Hit Blank ('B'). String is ACCEPTED in State: qAccept 🎉`]);
      } else {
        setIsTmAutoRunning(false);
        setTmHistory((h) => [...h, `Failure: uncoupled symbols remaining`]);
      }
    }
  };

  const autoRunTm = () => {
    if (isTmAutoRunning) {
      if (tmIntervalRef.current) clearInterval(tmIntervalRef.current);
      setIsTmAutoRunning(false);
    } else {
      setIsTmAutoRunning(true);
    }
  };

  useEffect(() => {
    if (isTmAutoRunning) {
      tmIntervalRef.current = setInterval(() => {
        stepTm();
      }, 950);
    } else {
      if (tmIntervalRef.current) clearInterval(tmIntervalRef.current);
    }
    return () => {
      if (tmIntervalRef.current) clearInterval(tmIntervalRef.current);
    };
  }, [isTmAutoRunning, headPos, tmState, tmTape]);

  const resetTm = () => {
    setIsTmAutoRunning(false);
    setTmTape(['a', 'a', 'b', 'b', 'c', 'c', 'B', 'B', 'B']);
    setHeadPos(0);
    setTmState('q0');
    setTmHistory(['Tape reset to input: aabbcc']);
  };

  const activeSlide = SLIDES_DATA[currentIdx];

  return (
    <div id="deck_root" className="min-h-screen bg-[#090d16] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),rgba(14,165,233,0.05),transparent_50%)] flex flex-col relative select-none">
      
      {/* HIGH TECH GRID DECORATION */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 z-0"></div>

      {/* HEADER BAR */}
      <header id="deck_header" className="w-full h-14 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-6 z-30 bg-[#090d16]/75">
        <div className="flex items-center space-x-3">
          <Terminal className="w-5 h-5 text-[#00f2fe]" />
          <span className="font-mono text-sm tracking-wider text-[#00f2fe]">UAS_MASTERCLASS_v2.0</span>
          <span className="text-white/30">|</span>
          <span className="text-xs text-slate-400 tracking-tight font-light hidden md:inline">TEORI KOMPUTASI - AKADEMIK CONSULTING HARNESS</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotes(!showNotes)} 
            id="btn_toggle_notes"
            className={`px-3 py-1 rounded-sm text-xs border font-mono transition-all flex items-center space-x-2 ${
              showNotes 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
            }`}
          >
            {showNotes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>DOSEN ADVISOR</span>
          </button>

          <button
            onClick={toggleFullscreen}
            id="btn_toggle_fullscreen"
            className="p-1 px-2.5 rounded-sm bg-white/5 border border-white/10 text-slate-400 hover:border-[#00f2fe]/30 hover:text-[#00f2fe] transition-all text-xs flex items-center space-x-1.5"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono">FULLSCREEN</span>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            id="btn_toggle_sidebar"
            className="p-2 rounded-sm bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] transition-all border border-[#00f2fe]/30"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* DETAILED SIDEBAR / INDEX DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              key="sidebar_backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-[#020617] z-40 cursor-pointer"
            />
            
            <motion.div 
              key="sidebar_drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-[#0f172a] border-l border-white/10 z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div id="sidebar_title_box" className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold tracking-wide text-slate-200">SLIDE INDEX</span>
                  </div>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 hover:text-[#00f2fe] text-slate-400 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 mt-4 overflow-y-auto max-h-[70vh] pr-1">
                  {SLIDES_DATA.map((s, index) => (
                    <button
                      key={s.id}
                      onClick={() => handleJump(index)}
                      className={`w-full text-left p-3 rounded transition-all flex items-start space-x-3 border ${
                        currentIdx === index 
                          ? 'bg-[#00f2fe]/10 border-[#00f2fe]/30 text-white shadow-[0_0_15px_rgba(0,242,254,0.1)]' 
                          : 'bg-white/0 hover:bg-white/5 border-transparent text-slate-400'
                      }`}
                    >
                      <span className="font-mono text-xs text-[#00f2fe] mt-0.5">{String(s.id).padStart(2, '0')}</span>
                      <div>
                        <p className="text-xs font-semibold leading-normal">{s.title}</p>
                        <p className="text-[10px] text-white/40 tracking-wider font-mono uppercase mt-0.5">{s.section}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 font-mono text-[10px] text-slate-500">
                <p>UAS - TEORI KOMPUTASI MASTERCLASS</p>
                <p className="text-[#00f2fe] mt-1">HACKER GRADE CONSULTANT</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CORE CONTENT LAYOUT */}
      <main className="flex-1 flex flex-col md:flex-row items-stretch p-4 md:p-6 gap-6 z-10 relative">
        
        {/* PRESENTATION CONTAINER */}
        <section id="deck_slide_viewport" className="flex-1 flex flex-col justify-between">
          
          {/* SLIDE PROGRESS FLIER */}
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-mono tracking-widest text-[#00f2fe] uppercase">
              {activeSlide.section}
            </span>
            <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5">
              SLIDE {String(activeSlide.id).padStart(2, '0')} OF {String(SLIDES_DATA.length).padStart(2, '0')}
            </span>
          </div>

          {/* MAIN FROSTED CONTAINER */}
          <div className="flex-1 min-h-[500px] rounded-xl relative overflow-hidden bg-white/[0.03] border border-white/10 backdrop-blur-[12px] p-6 md:p-10 flex flex-col justify-between select-text group hover:border-[#00f2fe]/20 transition-all duration-500 shadow-2xl">
            
            {/* GLOW DECORATIONS */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-sky-500/10 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex-1 flex flex-col justify-between h-full"
              >
                {/* 1. TITLE SLIDE */}
                {activeSlide.id === 1 && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 border border-[#00f2fe]/20 rounded-full px-4 py-1.5 bg-[#00f2fe]/5 mb-2 hover:bg-[#00f2fe]/10 transition">
                      <Sparkles className="w-4 h-4 text-[#00f2fe]" />
                      <span className="text-xs tracking-wider uppercase font-mono text-[#00f2fe]">AKADEMIK LEVEL DECK</span>
                    </div>

                    <h1 id="presentation_main_title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#00f2fe] pb-2 leading-tight w-full">
                      {activeSlide.title}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
                      {activeSlide.subtitle}
                    </p>

                    <div className="flex flex-col items-center space-y-4 pt-10">
                      <div className="flex items-center space-x-3 text-slate-400 bg-white/5 border border-white/5 rounded-lg p-3 px-5 backdrop-blur font-mono text-sm">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span>Created by:</span>
                        <a href="https://instagram.com/franklynical" target="_blank" className="text-[#00f2fe] font-semibold hover:underline">@franklynical</a>
                      </div>
                      
                      <button 
                        onClick={handleNext}
                        className="mt-6 flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 font-bold px-6 py-3 rounded-lg shadow-lg shadow-[#00f2fe]/20 transition-all font-mono text-sm animate-pulse"
                      >
                        <span>START MASTERCLASS</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. SECTION SLIDES (2, 4, 8) */}
                {activeSlide.category === 'section' && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-4xl mx-auto">
                    <div className="w-16 h-16 rounded-full border border-emerald-400/20 bg-emerald-900/10 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                      <Award className="w-8 h-8 text-emerald-400" />
                    </div>

                    <p className="text-xs tracking-widest uppercase font-mono text-emerald-400">
                      SECTION EXAM SCOPE
                    </p>

                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-emerald-400 leading-tight">
                      {activeSlide.title}
                    </h2>

                    <div className="h-0.5 w-24 bg-gradient-to-r from-cyan-500 to-emerald-500 my-2"></div>

                    <p className="text-slate-300 text-base md:text-lg max-w-lg leading-relaxed pt-2">
                      {activeSlide.subtitle}
                    </p>
                  </div>
                )}

                {/* 3. SLIDE 3: SOP Penyederhanaan CNF (Two_Column_Tiled_Text) */}
                {activeSlide.id === 3 && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-6">{activeSlide.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch my-auto">
                      {/* Left Column: Simplification */}
                      <div className="space-y-4">
                        <div className="border border-cyan-500/10 px-3 py-1.5 rounded bg-cyan-950/25 inline-block font-mono text-xs text-cyan-400 mb-1">
                          TAHAP 1: PENYEDERHANAAN CFG
                        </div>

                        {[
                          { step: "1", title: "Eliminasi ε-production", desc: "Singkirkan variabel S -> ε, kec. jika S awal. Gantikan sisa ruas kanan dengan substitusi null." },
                          { step: "2", title: "Eliminasi Unit production", desc: "Ganti aturan transisi variabel tunggal, e.g. A -> B dengan semua aturan produksi dari B." },
                          { step: "3", title: "Eliminasi Useless Symbol", desc: "Hapus variabel/terminal tak tergapai dari S awal atau tidak menghasilkan terminal (mandul)." }
                        ].map((s) => (
                          <div 
                            key={s.step}
                            className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex items-start space-x-4 hover:border-cyan-500/30 transition-all backdrop-blur-[120px]"
                            style={{ minHeight: '100px' }}
                          >
                            <span className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                              0{s.step}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-200">{s.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed mt-1">{s.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right Column: Chomsky Conv */}
                      <div className="space-y-4 flex flex-col justify-between h-full">
                        <div>
                          <div className="border border-emerald-500/10 px-3 py-1.5 rounded bg-emerald-950/25 inline-block font-mono text-xs text-emerald-400 mb-1">
                            TAHAP 2: KONVERSI CHOMSKY (CNF)
                          </div>
                        </div>

                        {[
                          { step: "4", title: "Aturan Terminal Tunggal (A -> a)", desc: "Setiap aturan ke terminal wajib tunggal. Jika tercampur, ubah terminal jadi variabel perantara baru, misal Pa -> a." },
                          { step: "5", title: "Pemecahan Variabel Panjang", desc: "Pola A -> BCD bermasalah. Potong ruas kanan per 2 variabel dengan membuat variabel baru, e.g. A -> BC_baru, C_baru -> CD." }
                        ].map((s) => (
                          <div 
                            key={s.step}
                            className="bg-white/[0.02] border border-white/5 rounded-lg p-4 flex items-start space-x-4 hover:border-emerald-500/30 transition-all backdrop-blur-[120px]"
                            style={{ minHeight: '100px' }}
                          >
                            <span className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                              0{s.step}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-200">{s.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed mt-1">{s.desc}</p>
                            </div>
                          </div>
                        ))}

                        {/* Interactive proof card */}
                        <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3 text-center flex items-center justify-between border-dashed mt-auto">
                          <span className="text-[11px] text-slate-500 font-mono">Contoh: S -&gt; aAB diringkas</span>
                          <span className="text-[#00f2fe] text-xs font-mono">S -&gt; PaAB -&gt; PaC, Pa -&gt; a</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SLIDE 5: Konsep Kantong Semen (Stack) (Image_Right_Text_Left + Interactive Stack) */}
                {activeSlide.id === 5 && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{activeSlide.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-auto">
                      {/* Left: Text & Explanation */}
                      <div className="space-y-4 font-sans">
                        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 space-y-3">
                          <div className="flex items-center space-x-2 text-yellow-400">
                            <Info className="w-4.5 h-4.5" />
                            <span className="text-xs font-mono font-semibold uppercase">Analogi Filosofis Akut</span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            Membayangkan stack memori PDA seperti <strong>Kantong Semen</strong> yang bertumpuk. Anda tidak bisa menarik semen terbawah tanpa menjatuhkan seluruh tumpukan. 
                          </p>
                          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 pl-1">
                            <li><strong>State sebagai SOP:</strong> Penuntun kapan semen harus diambil atau ditaruh.</li>
                            <li><strong>Stack sebagai Memori:</strong> Tempat penyimpanan beralur LIFO (Last In, First Out).</li>
                          </ul>
                        </div>

                        <div className="bg-cyan-950/10 border border-cyan-500/10 rounded-lg p-3.5">
                          <p className="text-[11px] text-slate-500 font-mono uppercase mb-2 text-center">Definisi Formal Tuple PDA</p>
                          <div className="font-mono text-xs text-[#00f2fe] tracking-wider text-center py-1">
                            M = (Q, Σ, Γ, δ, q₀, Z₀, F)
                          </div>
                        </div>
                      </div>

                      {/* Right: Live Interactive Cement Bag Stack */}
                      <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-5 flex flex-col items-center">
                        <h4 className="text-xs font-mono text-emerald-400 uppercase mb-4 tracking-widest flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                          <span>MEMORI STACK LIVE SIMULATOR</span>
                        </h4>

                        {/* Visual tumpukan semen */}
                        <div className="w-full max-w-[220px] h-48 border-b-4 border-slate-500 border-x-2 border-white/10 flex flex-col justify-end p-2 space-y-1.5 relative bg-[#090d16]/60 rounded-b-md">
                          
                          {/* TOP label indicator */}
                          {cementStack.length > 0 && (
                            <div className="absolute right-2 top-2 bg-[#00f2fe]/10 border border-[#00f2fe]/30 px-1.5 py-0.5 rounded text-[9px] font-mono text-[#00f2fe] animate-bounce">
                              TOP
                            </div>
                          )}

                          <AnimatePresence>
                            {cementStack.map((symbol, idx) => (
                              <motion.div
                                key={`${symbol}-${idx}`}
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={`w-full py-2.5 rounded border text-center font-mono text-xs font-extrabold flex items-center justify-center space-x-1.5 uppercase ${
                                  symbol === 'Z₀' 
                                    ? 'bg-slate-700/20 border-slate-500/30 text-slate-400' 
                                    : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400'
                                }`}
                              >
                                <span className="text-[10px] text-white/20">[{idx}]</span>
                                <span>{symbol === 'Z₀' ? 'Z₀ (DASAR PIT)' : `Semen '${symbol}'`}</span>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {/* Live actions */}
                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
                          <button
                            onClick={() => pushCement('a')}
                            disabled={cementStack.length >= maxStackHeight}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 text-emerald-400 border border-emerald-500/30 rounded py-2 text-xs font-mono transition-all font-semibold"
                          >
                            PUSH &apos;a&apos; (+Semen)
                          </button>
                          <button
                            onClick={popCement}
                            disabled={cementStack.length <= 1}
                            className="bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-40 text-rose-400 border border-rose-500/30 rounded py-2 text-xs font-mono transition-all font-semibold"
                          >
                            POP HEAD (-Semen)
                          </button>
                        </div>

                        <button 
                          onClick={resetCement}
                          className="mt-3 text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center space-x-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Storage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. SLIDE 6: Strategi State PDA (Tiled_Text_With_Icons) */}
                {activeSlide.id === 6 && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-6">{activeSlide.subtitle}</p>
                    </div>

                    {/* Sleek PDA State Transition Diagram */}
                    <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6">
                      <p className="text-[10px] font-mono text-[#00f2fe]/80 uppercase tracking-wider mb-4 text-center">
                        PDA State Transition Diagram
                      </p>
                      
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 py-6 px-2 select-none overflow-x-auto min-w-full">
                        {/* Node 1: q0 */}
                        <div className="flex flex-col items-center text-center relative group min-w-[130px]">
                          {/* Loop Label above */}
                          <div className="mb-3 text-[10px] font-mono text-cyan-300 leading-tight bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.15)] flex flex-col items-center">
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Loop</span>
                            <span>a, Z₀ → aZ₀</span>
                            <span>a, a → aa</span>
                          </div>
                          
                          {/* Circle State */}
                          <div className="relative">
                            {/* Loop Indicator Arc using SVG */}
                            <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6 text-cyan-400 opacity-60" viewBox="0 0 32 24" fill="none">
                              <path d="M 4 20 A 12 12 0 1 1 28 20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                              <path d="M 28 20 L 24 14 M 28 20 L 22 22" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            
                            <div className="bg-white/5 border border-white/20 hover:border-cyan-400/60 hover:bg-white/10 backdrop-blur w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-lg text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] duration-300 transition-all">
                              q₀
                            </div>
                            
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                              START
                            </span>
                          </div>
                        </div>

                        {/* Arrow 1: q0 -> q1 */}
                        <div className="flex flex-row md:flex-col items-center justify-center flex-1 min-w-[90px] max-w-[130px] py-2">
                          <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/10 mb-1.5 whitespace-nowrap">
                            b, a → ε
                          </span>
                          <svg className="w-12 h-6 md:w-full md:h-6" viewBox="0 0 80 24" fill="none" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="cyanToRose" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#f43f5e" />
                              </linearGradient>
                            </defs>
                            <line x1="0" y1="12" x2="72" y2="12" stroke="url(#cyanToRose)" strokeWidth="2" strokeDasharray="3 2" />
                            <polygon points="72,7 80,12 72,17" fill="#f43f5e" />
                          </svg>
                        </div>

                        {/* Node 2: q1 */}
                        <div className="flex flex-col items-center text-center relative group min-w-[130px]">
                          {/* Loop Label above */}
                          <div className="mb-3 text-[10px] font-mono text-rose-300 leading-tight bg-rose-950/40 px-2.5 py-1 rounded border border-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.15)] flex flex-col items-center">
                            <span className="text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Loop</span>
                            <span>b, a → ε</span>
                          </div>
                          
                          {/* Circle State */}
                          <div className="relative">
                            {/* Loop Indicator Arc using SVG */}
                            <svg className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-6 text-rose-400 opacity-60" viewBox="0 0 32 24" fill="none">
                              <path d="M 4 20 A 12 12 0 1 1 28 20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
                              <path d="M 28 20 L 24 14 M 28 20 L 22 22" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            
                            <div className="bg-white/5 border border-white/20 hover:border-rose-400/60 hover:bg-white/10 backdrop-blur w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-lg text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] duration-300 transition-all">
                              q₁
                            </div>
                            
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                              LOOPING
                            </span>
                          </div>
                        </div>

                        {/* Arrow 2: q1 -> q2 */}
                        <div className="flex flex-row md:flex-col items-center justify-center flex-1 min-w-[90px] max-w-[130px] py-2">
                          <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/10 mb-1.5 whitespace-nowrap">
                            ε, Z₀ → Z₀
                          </span>
                          <svg className="w-12 h-6 md:w-full md:h-6" viewBox="0 0 80 24" fill="none" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="roseToEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#10b981" />
                              </linearGradient>
                            </defs>
                            <line x1="0" y1="12" x2="72" y2="12" stroke="url(#roseToEmerald)" strokeWidth="2" strokeDasharray="3 2" />
                            <polygon points="72,7 80,12 72,17" fill="#10b981" />
                          </svg>
                        </div>

                        {/* Node 3: q2 */}
                        <div className="flex flex-col items-center text-center relative group min-w-[130px]">
                          {/* Placeholder to balance layout top height of loops */}
                          <div className="mb-3 h-[34px] invisible"></div>
                          
                          {/* Double Circle State */}
                          <div className="relative">
                            <div className="relative p-1 bg-white/5 border border-white/20 hover:border-emerald-400/60 hover:bg-white/10 backdrop-blur w-16 h-16 rounded-full flex items-center justify-center font-mono font-bold text-lg text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)] duration-300 transition-all">
                              {/* Inner Circle to make it a double-circle representation of final state */}
                              <div className="w-full h-full border border-emerald-400/35 rounded-full flex items-center justify-center">
                                q₂
                              </div>
                            </div>
                            
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-semibold">
                              ACCEPT
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch my-auto">
                      
                      {/* Tile 1 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all font-sans relative group" style={{ minHeight: '220px' }}>
                        <div>
                          <div className="w-12 h-12 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                            <i className="fa-solid fa-circle-arrow-up text-xl text-cyan-400"></i>
                          </div>
                          <h4 className="text-base font-bold text-slate-100 mb-2">Mode PUSH di q₀</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Membaca input awal (misal huruf &apos;a&apos;) dan memasukkannya ke dalam memori stack untuk persiapan pencocokan kelompok huruf berikutnya.
                          </p>
                        </div>
                        <div className="mt-6 pt-3 border-t border-white/5 font-mono text-[10px] text-cyan-400 select-all">
                          <SafeMathML html="<math display='block' class='text-center text-cyan-400'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mo>,</mo><msub><mi>Z</mi><mn>0</mn></msub><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><msub><mi>Z</mi><mn>0</mn></msub><mo>)</mo></math>" />
                        </div>
                      </div>

                      {/* Tile 2 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all font-sans relative group" style={{ minHeight: '220px' }}>
                        <div>
                          <div className="w-12 h-12 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                            <i className="fa-solid fa-right-left text-xl text-emerald-400"></i>
                          </div>
                          <h4 className="text-base font-bold text-slate-100 mb-2">Mode TRANSISI / Gerbang</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Peralihan state penanda pergantian domain alfabet (membaca &apos;a&apos; selesai, beralih membaca &apos;b&apos;). Menggunakan tanpa-input (ε).
                          </p>
                        </div>
                        <div className="mt-6 pt-3 border-t border-white/5 font-mono text-[10px] text-emerald-400 select-all">
                          <SafeMathML html="<math display='block' class='text-center text-emerald-400'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>1</mn></msub><mo>,</mo><mi>ε</mi><mo>)</mo></math>" />
                        </div>
                      </div>

                      {/* Tile 3 */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-between hover:border-rose-500/30 transition-all font-sans relative group" style={{ minHeight: '220px' }}>
                        <div>
                          <div className="w-12 h-12 rounded-lg bg-rose-950/20 border border-rose-500/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 duration-300">
                            <i className="fa-solid fa-circle-arrow-down text-xl text-rose-400"></i>
                          </div>
                          <h4 className="text-base font-bold text-slate-100 mb-2">Mode POP di q₁</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Membaca simbol input penyeimbang (e.g., huruf &apos;b&apos;) dan mengeluarkan (pop) semen teratas stack. Reduksi seimbang hingga tumpukan habis.
                          </p>
                        </div>
                        <div className="mt-6 pt-3 border-t border-white/5 font-mono text-[10px] text-rose-400 select-all">
                          <SafeMathML html="<math display='block' class='text-center text-rose-400'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>1</mn></msub><mo>,</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>1</mn></msub><mo>,</mo><mi>ε</mi><mo>)</mo></math>" />
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 7. SLIDE 7: Benchmark Case (Table representation) */}
                {activeSlide.id === 7 && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{activeSlide.subtitle}</p>
                    </div>

                    <div className="border border-white/5 rounded-xl overflow-hidden my-auto bg-[#090d16]/40 font-sans">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/[0.04] border-b border-white/10">
                            <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-widest border-r border-white/5 w-1/4">Skenario Elemen</th>
                            <th className="p-4 text-xs font-mono text-cyan-400 uppercase tracking-widest border-r border-white/5 w-3/8 text-center bg-cyan-950/10">Pola Seimbang: aⁿ bⁿ</th>
                            <th className="p-4 text-xs font-mono text-lime-400 uppercase tracking-widest w-3/8 text-center bg-lime-950/10">Pola Rasio Ganda: aⁿ b²ⁿ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs">
                          <tr>
                            <td className="p-4 font-semibold text-slate-300 border-r border-white/5">Fokus Logis Komparasi</td>
                            <td className="p-4 text-slate-400 border-r border-white/5 bg-cyan-950/5 text-center">Hubungan 1:1 antara &apos;a&apos; dan &apos;b&apos;</td>
                            <td className="p-4 text-slate-400 bg-lime-950/5 text-center">Hubungan 1:2 (Satu &apos;a&apos; berpasangan dengan dua &apos;b&apos;)</td>
                          </tr>
                          
                          <tr>
                            <td className="p-4 font-semibold text-slate-300 border-r border-white/5">Rule Push Pertama</td>
                            <td className="p-4 border-r border-white/5 bg-cyan-950/5 text-center">
                              <SafeMathML html="<math display='block' class='text-center text-[#00f2fe] font-bold'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mo>,</mo><msub><mi>Z</mi><mn>0</mn></msub><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><msub><mi>Z</mi><mn>0</mn></msub><mo>)</mo></math>" />
                            </td>
                            <td className="p-4 bg-lime-950/5 text-center">
                              <SafeMathML html="<math display='block' class='text-center text-lime-400 font-bold'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mo>,</mo><msub><mi>Z</mi><mn>0</mn></msub><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mi>a</mi><msub><mi>Z</mi><mn>0</mn></msub><mo>)</mo></math>" />
                            </td>
                          </tr>

                          <tr>
                            <td className="p-4 font-semibold text-slate-300 border-r border-white/5">Rule Push Rekursif</td>
                            <td className="p-4 border-r border-white/5 bg-cyan-950/5 text-center">
                              <SafeMathML html="<math display='block' class='text-center text-[#00f2fe] font-bold'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mo>,</mo><mi>a</mi><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mi>a</mi><mo>)</mo></math>" />
                            </td>
                            <td className="p-4 bg-lime-950/5 text-center">
                              <SafeMathML html="<math display='block' class='text-center text-lime-400 font-bold'><mi>δ</mi><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mo>,</mo><mi>a</mi><mo>)</mo><mo>=</mo><mo>(</mo><msub><mi>q</mi><mn>0</mn></msub><mo>,</mo><mi>a</mi><mi>a</mi><mi>a</mi><mo>)</mo></math>" />
                            </td>
                          </tr>

                          <tr>
                            <td className="p-4 font-semibold text-slate-300 border-r border-white/5 font-mono">Taktik Kecepatan POP</td>
                            <td className="p-4 text-slate-400 border-r border-white/5 bg-cyan-950/5 text-center">Setiap b dibaca, pop tepat 1 semen &apos;a&apos;</td>
                            <td className="p-4 text-slate-400 bg-lime-950/5 text-center">Setiap b dibaca, pop tepat 1 semen &apos;a&apos; (karena semen telah dilipatgandakan pada tahap push)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 9. SLIDE 9: Metode Coret-Pasangkan (Image_Right_Text_Left + Interactive TM Tape) */}
                {activeSlide.id === 9 && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-4">{activeSlide.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch my-auto">
                      {/* Left Explanation */}
                      <div className="flex flex-col justify-between space-y-4 font-sans">
                        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 space-y-3">
                          <div className="flex items-center space-x-2 text-sky-400">
                            <Terminal className="w-4.5 h-4.5" />
                            <span className="text-xs font-mono font-semibold uppercase">Mekanika Pita Mesin Turing</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Simulasi pembuktian keseimbangan string bahasa kompleks <strong>aⁿ bⁿ cⁿ</strong> yang tidak terjamah oleh kemampun PDA.
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <strong>Konsep Coret-Pasangkan:</strong> Untuk setiap &apos;a&apos; yang dicoret (diubah jadi &apos;X&apos;), kepala pita harus bergeser ke kanan mencari pasangan &apos;b&apos; untuk dicoret (&apos;Y&apos;), dan &apos;c&apos; untuk dicoret (&apos;Z&apos;). Jika semua habis seimbang, string sah!
                          </p>
                        </div>

                        {/* Custom visual instructions */}
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>Transition state:</span>
                          <span className={`${tmState.includes('Accept') ? 'text-emerald-400 font-extrabold' : 'text-[#00f2fe]'}`}>
                            Current State: {tmState}
                          </span>
                        </div>
                      </div>

                      {/* Right: Live Interactive Turing Tape */}
                      <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                            <span className="text-xs font-mono text-slate-400 uppercase">Turing Tape Console</span>
                            <span className="text-[10px] uppercase font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-2 py-0.5 rounded border border-[#00f2fe]/20">
                              Input: aabbcc
                            </span>
                          </div>

                          {/* Tape Visual Grid */}
                          <div className="flex items-center overflow-x-auto space-x-1.5 py-4 px-2 bg-black/40 rounded border border-white/5 justify-center">
                            {tmTape.map((cell, idx) => {
                              const isHeadHere = idx === headPos;
                              return (
                                <div 
                                  key={idx}
                                  className={`w-10 h-10 rounded text-center font-mono font-bold flex flex-col justify-center items-center transition-all shrink-0 border relative ${
                                    isHeadHere 
                                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50' 
                                      : cell === 'B'
                                        ? 'bg-slate-800/10 border-white/5 text-slate-600'
                                        : cell === 'X' || cell === 'Y' || cell === 'Z'
                                          ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-400'
                                          : 'bg-white/[0.03] border-white/10 text-slate-100'
                                  }`}
                                >
                                  <span>{cell}</span>
                                  {isHeadHere && (
                                    <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-amber-400 animate-ping"></span>
                                  )}
                                  {/* cell index */}
                                  <span className="absolute -top-3.5 text-[8px] text-white/20 select-none">#{idx}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Actions Console */}
                          <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
                            <button
                              onClick={stepTm}
                              disabled={tmState.startsWith('qAccept') || tmState.includes('Error')}
                              className="bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 disabled:opacity-30 border border-[#00f2fe]/30 rounded text-slate-200 py-1.5 cursor-pointer"
                            >
                              STEP
                            </button>
                            <button
                              onClick={autoRunTm}
                              disabled={tmState.startsWith('qAccept') || tmState.includes('Error')}
                              className={`rounded py-1.5 border transition-all cursor-pointer ${
                                isTmAutoRunning 
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse' 
                                  : 'bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/30 text-slate-200'
                              }`}
                            >
                              {isTmAutoRunning ? 'PAUSE' : 'AUTO RUN'}
                            </button>
                            <button
                              onClick={resetTm}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 rounded py-1.5 cursor-pointer"
                            >
                              RESET
                            </button>
                          </div>
                        </div>

                        {/* Log viewer */}
                        <div className="mt-4 bg-[#090d16]/80 rounded p-2.5 border border-white/5 h-24 overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1">
                          {tmHistory.slice(-4).map((log, lidx) => (
                            <div key={lidx} className="flex items-start space-x-1.5">
                              <span className="text-[#00f2fe] shrink-0">&gt;</span>
                              <span className={log.includes('Success') ? 'text-emerald-400 font-bold' : ''}>{log}</span>
                            </div>
                          ))}
                          {tmHistory.length === 0 && (
                            <div className="text-slate-600 text-center pt-4">Turing machine ready. Click Step/Auto Run.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 10. SLIDE 10: Aturan Tracing ID (Styled_Bullet_Points) */}
                {activeSlide.id === 10 && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-6">{activeSlide.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch my-auto font-sans">
                      {[
                        {
                          num: "01",
                          title: "Posisi 'q' Terikat di Kiri",
                          desc: "Karakter State ('q') wajib ditulis persis di sebelah kiri huruf pita yang sedang dibaca. Contoh: Jika pita berisi 'abb' dan head membaca 'a' pertama di state q₀, penulisan formalnya adalah: q₀abb.",
                          badge: "FORMAL ATURAN #1"
                        },
                        {
                          num: "02",
                          title: "Arah Gerakan L / R (Left/Right)",
                          desc: "Jika transisi menginstruksikan gerakan R, geser simbol kata 'q' ke kanan sejauh 1 karakter. Jika L, mundur 1 karakter ke kiri. Melewati batas karakter baru sesuai hasil rewrite.",
                          badge: "FORMAL ATURAN #2"
                        },
                        {
                          num: "03",
                          title: "Wajib Menyentuh Blank (B / Δ)",
                          desc: "Tracing penjelajah dianggap formal dinyatakan selesai bila dan hanya bila head membaca simbol Blank (B) untuk memastikan string selesai dipetakan dengan rapi ke final state.",
                          badge: "FORMAL ATURAN #3"
                        }
                      ].map((card, cidx) => (
                        <div 
                          key={cidx}
                          className="bg-white/[0.02] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-slate-500/40 transition-all group"
                          style={{ minHeight: '180px' }}
                        >
                          <div>
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                              <span className="font-mono text-xs text-slate-500">{card.badge}</span>
                              <span className="font-mono text-lg font-bold text-slate-300">#{card.num}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-100 mb-2">{card.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                          </div>
                          
                          <div className="mt-4 pt-2 flex items-center space-x-1 font-mono text-[9px] text-[#00f2fe]/80 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] inline-block animate-ping"></span>
                            <span>Strict Exam grading</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11. SLIDE 11: Decidability & Pumping Lemma (Two_Column_Tiled_Text) */}
                {activeSlide.id === 11 && (
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{activeSlide.title}</h3>
                      <p className="text-sm text-slate-400 mb-6">{activeSlide.subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch my-auto font-sans">
                      {/* Column 1: Pumping Lemma */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-between group hover:border-[#00f2fe]/30 transition-all">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-rose-400">
                            <Hash className="w-4.5 h-4.5" />
                            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">PUMPING LEMMA (SENJATA KONTRA-BUKTI)</h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Alat pembuktian matematis formal demi menegaskan bahasa tersebut <strong>Bukan Bahasa Bebas Konteks (CFL)</strong>. Caranya adalah menunjuk kontradiksi melalui &apos;pemompaan&apos; bagian string tengah.
                          </p>

                          <div className="bg-slate-900/40 p-4 border border-white/5 rounded-md font-mono text-xs text-[#00f2fe] space-y-2">
                            <p className="text-[10px] text-slate-500 uppercase">Teorema Pemompaan String:</p>
                            <div className="select-all">
                              <SafeMathML html="<math display='block' class='text-center text-[#00f2fe] font-bold'><mi>w</mi><mo>=</mo><mi>u</mi><mi>v</mi><mi>w</mi><mi>x</mi><mi>y</mi></math>" />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-2 list-none space-y-1">
                              <li className="flex items-center justify-between">
                                <span>• Sifat 1:</span>
                                <SafeMathML className="my-0 px-2" html="<math><mo>|</mo><mi>v</mi><mi>x</mi><mi>y</mi><mo>|</mo><mo>≤</mo><mi>p</mi></math>" />
                              </li>
                              <li className="flex items-center justify-between">
                                <span>• Sifat 2:</span>
                                <SafeMathML className="my-0 px-2" html="<math><mo>|</mo><mi>v</mi><mi>x</mi><mo>|</mo><mo>≥</mo><mn>1</mn></math>" />
                              </li>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 leading-relaxed italic">
                          UAS tip: Jika ada huruf p di soal, itu adalah konstanta pompa!
                        </div>
                      </div>

                      {/* Column 2: Halting Problem */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2 text-emerald-400">
                            <Terminal className="w-4.5 h-4.5" />
                            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">HALTING PROBLEM (BATAS LOGIS DUNIA)</h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Logika penemu Alan Turing membuktikan adanya problem komputasi yang <strong>Undecidable (Tidak dapat dituntaskan keputusan logisnya)</strong> secara universal.
                          </p>

                          <div className="bg-emerald-950/5 p-4 border border-emerald-500/10 rounded-md font-mono text-xs text-slate-300">
                            <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1 text-center">PERTANYAAN SENTRAL:</p>
                            <p className="text-xs text-slate-300 leading-normal mb-3 text-center">
                              &quot;Adakah program universal H yang sanggup memeriksa apakah sembarang program P akan berhenti (halt) atau looping selamanya?&quot;
                            </p>
                            <div className="text-emerald-400 font-bold text-center border border-emerald-500/20 py-1 bg-emerald-950/20 text-xs rounded">
                              TIDAK ADA / UNDECIDABLE
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 leading-relaxed italic">
                          UAS tip: Digunakan untuk membuktikan batas maksimal komputasi fisik.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 12. SLIDE 12: Q&A Slide / Closing (Outro representation) */}
                {activeSlide.id === 12 && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-2xl mx-auto font-sans">
                    <div className="w-16 h-16 rounded-full border border-[#00f2fe]/20 bg-[#00f2fe]/5 flex items-center justify-center animate-bounce shadow-[0_0_20px_rgba(0,242,254,0.1)]">
                      <Sparkles className="w-8 h-8 text-[#00f2fe]" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] via-emerald-400 to-lime-300 leading-none">
                      {activeSlide.title}
                    </h2>

                    <p className="text-slate-300 text-base md:text-lg max-w-md leading-relaxed">
                      Lumpas, tuntas bantai semua soal UAS Teori Komputasi! Jangan gugup, ikuti SOP akademik yang telah diajarkan.
                    </p>

                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl w-full max-w-sm text-left space-y-3 pt-3">
                      <div className="text-xs font-mono text-slate-400 border-b border-white/5 pb-2 mb-1 flex items-center justify-between">
                        <span>CREDENTIALS CARD</span>
                        <span className="text-emerald-400">VERIFIED PASS</span>
                      </div>
                      <div className="text-xs space-y-1 text-slate-300">
                        <p><strong className="text-slate-400 w-24 inline-block">Consultant:</strong> Franklyn</p>
                        <p><strong className="text-slate-400 w-24 inline-block">Social / IG:</strong> <a href="https://instagram.com/franklynical" target="_blank" className="text-[#00f2fe] hover:underline">@franklynical</a></p>
                        <p><strong className="text-slate-400 w-24 inline-block">Masterclass:</strong> TC_UAS_M_2026</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        alert("🎉 Good Luck! Bantai Soal Teori Komputasi 100/100! Semangat UAS-nya!");
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-[#00f2fe] hover:from-emerald-400 hover:to-[#00f2fe] text-slate-950 font-bold font-mono rounded text-xs tracking-wider uppercase transition-all shadow-md shadow-[#00f2fe]/10 cursor-pointer"
                    >
                      BOOST MORAL ENERGY 🎉
                    </button>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* TELEMETRY CONTROLS & TIMELINE BAR */}
          <footer id="deck_controls" className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            
            {/* Visual Progress Scale Bar */}
            <div className="flex-1 w-full max-w-md flex items-center space-x-3 bg-white/[0.02] border border-white/5 p-2 rounded-lg backdrop-blur">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest shrink-0">Scale</span>
              
              <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden flex relative border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${(currentIdx / (SLIDES_DATA.length - 1)) * 100}%` }}
                />
              </div>

              <span className="font-mono text-[10px] text-slate-300 shrink-0">
                {Math.round((currentIdx / (SLIDES_DATA.length - 1)) * 100)}% Completed
              </span>
            </div>

            {/* Slide Action Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[#00f2fe]/30 hover:bg-[#00f2fe]/5 text-slate-300 hover:text-[#00f2fe] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-300 disabled:hover:border-white/10 transition-all flex items-center justify-center outline-none cursor-pointer"
                id="btn_prev_slide"
                title="Slaid Sebelumnya (Kiri)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-mono text-sm px-3 text-slate-300">
                {String(currentIdx + 1).padStart(2, '0')} / {String(SLIDES_DATA.length).padStart(2, '0')}
              </span>

              <button
                onClick={handleNext}
                disabled={currentIdx === SLIDES_DATA.length - 1}
                className="w-10 h-10 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 hover:bg-[#00f2fe]/20 text-[#00f2fe] disabled:opacity-30 transition-all flex items-center justify-center outline-none shadow-[0_0_10px_rgba(0,242,254,0.05)] cursor-pointer"
                id="btn_next_slide"
                title="Slaid Selanjutnya (Kanan atau Spasi)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </section>

        {/* SIDE GRADING ADVISOR PANEL (Dosen Advisor notes) */}
        {showNotes && (
          <aside id="advisor_notes_aside" className="w-full md:w-80 shrink-0 flex flex-col justify-between">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-[12px] p-5 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 shadow-xl"
            >
              <div>
                <div id="advisor_badge" className="flex items-center space-x-2 text-emerald-400 border-b border-white/5 pb-3 mb-4 font-mono text-xs">
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span className="font-bold tracking-widest uppercase"> grading advisor</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3.5 space-y-2">
                    <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">DOSEN GRADING TRAP:</p>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &quot;{activeSlide.notes}&quot;
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h5 className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">Standard Penulisan Jawaban:</h5>
                    <ul className="text-xs text-slate-400 space-y-1.5 pl-1">
                      <li className="flex items-start space-x-2">
                        <span className="text-[#00f2fe] mt-1 shrink-0">▶</span>
                        <span>Selalu definisikan alfabet input secara tuntas (Σ).</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-[#00f2fe] mt-1 shrink-0">▶</span>
                        <span>Gambarkan state penyerangan secara visual dan bersihkan transisi ganda.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>TARGET GRADE:</span>
                  <span className="text-[#00f2fe] font-bold">100 / A+ PERFECT</span>
                </div>
              </div>
            </motion.div>
          </aside>
        )}
      </main>
    </div>
  );
}
