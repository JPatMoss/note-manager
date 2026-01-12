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

        const sliceWidth = width * 1.0 / values.length;
        let x = 0;

        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            // values are roughly -1 to 1. Map to height.
            // value 0 -> height/2
            // value 1 -> 0
            // value -1 -> height
            const y = (1 - v) * height / 2;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.lineTo(width, height / 2);
        this.ctx.stroke();
    }
}
