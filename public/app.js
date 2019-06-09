document.addEventListener("DOMContentLoaded", function(event) {
  // SOUNDCLOUD
  let bgMusic = new Audio("bg-music.mp3");
  bgMusic.volume = 0.3;
  bgMusic.play();
  // SOUNDCLOUD END

  document.getElementById("signup-button").addEventListener("click", function(event) {
    blockstack.redirectToSignIn();
  });

  document
    .getElementById("signout-button")
    .addEventListener("click", function(event) {
      event.preventDefault();
      blockstack.signUserOut(window.location.href);
    });

  getUsers(); // poke Heroku to start waking backend up

  setTimeout(() => {
    getUsersInterval();
  }, 2000); // give Heroku 2 seconds to wake up

  function getUsers() { 
    fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/users")
        .then(res => res.json())
        .then(data => (users = data));
  }

  function getUsersInterval() {
    let users = [];
    const interval = setInterval(() => {
      if (users.length < 1) {
        fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/users")
        .then(res => res.json())
        .then(data => (users = data));
      } else {
        clearInterval(interval);
      } 
    }, 1000); // fetch data every 1 second until data arrives

    return users.length < 1 ? interval : clearInterval(interval);
  }

  function showProfile(profile) {
    var person = new blockstack.Person(profile);
    document.getElementById("heading-name").innerHTML = person.name()
      ? person.name()
      : "Nameless Person";
    if (person.avatarUrl()) {
      document
        .getElementById("avatar-image")
        .setAttribute("src", person.avatarUrl());
    }
    document.getElementById("section-2").style.display = "block";
  }

  if (blockstack.isUserSignedIn()) {
    let signUp = document.getElementById("signup-button");
    signUp.classList.add("hide");
    var profile = blockstack.loadUserData().profile;
    showProfile(profile);
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin;
    });
  } else {
    let signOut = document.getElementById("signout-button");
    signOut.classList.add("hide");
  }
});

// jQuery like selection of elements.
window.$ = document.querySelectorAll.bind(document);

// Changes for  Firefox
if (navigator.userAgent.match(/firefox/i)) {
  // Unicode font sizes
  let ffBtn = "font-weight: normal; font-size: 2em; margin-left: 0.3em;";
  $("#restart-symbol")[0].setAttribute("style", ffBtn);

  let ffwait = "line-height: 1em; font-size: 4em;";
  $(".waiting")[0].setAttribute("style", ffwait);
}

/////////////////////////////////////////

// List of common programming words.
let wordList = [
  "if",
  "else",
  "elsif",
  "each",
  "forEach",
  "map",
  "collect",
  "select",
  "do",
  "def",
  "end",
  "function",
  "class",
  "module",
  "html",
  "fetch",
  "css",
  "javascript",
  "js",
  "rails",
  "rake",
  "db:migrate",
  "db:seed",
  "generate",
  "find",
  "findBy",
  "c++",
  "python",
  "shotgun",
  "let",
  "const",
  "addEventListener",
  "db:rollback",
  "querySelector",
  "querySelectorAll",
  "methods",
  "config",
  "Gemfile",
  "schema",
  "api",
  "controller",
  "models",
  "serializer",
  "cookies",
  "session[:id]",
  "params[:id]",
  "embed",
  "while",
  "until",
  "script",
  "h1",
  "h2",
  "h3",
  "img",
  "src=",
  "href",
  "views",
  "routes",
  "index",
  "show",
  "update",
  "edit",
  "delete",
  "destroy",
  "new",
  "create",
  "before_action",
  "@user",
  "User.create",
  "Tweet.save",
  "Tweet.new",
  "@tweet",
  "find_user",
  "render",
  "status",
  "{key:value}",
  "[array]",
  "string",
  "integer",
  "boolean",
  "true",
  "false",
  "null",
  "nil",
  "case",
  "when",
  "switch",
  "params.permit",
  "private",
  "errors",
  "div",
  "body",
  "ul",
  "li",
  "ol",
  "span",
  "p",
  "br",
  "#id",
  ".class",
  "selectElementById",
  "selectElementByClass",
  "text-align",
  "font-size",
  "background-color",
  "color",
  "a:hover",
  "width",
  "height",
  "border",
  "position",
  "absolute",
  "fixed",
  "relative",
  "overflow",
  "display",
  "none",
  "hidden",
  "style",
  "margin",
  "padding",
  "has_many",
  "belongs_to",
  ":id",
  ":name",
  "attributes",
  "Active:Model",
  "inherits",
  "ApplicationRecord",
  "ActiveRecord::Base",
  "self",
  "this",
  "validates",
  "uniqueness",
  "length",
  "User.first",
  "Tweet.last",
  "i++",
  "Tweet.all",
  "t.string",
  "t.integer",
  "create_table",
  "change",
  "innerHTML",
  "innerText",
  "add",
  "remove",
  "value",
  "key",
  "hash",
  "seeds",
  "install",
  "gem",
  "debugger",
  "console.log",
  "binding.pry",
  "typeof",
  "default",
  "event",
  "whitelist",
  "blacklist",
  "meta",
  "head",
  "iframe",
  "style.css",
  "index.html",
  "index.js",
  "index.erb",
  "show.erb",
  "edit.erb",
  "git",
  "branch",
  "checkout",
  "resources",
  "charset",
  "label",
  "input",
  "reset()",
  "%",
  "keypress",
  "localhost:3000",
  "http://",
  "https://",
  ".com",
  "cd",
  "touch",
  "mkdir",
  "bundle",
  "exec",
  "master",
  "commit",
  "-m",
  "push",
  "pull",
  "merge",
  "name=",
  "type=",
  "title",
  "authentication",
  "authorization",
  ".then",
  "dataset.id",
  "res.json()",
  "response",
  "res",
  "e.target",
  "event.target",
  "DOMContentLoaded",
  "click",
  "hover",
  "keyup",
  "keydown",
  "className",
  "button",
  "parentNode",
  "parentElement",
  "document",
  "data",
  "append",
  "prepend",
  "content",
  "createElement",
  "method:",
  "POST",
  "UPDATE",
  "DELETE",
  "GET",
  "Content-Type",
  "application/json",
  "headers:",
  "body:",
  "JSON.stringify",
  "e.preventDefault()",
  "only:",
  "except:",
  ":products",
  ":comments",
  ":seller",
  "@product",
  "@comment",
  "@seller",
  "form_for",
  "form_tag",
  "item",
  "action:",
  "dependent:",
  ":destroy",
  "through:",
  "join",
  "table",
  "open",
  "force:",
  ":cascade",
  "name:",
  "require",
  "sort",
  ":adapter",
  ":database",
  "sqlite",
  "sql",
  "postgresql",
  "json-server",
  "Rack::Response",
  "path.match",
  "resp.status",
  "resp.write",
  "resp.finish",
  "flash[:error]",
  "errors.full_messages",
  "redirect_to",
  "_form",
  "f.label",
  "f.text_field",
  "f.number_field",
  "f.collection_select",
  "f.submit",
  "form_tag",
  "label_tag",
  "text_field_tag",
  ":search",
  "submit_tag",
  "button_to",
  "new_user_path",
  "users_path",
  "edit_user_path",
  "style=",
  "color:red",
  "initialize",
  "attr_accessor",
  "attr_writer",
  "attr_reader",
  "scrolling",
  "(title)",
  "@@artists",
  "self.count",
  "self.all",
  "self.all.clear",
  "@@all",
  "downcase",
  "upcase",
  "gsub",
  "add_song",
  "require_relative",
  "student.rb",
  "teacher.rb",
  "link",
  "href",
  "options",
  "prototype",
  "jQuery",
  "elem",
  "node",
  "on",
  "be",
  "callback",
  "obj",
  "undefined",
  "NaN",
  "from",
  "not",
  "or",
  "and",
  "call",
  "args",
  "exports",
  "state",
  "set",
  "context",
  "scope",
  "arguments",
  "window",
  "test",
  "val",
  "fn",
  "start",
  "path",
  "top",
  "bottom",
  "left",
  "right",
  "Math",
  "random",
  "url",
  "offset",
  "child",
  "parent",
  "settings",
  "source",
  "code",
  "property",
  "line",
  "replace",
  "extend",
  "done",
  "instance",
  "container",
  "row",
  "column",
  "date",
  "time",
  "log",
  "range",
  "bind",
  "trigger",
  "catch",
  "max",
  "min",
  "filter",
  "list",
  "try",
  "token",
  "constructor",
  "Number",
  "promise",
  "indexOf",
  "slice",
  "assert",
  "dom",
  "base",
  "format",
  "disabled",
  "check",
  "editor",
  "any",
  "selected",
  "angular",
  "direct",
  "split",
  "after",
  "init",
  "root",
  "change",
  "process",
  "page",
  "load",
  "reload()",
  "equal",
  "==",
  "!=",
  "===",
  "frameborder",
  "autoplay",
  "template",
  "tag",
  "version",
  "global",
  "variable",
  "removeClass",
  "menu",
  "point",
  "attribute",
  "browser",
  "location",
  "full",
  "complete",
  "define",
  "component",
  "empty",
  "success",
  "group",
  "output",
  "clone",
  "pwd",
  "resolve",
  "image",
  "close",
  "setTimeout",
  "interval",
  "setInterval",
  "hasOwnProperty",
  "queue",
  "parse",
  "parseInt",
  "static",
  "ajax",
  "toLowerCase()",
  "toUpperCase()",
  "handler",
  "pass",
  "continue",
  "scale",
  "speed",
  "opacity",
  "isArray",
  "import",
  "export",
  "fail",
  "block",
  "animation",
  "canvas",
  "visible",
  "stop",
  "off",
  "isFunction",
  "lang",
  "compile",
  "concat",
  "invoke",
  "iterate",
  "loop",
  "nested",
  "object-oriented",
  "parameter",
  "parenthesis",
  "bracket",
  "syntax",
  "algorithm",
  "dump",
  "interpreter",
  "recursion",
  "sandbox",
  "GUI",
  "bootstrap",
  "IDE",
  "tab",
  "indent",
  "package",
  "prefix",
  "axis",
  "info",
  "listener",
  "plugin",
  "original",
  "deferred",
  "github",
  "public",
  "foo",
  "bar",
  "scroll",
  "delegation",
  "regex",
  "react",
  "month",
  "year",
  "cursor",
  "valid",
  "unless",
  "reject",
  "accept",
  "helper",
  "create-react-app",
  "react-router-dom",
  "componentDidMount()",
  "componentWillMount()",
  "componentDidUpdate()",
  "render()",
  "react-redux",
  "mapStateToProps",
  "mapDispatchToProps",
  "bindActionCreators",
  "withRouter",
  "export",
  "default",
  "React.Fragment",
  "this.state",
  "this.props",
  "this.setState({})",
  "JSX",
  "Components",
  "Containers",
  "onClick={}",
  "localStorage.getItem()"
];

function shuffle(array) {
  let m = array.length,
    t,
    i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// Add words to word-section

function addWords() {
  // clear existing word-section
  let wordSection = $("#word-section")[0];
  wordSection.style.backgroundColor = "white";
  wordSection.innerHTML = "";
  $("#typebox")[0].value = "";

  for (let i = 350; i > 0; i--) {
    let words = shuffle(wordList);
    let wordSpan = `<span>${words[i]}</span>`;
    wordSection.innerHTML += wordSpan;
  }
  // mark first word as current-word
  wordSection.firstChild.classList.add("current-word");

  // mark last word with magic-box
  // let magicBox = document.createElement("DIV");
  // magicBox.classList.add("magic-box");
  // wordSection.appendChild(magicBox);
}

//////////////////////////////////////////

// Word Colors
let colorCurrentWord = " #dddddd";
let colorCorrectWord = "#93C572";
let colorIncorrectWord = "#e50000";

// Word Count and other data.
let wordData = {
  seconds: 60,
  correct: 0,
  incorrect: 0,
  total: 0,
  typed: 0,
  freeze: false, // when this is true, stop the timer
  freezeTime: 0, // need to add this to seconds
  shield: false, // when this is true, can block one typo
  powerPercentActive: false, // when this is true
  powerPercentPoints: 0, // add 5% of score to here
  powerTime: false, // plus5sec glitching
  powerPoints: 0 // this adds 10,000 points
};

function grow() {
  let comboH2 = document.querySelector(".combo-combo");
  let hit = new Audio("hit.flac");

  comboH2.className = "combo-combo grow";
  hit.volume = 0.2;
  hit.play();

  setTimeout(function() {
    comboH2.className = "combo-combo";
  }, 500);
}

function complimentGrow() {
  const compliments = [
    "Good!",
    "Great!",
    "Wow!",
    "Amazing!",
    "Awesome!!",
    "Monster!!",
    "Super!!",
    "Dope!!",
    "Hyper!!",
    "King!!",
    "Killer!!",
    "Ultra!!!",
    "Godlike!!!",
    "Perfect!!!",
    "Incredible!!!"
  ];
  let index = Math.floor(Math.random() * 15);
  let compliment = compliments[index];

  let complimentSpan = document.querySelector(".compliment");
  complimentSpan.className = "compliment grow";
  complimentSpan.innerText = compliment;

  let killer = new Audio("killer.mp3");
  let hyper = new Audio("hyper.mp3");
  let ultra = new Audio("ultra.mp3");
  let monster = new Audio("monster.mp3");
  let awesome = new Audio("awesome.mp3");
  let king = new Audio("king.mp3");

  if (compliment === "Killer!!") {
    killer.play();
  } else if (compliment === "Hyper!!") {
    hyper.play();
  } else if (compliment === "Ultra!!!") {
    ultra.play();
  } else if (compliment === "Monster!!") {
    monster.play();
  } else if (compliment === "Awesome!!") {
    awesome.play();
  } else if (compliment === "King!!") {
    king.play();
  }

  setTimeout(function() {
    complimentSpan.className = "compliment";
  }, 500);
}

function missGrow() {
  let complimentSpan = document.querySelector(".compliment");
  complimentSpan.className = "compliment grow miss";
  complimentSpan.innerText = "Miss";
  let miss = new Audio("miss.mp3");
  miss.play();

  setTimeout(function() {
    complimentSpan.className = "compliment";
  }, 500);
}

function growMax() {
  let comboMaxH2 = document.querySelector(".combo-max");
  comboMaxH2.className = "combo-max grow";

  setTimeout(function() {
    comboMaxH2.className = "combo-max";
  }, 500);
}

function shrink() {
  let comboH2 = document.querySelector(".combo-combo");
  let comboMaxH2 = document.querySelector(".combo-max");
  comboH2.className = "combo-combo";
  comboMaxH2.className = "combo-max";
}

function powerUp() {
  const powers = ["freeze", "shield", "plus5percent", "plus5sec", "plus5000"];
  let index = Math.floor(Math.random() * 5);
  let power = powers[index];

  const powersDiv = document.querySelector(".powers");
  let powersSpan = powersDiv.querySelectorAll("SPAN");

  let powerExists = false;

  powersSpan.forEach(span => {
    if (span.className.includes(power)) {
      powerExists = true;
    }
  });

  if (powerExists === false) {
    let powerSpan = document.createElement("SPAN");
    powerSpan.className = `${power} fadein`;

    if (power === "freeze" || power === "shield") {
      powerSpan.innerHTML = `<img src="${power}.png" alt="${power}" />`;
    } else if (power === "plus5percent") {
      powerSpan.innerHTML = "<strong>+5%</strong>";
    } else if (power === "plus5sec") {
      powerSpan.innerHTML = "<strong>+5sec</strong>";
    } else if (power === "plus5000") {
      powerSpan.innerHTML = "<strong>+5,000</strong>";
    }

    powersDiv.append(powerSpan);

    if (power === "freeze") {
      freeze();
    } else if (power === "shield") {
      shield();
    } else if (power === "plus5percent") {
      plusFivePercent();
    } else if (power === "plus5sec") {
      plusFiveSeconds();
    } else if (power === "plus5000") {
      plusFiveThousand();
    }
  }
}

function freeze() {
  let powersDiv = document.querySelector(".powers");
  const freezeSpan = document.querySelector(".freeze");
  wordData.freeze = true;

  setTimeout(function() {
    wordData.freeze = false;
    freezeSpan.className = "freeze fadeout";
  }, 10000);

  setTimeout(function() {
    powersDiv.removeChild(freezeSpan);
  }, 11000);
}

function shield() {
  wordData.shield = true;
}

function plusFivePercent() {
  wordData.powerPercentActive = true;
}

function plusFiveSeconds() {
  wordData.powerTime = true;

  let powersDiv = document.querySelector(".powers");
  const plusFiveSecondsSpan = document.getElementsByClassName("plus5sec")[0];

  setTimeout(function() {
    plusFiveSecondsSpan.className = "plus5sec fadeout";
  }, 4000);

  setTimeout(function() {
    powersDiv.removeChild(plusFiveSecondsSpan);
  }, 5000);

  setTimeout(function() {
    wordData.powerTime = false;
  }, 5000);
}

function plusFiveThousand() {
  wordData.powerPoints += 5000;

  let powersDiv = document.querySelector(".powers");
  const plusFiveThousandSpan = document.getElementsByClassName("plus5000")[0];

  setTimeout(function() {
    plusFiveThousandSpan.className = "plus5000 fadeout";
  }, 4000);

  setTimeout(function() {
    powersDiv.removeChild(plusFiveThousandSpan);
  }, 5000);
}

function powerDown() {
  const powersDiv = document.querySelector(".powers");
  powersDiv.className = "powers fadeout";
  setTimeout(function() {
    powersDiv.innerHTML = "";
    powersDiv.className = "powers";
  }, 1000);

  wordData.freeze = false;
  wordData.shield = false;
  wordData.powerPercentActive = false;
}

//////////////////////////////////////////
// Initial implementation notes:
// next word on <space>, if empty, then set value=""
// after <space> if value == current-word, mark as correct-word
// else, mark as incorrect-word
// if value.length != current-word[:value.length], mark as incorrect-word
// else, mark as current-word
//////////////////////////////////////////

function checkWord(word) {
  let comboSpan = document.querySelector(".combo-count");
  let comboCount = parseInt(comboSpan.innerText);
  let comboMaxSpan = document.querySelector(".combo-max-count");
  let comboMaxCount = parseInt(comboMaxSpan.innerText);
  const powersDiv = document.querySelector(".powers");
  const shieldSpan = document.querySelector(".shield");
  let wlen = word.value.length;
  // how much we have of the current word.
  let current = $(".current-word")[0];
  let currentSubstring = current.innerHTML.substring(0, wlen);
  // check if we have any typing errors

  if (word.value.trim() != currentSubstring && wordData.shield === false) {
    current.classList.add("incorrect-word-bg");
    comboCount = 0;
    comboSpan.innerText = comboCount;
    shrink();
    powerDown();
    return false;
  } else {
    if (word.value.trim() != currentSubstring && wordData.shield) {
      word.value = currentSubstring;
      wordData.shield = false;
      shieldSpan.className = "shield fadeout";

      setTimeout(function() {
        powersDiv.removeChild(shieldSpan);
      }, 1000);
    }

    current.classList.remove("incorrect-word-bg");
    comboCount += 1;
    comboSpan.innerText = comboCount;
    grow();
    if (comboCount > comboMaxCount) {
      comboMaxSpan.innerText = comboCount;
      growMax();
    }
    if (comboCount % 20 === 0) {
      powerUp();
    }
    return true;
  }
}

function submitWord(word) {
  // update current-word and
  // keep track of correct & incorrect words
  let current = $(".current-word")[0];
  $("#typebox")[0].placeholder = "";

  if (checkWord(word)) {
    current.classList.remove("current-word");
    current.classList.add("correct-word-c");
    wordData.correct += 1;
    complimentGrow();
  } else {
    current.classList.remove("current-word", "incorrect-word-bg");
    current.classList.add("incorrect-word-c");
    wordData.incorrect += 1;
    missGrow();
  }

  // update wordData
  wordData.total = wordData.correct + wordData.incorrect;

  // make the next word the new current-word.
  current.nextSibling.classList.add("current-word");

  // change score on screen
  calculateWPM(wordData);
}

function clearLine() {
  // remove past words once you get to the next line
  let wordSection = $("#word-section")[0];
  let current = $(".current-word")[0]; // second line (first word)
  let previous = current.previousSibling; // first line (last word)
  let children = $(".correct-word-c, .incorrect-word-c").length;

  // <span>'s on the next line have a greater offsetTop value
  // than those on the top line.
  // Remove words until the first word on the second line
  // is the fistChild of word-section.
  if (current.offsetTop > previous.offsetTop) {
    for (let i = 0; i < children; i++) {
      wordSection.removeChild(wordSection.firstChild);
    }
  }
}

function isTimer(seconds) {
  let growTimer = false;
  let time = seconds;

  // only set timer once
  let one = $("#timer > span")[0].innerHTML;
  if (one == "1:00") {
    let typingTimer = setInterval(() => {
      growTimer = false;

      if (time <= 0) {
        clearInterval(typingTimer);
      } else {
        if (wordData.freeze || wordData.powerTime) {
          time -= 0;
          wordData.freezeTime += 1;
        } else {
          time -= 1;
        }

        let timePad = time < 10 ? "0" + time : time; // zero padded
        let timeRemaining = $("#timer > span")[0];
        $("#timer > span")[0].innerHTML = `0:${timePad}`;

        if (timeRemaining.innerHTML.slice(2, 4) <= 10 && growTimer === false) {
          timeRemaining.className = "growTimer";
          setTimeout(function() {
            timeRemaining.className = "shrink";
          }, 500);
          growTimer = true;
        }
      }
    }, 1000);
  } else if (one == "0:00") {
    return false;
  }
  return true;
}

function calculateWPM(data) {
  let comboMaxSpan = document.querySelector(".combo-max-count");
  let comboMaxCount = parseInt(comboMaxSpan.innerText);
  let {
    seconds,
    correct,
    incorrect,
    total,
    typed,
    freezeTime,
    powerPercentActive,
    powerPercentPoints,
    powerPoints
  } = data;
  seconds += freezeTime;
  let min = seconds / 60;
  let wpm = Math.ceil(typed / 5 - incorrect / min);
  let accuracy = Math.ceil((correct / total) * 100);
  let bonus = comboMaxCount * 100;
  let score = wpm * accuracy * 100 + powerPercentPoints + powerPoints + bonus;
  let scoreComma = score.toLocaleString("en");

  if (powerPercentActive) {
    powerPercentPoints = score / 20;
  }

  if (wpm < 0) {
    wpm = 0;
  } // prevent negative wpm from incorrect words

  // template strings are pretty cool
  let results = `<ul id="results">
        <li>WPM: <span class="wpm-value">${wpm}</span></li>
        <li>Accuracy: <span class="wpm-value">${accuracy}%</span></li>
        <li id="results-stats">
        Total Words: <span>${total}</span> |
        Correct Words: <span>${correct}</span> |
        Incorrect Words: <span>${incorrect}</span> |
        Characters Typed: <span>${typed}</span>
        </li>
        </ul>`;

  $("#ccr")[0].innerText = `Score: ${scoreComma}`;
}

var displayWPM = (function(data) {
  var executed = false;
  return function(data) {
    if (!executed) {
      executed = true;

      let comboMaxSpan = document.querySelector(".combo-max-count");
      let comboMaxCount = parseInt(comboMaxSpan.innerText);
      let {
        seconds,
        correct,
        incorrect,
        total,
        typed,
        freezeTime,
        powerPercentPoints,
        powerPoints
      } = data;
      seconds += freezeTime;
      let min = seconds / 60;
      let wpm = Math.ceil(typed / 5 - incorrect / min);
      let accuracy = Math.ceil((correct / total) * 100);
      let bonus = comboMaxCount * 100;
      let score =
        wpm * accuracy * 100 + powerPercentPoints + powerPoints + bonus;
      let scoreComma = score.toLocaleString("en");

      if (wpm < 0) {
        wpm = 0;
      } // prevent negative wpm from incorrect words

      // template strings are pretty cool
      let results = `<ul id="results">
          <li>WPM: <span class="wpm-value">${wpm}</span></li>
          <li>Accuracy: <span class="wpm-value">${accuracy}%</span></li>
          <li id="results-stats">
          Total Words: <span>${total}</span> |
          Correct Words: <span>${correct}</span> |
          Incorrect Words: <span>${incorrect}</span> |
          Characters Typed: <span>${typed}</span>
          </li>
          </ul>`;

      $("#ccr")[0].innerText = `Score: ${scoreComma}`;
      $("#word-section")[0].innerHTML = results;

      // start fetch
      showSubmitName();

      // color code accuracy
      let wpmClass = $("li:nth-child(2) .wpm-value")[0].classList;
      if (accuracy > 80) {
        wpmClass.add("correct-word-c");
      } else {
        wpmClass.add("incorrect-word-c");
      }
    }
  };
})();

function typingTest(e) {
  // Char:        Key Code:
  // <space>      32
  // <enter>      13
  // <backspace>  8
  // <shift>      16
  // [A-Z]        65-90
  // [' "]        222

  // Get key code of current key pressed.
  e = e || window.event;
  let kcode = e.keyCode;
  let word = $("#typebox")[0];

  // check if empty (starts with space)
  if (word.value.match(/^\s/g)) {
    word.value = "";
  } else {
    // Only score when timer is on.
    if (isTimer(wordData.seconds)) {
      checkWord(word); // checks for typing errors while you type
      // <space> submits words
      if (kcode == 32) {
        submitWord(word); // keep track of correct / incorrect words
        clearLine(); // get rid of old words
        $("#typebox")[0].value = ""; // clear typebox after each word
      }
      wordData.typed += 1; // count each valid character typed
    } else {
      // Display typing test results.
      displayWPM(wordData);
    }
  }
}

function restartTest() {
  $("#typebox")[0].value = "";
  location.reload();
}

/////////////////////////////////
///////// Let's fetch ///////////
/////////////////////////////////

var showSubmitName = (function() {
  var executed = false;
  return function() {
    if (!executed) {
      executed = true;

      let typeSection = document.querySelector("#type-section");
      let typeBox = document.querySelector("#typebox");
      let timer = document.querySelector("#timer");
      let comboSpan = document.querySelector(".combo-combo");
      let comboMaxSpan = document.querySelector(".combo-max")
      let powers = document.querySelector(".powers");
      let nameForm = document.createElement("FORM");
      let comboMaxCountSpan = document.querySelector(".combo-max-count");
      let comboMaxCount = parseInt(comboMaxCountSpan.innerText);

      // hide previous input box and timer
      typeBox.style.display = "none";
      timer.style.display = "none";
      comboSpan.style.display = "none";
      comboMaxSpan.style.display = "none";
      powers.style.display = "none";

      nameForm.id = "nameform";

      if(blockstack.isUserSignedIn()) {
        const person = blockstack.loadUserData().username;
        nameForm.innerHTML = `<input id='namebox' name='namebox' type='text' tabindex='1' value=${person} placeholder='Your name'><input id="submit-name" type='submit' value='Submit Score'>`;
      } else {
        nameForm.innerHTML =
        "<input id='namebox' name='namebox' type='text' tabindex='1' value='Guest' placeholder='Your name'><input id='submit-name' type='submit' value='Blockstack Submit Score'>";
      }
      
      typeSection.prepend(nameForm);

      nameForm.addEventListener("submit", e => signedInOrOut(e, comboMaxCount));
    }
  };
})();

function signedInOrOut(e, comboMaxCount) {
  e.preventDefault();

  if (blockstack.isUserSignedIn()) {
    findUser(comboMaxCount);
  } else {
    blockstack.redirectToSignIn();
  }
}

var findUser = (function() {
  var executed = false;
  return function(comboMaxCount) {
    if (!executed) {
      executed = true;

      // GET users and iterate
      // if user exists, post score to user
      // else create user, then post score to user
      fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/users")
        .then(data => data.json())
        .then(users => iterateUsers(users, comboMaxCount));
    }
  };
})();

function iterateUsers(users, comboMaxCount) {
  let nameBox = document.querySelector("#namebox");
  let names = [];
  users.forEach(user => {
    if (nameBox.value === user.name) {
      postScore(user, comboMaxCount);
      names.push(user.name);
    }
  });
  checkNames(users, names, comboMaxCount);
}

function checkNames(users, names, comboMaxCount) {
  let nameBox = document.querySelector("#namebox");
  if (!names.includes(nameBox.value)) {
    postUser(comboMaxCount);
  }
}

function postUser(comboMaxCount) {
  let nameBox = document.querySelector("#namebox");

  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: nameBox.value
    })
  })
    .then(data => data.json())
    .then(user => postScore(user, comboMaxCount));
}

function postScore(user, comboMaxCount) {
  let {
    seconds,
    correct,
    incorrect,
    total,
    typed,
    freezeTime,
    powerPercentPoints,
    powerPoints
  } = wordData;
  seconds += freezeTime;
  let min = seconds / 60;
  let wpm = Math.ceil(typed / 5 - incorrect / min);
  let accuracy = Math.ceil((correct / total) * 100);
  let bonus = comboMaxCount * 100;
  let score = wpm * accuracy * 100 + powerPercentPoints + powerPoints + bonus;
  let total_words = total;
  let correct_words = correct;
  let incorrect_words = incorrect;
  let characters_typed = typed;
  let ccr = document.querySelector("#ccr");
  let userId = user.id;
  ccr.dataset.id = userId;
  // scores = { scores: [] }

  // let options = { encrypt: false }

  // blockstack.getFile("scores.json", options).then(data => {
  //   if (data) {
  //     console.log("got it", data)
  //     scores = JSON.parse(data)
  //   } else {
  //     console.log("empty")
  //     scores = { scores: [] }
  //   }
  // })

  // console.log(score)

  // scores.scores.push(score)
  
  // blockstack.putFile("scores.json", JSON.stringify(scores), options).then(data => console.log(data))

  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      score: score ? score : 0,
      wpm: wpm,
      accuracy: accuracy,
      total_words: total_words,
      correct_words: correct_words,
      incorrect_words: incorrect_words,
      characters_typed: characters_typed
    })
  }).then(getScores);
}

function getScores() {

  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/scores")
    .then(data => data.json())
    .then(scores => sortScores(scores));
}

function sortScores(scores) {
  let scoresArray = [];
  scores.forEach(score => {
    scoresArray.push(({ user, score } = score));
  });

  scoresArray.sort(function(a, b) {
    return b.score - a.score;
  });

  //   let scoresArrayDistinct = [...new Set(scoresArray.map(score => score.user_id))]

  let idObj = {};
  let scoresArrayDistinct = [];

  for (let score of scoresArray) {
    if (!idObj[score.user_id]) {
      idObj[score.user_id] = score;
      scoresArrayDistinct.unshift(score);
    }
  }

  showLeaderBoard();
  showScores(scoresArrayDistinct);
}

function showLeaderBoard() {
  const ccr = document.querySelector("#ccr");
  const typeSection = document.querySelector("#type-section");
  const wordSection = document.querySelector("#word-section");
  const nameForm = document.querySelector("#nameform");

  ccr.innerText = "Leaderboard";
  wordSection.style.display = "none";
  nameForm.style.display = "none";

  let leaderBoard = document.createElement("TABLE");
  leaderBoard.id = "leaderboard";
  typeSection.prepend(leaderBoard);

  getComments();
}

function showScores(scoresArrayDistinct) {
  let leaderBoard = document.querySelector("#leaderboard");
  let i = scoresArrayDistinct.length;
  scoresArrayDistinct.forEach(score => {
    const tr = document.createElement("TR");
    tr.innerHTML = `<td class="count">${i--}.</td>
      <td class="name">${score.user.name}</td>
      <td class="score">${score.score}</td>`;
    leaderBoard.prepend(tr);
  });
}

function getComments() {
  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/comments")
    .then(data => data.json())
    .then(comments => loadComments(comments));
}

function loadComments(comments) {
  const typeSection = document.querySelector("#type-section");

  const commentSection = document.createElement("DIV");
  commentSection.id = "comment-section";
  typeSection.append(commentSection);

  const commentUl = document.createElement("UL");
  commentUl.id = "comment-ul";
  commentSection.append(commentUl);

  comments.forEach(comment => appendComment(comment));

  showSubmitComment();
}

function appendComment(comment) {
  let commentUl = document.querySelector("#comment-ul");

  let commentLi = document.createElement("LI");
  commentLi.className = "comment";
  commentLi.dataset.id = comment.id;
  commentLi.tabindex = "1";
  commentLi.innerHTML = `<strong><span id=${comment.user_id}>${
    comment.user_id
  }</span></strong>: <span class="content">${comment.content}</span>`;
  commentUl.append(commentLi);

  getUsersForNames();
}

function getUsersForNames() {
  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/users")
    .then(data => data.json())
    .then(users => matchIdsWithNames(users));
}

function matchIdsWithNames(users) {
  let idsSpanList = document.querySelectorAll(".comment span");

  idsSpanList.forEach(span => {
    users.forEach(user => {
      if (parseInt(span.innerText) === user.id) {
        span.innerText = user.name;
      }
    });
  });

  updateListSelection();
}

function showSubmitComment() {
  const commentSection = document.querySelector("#comment-section");
  const commentForm = document.createElement("FORM");

  commentForm.id = "commentform";
  commentForm.innerHTML =
    "<input id='commentbox' name='commentbox' type='text' tabindex='1' value='' placeholder='Your comment'><input id='submit-comment' type='submit' value='Enter'>";
  commentSection.append(commentForm);

  commentForm.addEventListener("submit", e => postComment(e));
}

function postComment(e) {
  e.preventDefault();

  let userId = parseInt(document.querySelector("#ccr").dataset.id);
  let content = document.querySelector("#commentbox").value;

  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      content: content
    })
  })
    .then(data => data.json())
    .then(comment => appendCommentWithButtons(comment))
    .then(document.querySelector("#commentform").reset());
}

function appendCommentWithButtons(comment) {
  let commentUl = document.querySelector("#comment-ul");

  let commentLi = document.createElement("LI");
  commentLi.className = "comment";
  commentLi.dataset.id = comment.id;
  commentLi.tabindex = "1";
  commentLi.innerHTML = `<strong><span id=${comment.user_id}>${
    comment.user_id
  }</span></strong>: <span class="content">${comment.content}</span>`;
  commentUl.append(commentLi);

  const deleteButton = document.createElement("BUTTON");
  deleteButton.className = "delete-button";
  deleteButton.innerText = "X";
  commentLi.prepend(deleteButton);

  const editButton = document.createElement("BUTTON");
  editButton.className = "edit-button";
  editButton.innerText = "edit";
  commentLi.append(editButton);

  getUsersForNames();

  deleteButton.addEventListener("click", e => deleteComment(e));
  editButton.addEventListener("click", e => prepareUpdateComment(e));
}

function deleteComment(e) {
  let commentId = e.target.parentNode.dataset.id;

  fetch(
    `https://code-code-revolution-backend.herokuapp.com/api/v1/comments/${commentId}`,
    {
      method: "DELETE"
    }
  )
    .then(e.target.parentNode.remove())
    .then(toggleToPostCommentForm());
}

function prepareUpdateComment(e) {
  const commentSection = document.querySelector("#comment-section");
  let originalContent = e.target.parentNode.querySelector(".content").innerText;
  let editButton = e.target;
  let cancelButton = document.createElement("BUTTON");
  cancelButton.className = "cancel-button";
  cancelButton.innerText = "cancel";
  e.target.parentNode.append(cancelButton);
  editButton.style.display = "none";
  cancelButton.addEventListener("click", e => toggleToEditButton(e));

  let commentForm = document.querySelector("#commentform");
  commentForm.style.display = "none";

  if (document.querySelector("#editcommentform")) {
    toggleToEditCommentForm(e);
  } else {
    let commentId = parseInt(e.target.parentNode.dataset.id);
    let editCommentForm = document.createElement("FORM");
    editCommentForm.dataset.id = commentId;
    editCommentForm.id = "editcommentform";
    editCommentForm.innerHTML = `<input id='editcommentbox' name='editcommentbox' type='text' tabindex='1' value="${originalContent}" placeholder='Edit your comment'><input id='submit-edit-comment' type='submit' value='Update'>`;
    commentSection.append(editCommentForm);
    editCommentForm.addEventListener("submit", e => {
      updateComment(e);
      toggleToEditButton(e);
    });
  }
}

function updateComment(e) {
  e.preventDefault();

  let commentId = parseInt(e.target.dataset.id);
  let content = document.querySelector("#editcommentbox").value;

  fetch(
    `https://code-code-revolution-backend.herokuapp.com/api/v1/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        content: content
      })
    }
  )
    .then(data => data.json())
    .then(comment => {
      changeCommentInDom(comment);
    });
}

function changeCommentInDom(comment) {
  let allCommentLis = document.querySelectorAll(".comment");

  allCommentLis.forEach(li => {
    if (parseInt(li.dataset.id) === comment.id) {
      li.querySelector(".content").innerText = comment.content;
      let allCancelButtons = li.querySelectorAll(".cancel-button");
      allCancelButtons[allCancelButtons.length - 1].style.display = "none";
    }
  });
}

function toggleToEditButton(e) {
  let cancelButton = e.target;
  cancelButton.style.display = "none";

  let editButton = e.target.parentNode.querySelector(".edit-button");
  editButton.style.display = "inline-block";

  toggleToPostCommentForm();
  // commentForm.addEventListener("submit", (e) => postComment(e))
}

function toggleToCancelButton(e) {
  let editButton = e.target.parentNode.querySelector(".edit-button");
  editButton.style.display = "none";

  let cancelButton = e.target;
  cancelButton.style.display = "inline-block";

  toggleToEditCommentForm(e);
}

function toggleToPostCommentForm() {
  const commentForm = document.querySelector("#commentform");
  commentForm.style.display = "block";

  const editCommentForm = document.querySelector("#editcommentform");
  editCommentForm.style.display = "none";
}

function toggleToEditCommentForm(e) {
  const editCommentForm = document.querySelector("#editcommentform");
  editCommentForm.style.display = "block";
  let originalContent = e.target.parentNode.querySelector(".content").innerText;
  editCommentForm.innerHTML = `<input id='editcommentbox' name='editcommentbox' type='text' tabindex='1' value="${originalContent}" placeholder='Edit your comment'><input id='submit-edit-comment' type='submit' value='Update'>`;

  const commentForm = document.querySelector("#commentform");
  commentForm.style.display = "none";
}

function updateListSelection() {
  let allLis = document.querySelectorAll(".comment");
  let lastLi = allLis[allLis.length - 1];
  lastLi.id = "last-li";
  lastLiId = lastLi.id;

  var list = document.getElementById("comment-ul"),
    targetLi = document.getElementById(lastLiId); // id tag of the <li> element

  list.scrollTop = targetLi.offsetTop - 50;
}
