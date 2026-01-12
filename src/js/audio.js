import * as Tone from 'tone';

let synth;

export async function initAudio() {
    if (!synth) {
        await Tone.start();
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
        console.log("Audio initialized");
    }
}

export function playNote(note, octave = 4, duration = "8n") {
    if (!synth) {
        console.warn("Audio not initialized. Click interaction needed first.");
        return;
    }
    // Tone.js accepts notes like "C4", "D#5"
    const fullNote = `${note}${octave}`;
    synth.triggerAttackRelease(fullNote, duration);
}
