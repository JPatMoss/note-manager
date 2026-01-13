import * as Tone from 'tone';

export class AudioVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id ${canvasId} not found`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        // Initial resize
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.waveform = new Tone.Waveform(512);
        this.isPlaying = false;

        // Start the loop
        this.draw();
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = 100; // Fixed height or dynamic
        }
    }

    connect(source) {
        if (source) {
            source.connect(this.waveform);
        }
    }

    draw() {
        requestAnimationFrame(() => this.draw());

        if (!this.canvas || !this.ctx) return;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const values = this.waveform.getValue();

        this.ctx.clearRect(0, 0, width, height);

        // Styling
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#646cff'; // Primary color
        this.ctx.beginPath();

        // Zero-crossing detection to stabilize waveform
        let startIndex = 0;
        // Find first zero crossing (going from negative to positive)
        for (let i = 1; i < values.length - 1; i++) {
            if (values[i] >= 0 && values[i - 1] < 0) {
                startIndex = i;
                break;
            }
        }

        const sliceWidth = width * 1.0 / (values.length - startIndex);
        let x = 0;

        for (let i = startIndex; i < values.length; i++) {
            const v = values[i];
            const y = (1 - v) * height / 2;

            if (i === startIndex) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.stroke();
    }
}
