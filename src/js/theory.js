export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Calculates a target note based on a base note and interval.
 * @param {string} baseNote - The starting note (e.g., "C").
 * @param {number} semitones - The interval in semitones (e.g., 4 for Major 3rd).
 * @param {string} direction - "up" or "down".
 * @returns {object} { note: string, octaveOffset: number }
 */
export function getNote(baseNote, semitones, direction) {
    const baseIndex = NOTES.indexOf(baseNote);
    if (baseIndex === -1) throw new Error("Invalid Note");

    let targetIndex;
    let octaveOffset = 0;

    if (direction === 'up') {
        targetIndex = baseIndex + semitones;
        if (targetIndex >= NOTES.length) {
            octaveOffset = Math.floor(targetIndex / NOTES.length);
            targetIndex = targetIndex % NOTES.length;
        }
    } else {
        targetIndex = baseIndex - semitones;
        if (targetIndex < 0) {
            // Calculate how many octaves down we went
            // e.g. base = 0 (C), semi = 7 (G down). -7. 
            // -7 / 12 = -0.58 -> floor = -1. 
            // -7 % 12 = -7. (-7 + 12) % 12 = 5 (F)? Wait.
            // C down 5th (7 semitones) is F. 
            // Index 0. 0 - 7 = -7. 
            // wrapping: ((-7 % 12) + 12) % 12 = 5 (F). 
            // octave offset: Math.floor(-7 / 12) = -1. Correct.

            octaveOffset = Math.floor(targetIndex / NOTES.length);
            targetIndex = ((targetIndex % NOTES.length) + NOTES.length) % NOTES.length;
        }
    }

    return {
        note: NOTES[targetIndex],
        octaveOffset: octaveOffset
    };
}

/**
 * Generates a chromatic sequence of notes from start to target.
 * @param {string} baseNote - e.g. "G"
 * @param {number} semitones - e.g. 5
 * @param {string} direction - "up" or "down"
 * @returns {Array<{note: string, octaveOffset: number}>} Array of note objects
 */
export function getChromaticScale(baseNote, semitones, direction) {
    const sequence = [];
    for (let i = 0; i <= semitones; i++) {
        sequence.push(getNote(baseNote, i, direction));
    }
    return sequence;
}
