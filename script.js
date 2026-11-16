const diceTypeSelect = document.getElementById('dice-type');
const diceCountInput = document.getElementById('dice-count');
const diceModifierInput = document.getElementById('dice-modifier');
const rollBtn = document.getElementById('roll-btn');  
const simBtn = document.getElementById('sim-btn');
const diceStage = document.getElementById('dice-stage');
const totalValue = document.getElementById('total-value');
const breakdownValue = document.getElementById('breakdown-value');
const historyList = document.getElementById('history-list');
const chartContainer = document.getElementById('chart-container');
let history = [];  

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDiceSet() {
  const sides = parseInt(diceTypeSelect.value, 10);  
  const count = parseInt(diceCountInput.value, 10);
  const modifier = parseInt(diceModifierInput.value, 10) || 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(getRandomInt(1, sides));
  }
  const sum = rolls.reduce((acc, val) => acc + val, 0);  
  const total = sum + modifier;
  return { sides, count, modifier, rolls, sum, total };
}

function renderRoll(result) {
  diceStage.innerHTML = '';
  result.rolls.forEach((val) => {  
    const cube = document.createElement('div');
    cube.className = 'dice-cube rolling';
    cube.textContent = val;
    diceStage.appendChild(cube);
    setTimeout(() => {
      cube.classList.remove('rolling');
    }, 600);  
  });
  totalValue.textContent = result.total;
  const modStr = result.modifier !== 0 ? (result.modifier > 0 ? ' + ' + result.modifier : ' - ' + Math.abs(result.modifier)) : '';
  breakdownValue.textContent = '[' + result.rolls.join(', ') + ']' + modStr;
  addToHistory(result);
}

function addToHistory(result) {
  history.unshift(result);
  if (history.length > 20) {
    history.pop();
  }
  historyList.innerHTML = '';
  history.forEach((item) => {  
    const li = document.createElement('li');
    const modStr = item.modifier !== 0 ? (item.modifier > 0 ? '+' + item.modifier : item.modifier) : '';
    li.innerHTML = '<span>' + item.count + 'd' + item.sides + modStr + '</span><span><strong>' + item.total + '</strong></span>';
    historyList.appendChild(li);
  });
}

function runSimulation() {
  const sides = parseInt(diceTypeSelect.value, 10);
  const count = parseInt(diceCountInput.value, 10);
  const modifier = parseInt(diceModifierInput.value, 10) || 0;
  const iterations = 1000;
  const minPossible = count * 1 + modifier;
  const maxPossible = count * sides + modifier;  
  const range = maxPossible - minPossible + 1;
  const counts = new Array(range).fill(0);
  for (let i = 0; i < iterations; i++) {
    let sum = 0;
    for (let d = 0; d < count; d++) {
      sum += getRandomInt(1, sides);
    }  
    const total = sum + modifier;
    counts[total - minPossible]++;
  }
  renderChart(counts, minPossible, maxPossible);
}

function renderChart(counts, minVal, maxVal) {  
  chartContainer.innerHTML = '';
  const maxCount = Math.max(...counts);
  counts.forEach((val, index) => {
    const wrap = document.createElement('div');
    wrap.className = 'chart-bar-wrap';
    const bar = document.createElement('div');
    bar.className = 'chart-bar';  
    const heightPercent = maxCount > 0 ? (val / maxCount) * 100 : 0;
    bar.style.height = heightPercent + '%';
    bar.title = 'Value ' + (minVal + index) + ': ' + val + ' times';
    wrap.appendChild(bar);
    chartContainer.appendChild(wrap);
  });
}  

rollBtn.addEventListener('click', () => {
  const result = rollDiceSet();
  renderRoll(result);
});

simBtn.addEventListener('click', () => {  
  runSimulation();
});

diceTypeSelect.addEventListener('change', () => {
  const sides = parseInt(diceTypeSelect.value, 10);
  diceCountInput.max = sides === 100 ? 5 : 10;
});  


