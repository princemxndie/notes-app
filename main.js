// Get the DOM elements
const noteTitle = document.getElementById('note-title');
const noteBody = document.getElementById('note-body');
const saveNoteBtn = document.getElementById('save-note');
const savedNotesHolder = document.querySelector('.--saved-notes');
const createNoteBtn = Array.from(document.getElementsByClassName('--create-note-btn'));
const savedNotesBtn = Array.from(document.getElementsByClassName('--saved-notes-btn'));
const noteList = document.getElementById('note-list');
const mainContainer = document.querySelector('.--container-fixed-vertical-overflow-scrolling-type');
const noteWord = document.querySelector('.--add-s');
noteWord.innerText = '';

createNoteBtn.forEach((btn) => {
  btn.innerHTML = `<span class='--font-size-3md --c-yellow-alt --bg-shader-1x --padding-xs fas fa-pen-to-square'></span>`;
  btn.addEventListener('click', createNote);
  
  function createNote(event) {
    savedNotesHolder.classList.add('--hidden-right');
    savedNotesHolder.classList.remove('--slide-in-from-right');
  
    btn.classList.add('--display-0');
  }
})

savedNotesBtn.forEach((btn) => {
  btn.addEventListener('click', showSaved);
  
  function showSaved() {
    savedNotesHolder.classList.remove('--hidden-right');
    savedNotesHolder.classList.add('--slide-in-from-right');
    createNoteBtn.forEach((btn) => {
      btn.classList.remove('--display-0');
    })
  }
})

// Initialize the notes array
let notes = [];

// Function to add a note to the notes array
function addNoteToList(title, body, id = null) {
  const timestamp = new Date().toLocaleString();
  const note = { title, body, timestamp };
  if (id) {
    note.id = id;
  }
  notes.push(note);
}

// Function to render the notes list
function renderNotesList() {
  const noteCount = document.querySelector('.--note-count');
  noteCount.innerText = notes.length;
  
  if (notes.length > 1) {
    noteWord.innerText = 's';
  } else if (notes.length < 1) {
    noteWord.innerText = 's';
  } else {
    noteWord.innerText = '';
  }
  
  noteList.innerHTML = '';
  
  // sort the notes in descending order based on their timestamps
  notes.sort((b, a) => b.timestamp < a.timestamp);
  
  notes.forEach((note, index) => {
    const li = document.createElement('li');
    const title = document.createElement('h4');
    const body = document.createElement('p');
    const timestamp = document.createElement('small');
    const deleteBtn = document.createElement('button');
    const shareBtn = document.createElement('button');
    
    const noteClasses = ['--border-bottom-width-4xs', '--border-0', '--border-solid', '--padding-top-bottom-xs', '--position-relative'];
    const noteTitleClasses = ['--font-weight-800', '--font-size-3sm'];
    const noteBodyClasses = ['--c-shader-3x', '--font-size-4sm'];
    const shareBtnClasses = ['--border-0', '--bg-blue', '--c-inherit', '--padding-3sm', '--position-absolute', '--right-0'];
    const delBtnClasses = ['--border-0', '--bg-pink', '--c-inherit', '--padding-3sm', '--position-absolute', '--right-md'];

    // Check if this is the last note element and remove the border classes
    if (index === notes.length - 1) {
      noteClasses.splice(noteClasses.indexOf('--border-bottom-width-4xs'), 1);
      noteClasses.splice(noteClasses.indexOf('--border-solid'), 1);
    }

    li.classList.add(...noteClasses);
    //li.setAttribute('id', `note-item-${index}`); // add an id attribute to the li element
    title.classList.add(...noteTitleClasses);
    body.classList.add(...noteBodyClasses);
    
    // Add truncation logic to the note body
    const maxLength = 30; // maximum length of the line
    const text = note.body; // get the text from the note body

    if (text.length > maxLength) { // check if the text is longer than the maximum length
      const truncatedText = text.substr(0, maxLength).trim() + '...'; // truncate the text and add ellipsis
      body.innerText = truncatedText; // update the text of the note body with the truncated text
    } else {
      body.innerText = text; // update the text of the note body as is
    }
    
    title.innerText = note.title;
    timestamp.innerText = note.timestamp;
    title.addEventListener('click', () => editNote(index));
    
    shareBtn.classList.add(...shareBtnClasses);
    shareBtn.innerHTML = `<span class='fas fa-share-nodes'></span>`;
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: title.innerText,
          text: text,
          url: window.location.href
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing:', error));
      }
    })

    deleteBtn.classList.add(...delBtnClasses);
    deleteBtn.innerHTML = `<span class='fas fa-trash-can'></span>`;
    deleteBtn.addEventListener('click', () => deleteNoteFromList(index));
    
    li.appendChild(title);
    li.appendChild(body);
    li.appendChild(timestamp);
    li.appendChild(deleteBtn);
    li.appendChild(shareBtn);
    noteList.appendChild(li);
  });
}

// Function to edit an already saved note
function editNote(index) {
  const note = notes[index];
  const modal = document.createElement('div');
  const modalClasses = ['--modal', '--bg-dark-alt'];
  modal.classList.add(...modalClasses);
  const modalContent = document.createElement('div');
  modalContent.classList.add('--modal-content');
  
  const titleClasses = ['--margin-bottom-4sm', '--font-size-3md', '--font-weight-900', '--bg-none', '--c-inherit', '--border-0', '--width-fxl'];
  const bodyClasses = ['--font-size-4sm', '--width-fxl', '--height-fxl', '--bg-none', '--c-inherit', '--border-0'];
  const saveClasses = ['--width-fxl', '--max-width-fmd', '--text-right', '--padding-xs', '--font-size-2sm', '--font-weight-600', '--bg-none', '--border-0', '--position-fixed', '--top-0', '--right-0', '--c-yellow-alt'];
  
  const titleInput = document.createElement('input');
  titleInput.classList.add(...titleClasses);
  titleInput.value = note.title;
  
  const bodyInput = document.createElement('textarea');
  bodyInput.classList.add(...bodyClasses);
  bodyInput.value = note.body;
  
  const saveBtn = document.createElement('button');
  saveBtn.classList.add(...saveClasses);
  saveBtn.innerText = 'Done';
  saveBtn.addEventListener('click', () => {
    const newTitle = titleInput.value.trim();
    const newBody = bodyInput.value.trim();
    if (newTitle && newBody) {
      notes[index].title = newTitle;
      notes[index].body = newBody;
      note.timestamp = new Date().toLocaleString(); // update the timestamp to the current time
      localStorage.setItem('notes', JSON.stringify(notes));
      modal.remove();
      renderNotesList();
    }
  });
  modalContent.appendChild(titleInput);
  modalContent.appendChild(bodyInput);
  modalContent.appendChild(saveBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}


// Function to delete a note from the notes array
function deleteNoteFromList(index) {
  notes.splice(index, 1);
  renderNotesList();
  
  // Update the DOM by removing the corresponding li element
  //const noteItem = document.getElementById(`note-item-${index}`);
  //noteItem.remove();
}

// Load the saved notes from local storage
if (localStorage.getItem('notes') || []) {
  notes = JSON.parse(localStorage.getItem('notes'));
  renderNotesList();
}

// Event listener for save note button
saveNoteBtn.addEventListener('click', () => {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();
  if (title && body) {
    addNoteToList(title, body);
    renderNotesList();
    localStorage.setItem('notes', JSON.stringify(notes));
    noteTitle.value = '';
    noteBody.value = '';
  }
});
