"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  Send, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles,
  Radio as RadioIcon
} from "lucide-react";
import { saveContactMessage } from "@/lib/cms";

type TabMode = "voice" | "text";

export default function AppMensajesPage() {
  const [tab, setTab] = useState<TabMode>("voice");

  // Formulario texto
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [sendingText, setSendingText] = useState(false);
  const [textSuccess, setTextSuccess] = useState(false);
  const [textError, setTextError] = useState("");

  // Grabador de voz
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [voiceName, setVoiceName] = useState("");
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const [voiceSuccess, setVoiceSuccess] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Limpiar timer y urls
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Manejador de Inicio de Grabación
  async function startRecording() {
    setVoiceError("");
    setVoiceSuccess(false);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu dispositivo no soporta grabación de audio en el navegador.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const type = mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Detener tracks del micrófono
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Mic error:", err);
      setVoiceError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Permiso denegado. Concede permiso al micrófono para grabar tu nota de voz."
          : err.message || "No se pudo acceder al micrófono."
      );
    }
  }

  // Detener Grabación
  function stopRecording() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }

  // Descartar Grabación
  function resetRecording() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setIsPlayingPreview(false);
    setVoiceError("");
  }

  // Toggle Reproducir Preview
  function togglePreview() {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  }

  // Enviar Nota de Voz
  async function handleSendVoice() {
    if (!audioBlob) return;
    setIsUploadingVoice(true);
    setVoiceError("");

    try {
      // 1. Subir a B2 a través del endpoint existente
      const ext = audioBlob.type.includes("mp4") ? "m4a" : "webm";
      const file = new File([audioBlob], `voicenote_${Date.now()}.${ext}`, { type: audioBlob.type });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "voicenotes");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("No se pudo subir la nota de voz");
      }

      const uploadResult = await res.json();
      const uploadedAudioUrl = uploadResult.url;

      // 2. Guardar en Firestore colección messages
      await saveContactMessage({
        name: voiceName.trim() || "Oyente Móvil (Nota de Voz)",
        email: "app@radiolibre.com",
        subject: "🎙️ Nota de Voz recibida desde la App",
        message: `Nota de voz de ${recordingSeconds} segundos enviada desde la aplicación móvil.`,
        audioUrl: uploadedAudioUrl,
        audioDuration: recordingSeconds,
      });

      setVoiceSuccess(true);
      resetRecording();
      setVoiceName("");
      setTimeout(() => setVoiceSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error sending voice note:", err);
      setVoiceError("No se pudo enviar la nota de voz. Por favor intenta de nuevo.");
    } finally {
      setIsUploadingVoice(false);
    }
  }

  // Enviar Mensaje Escrito
  async function handleSendText(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setTextError("Por favor completa tu nombre y el mensaje.");
      return;
    }

    setSendingText(true);
    setTextError("");

    try {
      await saveContactMessage({
        name: name.trim(),
        email: contactInfo.trim() || "oyente@radiolibre.com",
        subject: "Mensaje escrito desde la App",
        message: message.trim(),
      });

      setTextSuccess(true);
      setName("");
      setContactInfo("");
      setMessage("");
      setTimeout(() => setTextSuccess(false), 5000);
    } catch {
      setTextError("No se pudo enviar el mensaje. Por favor intenta de nuevo.");
    } finally {
      setSendingText(false);
    }
  }

  function formatSeconds(sec: number) {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col px-4 pt-3 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/app"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition active:scale-95"
          aria-label="Regresar"
        >
          <ChevronLeft size={20} />
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
            Línea Abierta
          </p>
          <h1 className="text-base font-black text-white tracking-tight uppercase">
            Enviar Mensajes
          </h1>
        </div>

        <div className="w-10" />
      </div>

      {/* Selector de Modo: Nota de Voz vs Texto */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#141418] border border-white/10 mb-6">
        <button
          type="button"
          onClick={() => setTab("voice")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tab === "voice"
              ? "bg-brand-accent text-brand-night shadow-md shadow-brand-accent/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Mic size={16} />
          Nota de Voz
        </button>

        <button
          type="button"
          onClick={() => setTab("text")}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            tab === "text"
              ? "bg-brand-accent text-brand-night shadow-md shadow-brand-accent/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Send size={16} />
          Mensaje Escrito
        </button>
      </div>

      {/* ======================= TAB 1: NOTA DE VOZ ======================= */}
      {tab === "voice" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181820] to-[#111115] border border-white/10 text-center relative overflow-hidden shadow-xl">
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Graba tu Nota de Voz
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
              Tu voz saldrá al aire en Radio Libre 93.9 FM. Envía tu saludo, denuncia o pide tu canción.
            </p>

            {/* Visualizer & Timer */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div className="relative">
                {isRecording && (
                  <span className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
                )}

                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={Boolean(audioBlob) || isUploadingVoice}
                  className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 shadow-2xl active:scale-95 disabled:opacity-50 ${
                    isRecording
                      ? "bg-red-500 text-white shadow-red-500/40 animate-pulse"
                      : "bg-brand-accent text-brand-night shadow-brand-accent/30 hover:scale-105"
                  }`}
                  aria-label={isRecording ? "Detener grabación" : "Comenzar a grabar"}
                >
                  {isRecording ? <Square size={30} /> : <Mic size={36} />}
                </button>
              </div>

              {/* Timer status */}
              <div className="mt-5">
                {isRecording ? (
                  <div className="flex items-center gap-2 text-red-400 font-mono text-xl font-black">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span>{formatSeconds(recordingSeconds)}</span>
                  </div>
                ) : audioBlob ? (
                  <p className="text-xs font-bold text-emerald-400">
                    ¡Grabación lista! ({formatSeconds(recordingSeconds)})
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-zinc-400">
                    Toca el micrófono para comenzar a grabar
                  </p>
                )}
              </div>
            </div>

            {/* Audio Preview Box */}
            {audioUrl && (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <audio
                  ref={previewAudioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlayingPreview(false)}
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent text-brand-night hover:scale-105 transition"
                    >
                      {isPlayingPreview ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-white text-left">Escuchar grabación</p>
                      <p className="text-[10px] text-zinc-400 text-left">Duración: {formatSeconds(recordingSeconds)}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetRecording}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                    title="Eliminar y grabar de nuevo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="pt-2">
                  <input
                    type="text"
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    placeholder="Tu nombre (opcional)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-brand-accent"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendVoice}
                  disabled={isUploadingVoice}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-accent text-brand-night font-black uppercase text-xs tracking-wider shadow-lg shadow-brand-accent/30 transition hover:scale-[1.02] active:scale-98 disabled:opacity-60"
                >
                  {isUploadingVoice ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-brand-night" />
                      <span>Subiendo audio a cabina...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Enviar Nota de Voz</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Notifications */}
            {voiceSuccess && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl animate-in fade-in">
                <CheckCircle2 size={16} />
                ¡Tu nota de voz fue enviada con éxito a cabina!
              </div>
            )}

            {voiceError && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-in fade-in">
                <AlertCircle size={16} />
                {voiceError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= TAB 2: MENSAJE ESCRITO ======================= */}
      {tab === "text" && (
        <form
          onSubmit={handleSendText}
          className="p-6 rounded-3xl bg-gradient-to-b from-[#181820] to-[#111115] border border-white/10 shadow-xl space-y-4"
        >
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">
              Escríbenos a Cabina
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Envía tu mensaje directamente al equipo de locutores y producción.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Tu Nombre *
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-accent transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Teléfono o Email (opcional)
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Ej. 0987654321 o tu@correo.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-accent transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Mensaje *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje, saludo o petición musical..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-brand-accent transition resize-none"
            />
          </div>

          {textSuccess && (
            <div className="flex items-center gap-2 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl animate-in fade-in">
              <CheckCircle2 size={16} />
              ¡Mensaje enviado con éxito a cabina!
            </div>
          )}

          {textError && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl animate-in fade-in">
              <AlertCircle size={16} />
              {textError}
            </div>
          )}

          <button
            type="submit"
            disabled={sendingText}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-accent text-brand-night font-black uppercase text-xs tracking-wider shadow-lg shadow-brand-accent/30 transition hover:scale-[1.02] active:scale-98 disabled:opacity-60"
          >
            {sendingText ? (
              <>
                <Loader2 size={16} className="animate-spin text-brand-night" />
                <span>Enviando mensaje...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Enviar Mensaje</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
