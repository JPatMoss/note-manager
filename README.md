# Musical Interval Explorer

A lightweight, interactive web application for exploring musical intervals, sequences, and audio visualization. Built with **Vite**, **Vanilla JS**, and **Tone.js**.

🚀 **Live Demo:** [https://scintillating-lebkuchen-96fa08.netlify.app/](https://scintillating-lebkuchen-96fa08.netlify.app/)

![App Screenshot](https://raw.githubusercontent.com/JPatMoss/note-manager/main/public/vite.svg) *Note: Replace with actual screenshot if available in repo*

## 🎵 How It Works

This application allows musicians and students to visualize and hear the relationship between a **Base Note** and various musical intervals (3rd, 5th, 8th, etc.).

### Core Concepts

1.  **Base Note Selection**: Choose a root note (e.g., `G`) and a starting octave (e.g., `4`). This serves as the foundation for all sequences.
2.  **Intervals**: The app lists common intervals (3rd, 5th, 8th, 10th, 12th). Each interval represents a distance from the base note.
3.  **Direction (Up/Down)**:
    *   **Up**: Plays the scale ascending from the Base Note to the Target Interval.
    *   **Down**: Starts from a calculated "Anchor" note (Base + 7 semitones) and plays descending to the target.
4.  **Palindrome Mode (To & Fro)**:
    *   **Linear (→)**: Plays the sequence once (Start → End).
    *   **To & Fro (⟲)**: Plays the sequence there and back again (Start → End → Start), creating a seamless loop.
5.  **Visualizer**: A real-time oscilloscope shows the waveform of the audio being generated, helping to visualize the sound waves.

## 🛠️ Usage

1.  **Select Base**: Use the top dropdowns to pick a key (e.g., `C`) and octave (`4`).
2.  **Configure Intervals**:
    *   Click **Up/Down** to change direction.
    *   Click the **⟲ / →** toggle to switch between Palindrome and Linear modes.
3.  **Play**: Click the **▶** button on any row to hear the sequence.
4.  **Loop**: Toggle the "Loop" checkbox at the top to keep the sequence repeating indefinitely.
5.  **Duration**: Adjust the "Duration" input to speed up or slow down the playback.

## ✨ Proposed Features / Roadmap

We are constantly improving the app. Here are some ideas for future development:

### 🎹 Advanced Audio
*   **Chord Mode**: Ability to play the Base Note and Target Note simultaneously instead of sequentially.
*   **Custom Synths**: Allow users to switch between Sine, Square, Sawtooth, and FM synthesis.
*   **MIDI Support**: Connect a generic MIDI keyboard to trigger the base note.

### 🎼 Theory Tools
*   **Scale Explorer**: Visualize entire scales (Major, Minor, Pentatonic, Dorian) on a virtual fretboard or keyboard.
*   **Custom Intervals**: Allow users to define their own intervals (e.g., "Minor 6th", "Tritone") by specifying semitones.

### 🎨 UI/UX Enhancements
*   **Dark/Light Theme**: Theme switcher for late-night practice sessions.
*   **Piano Roll View**: A visual representation of the notes on a piano keyboard as they are played.
*   **Share Presets**: Generate a URL that pre-loads a specific configuration (e.g., `?base=C&int=5&dir=down`).

## 💻 Tech Stack

*   **Framework**: Vanilla JavaScript (No heavy framework overhead)
*   **Build Tool**: Vite
*   **Audio**: Tone.js
*   **Styling**: CSS3 (Grid/Flexbox)

## 📦 Installation

To run this locally:

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Run development server
npm run dev
```
