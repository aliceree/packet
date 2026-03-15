const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");
const progressLabel = document.getElementById("progress-label");
const statusText = document.getElementById("status-text");
const resetButton = document.getElementById("reset-button");
const nodeTooltip = document.getElementById("node-tooltip");

const LEFT_COUNT = 3;
const MIDDLE_COUNT = 20;
const RIGHT_COUNT = 3;
const NODE_RADIUS = 14;
const HIT_RADIUS = 26;
const COLLISION_RADIUS = 18;
const MIN_PACKET_COUNT = 3;
const MAX_PACKET_COUNT = 5;
const PACKET_RADIUS = 6;
const PACKET_BASE_SPEED = 170;
const PACKET_MIN_GAP = 26;

const melody = [
  261.63,
  293.66,
  329.63,
  349.23,
  392.0,
  440.0,
  493.88,
  523.25,
  587.33,
  659.25,
  698.46,
  783.99,
  880.0,
  987.77,
  1046.5,
  1174.66,
  1318.51,
  1396.91,
  1567.98,
  1760.0,
  1975.53,
  2093.0,
];
const successChord = [261.63, 329.63, 392.0, 523.25];

let audioContext;
let nodes = [];
let chain = [];
let pointer = null;
let completed = false;
let hoveredNodeId = null;
let animationFrameId = null;
let packetStates = [];
let packetCountDirection = 1;
let lastAnimationTime = 0;

function createAudioContext() {
  if (!audioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextCtor();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(index) {
  createAudioContext();

  const frequency = melody[Math.min(index, melody.length - 1)];
  playPianoNote(frequency, 0, 0.82);
}

function playPianoNote(frequency, offset = 0, duration = 0.82, variant = "default") {
  const now = audioContext.currentTime + offset;
  const gain = audioContext.createGain();
  const oscA = audioContext.createOscillator();
  const oscB = audioContext.createOscillator();
  const hammer = audioContext.createOscillator();
  const hammerGain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  const isSoft = variant === "soft" || variant === "felt";
  const isBright = variant === "bright";
  const isFelt = variant === "felt";

  oscA.type = isFelt ? "triangle" : isSoft ? "sine" : "triangle";
  oscB.type = "sine";
  hammer.type = isBright ? "square" : "triangle";
  oscA.frequency.value = frequency;
  oscB.frequency.value = frequency * (isFelt ? 1.5 : isSoft ? 2.01 : isBright ? 3 : 2);
  oscB.detune.value = isFelt ? -8 : isSoft ? -2 : isBright ? 4 : -6;
  hammer.frequency.value = frequency * (isBright ? 6 : isFelt ? 2.5 : 4);

  filter.type = "lowpass";
  filter.frequency.value = isFelt ? 1250 : isSoft ? 1650 : isBright ? 3200 : 2400;
  filter.Q.value = isFelt ? 0.65 : isSoft ? 0.8 : isBright ? 1.6 : 2.5;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(
    isFelt ? 0.16 : isSoft ? 0.18 : isBright ? 0.22 : 0.26,
    now + (isFelt ? 0.014 : isSoft ? 0.008 : isBright ? 0.006 : 0.02)
  );
  gain.gain.exponentialRampToValueAtTime(
    isFelt ? 0.06 : isSoft ? 0.045 : isBright ? 0.07 : 0.1,
    now + Math.min(isFelt ? 0.16 : isSoft ? 0.1 : isBright ? 0.12 : 0.18, duration * 0.35)
  );
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  hammerGain.gain.setValueAtTime(0.0001, now);
  hammerGain.gain.exponentialRampToValueAtTime(
    isFelt ? 0.022 : isSoft ? 0.05 : isBright ? 0.07 : 0.035,
    now + (isFelt ? 0.007 : isBright ? 0.003 : 0.004)
  );
  hammerGain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + (isFelt ? 0.06 : isBright ? 0.032 : 0.045)
  );

  oscA.connect(filter);
  oscB.connect(filter);
  hammer.connect(hammerGain);
  hammerGain.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  oscA.start(now);
  oscB.start(now);
  hammer.start(now);
  oscA.stop(now + duration);
  oscB.stop(now + Math.max(0.12, duration * 0.85));
  hammer.stop(now + 0.05);
}

function playSuccessMelody() {
  createAudioContext();

  successChord.forEach((note, index) => {
    playPianoNote(note, index * 0.16, 0.56, "felt");
  });
}

function setStatus(message) {
  statusText.textContent = message;
}

function setProgress() {
  const routerCount = chain.filter((id) => id.startsWith("M")).length;
  const serverReached = chain.some((id) => id.startsWith("R"));
  progressLabel.textContent = serverReached
    ? `Klient může zaslat své pakety na server prostřednictvím ${routerCount} routerů.`
    : "Klient zatím nedokáže kontaktovat server.";
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  buildNodes(rect.width, rect.height);
  updateTooltip();
  draw();
}

function buildNodes(width, height) {
  const leftX = width * 0.1;
  const rightX = width * 0.9;
  const middleStartX = width * 0.24;
  const middleSpacing = (width * 0.52) / (MIDDLE_COUNT - 1);
  const yPositions = [height * 0.28, height * 0.5, height * 0.72];
  const middleOffsets = [
    -0.18,
    0.1,
    -0.06,
    0.19,
    -0.14,
    0.05,
    0.16,
    -0.09,
    0.2,
    -0.03,
    0.12,
    -0.17,
    0.08,
    -0.05,
    0.18,
    -0.11,
    0.04,
    0.15,
    -0.08,
    0.13,
  ];

  nodes = [];

  yPositions.forEach((y, index) => {
    nodes.push({ id: `L${index}`, group: "left", x: leftX, y });
  });

  for (let index = 0; index < MIDDLE_COUNT; index += 1) {
    nodes.push({
      id: `M${index}`,
      group: "middle",
      x: middleStartX + middleSpacing * index,
      y: height * (0.5 + middleOffsets[index]),
    });
  }

  yPositions.forEach((y, index) => {
    nodes.push({ id: `R${index}`, group: "right", x: rightX, y });
  });
}

function getNodeById(id) {
  return nodes.find((node) => node.id === id);
}

function getConnectedIds() {
  return new Set(chain);
}

function getActivePathNodes() {
  return chain.map((id) => getNodeById(id)).filter(Boolean);
}

function getPathMetrics() {
  const points = getActivePathNodes();
  if (points.length < 2) {
    return null;
  }

  const segments = [];
  let totalLength = 0;

  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    segments.push({ from, to, length, start: totalLength });
    totalLength += length;
  }

  return totalLength > 0 ? { segments, totalLength } : null;
}

function getPointAtDistance(metrics, distance) {
  for (const segment of metrics.segments) {
    if (distance <= segment.start + segment.length) {
      const segmentDistance = distance - segment.start;
      const t = segment.length === 0 ? 0 : segmentDistance / segment.length;
      return {
        x: segment.from.x + (segment.to.x - segment.from.x) * t,
        y: segment.from.y + (segment.to.y - segment.from.y) * t,
      };
    }
  }

  const lastSegment = metrics.segments[metrics.segments.length - 1];
  return { x: lastSegment.to.x, y: lastSegment.to.y };
}

function createPacketState(index) {
  return {
    id: `packet-${index}-${Math.random().toString(36).slice(2, 7)}`,
    distance: 0,
    speed: PACKET_BASE_SPEED + Math.random() * 55,
    direction: 1,
  };
}

function syncPacketCount(totalLength, edgeDistance, packetId) {
  if (packetStates.length <= MIN_PACKET_COUNT) {
    packetCountDirection = 1;
  } else if (packetStates.length >= MAX_PACKET_COUNT) {
    packetCountDirection = -1;
  }

  if (packetCountDirection > 0 && packetStates.length < MAX_PACKET_COUNT) {
    const packet = createPacketState(packetStates.length);
    packet.distance = edgeDistance;
    packet.direction = edgeDistance === 0 ? 1 : -1;
    packetStates.push(packet);
    return;
  }

  if (packetCountDirection < 0 && packetStates.length > MIN_PACKET_COUNT) {
    const packetIndex = packetStates.findIndex((packet) => packet.id === packetId);
    if (packetIndex !== -1) {
      packetStates.splice(packetIndex, 1);
    }
  }
}

function updatePackets(deltaSeconds) {
  if (!completed) {
    return;
  }

  const metrics = getPathMetrics();
  if (!metrics) {
    return;
  }

  const edgeHits = [];

  packetStates.forEach((packet) => {
    packet.distance += packet.speed * deltaSeconds * packet.direction;

    if (packet.distance >= metrics.totalLength) {
      packet.distance = metrics.totalLength;
      packet.direction = -1;
      edgeHits.push({ edgeDistance: metrics.totalLength, packetId: packet.id });
    } else if (packet.distance <= 0) {
      packet.distance = 0;
      packet.direction = 1;
      edgeHits.push({ edgeDistance: 0, packetId: packet.id });
    }
  });

  const forwardPackets = packetStates
    .filter((packet) => packet.direction === 1)
    .sort((a, b) => b.distance - a.distance);
  const backwardPackets = packetStates
    .filter((packet) => packet.direction === -1)
    .sort((a, b) => a.distance - b.distance);

  for (let index = 1; index < forwardPackets.length; index += 1) {
    const leadPacket = forwardPackets[index - 1];
    const trailingPacket = forwardPackets[index];
    const allowedDistance = leadPacket.distance - PACKET_MIN_GAP;

    if (trailingPacket.distance > allowedDistance) {
      trailingPacket.distance = Math.max(0, allowedDistance);
    }
  }

  for (let index = 1; index < backwardPackets.length; index += 1) {
    const leadPacket = backwardPackets[index - 1];
    const trailingPacket = backwardPackets[index];
    const allowedDistance = leadPacket.distance + PACKET_MIN_GAP;

    if (trailingPacket.distance < allowedDistance) {
      trailingPacket.distance = Math.min(metrics.totalLength, allowedDistance);
    }
  }

  edgeHits.forEach(({ edgeDistance, packetId }) => {
    syncPacketCount(metrics.totalLength, edgeDistance, packetId);
  });
}

function getPacketPositions() {
  if (!completed) {
    return [];
  }

  const metrics = getPathMetrics();
  if (!metrics) {
    return [];
  }

  return packetStates.map((packet) => getPointAtDistance(metrics, packet.distance));
}

function drawPackets() {
  const packets = getPacketPositions();

  packets.forEach((packet) => {
    context.beginPath();
    context.arc(packet.x, packet.y, PACKET_RADIUS, 0, Math.PI * 2);
    context.fillStyle = "#f05b3f";
    context.fill();
  });
}

function drawNode(node, connectedIds) {
  const isSelected = pointer && pointer.anchorId === node.id;
  const isVisited = connectedIds.has(node.id);

  context.beginPath();
  context.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
  context.fillStyle = isVisited ? "#12110f" : "#fffdf7";
  context.fill();
  context.lineWidth = isSelected ? 4 : 2;
  context.strokeStyle = isSelected ? "#f05b3f" : "rgba(37, 35, 30, 0.28)";
  context.stroke();

  if (!isVisited) {
    context.beginPath();
    context.arc(node.x, node.y, 4, 0, Math.PI * 2);
    context.fillStyle = node.group === "middle" ? "rgba(37, 35, 30, 0.42)" : "#f05b3f";
    context.fill();
  }
}

function draw(timestamp = performance.now()) {
  if (completed && lastAnimationTime) {
    updatePackets((timestamp - lastAnimationTime) / 1000);
  }

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);

  const connectedIds = getConnectedIds();

  context.lineCap = "round";
  context.lineJoin = "round";

  for (let index = 1; index < chain.length; index += 1) {
    const from = getNodeById(chain[index - 1]);
    const to = getNodeById(chain[index]);
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.lineWidth = 6;
    context.strokeStyle = "#25231e";
    context.stroke();
  }

  if (pointer) {
    const anchor = getNodeById(pointer.anchorId);
    context.beginPath();
    context.moveTo(anchor.x, anchor.y);
    context.lineTo(pointer.x, pointer.y);
    context.lineWidth = 5;
    context.strokeStyle = "rgba(37, 35, 30, 0.35)";
    context.stroke();
  }

  drawPackets();
  nodes.forEach((node) => drawNode(node, connectedIds));

  lastAnimationTime = timestamp;
}

function findNodeAt(x, y) {
  return nodes.find((node) => Math.hypot(node.x - x, node.y - y) <= HIT_RADIUS);
}

function hideTooltip() {
  hoveredNodeId = null;
  nodeTooltip.classList.remove("is-visible");
  nodeTooltip.setAttribute("aria-hidden", "true");
}

function getTooltipLabel(group) {
  if (group === "left") {
    return "klient";
  }

  if (group === "middle") {
    return "router";
  }

  if (group === "right") {
    return "server";
  }

  return "";
}

function updateTooltip() {
  if (!hoveredNodeId) {
    hideTooltip();
    return;
  }

  const node = getNodeById(hoveredNodeId);
  const label = node ? getTooltipLabel(node.group) : "";
  if (!node || !label) {
    hideTooltip();
    return;
  }

  nodeTooltip.textContent = label;
  nodeTooltip.style.left = `${node.x}px`;
  nodeTooltip.style.top = `${node.y}px`;
  nodeTooltip.classList.add("is-visible");
  nodeTooltip.setAttribute("aria-hidden", "false");
}

function distancePointToSegment(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }

  const t = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared)
  );
  const projectionX = start.x + t * dx;
  const projectionY = start.y + t * dy;
  return Math.hypot(point.x - projectionX, point.y - projectionY);
}

function segmentHitsForbiddenNode(fromNode, toNode) {
  const connectedIds = getConnectedIds();

  return nodes.some((candidate) => {
    if (candidate.id === fromNode.id || candidate.id === toNode.id) {
      return false;
    }

    if (connectedIds.has(candidate.id)) {
      return false;
    }

    return distancePointToSegment(candidate, fromNode, toNode) <= COLLISION_RADIUS;
  });
}

function isValidTargetNode(node) {
  if (!pointer || !node) {
    return false;
  }

  if (node.group === "left") {
    return false;
  }

  if (getConnectedIds().has(node.id)) {
    return false;
  }

  const fromNode = getNodeById(pointer.anchorId);
  return !segmentHitsForbiddenNode(fromNode, node);
}

function startPointer(x, y) {
  if (completed) {
    return;
  }

  const node = findNodeAt(x, y);
  if (!node) {
    if (!pointer) {
      return;
    }

    pointer.x = x;
    pointer.y = y;
    draw();
    return;
  }

  if (!pointer) {
    if (chain.length === 0 && node.group === "left") {
      createAudioContext();
      chain.push(node.id);
      playTone(0);
      setProgress();
      pointer = { anchorId: node.id, x, y };
      setStatus("Klient je aktivní. Teď klienta propojte s některým z routerů. Spojení však nesmí překrývat nepřipojený router.");
      draw();
      return;
    }

    if (chain.length === 0) {
      setStatus("Kliknutím na libovolného klienta jej lze propojit s některým z routerů. Spojení však nesmí překrývat nepřipojený router.");
      return;
    }

    const lastNode = getNodeById(chain[chain.length - 1]);
    pointer = { anchorId: lastNode.id, x, y };
  }

  const targetNode = isValidTargetNode(node) ? node : null;
  if (!targetNode) {
    if (node.group === "left") {
      setStatus("Klient je aktivní. Teď klienta propojte s některým z routerů. Spojení však nesmí překrývat nepřipojený router.");
    } else {
      setStatus("Toto spojení by se dotknulo jiného neaktivního routeru. Zkuste jiný směr.");
    }
    pointer.x = x;
    pointer.y = y;
    draw();
    return;
  }

  chain.push(targetNode.id);
  setProgress();

  if (targetNode.group === "right") {
    playSuccessMelody();
    completed = true;
    pointer = null;
    setStatus("Klient nyní může zaslat své pakety serveru a server klientovi. Připoj i ostatní klienty a servery.");
    startPacketAnimation();
  } else {
    playTone(chain.length - 1);
    pointer = { anchorId: targetNode.id, x, y };
    setStatus("Propojeno. Pokračujte na další libovolný bod, pokud spojení nic neprotne.");
  }
  draw();
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function startPacketAnimation() {
  if (animationFrameId !== null) {
    return;
  }

  packetCountDirection = 1;
  packetStates = Array.from({ length: MIN_PACKET_COUNT }, (_, index) => {
    const packet = createPacketState(index);
    packet.distance = 0;
    return packet;
  });
  lastAnimationTime = performance.now();

  const animate = (timestamp) => {
    draw(timestamp);
    animationFrameId = requestAnimationFrame(animate);
  };

  animationFrameId = requestAnimationFrame(animate);
}

function stopPacketAnimation() {
  if (animationFrameId === null) {
    packetStates = [];
    lastAnimationTime = 0;
    return;
  }

  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  packetStates = [];
  lastAnimationTime = 0;
}

function resetGame() {
  stopPacketAnimation();
  chain = [];
  pointer = null;
  completed = false;
  setProgress();
  setStatus("Kliknutím na libovolného klienta jej lze propojit s některým z routerů. Spojení však nesmí překrývat nepřipojený router.");
  draw();
}

canvas.addEventListener("pointerdown", (event) => {
  const pos = pointerPosition(event);
  startPointer(pos.x, pos.y);
});

canvas.addEventListener("pointermove", (event) => {
  const pos = pointerPosition(event);
  const hoveredNode = findNodeAt(pos.x, pos.y);
  hoveredNodeId = hoveredNode?.id ?? null;
  updateTooltip();

  if (!pointer) {
    return;
  }
  pointer.x = pos.x;
  pointer.y = pos.y;
  draw();
});

canvas.addEventListener("pointercancel", () => {
  hideTooltip();
  if (!completed && chain.length > 0) {
    const lastNode = getNodeById(chain[chain.length - 1]);
    pointer = { anchorId: lastNode.id, x: lastNode.x, y: lastNode.y };
  }
  draw();
});

canvas.addEventListener("pointerleave", () => {
  hideTooltip();
});

resetButton.addEventListener("click", resetGame);
window.addEventListener("resize", resizeCanvas);

resetGame();
resizeCanvas();
