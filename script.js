const moodButtons = document.querySelectorAll(".mood");
const noteInput = document.getElementById("note");
const saveBtn = document.getElementById("saveBtn");
const historyDiv = document.getElementById("history");
const message = document.getElementById("message");

let selectedMood = "";

let entries = JSON.parse(
  localStorage.getItem("moodEntries") || "[]"
);

// Select a mood
moodButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedMood = button.dataset.mood;

    moodButtons.forEach(btn => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");
    message.textContent = "";
  });
});

// Save a mood
saveBtn.addEventListener("click", () => {
  if (!selectedMood) {
    message.textContent = "Please select your mood first!";
    return;
  }

  const entry = {
    id: Date.now(),
    mood: selectedMood,
    note: noteInput.value.trim(),
    date: new Date().toLocaleString()
  };

  entries.unshift(entry);

  localStorage.setItem(
    "moodEntries",
    JSON.stringify(entries)
  );

  noteInput.value = "";
  selectedMood = "";

  moodButtons.forEach(button => {
    button.classList.remove("selected");
  });

  message.textContent = "Your mood has been saved! ";

  displayHistory();
});

// Display saved moods
function displayHistory() {
  historyDiv.replaceChildren();

  if (entries.length === 0) {
    historyDiv.textContent = "No moods recorded yet.";
    return;
  }

  const emojis = {
    Happy: "😄",
    Calm: "😌",
    Okay: "😐",
    Sad: "😔",
    Angry: "😡"
  };

  entries.forEach(entry => {
    const card = document.createElement("div");
    card.className = "entry";

    const heading = document.createElement("h3");
    heading.textContent = `${emojis[entry.mood] || "🙂"} ${entry.mood}`;

    const date = document.createElement("small");
    date.textContent = entry.date;

    const note = document.createElement("p");
    note.textContent = entry.note || "No note added.";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      entries = entries.filter(item => item.id !== entry.id);

      localStorage.setItem(
        "moodEntries",
        JSON.stringify(entries)
      );

      displayHistory();
    });

    card.append(heading, date, note, deleteBtn);
    historyDiv.appendChild(card);
  });
}

// Load history when the page opens
displayHistory();
