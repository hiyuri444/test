const board = document.getElementById("board")
const button = document.getElementById("placebutton")
const timerdisplay = document.getElementById("timer")
const notetextarea = document.getElementById("notetextarea")
const authortextarea = document.getElementById("authortextarea")
let activenote
let offset
let notewidth
let timer = 2

function formattime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return mins + ":" + secs.toString().padStart(2, "0");
}

function createactivenote() {
    activenote = document.createElement("div");
    activenote.classList.add("note");
    activenote.style.transform = "rotate(" + (Math.random()-0.5)*15 + "deg)";
    board.appendChild(activenote)

    notetext = document.createElement("div");
    notetext.classList.add("notetext");
    notetext.textContent = notetextarea.value;
    activenote.appendChild(notetext)

    authortext = document.createElement("div");
    authortext.classList.add("authortext");
    authortext.textContent = "- " + authortextarea.value;
    activenote.appendChild(authortext)
}

function positionactivenote(event) {
    offset = board.getBoundingClientRect();
    activenote.style.top = event.pageY - offset.top + 10 + "px";
    activenote.style.left = event.pageX - offset.left - 60 + "px";
}

function updatetimerdisplay() {
    if (timer >= 0) {
        timerdisplay.innerText = formattime(timer);
    } else {
        timerdisplay.innerText = "ready!1"
    }
}

function santizeinput() {
  this.value = this.value.replace(/\n/g, "");
}

// todo:
// add clamping when moving note
// make notes removable
// note types
// check if notes are valid

button.addEventListener("click", (event) => {

    if (timer >= 0) {
        // flash timer red
    } else {
        if (activenote == null) { 
            createactivenote()
            positionactivenote(event)
        }
    }

});

document.addEventListener("mousemove", (event) => {
    if (activenote !== null) {
        positionactivenote(event)
    }
});

board.addEventListener("click", (event) => {
    if (activenote !== null && event.target === board) {
        if (timer >= 0) {
            activenote.remove()
            activenote = null
        } else {
            activenote = null
            timer = 120
            updatetimerdisplay()
        }
    }
});

notetextarea.addEventListener("input", santizeinput);
authortextarea.addEventListener("input", santizeinput)

setInterval(() => {
    timer = timer - 1
    updatetimerdisplay()
}, 1000);