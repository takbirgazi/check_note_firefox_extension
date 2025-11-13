// Select elements
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const linkInput = document.getElementById("link");
const addBtn = document.getElementById("addBtn");
const notesList = document.getElementById("notesList");

let editIndex = null; // Track which note is being edited

// Load notes on start
document.addEventListener("DOMContentLoaded", showNotes);

// Add or update note
addBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();
    const link = linkInput.value.trim();

    if (!name || !description) {
        alert("Please fill in both name and description!");
        return;
    }

    const notes = JSON.parse(localStorage.getItem("checkNotes")) || [];

    if (editIndex !== null) {
        // Update existing note
        notes[editIndex].name = name;
        notes[editIndex].description = description;
        notes[editIndex].link = link;
        localStorage.setItem("checkNotes", JSON.stringify(notes));

        addBtn.textContent = "Add Note";
        editIndex = null;
    } else {
        // Add new note
        const newNote = { name, description, link, checked: false };
        notes.push(newNote);
        localStorage.setItem("checkNotes", JSON.stringify(notes));
    }

    nameInput.value = "";
    descriptionInput.value = "";
    linkInput.value = "";

    showNotes();
});

// Show all notes (SAFE rendering)
function showNotes() {
    const notes = JSON.parse(localStorage.getItem("checkNotes")) || [];
    notesList.innerHTML = "";

    notes.forEach((note, index) => {
        const li = document.createElement("li");

        // --- Create header container ---
        const headerDiv = document.createElement("div");
        headerDiv.className = "note-header";

        // --- Left side (checkbox + title) ---
        const leftDiv = document.createElement("div");
        leftDiv.style.display = "flex";
        leftDiv.style.alignItems = "center";
        leftDiv.style.gap = "5px";

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.className = "check-box";
        checkBox.dataset.index = index;
        checkBox.checked = note.checked;

        const title = document.createElement("span");
        title.className = `note-title ${note.checked ? "checked" : ""}`;
        title.textContent = note.name;

        leftDiv.appendChild(checkBox);
        leftDiv.appendChild(title);

        // --- Right side (actions) ---
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "actions";

        const editBtn = document.createElement("span");
        editBtn.className = "edit-btn";
        editBtn.dataset.index = index;
        editBtn.textContent = "✏️";

        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.index = index;
        deleteBtn.textContent = "✖";

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        headerDiv.appendChild(leftDiv);
        headerDiv.appendChild(actionsDiv);
        li.appendChild(headerDiv);

        // --- Description ---
        const descDiv = document.createElement("div");
        descDiv.className = "note-description";
        descDiv.textContent = note.description;
        li.appendChild(descDiv);

        // --- Link (optional) ---
        if (note.link) {
            const linkDiv = document.createElement("div");
            linkDiv.className = "note-link";

            const anchor = document.createElement("a");
            anchor.href = note.link;
            anchor.target = "_blank";
            anchor.textContent = "🔗 Visit";

            linkDiv.appendChild(anchor);
            li.appendChild(linkDiv);
        }

        notesList.appendChild(li);
    });

    // Delete note
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            deleteNote(index);
        });
    });

    // Edit note
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            editNote(index);
        });
    });

    // Check/uncheck note
    document.querySelectorAll(".check-box").forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
            const index = e.target.getAttribute("data-index");
            toggleChecked(index, e.target.checked);
        });
    });
}

// Delete a note
function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem("checkNotes")) || [];
    notes.splice(index, 1);
    localStorage.setItem("checkNotes", JSON.stringify(notes));
    showNotes();
}

// Toggle checked state
function toggleChecked(index, isChecked) {
    const notes = JSON.parse(localStorage.getItem("checkNotes")) || [];
    notes[index].checked = isChecked;
    localStorage.setItem("checkNotes", JSON.stringify(notes));
    showNotes();
}

// Edit a note
function editNote(index) {
    const notes = JSON.parse(localStorage.getItem("checkNotes")) || [];
    const note = notes[index];

    nameInput.value = note.name;
    descriptionInput.value = note.description;
    linkInput.value = note.link;

    editIndex = index;
    addBtn.textContent = "Update Note";
}
