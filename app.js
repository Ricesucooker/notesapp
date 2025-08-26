let notes =[]
let editingNoteId= null

function loadNotes(){
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes):[]
}

function saveNote(event){
    event.preventDefault()

    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if(editingNoteId){
        const notesIndex = notes.findIndex( note => note.id === editingNoteId)
        notes[notesIndex]={
            ...notes[notesIndex],
            title: title,
            content: content
        }

    }else{
        notes.unshift({
        id: generateID(),
        title: title,
        content: content
    })
    }
    closeNoteDialog()
    saveNotes()
    renderNotes()
  
}

function generateID(){
    return Date.now().toString()
}

function saveNotes(){
    localStorage.setItem("quickNotes", JSON.stringify(notes))
}

function deleteNote(noteId){
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}


function renderNotes(){
    const notesContainer = document.getElementById("notesContainer");
  
    if(notes.length === 0) {
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No notes yet</h2>
        <p>Create your first note to get started!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
      </div>
    `
    return
  }

    notesContainer.innerHTML = notes.map(note =>`
        <div class="note-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>

            <div class="note-actions">
                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                </button>

                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
    
        </div>
        `).join('')
}

function openNoteDialog(noteId = null){
    const dialog = document.getElementById("noteDialog");
    const titleInput = document.getElementById("noteTitle");
    const contentInput= document.getElementById("noteContent");

    if(noteId){
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteId = noteId
        document.getElementById("dialogTitle").textContent = "Edit Note"
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content

    }
    else{
        editingNoteId = null
        document.getElementById("dialogTitle").textContent="Add Notes"
        titleInput.value = ""
        contentInput.value = ""
    }

    dialog.showModal()
    titleInput.focus()
}


function closeNoteDialog(){
    document.getElementById("noteDialog").close()
}

function applyStoredTheme(){
    if(localStorage.getItem("theme") === 'dark'){
        document.body.classList.add('dark-theme')
        document.getElementById("themeToggleBtn").textContent ='☀️'
    }
}

function toggleTheme(){
   const isDark = document.body.classList.toggle("dark-theme")
   localStorage.setItem('theme', isDark ? "dark": "light")
   document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙'
}

document.addEventListener("DOMContentLoaded",function(){
    applyStoredTheme()
    notes = loadNotes()
    renderNotes()

    document.getElementById("noteForm").addEventListener("submit", saveNote)
    document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme)

    document.getElementById("noteDialog").addEventListener("click", function(event){
        if(event.target === this){
            closeNoteDialog()
        }
    })
})

