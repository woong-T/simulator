// 지층 상태를 관리하는 배열
const layers = [];

const layerArea = document.getElementById("layerArea");
const depositBtn = document.getElementById("depositBtn");
const intrudeBtn = document.getElementById("intrudeBtn");
const erodeBtn = document.getElementById("erodeBtn");
const resetBtn = document.getElementById("resetBtn");
const checkBtn = document.getElementById("checkBtn");
const explanation = document.getElementById("explanation");

let intrusionElement = null;
let depositionCount = 0;

// 미리 정한 색상 패턴으로 층을 표시
const layerNames = [
  "모래층",
  "점토층",
  "자갈층",
  "석회층",
  "실트층",
  "셰일층",
  "재층"
];

// 퇴적 버튼 클릭 시 새로운 층을 추가
depositBtn.addEventListener("click", () => {
  addLayer();
  renderLayers();
});

// 관입 버튼 클릭 시 마그마 관입 구조를 추가하거나 제거
intrudeBtn.addEventListener("click", () => {
  toggleIntrusion();
});

// 침식 버튼 클릭 시 가장 위쪽 층을 일부 깎음
erodeBtn.addEventListener("click", () => {
  erodeLayer();
  renderLayers();
});

// 초기화 버튼 클릭 시 모든 상태를 초기화
resetBtn.addEventListener("click", () => {
  resetSimulation();
});

// 문제 정답 확인 버튼 클릭 시 선택지를 검사하고 해설을 표시
checkBtn.addEventListener("click", () => {
  checkQuiz();
});

// 새로운 퇴적층을 생성하고 상태 배열에 추가
function addLayer() {
  const layerIndex = depositionCount % layerNames.length;
  layers.push({
    type: "deposit",
    name: layerNames[layerIndex],
    colorIndex: layerIndex,
    eroded: false,
  });
  depositionCount += 1;
}

// 현재 퇴적층 배열을 화면에 렌더링
function renderLayers() {
  layerArea.querySelectorAll(".layer").forEach((node) => node.remove());

  const layerHeight = 48;
  layers.forEach((layer, index) => {
    const layerElement = document.createElement("div");
    layerElement.className = `layer deposit-${layer.colorIndex}`;
    layerElement.dataset.name = layer.name;
    layerElement.style.bottom = `${index * layerHeight + 12}px`;

    if (layer.eroded) {
      layerElement.classList.add("eroded");
      layerElement.style.width = "70%";
    } else {
      layerElement.style.width = "100%";
    }

    layerArea.appendChild(layerElement);
  });
}

// 관입 요소를 켜고/끄기
function toggleIntrusion() {
  if (intrusionElement) {
    intrusionElement.remove();
    intrusionElement = null;
    return;
  }

  intrusionElement = document.createElement("div");
  intrusionElement.className = "intrusion";
  layerArea.appendChild(intrusionElement);
}

// 가장 위층에서 침식 효과를 발생시킨다
function erodeLayer() {
  if (layers.length === 0) {
    alert("먼저 퇴적 버튼을 눌러 지층을 쌓아 보세요.");
    return;
  }

  // 위쪽에서부터 아직 깎이지 않은 층을 찾아서 표시한다.
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    if (!layers[i].eroded) {
      layers[i].eroded = true;
      return;
    }
  }

  alert("더 이상 깎을 수 있는 층이 없습니다.");
}

// 시뮬레이션을 모두 초기 상태로 되돌린다
function resetSimulation() {
  layers.length = 0;
  depositionCount = 0;
  if (intrusionElement) {
    intrusionElement.remove();
    intrusionElement = null;
  }
  renderLayers();
  explanation.innerHTML = '<p>정답을 확인하면 지사학 법칙과 함께 해설이 표시됩니다.</p>';
  document.querySelectorAll(".quiz-select").forEach((select) => {
    select.value = "";
  });
}

// 퀴즈 정답을 검사하고 해설 텍스트를 표시한다
function checkQuiz() {
  const selects = Array.from(document.querySelectorAll(".quiz-select"));
  const given = selects.map((select) => select.value);

  if (given.some((value) => value === "")) {
    alert("모든 항목에 순서를 선택해 주세요.");
    return;
  }

  const correctOrder = ["1", "2", "3", "4"];
  const isCorrect = selects.every((select, index) => select.value === correctOrder[index]);

  if (isCorrect) {
    explanation.innerHTML = `
      <h3>정답입니다!</h3>
      <p>올바른 순서는 1. 수평퇴적 → 2. 관입 → 3. 침식 → 4. 부정합 입니다.</p>
      <p>수평퇴적의 법칙은 퇴적층이 처음에는 수평으로 놓인다는 것이고, 지층누중의 법칙은 아래쪽 층이 위쪽 층보다 오래되었다는 법칙입니다.</p>
      <p>관입의 법칙은 관입암이 주변 암석보다 나중에 생긴다는 뜻이며, 침식 후 새로운 퇴적층이 쌓이면 부정합이 만들어집니다.</p>
    `;
  } else {
    explanation.innerHTML = `
      <h3>아직 틀렸습니다.</h3>
      <p>정답은 1. 수평퇴적 → 2. 관입 → 3. 침식 → 4. 부정합 입니다.</p>
      <p>이 순서는 지층의 쌓임과 나중에 일어난 지질 작용을 보여 줍니다. 퇴적층이 먼저 쌓이고, 그 뒤에 마그마가 관입하며, 침식과 부정합으로 과거 시간 간극이 드러납니다.</p>
    `;
  }
}

// 초기 렌더링
renderLayers();
