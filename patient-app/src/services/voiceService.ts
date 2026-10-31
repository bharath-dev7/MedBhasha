/**
 * MedBhasha Voice & Audio Service
 * Implements S5, ADR-006, and ref/08-translation-lock-spec.md
 */

import { localDb } from '../db/localStore';

export class VoiceService {
  /**
   * Speaks the given text using Web SpeechSynthesis API
   */
  public static speak(text: string, lang: 'te' | 'en' = 'te') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85; // Slightly slower for elderly comprehension
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'te') {
      const teVoice = voices.find((v) => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
      if (teVoice) {
        utterance.voice = teVoice;
        utterance.lang = 'te-IN';
      } else {
        // Fallback voice
        utterance.lang = 'en-IN';
      }
    } else {
      utterance.lang = 'en-IN';
    }

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Plays a gentle, attention-grabbing chime sound using Web Audio API
   * Used for Alarms and Reminder alerts
   */
  public static playAlarmChime() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // Soft dual-tone chime (harmonic frequencies)
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.2, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 1.2);
      });
    } catch (e) {
      console.warn('AudioContext chime error:', e);
    }
  }

  public static stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
