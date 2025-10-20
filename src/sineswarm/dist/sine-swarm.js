import SineSwarmPoint from './sine-swarm-point.js';
class SineSwarm {
    constructor(config) {
        this.points = [];
        this.config = config;
        this.createScene();
        this.createAudio();
        this.createPoints();
        this.startAnimation();
    }
    createScene() {
        this.scene = window.document.createElement('canvas');
        this.scene.id = 'sine-swarm-scene';
        window.document.body.appendChild(this.scene);
        this.canvasContext = this.scene.getContext('2d');
        this.setSceneSize();
        window.addEventListener('resize', this.setSceneSize.bind(this));
    }
    setSceneSize() {
        this.scene.width = window.innerWidth;
        this.scene.height = window.innerHeight;
    }
    createAudio() {
        this.audio = {
            context: new window.AudioContext(),
            mixer: null
        };
        this.audio.mixer = this.audio.context.createGain();
        this.audio.mixer.connect(this.audio.context.destination);
        this.audio.mixer.gain.value = 1 / this.config.initialPointCount;
    }
    createPoints() {
        for (let i = 0; i < this.config.initialPointCount; i++) {
            this.points.push(new SineSwarmPoint(this.audio, this.config));
        }
    }
    drawPoints() {
        const scaler = 2;
        this.canvasContext.clearRect(0, 0, this.scene.width, this.scene.height);
        this.points
            .slice() // make copy so we can sort based on z without altering original order
            .sort((a, b) => a.currentPosition.z - b.currentPosition.z)
            .forEach(p => {
            const divider = scaler - p.currentPosition.z;
            const padding = (0.5 / scaler) - (p.currentPosition.z / 2 / scaler);
            const colorScale = p.currentPosition.z * 255;
            const color = p.collided
                ? `rgb(${colorScale}, ${colorScale}, ${colorScale})`
                : `rgb(0, ${colorScale}, 0)`;
            this.canvasContext.beginPath();
            this.canvasContext.arc((p.currentPosition.x / divider + padding) * this.scene.width, ((1 - p.currentPosition.y) / divider + padding) * this.scene.height, p.currentPosition.z * 20, 0, Math.PI * 2);
            this.canvasContext.closePath();
            this.canvasContext.fillStyle = color;
            this.canvasContext.fill();
        });
    }
    tunePoints() {
        const targetTime = this.audio.context.currentTime + 0.01;
        this.points.forEach(p => {
            p.oscillator.frequency.linearRampToValueAtTime((Math.pow(2, (p.currentPosition.y * 10))) * 20, targetTime);
            p.gain.gain.linearRampToValueAtTime((p.currentPosition.z), targetTime);
            p.panner.pan.linearRampToValueAtTime(p.currentPosition.x * 2 - 1, targetTime);
        });
    }
    startAnimation() {
        this.animationRequestId = requestAnimationFrame(this.tick.bind(this));
    }
    stopAnimation() {
        cancelAnimationFrame(this.animationRequestId);
        this.points.forEach(p => {
            p.oscillator.stop();
        });
        this.scene.remove();
    }
    tick(timestamp) {
        const deltaTime = timestamp - this.prevTickTime || 0;
        window.document.querySelector('#timer').textContent = Math.round(1000 / deltaTime).toString();
        this.prevTickTime = timestamp;
        // TODO: take timing from config and use here
        this.points.forEach((p, i) => {
            p.calculateVelocity(this.points, deltaTime);
            p.calculateNextPosition(deltaTime);
            p.trySnapping(this.points.slice(i + 1));
        });
        this.points.forEach(p => p.checkBounds());
        this.points.forEach(p => p.moveToNextPosition());
        this.drawPoints();
        this.tunePoints();
        this.animationRequestId = requestAnimationFrame(this.tick.bind(this));
    }
}
export default SineSwarm;
//# sourceMappingURL=sine-swarm.js.map