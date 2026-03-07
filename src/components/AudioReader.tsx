"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ContentBlock } from "@/lib/content";

interface AudioReaderProps {
  blocks: ContentBlock[];
}

// Voices that sound more natural — prioritize these
const PREFERRED_VOICE_PATTERNS = [
  "Google US English",
  "Google UK English Female",
  "Google UK English Male",
  "Microsoft Zira",
  "Microsoft David",
  "Microsoft Mark",
  "Microsoft Jenny",
  "Microsoft Aria",
  "Microsoft Guy",
  "Microsoft Ana",
  "Samantha",  // macOS
  "Alex",      // macOS
  "Karen",     // macOS
  "Daniel",    // macOS
  "Moira",     // macOS
  "Tessa",     // macOS
  "Natural",   // catches "Microsoft ... Natural" voices
  "Neural",    // catches neural TTS voices
  "Online",    // Chrome's online voices tend to be better
];

function isPreferredVoice(name: string): boolean {
  return PREFERRED_VOICE_PATTERNS.some((p) =>
    name.toLowerCase().includes(p.toLowerCase())
  );
}

function extractText(blocks: ContentBlock[]): string {
  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
      case "subheading":
      case "paragraph":
        parts.push(block.text);
        break;
      case "concept":
        parts.push(block.title + ". " + block.text);
        break;
      case "tip":
        parts.push("Tip: " + block.text);
        break;
      case "step":
        parts.push("Step " + block.number + ": " + block.title + ". " + block.text);
        break;
      case "comparison":
        parts.push(block.left.title + ": " + block.left.text + ". " + block.right.title + ": " + block.right.text);
        break;
      case "prompt-card":
        parts.push("Prompt pattern: " + block.phrase + ". " + block.explanation);
        break;
      case "myth-reality":
        parts.push("Myth: " + block.myth + ". Reality: " + block.reality);
        break;
      case "checklist":
        parts.push(block.items.join(". "));
        break;
      case "exercise":
        parts.push("Exercise: " + block.prompt);
        break;
      case "quiz":
        parts.push("Quiz: " + block.question);
        break;
      case "accordion":
        parts.push(block.title + ". " + block.content);
        break;
    }
  }

  return parts.join("\n\n");
}

export default function AudioReader({ blocks }: AudioReaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [rate, setRate] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef("");
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const charIndexRef = useRef(0);

  // Check support & load voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }

    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      const english = allVoices.filter((v) => v.lang.startsWith("en"));

      // Sort: preferred natural-sounding voices first, then others
      const sorted = english.sort((a, b) => {
        const aPref = isPreferredVoice(a.name);
        const bPref = isPreferredVoice(b.name);
        if (aPref && !bPref) return -1;
        if (!aPref && bPref) return 1;
        if (a.default && !b.default) return -1;
        if (!a.default && b.default) return 1;
        return a.name.localeCompare(b.name);
      });

      const others = allVoices.filter((v) => !v.lang.startsWith("en"));
      setVoices([...sorted, ...others]);

      // Auto-select the best available voice
      if (!selectedVoiceURI && sorted.length > 0) {
        setSelectedVoiceURI(sorted[0].voiceURI);
      }
    };

    loadVoices();
    speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [selectedVoiceURI]);

  // Extract text when blocks change
  useEffect(() => {
    textRef.current = extractText(blocks);
  }, [blocks]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const total = textRef.current.length;
      if (total > 0) {
        setProgress(Math.min((charIndexRef.current / total) * 100, 100));
      }
    }, 200);
  }, []);

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handlePlay = () => {
    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      startProgressTracking();
      return;
    }

    speechSynthesis.cancel();

    const text = textRef.current;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1;

    charIndexRef.current = 0;

    utterance.onboundary = (e) => {
      if (e.name === "word") {
        charIndexRef.current = e.charIndex;
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      stopProgressTracking();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      stopProgressTracking();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    startProgressTracking();
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
    stopProgressTracking();
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    charIndexRef.current = 0;
    stopProgressTracking();
  };

  // Minimize: just close the panel, keep audio running
  const handleMinimize = () => {
    setIsOpen(false);
  };

  if (!supported) return null;

  const isActive = isPlaying || isPaused;

  // Collapsed: small button — shows playing state
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full shadow-lg transition-all flex items-center justify-center ${
          isActive
            ? "bg-teal-600 text-white hover:bg-teal-700"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
        title={isActive ? "Audio playing — tap to open controls" : "Listen to this lesson"}
      >
        {isActive ? (
          <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    );
  }

  // Label for voice dropdown — tag preferred voices
  const voiceLabel = (v: SpeechSynthesisVoice) => {
    const pref = isPreferredVoice(v.name);
    return pref ? `${v.name} (${v.lang})` : `${v.name} (${v.lang})`;
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-100">
        <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
          Listen to Lesson
        </span>
        <button
          onClick={handleMinimize}
          className="text-stone-400 hover:text-stone-600 transition-colors"
          title="Minimize — audio keeps playing"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-stone-100">
        <div
          className="h-full bg-teal-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4 space-y-4">
        {/* Playback controls */}
        <div className="flex items-center justify-center gap-3">
          {/* Stop */}
          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-md"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Speed */}
          <button
            onClick={() => {
              const speeds = [0.75, 1.0, 1.25, 1.5];
              const idx = speeds.indexOf(rate);
              const next = speeds[(idx + 1) % speeds.length];
              setRate(next);
              if (isPlaying || isPaused) {
                handleStop();
              }
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors text-xs font-bold"
          >
            {rate}x
          </button>
        </div>

        {/* Voice selector */}
        {voices.length > 0 && (
          <div>
            <label className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5">
              Voice
            </label>
            <select
              value={selectedVoiceURI}
              onChange={(e) => {
                setSelectedVoiceURI(e.target.value);
                if (isPlaying || isPaused) {
                  handleStop();
                }
              }}
              className="w-full text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
            >
              {voices.map((v, i) => {
                const pref = isPreferredVoice(v.name);
                // Add separator between preferred and other voices
                const prevPref = i > 0 && isPreferredVoice(voices[i - 1].name);
                const showSep = !pref && prevPref;
                return showSep ? (
                  <optgroup key={`group-${i}`} label="Other voices">
                    <option value={v.voiceURI}>{voiceLabel(v)}</option>
                  </optgroup>
                ) : (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {pref ? `\u2605 ${voiceLabel(v)}` : voiceLabel(v)}
                  </option>
                );
              })}
            </select>
            <p className="text-[9px] text-stone-400 mt-1">
              \u2605 = recommended for natural sound
            </p>
          </div>
        )}

        {/* Status */}
        <p className="text-[10px] text-center text-stone-400">
          {isPlaying
            ? "Reading aloud..."
            : isPaused
            ? "Paused"
            : "Press play to listen"}
        </p>
      </div>
    </div>
  );
}
