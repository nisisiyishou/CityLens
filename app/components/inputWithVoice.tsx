'use client';

import React, { useEffect, useState } from 'react';
import Recorder from 'recorder-js';

type Props = {
  className?: string;
  doSend: (text: string) => void;
};

export default function InputWithVoice({ className, doSend }: Props) {
  const [recorder, setRecorder] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');

  const init = () => {
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      const audioContext = new window.AudioContext({ sampleRate: 16000 });
      const recorderInstance = new Recorder(audioContext);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          recorderInstance.init(stream);
          setRecorder(recorderInstance);
        })
        .catch((err) => {
          console.error('can not access microphone', err);
        });
    }
  };

  const openModal = () => {
    init();
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const startRecording = () => {
    if (recorder && !isRecording && !processing) {
      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = (onClose: () => void) => {
    if (recorder && isRecording) {
      recorder.stop().then(({ blob }: { blob: Blob }) => {
        setIsRecording(false);
        speechToText(blob, onClose);
      });
    }
  };

  const sendHandler = (txt: string) => {
    if (txt.trim() === '') return;
    doSend(txt);
    setText('');
  };

  const speechToText = async (blob: Blob, onClose: () => void) => {
    if (processing) return;

    const formData = new FormData();
    formData.append('file', blob, 'recording.wav');

    setProcessing(true);

    try {
      const res = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const data: { text?: string } = await res.json();
      const out = (data.text ?? '').trim();

      if (out) {
        onClose();
        setText(out);
        sendHandler(out);
      }
    } catch (err) {
      console.error('Speech-to-text failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <div className={className}>
      <div className="relative">
        <input
          className="text-black w-full rounded-xl border border-gray-300 bg-white px-4 py-2 pr-24 text-base outline-none focus:border-green-300/90"
          placeholder="Type here ... or speak"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            className="h-7 w-7 rounded-full background-green hover:bg-gray-300 active:scale-95 transition"
            title="Speak"
            onClick={openModal}
            disabled={processing}
          >
            <span className="text-sm font-semibold">M</span>
          </button>

          <button
            type="button"
            className="h-7 w-7 rounded-full background-green text-white hover:bg-gray-800 active:scale-95 transition grid place-items-center"
            title="Send"
            onClick={() => sendHandler(text)}
            disabled={processing}
          >
            {/* SVG */}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path
                d="M4 11h11.17l-4.59-4.59L12 5l7 7-7 7-1.41-1.41L15.17 13H4v-2z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-20 z-50 mx-auto mb-16 w-[min(640px,92vw)] rounded-2xl border border-white/10 bg-white/80 backdrop-blur p-4 shadow-2xl"
          >
            <div className='flex justify-between items-center px-2'>
              <div className="mb-2 text-sm font-medium text-gray-700">
                City Lens makes your life easier.
              </div>
              <button
                type="button"
                className="self-end rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 active:scale-95 transition"
                onClick={closeModal}
                disabled={processing}
              >
                Close
              </button>
            </div>


            <div className="flex flex-col gap-3">
              <div
                className={`flex h-40 w-full items-center justify-center rounded-xl border ${isRecording ? 'border-red-400' : 'border-gray-300'
                  } bg-white/70 text-gray-800 select-none`}
                onMouseDown={startRecording}
                onMouseUp={() => stopRecording(closeModal)}
                onMouseLeave={() => isRecording && stopRecording(closeModal)}
                onTouchStart={startRecording}
                onTouchEnd={() => stopRecording(closeModal)}
                onTouchCancel={() => isRecording && stopRecording(closeModal)}
              >
                {processing ? (
                  <div className="flex items-center gap-2 text-primary">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="text-sm">Processing...</span>
                  </div>
                ) : (
                  <span className="text-base">
                    {isRecording ? 'Recording...' : 'Hold & Speak'}
                  </span>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}