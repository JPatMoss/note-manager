import './style.css'
import { NOTES, getNote, getChromaticScale } from './js/theory.js'
import { initAudio, playNote } from './js/audio.js'

// State
const state = {
  baseNote: 'G',
  baseOctave: 4,
  duration: 0.5,
  isLooping: false,
  playingIntervalIndex: null, // Track which interval is playing
  intervals: [
    { id: '3rd', label: '3', semitones: 2, direction: 'up' },
    { id: '5th', label: '5', semitones: 4, direction: 'up' },
    { id: '8th', label: '8', semitones: 7, direction: 'up' },
    { id: '10th', label: '10', semitones: 9, direction: 'up' },
    { id: '12th', label: '12', semitones: 11, direction: 'up' }
  ]
};

const app = document.querySelector('#app');
const baseSelect = document.getElementById('base-note');
const octaveSelect = document.getElementById('octave-selector');
const intervalContainer = document.getElementById('interval-container');
const playBaseBtn = document.getElementById('play-base');
const durationInput = document.getElementById('duration-input');
const loopToggle = document.getElementById('loop-toggle');

let currentSequenceTimeouts = [];

function clearSequence() {
  currentSequenceTimeouts.forEach(id => clearTimeout(id));
  currentSequenceTimeouts = [];
  state.playingIntervalIndex = null;
  // We don't full re-render here to avoid glitching if not needed, 
  // but we should remove playing classes
  document.querySelectorAll('.interval-row').forEach(row => {
    row.classList.remove('playing');
    const btn = row.querySelector('.play-btn');
    if (btn) btn.textContent = '▶';
  });
}

// NOTE: race condition fix - async to await initAudio
async function playSequence(index) {
  clearSequence(); // Stop any existing sequence
  await initAudio(); // Ensure audio context is ready/resumed

  state.playingIntervalIndex = index;

  // Update UI manually to avoid full re-render
  renderIntervals();

  const interval = state.intervals[index];

  // Logic Refactor: Down starts from Base + 8 semitones
  let startNote = state.baseNote;
  let startOctave = state.baseOctave;

  if (interval.direction === 'down') {
    // Calculate Anchor (Base + 7 semitones to reach the 5th/Rey/D)
    const anchor = getNote(state.baseNote, 7, 'up');
    startNote = anchor.note;
    startOctave = state.baseOctave + anchor.octaveOffset;
  }

  const sequence = getChromaticScale(startNote, interval.semitones, interval.direction);

  // Schedule each note
  sequence.forEach((item, stepIndex) => {
    const delay = stepIndex * state.duration * 1000;

    const timeoutId = setTimeout(() => {
      // Play Sound
      // Combine startOctave (which includes anchor offset) with item's relative offset
      playNote(item.note, startOctave + item.octaveOffset, state.duration);

      // Update UI (Visually highlight current note)
      highlightNote(index, item.note);

      // Check if last note
      if (stepIndex === sequence.length - 1) {
        if (state.isLooping && state.playingIntervalIndex == index) {
          // Loop: Play again after duration
          const loopId = setTimeout(() => {
            playSequence(index);
          }, state.duration * 1000);
          currentSequenceTimeouts.push(loopId);
        } else {
          // End of sequence
          const finishId = setTimeout(() => {
            state.playingIntervalIndex = null;
            renderIntervals();
          }, state.duration * 1000);
          currentSequenceTimeouts.push(finishId);
        }
      }
    }, delay);

    currentSequenceTimeouts.push(timeoutId);
  });
}

function highlightNote(rowIndex, noteName) {
  const row = document.querySelector(`.interval-row[data-index="${rowIndex}"]`);
  if (row) {
    const display = row.querySelector('.note-display');
    display.textContent = noteName;
    display.style.color = 'var(--primary-color)';
    // Reset color after duration
    setTimeout(() => {
      if (display) display.style.color = '';
    }, state.duration * 1000 * 0.9);
  }
}

function renderBaseOptions() {
  baseSelect.innerHTML = NOTES.map(note =>
    `<option value="${note}" ${note === state.baseNote ? 'selected' : ''}>${note}</option>`
  ).join('');
}

function renderIntervals() {
  intervalContainer.innerHTML = state.intervals.map((interval, index) => {
    // Logic Refactor for Display Note
    let startNote = state.baseNote;
    // We don't need octave here for the *name* display, but let's be consistent
    // (getNote handles wrapping, so just need correct base)
    if (interval.direction === 'down') {
      const anchor = getNote(state.baseNote, 7, 'up');
      startNote = anchor.note;
    }

    const result = getNote(startNote, interval.semitones, interval.direction);
    const isUp = interval.direction === 'up';
    // Use loosely equal in case of string vs number index
    const isPlaying = state.playingIntervalIndex == index;

    return `
      <div class="interval-row ${isPlaying ? 'playing' : ''}" data-index="${index}">
        <div class="interval-label">${interval.label}</div>
        <div class="toggle-group">
          <button class="toggle-btn ${isUp ? 'active' : ''}" data-dir="up">Up</button>
          <button class="toggle-btn ${!isUp ? 'active' : ''}" data-dir="down">Down</button>
        </div>
        <div class="note-display">${result.note}</div>
        <button class="play-btn" data-action="play">${isPlaying ? 'Stop' : '▶'}</button>
      </div>
    `;
  }).join('');

  attachIntervalListeners();
}

function attachIntervalListeners() {
  // Toggle buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      clearSequence(); // Stop playing if user interacts
      const row = e.target.closest('.interval-row');
      const index = row.dataset.index;
      const newDir = e.target.dataset.dir;

      if (state.intervals[index].direction !== newDir) {
        state.intervals[index].direction = newDir;
        renderIntervals();
      }
    });
  });

  // Play buttons (Intervals) 
  document.querySelectorAll('.interval-row .play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.interval-row');
      const index = row.dataset.index;

      if (state.playingIntervalIndex == index) {
        clearSequence(); // Stop if already playing
      } else {
        playSequence(index);
      }
    });
  });
}

function init() {
  renderBaseOptions();
  renderIntervals();

  // Inputs
  durationInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    if (val > 0) {
      state.duration = val;
    }
  });

  loopToggle.addEventListener('change', (e) => {
    state.isLooping = e.target.checked;
  });

  octaveSelect.addEventListener('change', (e) => {
    state.baseOctave = parseInt(e.target.value);
    clearSequence(); // Reset any playing sequence
  });

  // Base Note Change
  baseSelect.addEventListener('change', (e) => {
    clearSequence();
    state.baseNote = e.target.value;
    renderIntervals();
  });

  // Base Note Play
  playBaseBtn.addEventListener('click', async () => {
    await initAudio();
    playNote(state.baseNote, state.baseOctave, state.duration);
  });

  // Global click to start audio context (browser policy)
  document.addEventListener('click', () => {
    initAudio();
  }, { once: true });
}

init();
