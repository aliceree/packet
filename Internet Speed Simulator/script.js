const SPEED_MODEL = {
  EDGE: { 1: 0.066, 2: 0.132, 3: 0.2 },
  "3G": { 1: 0.99, 2: 1.98, 3: 3 },
  LTE: { 1: 9.9, 2: 19.8, 3: 30 },
  "5G": { 1: 49.5, 2: 99, 3: 150 }
};

const state = {
  signal: 1,
  technology: "5G",
  currentSpeed: 0,
  currentCps: 0,
  angle: -Math.PI / 2,
  angularVelocity: 0,
  lastFrame: performance.now()
};

const config = {
  orbitRadiusFactor: 0.43,
  minRotationSpeed: 0.28,
  maxRotationSpeed: 12.5,
  smoothing: 0.14,
  absoluteMaxSpeed: 150,
  speedCurveExponent: 0.32,
  targetCps: 10,
  singleClickCps: 0.35,
  cpsDecayPerSecond: 8.5,
  accelerationSmoothing: 0.2,
  decelerationSmoothing: 0.12,
  angularVelocityDamping: 0.86,
  speedZeroThreshold: 0.02
};

const elements = {
  meme: document.getElementById("meme"),
  boostButton: document.getElementById("boostButton"),
  speedValue: document.getElementById("speedValue"),
  technologyValue: document.getElementById("technologyValue"),
  signalSelector: document.getElementById("signalSelector"),
  signalBars: document.getElementById("signalBars"),
  technologySelector: document.getElementById("technologySelector"),
  orbit: document.querySelector(".orbit")
};

let lastClickTime = null;
const SIGNAL_OPTIONS = [1, 2, 3];
const TECHNOLOGY_OPTIONS = ["5G", "LTE", "3G", "EDGE"];

function getMaxSpeed() {
  return SPEED_MODEL[state.technology][state.signal];
}

function formatSpeed(value) {
  if (value >= 100) {
    return value.toFixed(0);
  }
  if (value >= 10) {
    return value.toFixed(1);
  }
  if (value >= 1) {
    return value.toFixed(2);
  }
  return value.toFixed(3);
}

function syncControls() {
  elements.signalBars.className = `signal-bars signal-bars--${state.signal}`;
  elements.signalSelector.setAttribute("aria-label", `Síla signálu ${state.signal} čárka`);
  elements.technologySelector.textContent = state.technology;
  elements.technologySelector.setAttribute("aria-label", `Technologie ${state.technology}`);
}

function syncStats() {
  elements.speedValue.textContent = formatSpeed(state.currentSpeed);
  elements.technologyValue.textContent = state.technology;
}

function registerClick(now = performance.now()) {
  if (lastClickTime === null) {
    state.currentCps = Math.max(state.currentCps, config.singleClickCps);
  } else {
    const intervalMs = now - lastClickTime;
    const instantCps = intervalMs > 0 ? Math.min(1000 / intervalMs, config.targetCps) : config.targetCps;
    state.currentCps = Math.max(state.currentCps, instantCps);
  }

  lastClickTime = now;
}

function bindControls() {
  elements.signalSelector.addEventListener("click", () => {
    const currentIndex = SIGNAL_OPTIONS.indexOf(state.signal);
    state.signal = SIGNAL_OPTIONS[(currentIndex + 1) % SIGNAL_OPTIONS.length];
    syncControls();
    syncStats();
  });

  elements.technologySelector.addEventListener("click", () => {
    const currentIndex = TECHNOLOGY_OPTIONS.indexOf(state.technology);
    state.technology = TECHNOLOGY_OPTIONS[(currentIndex + 1) % TECHNOLOGY_OPTIONS.length];
    syncControls();
    syncStats();
  });

  const startBoost = () => {
    elements.boostButton.classList.add("is-pressed");
    registerClick();
  };

  const stopBoost = () => {
    elements.boostButton.classList.remove("is-pressed");
  };

  elements.boostButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    startBoost();
  });

  window.addEventListener("pointerup", stopBoost);
  window.addEventListener("pointercancel", stopBoost);
}

function animate(now) {
  const deltaSeconds = Math.min((now - state.lastFrame) / 1000, 0.05);
  state.lastFrame = now;

  state.currentCps = Math.max(0, state.currentCps - config.cpsDecayPerSecond * deltaSeconds);
  if (state.currentCps < 0.01) {
    state.currentCps = 0;
  }

  const maxSpeed = getMaxSpeed();
  const cpsRatio = Math.min(state.currentCps / config.targetCps, 1);
  const targetSpeed = maxSpeed * cpsRatio;
  const speedSmoothing = targetSpeed >= state.currentSpeed
    ? config.accelerationSmoothing
    : config.decelerationSmoothing;
  state.currentSpeed += (targetSpeed - state.currentSpeed) * speedSmoothing;
  state.currentSpeed = Math.max(0, state.currentSpeed);
  if (state.currentCps === 0 && state.currentSpeed < config.speedZeroThreshold) {
    state.currentSpeed = 0;
  }

  const currentSpeed = state.currentSpeed;
  const speedRatio = config.absoluteMaxSpeed === 0 ? 0 : currentSpeed / config.absoluteMaxSpeed;
  const curvedRatio = speedRatio > 0 ? Math.pow(speedRatio, config.speedCurveExponent) : 0;
  const targetAngularVelocity = currentSpeed === 0
    ? 0
    : config.minRotationSpeed + curvedRatio * (config.maxRotationSpeed - config.minRotationSpeed);

  state.angularVelocity += (targetAngularVelocity - state.angularVelocity) * config.smoothing;
  if (targetAngularVelocity === 0) {
    state.angularVelocity *= config.angularVelocityDamping;
    if (state.angularVelocity < 0.01) {
      state.angularVelocity = 0;
    }
  }
  state.angle += state.angularVelocity * deltaSeconds;

  render();
  syncStats();
  requestAnimationFrame(animate);
}

function render() {
  const orbitRect = elements.orbit.getBoundingClientRect();
  const radius = Math.min(orbitRect.width, orbitRect.height) * config.orbitRadiusFactor;
  const x = Math.cos(state.angle) * radius;
  const y = Math.sin(state.angle) * radius;
  const tangentDegrees = (state.angle * 180) / Math.PI + 90;

  elements.meme.style.transform = `translate(${x}px, ${y}px) rotate(${tangentDegrees}deg)`;
}

bindControls();
syncControls();
syncStats();
requestAnimationFrame(animate);
