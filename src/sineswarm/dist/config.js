const initialPointCount = 100;
const harmonicRelations = [2 / 1, 3 / 1, 3 / 2, 4 / 1, 4 / 3, 5 / 2, 5 / 3, 5 / 4, 6 / 5];
const snappingSensitivity = 500;
const harmDist = harmonicRelations
    .map(r => {
    return (Math.log2(r) / 10);
})
    .sort();
const snappingDeltas = {};
harmDist.forEach(x => {
    harmDist.forEach(y => {
        harmDist.forEach(z => {
            const key = Math.round(x * snappingSensitivity) +
                '-' +
                Math.round(y * snappingSensitivity) +
                '-' +
                Math.round(z * snappingSensitivity);
            snappingDeltas[key] = [x, y, z];
        });
    });
});
export { initialPointCount, snappingSensitivity, snappingDeltas };
//# sourceMappingURL=config.js.map