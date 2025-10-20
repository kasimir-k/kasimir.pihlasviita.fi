class Point {
    constructor(xyz) {
        [this.x, this.y, this.z] = xyz || [null, null, null];
    }
    static distanceBetweenPoints(a, b) {
        const distance = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        return distance;
    }
    static coordinateDelta(a, b) {
        const delta = {};
        this.dimensions.forEach(d => {
            delta[d] = a[d] - b[d];
        });
        return delta;
    }
    static distanceSignature(a, b, snappingSensitivity) {
        const parts = this.dimensions.map(d => {
            return Math.round(Math.abs(a[d] - b[d]) * snappingSensitivity);
        });
        return parts.join('-');
    }
}
Point.dimensions = ['x', 'y', 'z'];
export default Point;
//# sourceMappingURL=point.js.map