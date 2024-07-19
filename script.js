let characterName = "";
let isFirstMessage = true;

document.getElementById("nameInputModal").style.display = "block";

document.getElementById("submitName").addEventListener("click", function () {
  characterName = document.getElementById("nameInput").value;
  if (characterName) {
    document.getElementById("nameInputModal").style.display = "none";
    document.getElementById("characterName").textContent =
      "이름: " + characterName;
    initializeGame();
  }
});

async function initializeGame() {
  const chatMessages = document.getElementById("chatMessages");
  const loadingMessage = createLoadingMessage();
  chatMessages.appendChild(loadingMessage);

  try {
    const data = await converseWithGPT([
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `캐릭터 이름: ${characterName}\n\n이 캐릭터의 종족, 직업, 현재 위치와 상황을 포함한 스토리의 초반 설정을 만들어주세요. 그리고 능력치와 기본 장비, 초기 퀘스트도 설정해주세요.`,
      },
    ]);

    chatMessages.removeChild(loadingMessage);

    const dmMessage = document.createElement("div");
    dmMessage.className = "chat-message dm-message";
    dmMessage.textContent = data.content;
    chatMessages.appendChild(dmMessage);

    updateAIImage(data.content);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    chatMessages.removeChild(loadingMessage);

    const errorMessage = document.createElement("div");
    errorMessage.className = "chat-message";
    errorMessage.textContent =
      "캐릭터를 생성하지 못했습니다. 페이지를 새로 고친 후 다시 시도하십시오.";
    chatMessages.appendChild(errorMessage);
  }
}

function createLoadingMessage() {
  const loadingContainer = document.createElement("div");
  loadingContainer.className = "loading";

  const loadingBar = document.createElement("div");
  loadingBar.className = "loading-bar";
  const loadingProgress = document.createElement("div");
  loadingProgress.className = "loading-progress";
  loadingBar.appendChild(loadingProgress);
  loadingContainer.appendChild(loadingBar);

  let progress = 0;
  const intervalId = setInterval(() => {
    progress += 10;
    loadingProgress.style.width = `${progress}%`;
    if (progress >= 100) {
      clearInterval(intervalId);
    }
  }, 500);

  loadingContainer.intervalId = intervalId;

  return loadingContainer;
}

function addToInput(text) {
  const userInput = document.getElementById("userInput");
  userInput.value += (userInput.value ? " " : "") + text;
  userInput.focus();
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateModifier(stat) {
  return Math.floor((stat - 10) / 2);
}

function performSkillCheck(skill, difficulty) {
  const stat = document.getElementById("char" + skill).value;
  const modifier = calculateModifier(parseInt(stat));
  const roll = rollDice(20);
  const total = roll + modifier;
  return {
    success: total >= difficulty,
    roll: roll,
    total: total,
    modifier: modifier,
  };
}

function checkInventory(item) {
  const inventory = document
    .getElementById("inventoryList")
    .textContent.toLowerCase();
  const equipment = document
    .getElementById("equipmentList")
    .textContent.toLowerCase();
  const spells = document
    .getElementById("spellsList")
    .textContent.toLowerCase();

  return (
    inventory.includes(item.toLowerCase()) ||
    equipment.includes(item.toLowerCase()) ||
    spells.includes(item.toLowerCase())
  );
}

async function converseWithGPT(messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: messages }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

async function generateImage(prompt) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data.image_url;
}

function updateAlignmentDisplay() {
  const goodEvilSlider = document.getElementById("goodEvilSlider");
  const lawChaosSlider = document.getElementById("lawChaosSlider");
  const goodEvilValue = document.getElementById("goodEvilValue");
  const lawChaosValue = document.getElementById("lawChaosValue");

  const geValue = parseInt(goodEvilSlider.value);
  const lcValue = parseInt(lawChaosSlider.value);

  let geAlignment = "중립";
  if (geValue <= -33) geAlignment = "악";
  else if (geValue >= 33) geAlignment = "선";

  let lcAlignment = "완전 중립";
  if (lcValue <= -33) lcAlignment = "질서";
  else if (lcValue >= 33) lcAlignment = "혼돈";

  goodEvilValue.textContent = `${geAlignment} (${geValue})`;
  lawChaosValue.textContent = `${lcAlignment} (${lcValue})`;
}

async function handleUserInput(userInputValue) {
  const chatMessages = document.getElementById("chatMessages");

  const userMessage = document.createElement("div");
  userMessage.className = "chat-message player-message";
  userMessage.textContent = "플레이어: " + userInputValue;
  chatMessages.appendChild(userMessage);

  const loadingMessage = createLoadingMessage();
  chatMessages.appendChild(loadingMessage);

  chatMessages.scrollTop = chatMessages.scrollHeight;

  const characterInfo = {
    name: characterName,
    race: document.getElementById("characterRace").textContent.split(": ")[1],
    class: document.getElementById("characterClass").textContent.split(": ")[1],
    level: document.getElementById("charLevel").value,
    xp: document.getElementById("charXP").value,
    maxXp: document.getElementById("charMaxXP").value,
    currentHP: document.getElementById("charCurrentHP").value,
    maxHP: document.getElementById("charMaxHP").value,
    armorClass: document.getElementById("charArmorClass").value,
    alignment: {
      goodEvil: document.getElementById("goodEvilSlider").value,
      lawChaos: document.getElementById("lawChaosSlider").value,
    },
    stats: {
      strength: document.getElementById("charStrength").value,
      dexterity: document.getElementById("charDexterity").value,
      constitution: document.getElementById("charConstitution").value,
      intelligence: document.getElementById("charIntelligence").value,
      wisdom: document.getElementById("charWisdom").value,
      charisma: document.getElementById("charCharisma").value,
    },
    inventory: document.getElementById("inventoryList").textContent,
    quests: document.getElementById("questsList").textContent,
    equipment: document.getElementById("equipmentList").textContent,
    spells: document.getElementById("spellsList").textContent,
    npcs: document.getElementById("npcList").textContent,
    visibleHostiles: document.getElementById("visibleHostilesList").textContent,
    currentLocation: document.getElementById("currentLocationList").textContent,
    locations: document.getElementById("locationsList").textContent,
  };

  try {
    const skillCheckRegex = /(\w+) 체크/i;
    const match = userInputValue.match(skillCheckRegex);
    let skillCheckResult = null;
    if (match) {
      const skill = match[1].toLowerCase();
      const difficulty = 15;
      skillCheckResult = performSkillCheck(skill, difficulty);
    }

    const useRegex = /사용|시전|장착|휘두르기|공격/i;
    const useMatch = userInputValue.match(useRegex);
    let itemCheckResult = null;
    if (useMatch) {
      const item = userInputValue.split(useMatch[0])[1].trim().split(" ")[0];
      itemCheckResult = checkInventory(item);
    }

    const data = await converseWithWebSim(
      JSON.stringify({
        message:
          userInputValue +
          "\n\n이 메시지가 대화에 영향을 미치지 않도록 해주세요. 정보 상자 편집을 대화에 표시하지 마세요. 모든 퀘스트를 업데이트하고 완료된 퀘스트를 목록 맨 아래로 이동해 주세요. 모든 알려진 위치를 최신 상태로 유지해 주세요. 알려진 NPC 목록에 각 NPC를 만난 방법, 플레이어에 대한 느낌, 그리고 있다면 거래나 합의 등을 최신 상태로 유지해 주세요. 플레이어가 중요한 정보를 알게 되거나 무언가를 죽이면 경험치를 추가해 주세요.",
        context: "AD&IM 판타지 RPG 설정",
        characterInfo: characterInfo,
        skillCheckResult: skillCheckResult,
        itemCheckResult: itemCheckResult,
      })
    );

    chatMessages.removeChild(loadingMessage);

    const dmMessage = document.createElement("div");
    dmMessage.className = "chat-message dm-message";
    dmMessage.textContent = data.response;
    chatMessages.appendChild(dmMessage);

    if (data.characterUpdates) {
      updateCharacterSheet(data.characterUpdates);
    }

    updateAIImage(data.response);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    console.error("오류:", error);
    chatMessages.removeChild(loadingMessage);

    const errorMessage = document.createElement("div");
    errorMessage.className = "chat-message";
    errorMessage.textContent =
      "야생 마법의 급증으로 통신이 중단되었습니다. 다시 시도해 주세요.";
    chatMessages.appendChild(errorMessage);
  }
}

document
  .getElementById("chatForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const userInput = document.getElementById("userInput");
    await handleUserInput(userInput.value);
    userInput.value = "";
  });

function updateCharacterSheet(updates) {
  for (const [key, value] of Object.entries(updates)) {
    const element = document.getElementById(key);
    if (element) {
      if (element.tagName === "INPUT") {
        element.value = value;
      } else {
        element.textContent = value;
      }
    } else if (key === "stats") {
      for (const [stat, statValue] of Object.entries(value)) {
        const statElement = document.getElementById(
          "char" + stat.charAt(0).toUpperCase() + stat.slice(1)
        );
        if (statElement) {
          statElement.value = statValue;
        }
      }
    } else if (
      key === "inventory" ||
      key === "quests" ||
      key === "equipment" ||
      key === "spells" ||
      key === "npcs" ||
      key === "visibleHostiles" ||
      key === "currentLocation" ||
      key === "locations"
    ) {
      const listElement = document.getElementById(key + "List");
      if (listElement) {
        listElement.textContent = value;
      }
    } else if (key === "alignment") {
      document.getElementById("goodEvilSlider").value = value.goodEvil;
      document.getElementById("lawChaosSlider").value = value.lawChaos;
      updateAlignmentDisplay();
    } else if (key === "currentHP") {
      document.getElementById("charCurrentHP").value = value;
    } else if (key === "maxHP") {
      document.getElementById("charMaxHP").value = value;
    } else if (key === "armorClass") {
      document.getElementById("charArmorClass").value = value;
    } else if (key === "race") {
      document.getElementById("characterRace").textContent = "종족: " + value;
    } else if (key === "class") {
      document.getElementById("characterClass").textContent = "직업: " + value;
    }
  }
}

async function updateAIImage(response) {
  const imageContainer = document.getElementById("aiImageContainer");
  const imageElement = document.getElementById("aiGeneratedImage");
  const containerWidth = 1846;
  const containerHeight = 800;
  const imagePrompt = `Fantasy RPG scene: ${response.substring(0, 100)}`;

  try {
    const imageUrl = await generateImage(imagePrompt);
    imageElement.src = imageUrl;
    imageElement.alt = `Current scene: ${response.substring(0, 50)}...`;
    imageElement.width = containerWidth;
    imageElement.height = containerHeight;
  } catch (error) {
    console.error("Image generation error:", error);
    imageElement.src = `https://picsum.photos/${containerWidth}/${containerHeight}?random=${Date.now()}`;
    imageElement.alt = `Image generation failed. Current scene: ${response.substring(
      0,
      50
    )}...`;
    imageElement.width = containerWidth;
    imageElement.height = containerHeight;
  }
}

updateAlignmentDisplay();
