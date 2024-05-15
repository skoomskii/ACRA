
try {
  var SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  console.error(e);
  $(".no-browser-support").show();
  $(".app").hide();
}

var noteTextarea = $("#note-textarea1");

var instructions = $("#recording-instructions");

var notesList = $("ul#notes");

var noteContent = "";

var notes = getAllNotes();
renderNotes(notes);

recognition.continuous = true;

recognition.onresult = function (event) {
  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

  var mobileRepeatBug =
    current == 1 && transcript == event.results[0][0].transcript;

  var final_transcript;

  if (!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
};

recognition.onstart = function () {
  instructions.text(
    "Voice recognition has begun. Please speak clearly into the mic."
  );
};

recognition.onspeechend = function () {
  instructions.text(
    "Silence was detected for over 15 seconds so the mic was automatically turned off."
  );
};

recognition.onerror = function (event) {
  if (event.error == "no-speech") {
    instructions.text("No speech was detected. Please attempt to try again.");
  }
};

$("#start-record-btn").on("click", function (e) {
  if (noteContent.length) {
    noteContent += " ";
  }
  recognition.start();
});

$("#stop-record-btn").on("click", function (e) {
  recognition.stop();
  instructions.text("Voice recognition stopped");
  extract_info(noteContent.toLowerCase());
});

noteTextarea.on("input", function () {
  noteContent = $(this).val();
});

notesList.on("click", function (e) {
  e.preventDefault();
  var target = $(e.target);


  if (target.hasClass("listen-note")) {
    var content = target.closest(".note").find(".content").text();
    readOutLoud(content);
  }

});


function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();

  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}



function renderNotes(notes) {
  var html = "";
  if (notes.length) {
    notes.forEach(function (note) {
      html += `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;
    });
  } else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
}

function saveNote(dateTime, content) {
  localStorage.setItem("note-" + dateTime, content);
}

function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if (key.substring(0, 5) == "note-") {
      notes.push({
        date: key.replace("note-", ""),
        content: localStorage.getItem(localStorage.key(i)),
      });
    }
  }
  return notes;
}

function deleteNote(dateTime) {
  localStorage.removeItem("note-" + dateTime);
}

function handleFiles(event) {
  var files = event.target.files;
  $("#src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
}
