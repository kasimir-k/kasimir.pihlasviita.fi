import Point from "./point.js";
class SineSwarmPoint {
    constructor(audio, config) {
        this.config = config;
        this.createOscillator(audio);
        this.currentPosition = new Point([0.5, 0.5, 0.5]);
        //this.currentPosition = new Point(this.randomizePosition())
        this.velocity = new Point(this.randomizeVelocity());
    }
    createOscillator(audio) {
        this.oscillator = audio.context.createOscillator();
        this.gain = audio.context.createGain();
        this.panner = audio.context.createStereoPanner();
        this.oscillator.connect(this.gain);
        this.gain.connect(this.panner);
        this.panner.connect(audio.mixer);
        this.gain.gain.value = 0;
        this.oscillator.start();
    }
    randomizePosition() {
        return [
            Math.random(),
            Math.random(),
            Math.random()
        ];
    }
    randomizeVelocity() {
        // TODO: use config to set speed limits
        const speedLimit = this.config.initialSpeedLimit;
        const vel = () => (Math.random() - 0.5) / 10000 * speedLimit;
        return [vel(), vel(), vel()];
    }
    calculateVelocity(allPoints, time) {
        const gravityForce = this.config.gravityForce * time;
        const gravityPoint = this.calculateDistanceRelativeGravity(allPoints);
        const gravityDelta = Point.coordinateDelta(gravityPoint, this.currentPosition);
        Point.dimensions.forEach(d => {
            this.velocity[d] = (this.velocity[d] * (1000000 - gravityForce) + gravityDelta[d] * gravityForce) / 1000000;
        });
    }
    trySnapping(points) {
        let foundKey = '';
        const snap = points.find(p => {
            if (p.nextPosition) {
                return false;
            }
            const keyCandidate = Point.distanceSignature(this.currentPosition, p.currentPosition, this.config.snappingSensitivity);
            if (this.config.snappingDeltas[keyCandidate]) {
                foundKey = keyCandidate;
                return true;
            }
            return false;
        });
        if (snap) {
            const delta = this.config.snappingDeltas[foundKey];
            snap.nextPosition = new Point();
            Point.dimensions.forEach((d, idx) => {
                const direction = this.currentPosition[d] < snap.currentPosition[d] ? 1 : -1;
                snap.nextPosition[d] = this.nextPosition[d] + (delta[idx] * direction);
                snap.velocity[d] = this.velocity[d];
            });
        }
    }
    calculateNextPosition(deltaTime) {
        this.nextPosition = new Point();
        Point.dimensions.forEach(d => {
            this.nextPosition[d] = this.currentPosition[d] + this.velocity[d] * deltaTime;
        });
    }
    checkBounds() {
        this.collided = false;
        Point.dimensions.forEach(d => {
            if (this.nextPosition[d] > 1) {
                this.nextPosition[d] = 2 - this.nextPosition[d];
                this.velocity[d] *= -1;
                this.collided = true;
            }
            else if (this.nextPosition[d] < 0) {
                this.nextPosition[d] *= -1;
                this.velocity[d] *= -1;
                this.collided = true;
            }
        });
    }
    moveToNextPosition() {
        Point.dimensions.forEach(d => {
            this.currentPosition[d] = this.nextPosition[d];
        });
        this.nextPosition = null;
    }
    calculateDistanceRelativeGravity(points) {
        const nearestPoints = this.findNearestPoints(points, 12);
        const gravity = nearestPoints.reduce((acc, point) => {
            Point.dimensions.forEach(d => {
                acc[d] += (1 - point.distance) * point.position[d];
            });
            return acc;
        }, Object.assign({}, this.currentPosition));
        Point.dimensions.forEach(d => {
            gravity[d] /= nearestPoints.length;
        });
        return gravity;
    }
    findNearestPoints(points, amount) {
        const distancesAndPoints = points
            .map(point => {
            const distance = Point.distanceBetweenPoints(this.currentPosition, point.currentPosition);
            return {
                distance,
                position: point.currentPosition
            };
        })
            .sort((a, b) => {
            // ascending distances
            return a.distance - b.distance;
        });
        distancesAndPoints.shift(); // nearest point is self, remove
        distancesAndPoints.splice(amount);
        return distancesAndPoints;
    }
}
export default SineSwarmPoint;
//# sourceMappingURL=sine-swarm-point.js.map