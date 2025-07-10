const textosDefault = [
  "As pessoas odeiam-se frequentemente porque têm medo umas das outras; têm medo umas das outras porque não se conhecem; não se conhecem porque não conseguem comunicar; não conseguem comunicar porque estão separadas",
  "A meu favor Tenho o verde secreto dos teus olhos Algumas palavras de ódio algumas palavras de amor O tapete que vai partir para o infinito Esta noite ou uma noite qualquer",
];

let sourceTexts = [], // First database texts
  targetTexts = [], // Second database texts
  currentSourceText = "",
  currentTargetText = "",
  displayedText = "",
  transformTimers = [];
let decodedDiv = document.getElementById("decoded");

let timeOffset = 0; // Difference between server time and local time
let containerRect = null; // Fixed rectangle dimensions
let preCalculatedFont = null; // Pre-calculated font size

window.addEventListener("load", () => {
  for (let textarea of document.querySelectorAll("textarea.tr")) {
    let wrap = document.createElement("div");
    wrap.className = "tr-wrap";
    textarea.parentNode.insertBefore(wrap, textarea);
    wrap.appendChild(textarea);

    let buttonCounterContainer = document.createElement("div");
    buttonCounterContainer.className = "button-counter-container";

    let existingButton = wrap.parentNode.querySelector("button");
    if (existingButton) {
      existingButton.parentNode.removeChild(existingButton);
      buttonCounterContainer.appendChild(existingButton);
    }

    let counter = document.createElement("div");
    counter.className = "tr-counter";
    counter.innerHTML = textarea.maxLength;
    buttonCounterContainer.appendChild(counter);

    wrap.parentNode.insertBefore(buttonCounterContainer, wrap.nextSibling);

    textarea.addEventListener(
      "input",
      () => (counter.innerHTML = textarea.maxLength - textarea.value.length)
    );
    textarea.addEventListener(
      "keyup",
      () => (counter.innerHTML = textarea.maxLength - textarea.value.length)
    );
  }
});

async function syncTime() {
  try {
    const start = Date.now();
    const response = await fetch("api/time.php");
    const serverTime = await response.json();
    const end = Date.now();
    const networkDelay = (end - start) / 2;
    timeOffset = serverTime - (start + networkDelay);
  } catch (e) {
    console.log("Could not sync time, using local time");
    timeOffset = 0;
  }
}

function getNetworkTime() {
  return Date.now() + timeOffset;
}

function formatToBlock(text) {
  // Preserve original formatting and case, just clean up extra whitespace
  return text.trim();
}

function createFixedContainer() {
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Mobile-friendly spacing
  const isMobile = viewportWidth <= 768;
  const horizontalMargin = isMobile ? 0.05 : 0.08;
  const verticalMargin = isMobile ? 0.05 : 0.1;

  const containerWidth = viewportWidth * (1 - horizontalMargin * 2);
  const containerHeight = viewportHeight * (1 - verticalMargin * 2);

  // Store container dimensions
  containerRect = {
    width: containerWidth,
    height: containerHeight,
    isMobile: isMobile,
  };

  // Set up the container styles once
  decodedDiv.style.position = "fixed";
  decodedDiv.style.top = "50%";
  decodedDiv.style.left = "50%";
  decodedDiv.style.transform = "translate(-50%, -50%)";
  decodedDiv.style.width = containerWidth + "px";
  decodedDiv.style.height = containerHeight + "px";
  decodedDiv.style.maxWidth = containerWidth + "px";
  decodedDiv.style.maxHeight = containerHeight + "px";
  decodedDiv.style.display = "flex";
  decodedDiv.style.alignItems = "center";
  decodedDiv.style.justifyContent = "center";
  decodedDiv.style.textAlign = "justify";
  decodedDiv.style.overflowWrap = "break-word";
  decodedDiv.style.whiteSpace = "pre-wrap";
  decodedDiv.style.overflow = "hidden";
  decodedDiv.style.boxSizing = "border-box";
}

function calculateOptimalFontSize(text) {
  if (!containerRect) return 16;

  const {
    width: availableWidth,
    height: availableHeight,
    isMobile,
  } = containerRect;

  // Responsive font size ranges
  const minFont = isMobile ? 8 : 22;
  const maxFont = isMobile ? 20 : 120;

  // Temporarily set text to measure
  decodedDiv.textContent = text;

  let left = minFont;
  let right = maxFont;
  let bestFont = minFont;

  // Test if text fits at a given font size
  function testFontSize(fontSize) {
    decodedDiv.style.fontSize = fontSize + "px";

    // Force layout recalculation
    decodedDiv.offsetHeight;

    // Check if content overflows
    const fitsWidth = decodedDiv.scrollWidth <= availableWidth;
    const fitsHeight = decodedDiv.scrollHeight <= availableHeight;

    return fitsWidth && fitsHeight;
  }

  // Binary search for optimal font size
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (testFontSize(mid)) {
      bestFont = mid;
      left = mid + 1; // Try larger font
    } else {
      right = mid - 1; // Try smaller font
    }
  }

  // Apply final font size with tiny safety margin
  const finalFontSize = Math.max(bestFont * 0.99, minFont);
  return finalFontSize;
}

function submitText() {
  const txt = document.getElementById("input").value.trim();
  if (!txt) return;

  console.log("Submitting text:", txt); // Debug log

  fetch("api/submit.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: txt }),
  })
    .then((response) => {
      console.log("Response status:", response.status); // Debug log
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((result) => {
      console.log("Server response:", result); // Debug log
      document.getElementById("input").value = "";
      fetchTexts();
      window.location.href = "../odio/index.html";
    })
    .catch((error) => {
      console.error("Error submitting text:", error);
    });
}

async function fetchSourceTexts() {
  try {
    const res = await fetch("api/source_texts.php");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.log("Source database empty or error. Using fallback.");
      sourceTexts = textosDefault;
    } else {
      sourceTexts = data;
    }
  } catch (e) {
    console.log("Error fetching source texts. Using fallback.");
    sourceTexts = textosDefault;
  }
}

async function fetchTargetTexts() {
  try {
    const res = await fetch("api/target_texts.php");
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.log("Target database empty or error. Using fallback.");
      targetTexts = textosDefault;
    } else {
      targetTexts = data;
    }
  } catch (e) {
    console.log("Error fetching target texts. Using fallback.");
    targetTexts = textosDefault;
  }
}

async function fetchTexts() {
  await Promise.all([fetchSourceTexts(), fetchTargetTexts()]);
}

function padTextsToSameLength(sourceText, targetText) {
  const maxLength = Math.max(sourceText.length, targetText.length);

  // Pad shorter text with spaces at the end
  const paddedSource = sourceText.padEnd(maxLength, " ");
  const paddedTarget = targetText.padEnd(maxLength, " ");

  return { paddedSource, paddedTarget, maxLength };
}

function getRandomChar() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}

function startCycle() {
  if (!sourceTexts.length || !targetTexts.length) return;

  // Ensure container is set up
  if (!containerRect) {
    createFixedContainer();
  }

  // Use network time for synchronization
  const now = getNetworkTime();

  // Make cycles start at predictable intervals (e.g., every 60 seconds)
  const cycleInterval = 1 * 60 * 1000; // 60 seconds
  const currentCycle = Math.floor(now / cycleInterval);
  const cycleStartTime = currentCycle * cycleInterval;

  // Determine which texts to show based on time (deterministic)
  const sourceIndex = currentCycle % sourceTexts.length;
  const targetIndex = currentCycle % targetTexts.length;

  const originalSourceText = sourceTexts[sourceIndex];
  const originalTargetText = targetTexts[targetIndex];

  // Pad texts to same length
  const { paddedSource, paddedTarget, maxLength } = padTextsToSameLength(
    originalSourceText,
    originalTargetText
  );

  currentSourceText = paddedSource;
  currentTargetText = paddedTarget;

  // Pre-calculate the optimal font size based on the longer text
  const longerText =
    originalSourceText.length > originalTargetText.length
      ? originalSourceText
      : originalTargetText;
  const formatted = formatToBlock(longerText);
  preCalculatedFont = calculateOptimalFontSize(formatted);

  // Set the font size once
  decodedDiv.style.fontSize = preCalculatedFont + "px";

  displayedText = currentSourceText; // Start with source text
  transformTimers = [];

  // Create transformation timeline
  for (let i = 0; i < maxLength; i++) {
    const delay = i * 150; // Time between character transformations
    transformTimers.push({
      transformed: false,
      transformTime: cycleStartTime + delay,
      isRandomizing: false,
      randomizeStartTime: cycleStartTime + delay - 500, // Start randomizing 500ms before transform
    });
  }

  requestAnimationFrame(transformFrame);
}

function transformFrame() {
  const now = getNetworkTime();
  let output = "";

  for (let i = 0; i < currentSourceText.length; i++) {
    const timer = transformTimers[i];
    const sourceChar = currentSourceText[i];
    const targetChar = currentTargetText[i];

    if (timer.transformed || now >= timer.transformTime) {
      // Character has been transformed to target
      timer.transformed = true;
      output += targetChar;
    } else if (now >= timer.randomizeStartTime && !timer.transformed) {
      // Character is in randomization phase before transformation
      timer.isRandomizing = true;

      // Don't randomize whitespace characters
      if (/\s/.test(sourceChar) && /\s/.test(targetChar)) {
        output += sourceChar; // Keep original spacing
      } else if (/\s/.test(sourceChar)) {
        output += sourceChar; // Keep source whitespace
      } else if (/\s/.test(targetChar)) {
        output += getRandomChar(); // Randomize until it becomes target whitespace
      } else {
        output += getRandomChar(); // Randomize non-whitespace characters
      }
    } else {
      // Character hasn't started transforming yet
      output += sourceChar;
    }
  }

  // Remove trailing spaces for display (but keep internal spacing)
  const formatted = formatToBlock(output);
  decodedDiv.textContent = formatted;

  if (transformTimers.every((timer) => timer.transformed)) {
    // All characters transformed, calculate time until next cycle
    const cycleInterval = 1 * 60 * 1000;
    const nextCycleTime = Math.ceil(now / cycleInterval) * cycleInterval;
    const waitTime = nextCycleTime - now;
    setTimeout(startCycle, waitTime);
  } else {
    // Continue transformation
    setTimeout(() => requestAnimationFrame(transformFrame), 50);
  }
}

// Handle window resize and orientation changes
function handleResize() {
  // Recreate container and recalculate font for current texts
  createFixedContainer();

  if (currentSourceText && currentTargetText) {
    // Use the longer of the two texts for font calculation
    const longerText =
      currentSourceText.length > currentTargetText.length
        ? currentSourceText
        : currentTargetText;
    const formatted = formatToBlock(longerText);
    preCalculatedFont = calculateOptimalFontSize(formatted);
    decodedDiv.style.fontSize = preCalculatedFont + "px";

    // Update current display
    const currentText = decodedDiv.textContent;
    if (currentText) {
      decodedDiv.textContent = formatToBlock(currentText);
    }
  }
}

window.addEventListener("resize", () => {
  // Small delay to ensure viewport dimensions are updated
  setTimeout(handleResize, 100);
});

// Handle mobile orientation changes specifically
window.addEventListener("orientationchange", () => {
  // Longer delay for orientation changes
  setTimeout(handleResize, 300);
});

// Initialize with time sync
syncTime().then(() => {
  fetchTexts().then(() => {
    createFixedContainer(); // Set up the container first
    startCycle();
    setInterval(fetchTexts, 2 * 60 * 1000); // Update text cache every 2 minutes
    setInterval(syncTime, 10 * 60 * 1000); // Re-sync time every 10 minutes
  });
});
