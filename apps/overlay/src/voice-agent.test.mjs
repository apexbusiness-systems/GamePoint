import test from 'node:test';
import assert from 'node:assert/strict';
import {
  browserSpeechRecognizer,
  browserSpeechSynthesis,
  ENABLE_VOICE_INPUT,
  matchVoiceIntent,
  speakAdvice,
} from './voice-agent.ts';

// --- matchVoiceIntent: closed-vocabulary only, never open dictation -------------------

test('matchVoiceIntent maps known phrases to the existing HotkeyIntent enum', () => {
  assert.equal(matchVoiceIntent('assist'), 'assist');
  assert.equal(matchVoiceIntent('Help!'), 'assist');
  assert.equal(matchVoiceIntent("what's next"), 'assist');
  assert.equal(matchVoiceIntent('Explain that.'), 'explain');
  assert.equal(matchVoiceIntent('why'), 'explain');
  assert.equal(matchVoiceIntent('Recap'), 'recap');
  assert.equal(matchVoiceIntent('summarize'), 'recap');
});

test('matchVoiceIntent fails closed on anything unrecognized — no free-text passthrough', () => {
  assert.equal(matchVoiceIntent('what is the capital of france'), null);
  assert.equal(matchVoiceIntent(''), null);
  assert.equal(matchVoiceIntent('   '), null);
  assert.equal(matchVoiceIntent('assist me with something totally unscripted'), 'assist'); // contains 'assist'
});

test('matchVoiceIntent is case- and punctuation-insensitive but not fuzzy beyond that', () => {
  assert.equal(matchVoiceIntent('  RECAP?  '), 'recap');
  assert.equal(matchVoiceIntent('recaps'), null, 'no stemming — closed vocabulary is literal');
});

// --- speakAdvice: gated, cancels-before-speak, never speaks when disabled/muted -------

function fakeSynth() {
  const calls = { speak: [], cancel: 0 };
  return {
    calls,
    speak: (u) => calls.speak.push(u),
    cancel: () => {
      calls.cancel += 1;
    },
  };
}

test('speakAdvice speaks only when enabled, consented-equivalent flag true, and not muted', () => {
  const synth = fakeSynth();
  const spoke = speakAdvice(synth, 'Refill flasks.', { enabled: true, muted: false });
  assert.equal(spoke, true);
  assert.equal(synth.calls.speak.length, 1);
  assert.equal(synth.calls.speak[0].text, 'Refill flasks.');
  assert.equal(synth.calls.cancel, 1, 'cancels any prior utterance before speaking the new one');
});

test('speakAdvice is a no-op when disabled', () => {
  const synth = fakeSynth();
  assert.equal(speakAdvice(synth, 'text', { enabled: false, muted: false }), false);
  assert.equal(synth.calls.speak.length, 0);
});

test('speakAdvice is a no-op when muted, even if voice output is enabled', () => {
  const synth = fakeSynth();
  assert.equal(speakAdvice(synth, 'text', { enabled: true, muted: true }), false);
  assert.equal(synth.calls.speak.length, 0);
});

test('speakAdvice is a no-op with no synth (unsupported browser) or empty text', () => {
  assert.equal(speakAdvice(null, 'text', { enabled: true, muted: false }), false);
  const synth = fakeSynth();
  assert.equal(speakAdvice(synth, '', { enabled: true, muted: false }), false);
});

// --- Environment guards: no window in this Node test runner --------------------------

test('browserSpeechSynthesis / browserSpeechRecognizer return null outside a browser', () => {
  assert.equal(browserSpeechSynthesis(), null);
  assert.equal(browserSpeechRecognizer(), null);
});

// --- STT is shipped feature-flagged off until Windows-verified (ADR-010) -------------

test('ENABLE_VOICE_INPUT defaults to false — STT is not live until verified local-only', () => {
  assert.equal(ENABLE_VOICE_INPUT, false);
});
