const board = document.getElementById("board")
const button = document.getElementById("placebutton")
const timerdisplay = document.getElementById("timer")
const notetextarea = document.getElementById("notetextarea")
const authortextarea = document.getElementById("authortextarea")
let activenote
let offset
let notewidth
let timer = fetch("https://test-xajq.onrender.com/timer", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }})
    .then(res => res.json())
    .then(data => {
        timer = data.timer;
        updatetimerdisplay();
    });

function formattime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return mins + ":" + secs.toString().padStart(2, "0");
}

function getRotationDegrees(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (transform === "none") return 0;

  const values = transform.match(/matrix\((.+)\)/)[1].split(", ");

  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);

  const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

  return angle;
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

            fetch("https://test-xajq.onrender.com/board", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: notetextarea.value,
                    author: authortextarea.value,
                    x: Math.floor(event.pageX - offset.left - 60),
                    y: Math.floor(event.pageY - offset.top + 10),
                    angle: Math.floor(getRotationDegrees(activenote))
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "error") {
                    location.reload()
                } else {
                    activenote = null
                    timer = 120
                    updatetimerdisplay()
                }
            });
        }
    }
});

notetextarea.addEventListener("input", santizeinput);
authortextarea.addEventListener("input", santizeinput)

fetch("https://test-xajq.onrender.com/board", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}).then(res => res.json())
.then(data => {
    for (const datum in data) {

        note = document.createElement("div");
        note.classList.add("note");

        note.style.top = data[datum].y + "px";
        note.style.left = data[datum].x + "px";
        note.style.transform = "rotate(" + data[datum].angle + "deg)";
        board.appendChild(note);

        notetext = document.createElement("div");
        notetext.classList.add("notetext");
        notetext.textContent = data[datum].message;
        note.appendChild(notetext)

        authortext = document.createElement("div");
        authortext.classList.add("authortext");
        authortext.textContent = "- " + data[datum].author;
        note.appendChild(authortext)
    }
});

setInterval(() => {
    timer = timer - 1
    updatetimerdisplay()
}, 1000);