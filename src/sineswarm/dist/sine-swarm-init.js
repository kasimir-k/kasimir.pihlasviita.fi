import SineSwarm from "./sine-swarm.js";
let activeSwarm = null;
const uiPanel = document.querySelector('article');
const harmonicRelations = [2 / 1, 3 / 1, 3 / 2, 4 / 1, 4 / 3, 5 / 2, 5 / 3, 5 / 4, 6 / 5];
const harmDist = harmonicRelations
    .map(r => {
    return (Math.log2(r) / 10);
})
    .sort();
const config = {
    initialPointCount: 0,
    snappingSensitivity: 0,
    snappingDeltas: {}
};
const sineSwarmInit = () => {
    const settingsForm = document.querySelector('form#settings');
    settingsForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const formData = new FormData(settingsForm);
        for (const [key, value] of formData.entries()) {
            config[key] = value;
        }
        sineSwarmStart();
    });
    document.addEventListener('keyup', (ev) => {
        if (ev.key === 'Escape') {
            sineSwarmReset();
        }
    });
};
const sineSwarmStart = () => {
    uiPanel.style.display = 'none';
    calculateSnappingDeltas(config.snappingSensitivity);
    activeSwarm = new SineSwarm(config);
};
const sineSwarmReset = () => {
    uiPanel.style.display = 'block';
    activeSwarm.stopAnimation();
};
const calculateSnappingDeltas = snappingSensitivity => {
    harmDist.forEach(x => {
        harmDist.forEach(y => {
            harmDist.forEach(z => {
                const key = Math.round(x * snappingSensitivity) +
                    '-' +
                    Math.round(y * snappingSensitivity) +
                    '-' +
                    Math.round(z * snappingSensitivity);
                config.snappingDeltas[key] = [x, y, z];
            });
        });
    });
};
export default sineSwarmInit;
//# sourceMappingURL=sine-swarm-init.js.map