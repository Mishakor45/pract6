const audioElement = document.getElementById('backgroundMusic');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const canvas = document.getElementById('audioCanvas');
const ctx = canvas.getContext('2d');

let audioContext;
let analyser;
let source;
let dataArray;
let animationId;

function setupAudioContext() {
  if (!audioContext)
  {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    source = audioContext.createMediaElementSource(audioElement);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function drawSpectrum() {
  animationId = requestAnimationFrame(drawSpectrum);

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / dataArray.length) * 2.5;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++)
  {
    const barHeight = dataArray[i] * 0.8;

    const r = barHeight + 25;
    const g = 250 * (i / dataArray.length);
    const b = 50;

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

playBtn.addEventListener('click', async () => {
  setupAudioContext();
  await audioContext.resume();
  audioElement.play();
  drawSpectrum();
});

pauseBtn.addEventListener('click', () => {
  audioElement.pause();
  cancelAnimationFrame(animationId);
});