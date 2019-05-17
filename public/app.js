document.addEventListener("DOMContentLoaded", function(event) {
  // HOMEPAGE
  if (!blockstack.isUserSignedIn()) {
  window.onload = init;

  function init() {
    var root = new THREERoot({
      createCameraControls: !true,
      antialias: true,
      fov: 90
    });
    root.renderer.setClearColor(0x000000);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    root.camera.position.set(0, 0, 250);

    var textAnimation = createTextAnimation();
    root.scene.add(textAnimation);

    var light = new THREE.DirectionalLight();
    light.position.set(0, 0, 1);
    root.scene.add(light);

    var tl = new TimelineMax({
      repeat: -1,
      repeatDelay: 0.25,
      yoyo: true
    });
    tl.fromTo(
      textAnimation,
      8,
      { animationProgress: 0.0 },
      { animationProgress: 0.9, ease: Power1.easeInOut },
      0
    );
    // tl.to(root.camera.position, 8, {z:-350, ease:Power1.easeInOut}, 0);

    createTweenScrubber(tl);
  }

  function createTextAnimation() {
    var geometry = generateTextGeometry("CODE CODE REVOLUTION", {
      size: 14,
      height: 4,
      font: "droid sans",
      weight: "bold",
      style: "normal",
      curveSegments: 24,
      bevelSize: 1,
      bevelThickness: 1,
      bevelEnabled: true,
      anchor: { x: 0.5, y: 0.5, z: 0.5 }
    });

    THREE.BAS.Utils.separateFaces(geometry);

    return new TextAnimation(geometry);
  }

  function generateTextGeometry(text, params) {
    var geometry = new THREE.TextGeometry(text, params);

    geometry.computeBoundingBox();

    geometry.userData = {};
    geometry.userData.size = {
      width: geometry.boundingBox.max.x - geometry.boundingBox.min.x,
      height: geometry.boundingBox.max.y - geometry.boundingBox.min.y,
      depth: geometry.boundingBox.max.z - geometry.boundingBox.min.z
    };

    var anchorX = geometry.userData.size.width * -params.anchor.x;
    var anchorY = geometry.userData.size.height * -params.anchor.y;
    var anchorZ = geometry.userData.size.depth * -params.anchor.z;
    var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

    geometry.applyMatrix(matrix);

    return geometry;
  }

  ////////////////////
  // CLASSES
  ////////////////////

  function TextAnimation(textGeometry) {
    var bufferGeometry = new THREE.BAS.ModelBufferGeometry(textGeometry);

    var aAnimation = bufferGeometry.createAttribute("aAnimation", 2);
    var aCentroid = bufferGeometry.createAttribute("aCentroid", 3);
    var aControl0 = bufferGeometry.createAttribute("aControl0", 3);
    var aControl1 = bufferGeometry.createAttribute("aControl1", 3);
    var aEndPosition = bufferGeometry.createAttribute("aEndPosition", 3);
    var aAxisAngle = bufferGeometry.createAttribute("aAxisAngle", 4);

    var faceCount = bufferGeometry.faceCount;
    var i, i2, i3, i4, v;
    var keys = ["a", "b", "c"];
    var vDelay = new THREE.Vector3();

    var maxDelay = 0.0;
    var minDuration = 1.0;
    var maxDuration = 1.0;
    var stretch = 0.02;
    var lengthFactor = 0.02;
    var maxLength = textGeometry.boundingBox.max.length();

    this.animationDuration =
      maxDuration + maxDelay + stretch + lengthFactor * maxLength;
    this._animationProgress = 0;

    var distanceZ = -150;

    var axis = new THREE.Vector3();
    var angle;

    for (
      i = 0, i2 = 0, i3 = 0, i4 = 0;
      i < faceCount;
      i++, i2 += 6, i3 += 9, i4 += 12
    ) {
      var face = textGeometry.faces[i];
      var centroid = THREE.BAS.Utils.computeCentroid(textGeometry, face);

      // animation
      var delay = centroid.length() * lengthFactor + Math.random() * maxDelay;
      var duration = THREE.Math.randFloat(minDuration, maxDuration);

      for (v = 0; v < 6; v += 2) {
        var vertex = textGeometry.vertices[face[keys[v * 0.5]]];
        var vertexDelay = vDelay.subVectors(centroid, vertex).length() * 0.005;

        aAnimation.array[i2 + v] =
          delay + vertexDelay + stretch * Math.random();
        aAnimation.array[i2 + v + 1] = duration;
      }

      // centroid
      for (v = 0; v < 9; v += 3) {
        aCentroid.array[i3 + v] = centroid.x;
        aCentroid.array[i3 + v + 1] = centroid.y;
        aCentroid.array[i3 + v + 2] = centroid.z;
      }

      // ctrl
      var c0x = centroid.x * THREE.Math.randFloat(0.0, 1.0);
      var c0y = centroid.y * THREE.Math.randFloat(0.0, 1.0);
      var c0z = distanceZ * THREE.Math.randFloat(0.5, 0.75);

      var c1x = centroid.x * THREE.Math.randFloat(0.0, 1.0);
      var c1y = centroid.y * THREE.Math.randFloat(0.0, 1.0);
      var c1z = distanceZ * THREE.Math.randFloat(0.75, 1.0);

      for (v = 0; v < 9; v += 3) {
        aControl0.array[i3 + v] = c0x;
        aControl0.array[i3 + v + 1] = c0y;
        aControl0.array[i3 + v + 2] = c0z;

        aControl1.array[i3 + v] = c1x;
        aControl1.array[i3 + v + 1] = c1y;
        aControl1.array[i3 + v + 2] = c1z;
      }

      // end position
      var x, y, z;

      x = 0;
      y = 0;
      z = distanceZ * THREE.Math.randFloat(0.0, 1.0);

      for (v = 0; v < 9; v += 3) {
        aEndPosition.array[i3 + v] = x;
        aEndPosition.array[i3 + v + 1] = y;
        aEndPosition.array[i3 + v + 2] = z;
      }

      // axis angle
      // axis.x = THREE.Math.randFloatSpread(0.25);
      // axis.y = THREE.Math.randFloatSpread(0.25);
      // axis.z = 1.0;
      axis.x = -centroid.x * 0.05;
      axis.y = centroid.y * 0.05;
      axis.z = 1;

      axis.normalize();

      angle = Math.PI * THREE.Math.randFloat(2, 4);
      // angle = Math.PI * 4;

      for (v = 0; v < 12; v += 4) {
        aAxisAngle.array[i4 + v] = axis.x;
        aAxisAngle.array[i4 + v + 1] = axis.y;
        aAxisAngle.array[i4 + v + 2] = axis.z;
        aAxisAngle.array[i4 + v + 3] = angle;
      }
    }

    var material = new THREE.BAS.PhongAnimationMaterial(
      {
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uTime: { type: "f", value: 0 }
        },
        shaderFunctions: [
          THREE.BAS.ShaderChunk["cubic_bezier"],
          THREE.BAS.ShaderChunk["ease_out_cubic"],
          THREE.BAS.ShaderChunk["quaternion_rotation"]
        ],
        shaderParameters: [
          "uniform float uTime;",
          "uniform vec3 uAxis;",
          "uniform float uAngle;",
          "attribute vec2 aAnimation;",
          "attribute vec3 aCentroid;",
          "attribute vec3 aControl0;",
          "attribute vec3 aControl1;",
          "attribute vec3 aEndPosition;",
          "attribute vec4 aAxisAngle;"
        ],
        shaderVertexInit: [
          "float tDelay = aAnimation.x;",
          "float tDuration = aAnimation.y;",
          "float tTime = clamp(uTime - tDelay, 0.0, tDuration);",
          "float tProgress =  ease(tTime, 0.0, 1.0, tDuration);"
          //'float tProgress = tTime / tDuration;'
        ],
        shaderTransformPosition: [
          // 'transformed -= aCentroid;',
          "transformed *= 1.0 - tProgress;",
          // 'transformed += aCentroid;',

          "transformed += cubicBezier(transformed, aControl0, aControl1, aEndPosition, tProgress);",
          // 'transformed += aEndPosition * tProgress;'

          "float angle = aAxisAngle.w * tProgress;",
          "vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);",
          "transformed = rotateVector(tQuat, transformed);"
        ]
      },
      {
        diffuse: 0xffffff
      }
    );

    THREE.Mesh.call(this, bufferGeometry, material);

    this.frustumCulled = false;
  }
  TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
  TextAnimation.prototype.constructor = TextAnimation;

  Object.defineProperty(TextAnimation.prototype, "animationProgress", {
    get: function() {
      return this._animationProgress;
    },
    set: function(v) {
      this._animationProgress = v;
      this.material.uniforms["uTime"].value = this.animationDuration * v;
    }
  });

  function THREERoot(params) {
    params = utils.extend(
      {
        fov: 60,
        zNear: 1,
        zFar: 10000,

        createCameraControls: true
      },
      params
    );

    this.renderer = new THREE.WebGLRenderer({
      antialias: params.antialias
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    document
      .getElementById("three-container")
      .appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      params.fov,
      window.innerWidth / window.innerHeight,
      params.zNear,
      params.zfar
    );

    this.scene = new THREE.Scene();

    if (params.createCameraControls) {
      this.controls = new THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
    }

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);

    this.resize();
    this.tick();

    window.addEventListener("resize", this.resize, false);
  }
  THREERoot.prototype = {
    tick: function() {
      this.update();
      this.render();
      requestAnimationFrame(this.tick);
    },
    update: function() {
      this.controls && this.controls.update();
    },
    render: function() {
      this.renderer.render(this.scene, this.camera);
    },
    resize: function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };

  ////////////////////
  // UTILS
  ////////////////////

  var utils = {
    extend: function(dst, src) {
      for (var key in src) {
        dst[key] = src[key];
      }

      return dst;
    },
    randSign: function() {
      return Math.random() > 0.5 ? 1 : -1;
    }
  };

  function createTweenScrubber(tween, seekSpeed) {
    seekSpeed = seekSpeed || 0.001;

    function stop() {
      TweenMax.to(tween, 2, { timeScale: 0 });
    }

    function resume() {
      TweenMax.to(tween, 2, { timeScale: 1 });
    }

    function seek(dx) {
      var progress = tween.progress();
      var p = THREE.Math.clamp(progress + dx * seekSpeed, 0, 1);

      tween.progress(p);
    }

    var _cx = 0;

    // desktop
    var mouseDown = false;
    document.body.style.cursor = "pointer";

    window.addEventListener("mousedown", function(e) {
      mouseDown = true;
      document.body.style.cursor = "ew-resize";
      _cx = e.clientX;
      stop();
    });
    window.addEventListener("mouseup", function(e) {
      mouseDown = false;
      document.body.style.cursor = "pointer";
      resume();
    });
    window.addEventListener("mousemove", function(e) {
      if (mouseDown === true) {
        var cx = e.clientX;
        var dx = cx - _cx;
        _cx = cx;

        seek(dx);
      }
    });
    // mobile
    window.addEventListener("touchstart", function(e) {
      _cx = e.touches[0].clientX;
      stop();
      e.preventDefault();
    });
    window.addEventListener("touchend", function(e) {
      resume();
      e.preventDefault();
    });
    window.addEventListener("touchmove", function(e) {
      var cx = e.touches[0].clientX;
      var dx = cx - _cx;
      _cx = cx;

      seek(dx);
      e.preventDefault();
    });
  }
}

  document
    .getElementById("signup-button")
    .addEventListener("click", function(event) {
      event.preventDefault();
      blockstack.redirectToSignIn();
    });
  document
    .getElementById("signout-button")
    .addEventListener("click", function(event) {
      event.preventDefault();
      blockstack.signUserOut(window.location.href);
    });

  getUsersInterval();

  function getUsersInterval() {
    let users = [];
    const interval = setInterval(() => {
      users.length < 1
        ? fetch(
            "https://code-code-revolution-backend.herokuapp.com/api/v1/users"
          )
            .then(res => res.json())
            .then(data => (users = data))
        : clearInterval(interval);
    }, 2000);

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
    document.getElementById("section-1").style.display = "none";
    document.getElementById("section-2").style.display = "block";
  }

  if (blockstack.isUserSignedIn()) {
    var profile = blockstack.loadUserData().profile;
    showProfile(profile);
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function(userData) {
      window.location = window.location.origin;
    });
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
  "export default",
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

//////////////////////////////////////////

// /////////////////////////////////////////
//
// // Sorted list of the 500 most common English words.
// let wordList = ["the", "name", "of", "very", "to", "through", "and", "just", "a", "form", "in", "much", "is", "great", "it", "think", "you", "say", "that", "help", "he", "low", "was", "line", "for", "before", "on", "turn", "are", "cause", "with", "same", "as", "mean", "I", "differ", "his", "move", "they", "right", "be", "boy", "at", "old", "one", "too", "have", "does", "this", "tell", "from", "sentence", "or", "set", "had", "three", "by", "want", "hot", "air", "but", "well", "some", "also", "what", "play", "there", "small", "we", "end", "can", "put", "out", "home", "other", "read", "were", "hand", "all", "port", "your", "large", "when", "spell", "up", "add", "use", "even", "word", "land", "how", "here", "said", "must", "an", "big", "each", "high", "she", "such", "which", "follow", "do", "act", "their", "why", "time", "ask", "if", "men", "will", "change", "way", "went", "about", "light", "many", "kind", "then", "off", "them", "need", "would", "house", "write", "picture", "like", "try", "so", "us", "these", "again", "her", "animal", "long", "point", "make", "mother", "thing", "world", "see", "near", "him", "build", "two", "self", "has", "earth", "look", "father", "more", "head", "day", "stand", "could", "own", "go", "page", "come", "should", "did", "country", "my", "found", "sound", "answer", "no", "school", "most", "grow", "number", "study", "who", "still", "over", "learn", "know", "plant", "water", "cover", "than", "food", "call", "sun", "first", "four", "people", "thought", "may", "let", "down", "keep", "side", "eye", "been", "never", "now", "last", "find", "door", "any", "between", "new", "city", "work", "tree", "part", "cross", "take", "since", "get", "hard", "place", "start", "made", "might", "live", "story", "where", "saw", "after", "far", "back", "sea", "little", "draw", "only", "left", "round", "late", "man", "run", "year", "don't", "came", "while", "show", "press", "every", "close", "good", "night", "me", "real", "give", "life", "our", "few", "under", "stop", "open", "ten", "seem", "simple", "together", "several", "next", "vowel", "white", "toward", "children", "war", "begin", "lay", "got", "against", "walk", "pattern", "example", "slow", "ease", "center", "paper", "love", "often", "person", "always", "money", "music", "serve", "those", "appear", "both", "road", "mark", "map", "book", "science", "letter", "rule", "until", "govern", "mile", "pull", "river", "cold", "car", "notice", "feet", "voice", "care", "fall", "second", "power", "group", "town", "carry", "fine", "took", "certain", "rain", "fly", "eat", "unit", "room", "lead", "friend", "cry", "began", "dark", "idea", "machine", "fish", "note", "mountain", "wait", "north", "plan", "once", "figure", "base", "star", "hear", "box", "horse", "noun", "cut", "field", "sure", "rest", "watch", "correct", "color", "able", "face", "pound", "wood", "done", "main", "beauty", "enough", "drive", "plain", "stood", "girl", "contain", "usual", "front", "young", "teach", "ready", "week", "above", "final", "ever", "gave", "red", "green", "list", "oh", "though", "quick", "feel", "develop", "talk", "sleep", "bird", "warm", "soon", "free", "body", "minute", "dog", "strong", "family", "special", "direct", "mind", "pose", "behind", "leave", "clear", "song", "tail", "measure", "produce", "state", "fact", "product", "street", "black", "inch", "short", "lot", "numeral", "nothing", "class", "course", "wind", "stay", "question", "wheel", "happen", "full", "complete", "force", "ship", "blue", "area", "object", "half", "decide", "rock", "surface", "order", "deep", "fire", "moon", "south", "island", "problem", "foot", "piece", "yet", "told", "busy", "knew", "test", "pass", "record", "farm", "boat", "top", "common", "whole", "gold", "king", "possible", "size", "plane", "heard", "age", "best", "dry", "hour", "wonder", "better", "laugh", "true", "thousand", "during", "ago", "hundred", "ran", "am", "check", "remember", "game", "step", "shape", "early", "yes", "hold", "hot", "west", "miss", "ground", "brought", "interest", "heat", "reach", "snow", "fast", "bed", "five", "bring", "sing", "sit", "listen", "perhaps", "six", "fill", "table", "east", "travel", "weight", "less", "language", "morning", "among"];
//
// //////////////////////////////////////////

// Knuth-Fisher-Yates Shuffle
// http://bost.ocks.org/mike/shuffle/
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
  comboH2.className = "combo-combo grow";

  setTimeout(function() {
    comboH2.className = "combo-combo";
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
  } else {
    current.classList.remove("current-word", "incorrect-word-bg");
    current.classList.add("incorrect-word-c");
    wordData.incorrect += 1;
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
  let bonus = comboMaxCount * 10;
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
      let bonus = comboMaxCount * 10;
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
      let powers = document.querySelector(".powers");
      let nameForm = document.createElement("FORM");

      // hide previous input box and timer
      typeBox.style.display = "none";
      timer.style.display = "none";
      comboSpan.style.display = "none";
      powers.style.display = "none";

      // show input name form with submit
      const person = blockstack.loadUserData().username;
      nameForm.id = "nameform";
      nameForm.innerHTML = `<input id='namebox' name='namebox' type='text' tabindex='1' value=${person} placeholder='Your name'><input id='submit-name' type='submit' value='Submit Score'>`;
      typeSection.prepend(nameForm);

      nameForm.addEventListener("submit", e => preventFormReload(e));
    }
  };
})();

function preventFormReload(e) {
  e.preventDefault();
  findUser();
}

var findUser = (function() {
  var executed = false;
  return function() {
    if (!executed) {
      executed = true;

      // GET users and iterate
      // if user exists, post score to user
      // else create user, then post score to user
      fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/users")
        .then(data => data.json())
        .then(users => iterateUsers(users));
    }
  };
})();

function iterateUsers(users) {
  let nameBox = document.querySelector("#namebox");
  let names = [];
  users.forEach(user => {
    if (nameBox.value === user.name) {
      postScore(user);
      names.push(user.name);
    }
  });
  checkNames(users, names);
}

function checkNames(users, names) {
  let nameBox = document.querySelector("#namebox");
  if (!names.includes(nameBox.value)) {
    postUser();
  }
}

function postUser() {
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
    .then(user => postScore(user));
}

function postScore(user) {
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
  } = wordData;
  seconds += freezeTime;
  let min = seconds / 60;
  let wpm = Math.ceil(typed / 5 - incorrect / min);
  let accuracy = Math.ceil((correct / total) * 100);
  let bonus = comboMaxCount * 10;
  let score = wpm * accuracy * 100 + powerPercentPoints + powerPoints + bonus;
  let total_words = total;
  let correct_words = correct;
  let incorrect_words = incorrect;
  let characters_typed = typed;
  let ccr = document.querySelector("#ccr");
  let userId = user.id;
  ccr.dataset.id = userId;

  fetch("https://code-code-revolution-backend.herokuapp.com/api/v1/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      user_id: userId,
      score: score,
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
  const comboMaxSpan = document.querySelector(".combo-max");

  ccr.innerText = "Leaderboard";
  wordSection.style.display = "none";
  nameForm.style.display = "none";
  comboMaxSpan.style.display = "none";

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

// lightning thunder

// let canvas, ctx, w, h, thunder, text, particles, input;

// function Thunder(options) {
//   options = options || {};
//   this.lifespan = options.lifespan || Math.round(Math.random() * 10 + 10);
//   this.maxlife = this.lifespan;
//   this.color = options.color || "rgba(25, 181, 254, 1)";
//   this.glow = options.glow || "#2323fe";
//   this.x = options.x || Math.random() * w;
//   this.y = options.y || Math.random() * h;
//   this.width = options.width || 2;
//   this.direct = options.direct || Math.random() * Math.PI * 2;
//   this.max = options.max || Math.round(Math.random() * 10 + 20);
//   this.segments = [...new Array(this.max)].map(() => {
//     return {
//       direct: this.direct + (Math.PI * Math.random() * 0.2 - 0.1),
//       length: Math.random() * 20 + 80,
//       change: Math.random() * 0.04 - 0.02
//     };
//   });

//   this.update = function(index, array) {
//     this.segments.forEach(s => {
//       (s.direct += s.change) && Math.random() > 0.96 && (s.change *= -1);
//     });
//     (this.lifespan > 0 && this.lifespan--) || this.remove(index, array);
//   };

//   this.render = function(ctx) {
//     if (this.lifespan <= 0) return;
//     ctx.beginPath();
//     ctx.globalAlpha = this.lifespan / this.maxlife;
//     ctx.strokeStyle = this.color;
//     ctx.lineWidth = this.width;
//     ctx.shadowBlur = 32;
//     ctx.shadowColor = this.glow;
//     ctx.moveTo(this.x, this.y);
//     let prev = { x: this.x, y: this.y };
//     this.segments.forEach(s => {
//       const x = prev.x + Math.cos(s.direct) * s.length;
//       const y = prev.y + Math.sin(s.direct) * s.length;
//       prev = { x: x, y: y };
//       ctx.lineTo(x, y);
//     });
//     ctx.stroke();
//     ctx.closePath();
//     ctx.shadowBlur = 0;
//     const strength = Math.random() * 80 + 40;
//     const light = ctx.createRadialGradient(
//       this.x,
//       this.y,
//       0,
//       this.x,
//       this.y,
//       strength
//     );
//     light.addColorStop(0, "rgba(75, 119, 190, 0)");
//     light.addColorStop(0.1, "rgba(65, 131, 215, .02)");
//     light.addColorStop(0.4, "rgba(52, 152, 219, .12)");
//     light.addColorStop(0.65, "rgba(34, 167, 240, 0.4)");
//     light.addColorStop(0.8, "rgba(25, 181, 254, 1)");
//     ctx.beginPath();
//     ctx.fillStyle = light;
//     ctx.arc(this.x, this.y, strength, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.closePath();
//   };

//   this.remove = function(index, array) {
//     array.splice(index, 1);
//   };
// }

// function Spark(options) {
//   options = options || {};
//   this.x = options.x || w * 0.5;
//   this.y = options.y || h * 0.5;
//   this.v = options.v || {
//     direct: Math.random() * Math.PI * 2,
//     weight: Math.random() * 14 + 2,
//     friction: 0.88
//   };
//   this.a = options.a || {
//     change: Math.random() * 0.4 - 0.2,
//     min: this.v.direct - Math.PI * 0.4,
//     max: this.v.direct + Math.PI * 0.4
//   };
//   this.g = options.g || {
//     direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2),
//     weight: Math.random() * 0.25 + 0.25
//   };
//   this.width = options.width || Math.random() * 3;
//   this.lifespan = options.lifespan || Math.round(Math.random() * 20 + 40);
//   this.maxlife = this.lifespan;
//   this.color = options.color || "#feca32";
//   this.prev = { x: this.x, y: this.y };

//   this.update = function(index, array) {
//     this.prev = { x: this.x, y: this.y };
//     this.x += Math.cos(this.v.direct) * this.v.weight;
//     this.x += Math.cos(this.g.direct) * this.g.weight;
//     this.y += Math.sin(this.v.direct) * this.v.weight;
//     this.y += Math.sin(this.g.direct) * this.g.weight;
//     this.v.weight > 0.2 && (this.v.weight *= this.v.friction);
//     this.v.direct += this.a.change;
//     (this.v.direct > this.a.max || this.v.direct < this.a.min) &&
//       (this.a.change *= -1);
//     this.lifespan > 0 && this.lifespan--;
//     this.lifespan <= 0 && this.remove(index, array);
//   };

//   this.render = function(ctx) {
//     if (this.lifespan <= 0) return;
//     ctx.beginPath();
//     ctx.globalAlpha = this.lifespan / this.maxlife;
//     ctx.strokeStyle = this.color;
//     ctx.lineWidth = this.width;
//     ctx.moveTo(this.x, this.y);
//     ctx.lineTo(this.prev.x, this.prev.y);
//     ctx.stroke();
//     ctx.closePath();
//   };

//   this.remove = function(index, array) {
//     array.splice(index, 1);
//   };
// }

// function Particles(options) {
//   options = options || {};
//   this.max = options.max || Math.round(Math.random() * 10 + 10);
//   this.sparks = [...new Array(this.max)].map(() => new Spark(options));

//   this.update = function() {
//     this.sparks.forEach((s, i) => s.update(i, this.sparks));
//   };

//   this.render = function(ctx) {
//     this.sparks.forEach(s => s.render(ctx));
//   };
// }

// function Text(options) {
//   options = options || {};
//   const pool = document.createElement("canvas");
//   const buffer = pool.getContext("2d");
//   pool.width = w;
//   buffer.fillStyle = "#000000";
//   buffer.fillRect(0, 0, pool.width, pool.height);

//   this.size = options.size || 100;
//   this.copy = (options.copy || `Hello!`) + " ";
//   this.color = options.color || "rgba(25, 181, 254, 1)";
//   this.delay = options.delay || 5;
//   this.basedelay = this.delay;
//   buffer.font = `${this.size}px Comic Sans MS`;
//   this.bound = buffer.measureText(this.copy);
//   this.bound.height = this.size * 1.5;
//   this.x = options.x || w * 0.5 - this.bound.width * 0.5;
//   this.y = options.y || h * 0.5 - this.size * 0.5;

//   buffer.strokeStyle = this.color;
//   buffer.strokeText(this.copy, 0, this.bound.height * 0.8);
//   this.data = buffer.getImageData(0, 0, this.bound.width, this.bound.height);
//   this.index = 0;

//   this.update = function() {
//     if (this.index >= this.bound.width) {
//       this.index = 0;
//       return;
//     }
//     const data = this.data.data;
//     for (let i = this.index * 4; i < data.length; i += 4 * this.data.width) {
//       const bitmap = data[i] + data[i + 1] + data[i + 2] + data[i + 3];
//       if (bitmap > 255 && Math.random() > 0.96) {
//         const x = this.x + this.index;
//         const y = this.y + i / this.bound.width / 4;
//         thunder.push(
//           new Thunder({
//             x: x,
//             y: y
//           })
//         );
//         Math.random() > 0.5 &&
//           particles.push(
//             new Particles({
//               x: x,
//               y: y
//             })
//           );
//       }
//     }
//     if (this.delay-- < 0) {
//       this.index++;
//       this.delay += this.basedelay;
//     }
//   };

//   this.render = function(ctx) {
//     ctx.putImageData(
//       this.data,
//       this.x,
//       this.y,
//       0,
//       0,
//       this.index,
//       this.bound.height
//     );
//   };
// }

// function loop() {
//   update();
//   render();
//   requestAnimationFrame(loop);
// }

// function update() {
//   text.update();
//   thunder.forEach((l, i) => l.update(i, thunder));
//   particles.forEach(p => p.update());
// }

// function render() {
//   ctx.globalCompositeOperation = "source-over";
//   ctx.globalAlpha = 1;
//   ctx.fillStyle = "#000000";
//   ctx.fillRect(0, 0, w, h);
//   //
//   ctx.globalCompositeOperation = "screen";
//   text.render(ctx);
//   thunder.forEach(l => l.render(ctx));
//   particles.forEach(p => p.render(ctx));
// }

// (function() {
//   //
//   canvas = document.getElementById("canvas");
//   input = document.getElementById("input");
//   ctx = canvas.getContext("2d");
//   w = window.innerWidth;
//   h = window.innerHeight;
//   canvas.width = w;
//   canvas.height = h;
//   thunder = [];
//   particles = [];
//   //
//   text = new Text({
//     copy: "Code Code Revolution"
//   });
//   document.addEventListener("mousemove", e => {
//     const x = e.clientX;
//     const y = e.clientY;
//     thunder.push(
//       new Thunder({
//         x: x,
//         y: y
//       })
//     );
//     particles.push(
//       new Particles({
//         x: x,
//         y: y
//       })
//     );
//   });
//   let cb = 0;
//   input.addEventListener("keyup", e => {
//     clearTimeout(cb);
//     cb = setTimeout(() => {
//       text = new Text({
//         copy: input.value
//       });
//     }, 300);
//   });
//   //
//   loop();
// })();
