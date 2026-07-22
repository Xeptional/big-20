document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('gameDisplay');
  const input = document.getElementById('gameInput');
  const submitBtn = document.getElementById('gameSubmit');
  const newRoundBtn = document.getElementById('gameNewRound');
  const levelSpan = document.getElementById('gameLevel');
  const scoreSpan = document.getElementById('gameScore');
  const bestSpan = document.getElementById('gameBest');
  const feedback = document.getElementById('gameFeedback');

  let level = 0;
  let score = 0;
  let best = parseInt(localStorage.getItem('memorySprintBest')) || 0;
  let sequence = '';
  let roundActive = false;
  let timer = null;
  let displayTimeout = null;

  bestSpan.textContent = best;

  function generateSequence(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let seq = '';
    for (let i = 0; i < length; i++) {
      seq += chars[Math.floor(Math.random() * chars.length)];
    }
    return seq;
  }

  function getDisplayTime(level) {
    // Start at 2s, decrease to 0.5s minimum
    return Math.max(0.5, 2 - level * 0.08);
  }

  function getSequenceLength(level) {
    return Math.floor(level / 2) + 1; // level 1->1, 2->2, 3->2, 4->3, etc.
  }

  function startRound() {
    if (displayTimeout) clearTimeout(displayTimeout);
    if (timer) clearInterval(timer);
    feedback.textContent = '';
    input.value = '';
    input.disabled = true;
    submitBtn.disabled = true;

    const len = getSequenceLength(level);
    sequence = generateSequence(len);
    const time = getDisplayTime(level);

    display.textContent = sequence;
    display.className = 'game-display';

    let countdown = Math.ceil(time);
    displayTimeout = setTimeout(() => {
      display.textContent = '?'.repeat(sequence.length);
      input.disabled = false;
      submitBtn.disabled = false;
      input.focus();
      roundActive = true;
      // Countdown timer for input? Not needed, we just wait for submit.
    }, time * 1000);

    // Show countdown? We'll just show the sequence then hide.
  }

  function submitAnswer() {
    if (!roundActive) return;
    const answer = input.value.trim();
    if (answer === '') return;

    if (answer === sequence) {
      // Correct
      roundActive = false;
      score += 1;
      level += 1;
      scoreSpan.textContent = score;
      levelSpan.textContent = level;
      if (score > best) {
        best = score;
        localStorage.setItem('memorySprintBest', best);
        bestSpan.textContent = best;
      }
      feedback.textContent = '✅ Correct!';
      display.className = 'game-display success';
      // Confetti effect
      for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = Math.random() * 100 + 'vh';
        confetti.style.backgroundColor = ['#D4B26A','#E88D7A','#A6B7A1','#F4EEF5'][Math.floor(Math.random()*4)];
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 700);
      }
      input.disabled = true;
      submitBtn.disabled = true;
      setTimeout(() => {
        startRound();
      }, 1200);
    } else {
      // Wrong
      roundActive = false;
      feedback.textContent = '❌ Wrong! Try again.';
      display.className = 'game-display error';
      input.disabled = true;
      submitBtn.disabled = true;
      setTimeout(() => {
        // Reset but keep level and score? We'll keep them, just start new round.
        startRound();
      }, 1500);
    }
  }

  function newRound() {
    // Reset game
    if (displayTimeout) clearTimeout(displayTimeout);
    if (timer) clearInterval(timer);
    level = 0;
    score = 0;
    sequence = '';
    roundActive = false;
    levelSpan.textContent = level;
    scoreSpan.textContent = score;
    feedback.textContent = '';
    display.className = 'game-display';
    input.disabled = true;
    submitBtn.disabled = true;
    display.textContent = 'Press "New Round" to start';
    input.value = '';
  }

  // Event listeners
  submitBtn.addEventListener('click', submitAnswer);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAnswer();
  });
  newRoundBtn.addEventListener('click', () => {
    newRound();
    // Start first round after a brief delay
    setTimeout(startRound, 300);
  });

  // Initial best display
  bestSpan.textContent = best;
  // Auto-start on page load? We'll let user press New Round.
  display.textContent = 'Press "New Round" to start';
  input.disabled = true;
  submitBtn.disabled = true;
});