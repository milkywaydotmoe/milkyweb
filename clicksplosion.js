var sparks = 75; // How many sparks per clicksplosion
var speed = 20; // How fast - smaller is faster
var bangs = 7; // How many can be launched simultaneously (note that using too many can slow the script down)
var colours = ['#22ff00', '#00ff42', '#00ff61', '#00ff7a', '#00ff8f', '#00ffa2', '#00ffb3'];

var intensity = [];
var Xpos = [];
var Ypos = [];
var dX = [];
var dY = [];
var stars = [];
var decay = [];
var swide = 800;
var shigh = 600;
var sleft = sdown = 0;
var count = 0;
var timers = [];

function addLoadEvent(funky) {
  window.addEventListener('load', funky);
}

addLoadEvent(clicksplode);

function clicksplode() {
  if (document.getElementById) {
    window.addEventListener('scroll', set_scroll);
    window.addEventListener('resize', set_width);
    document.addEventListener('click', eksplode);
    set_width();
    set_scroll();
    for (let i = 0; i < bangs; i++) {
      for (let j = sparks * i; j < sparks + sparks * i; j++) {
        stars[j] = createDiv('*', 13);
        document.body.appendChild(stars[j]);
      }
    }
  }
}

function createDiv(char, size) {
  var div = document.createElement('div');
  var sty = div.style;
  sty.font = size + 'px monospace';
  sty.position = 'absolute';
  sty.backgroundColor = 'transparent';
  sty.visibility = 'hidden';
  sty.zIndex = '101';
  div.textContent = char;
  return div;
}

function bang(N) {
  var A = 0;
  for (let i = sparks * N; i < sparks * (N + 1); i++) {
    if (decay[i]) {
      let Z = stars[i].style;
      Xpos[i] += dX[i];
      Ypos[i] += (dY[i] += 1.25 / intensity[N]);
      if (Xpos[i] >= swide || Xpos[i] < 0 || Ypos[i] >= shigh + sdown || Ypos[i] < 0) decay[i] = 1;
      else {
        Z.left = Xpos[i] + 'px';
        Z.top = Ypos[i] + 'px';
      }
      if (decay[i] === 15) Z.fontSize = '7px';
      else if (decay[i] === 7) Z.fontSize = '2px';
      else if (decay[i] === 1) Z.visibility = 'hidden';
      decay[i]--;
    } else A++;
  }
  if (A !== sparks) timers[N] = requestAnimationFrame(() => bang(N));
}

function eksplode(e) {
  var x = e.pageX;
  var y = e.pageY;
  var N = ++count % bangs;
  var M = Math.floor(Math.random() * 3 * colours.length);
  intensity[N] = 5 + Math.random() * 4;
  for (let i = N * sparks; i < (N + 1) * sparks; i++) {
    Xpos[i] = x;
    Ypos[i] = y - 5;
    dY[i] = (Math.random() - 0.5) * intensity[N];
    dX[i] = (Math.random() - 0.5) * (intensity[N] - Math.abs(dY[i])) * 1.25;
    decay[i] = 16 + Math.floor(Math.random() * 16);
    let Z = stars[i].style;
    if (M < colours.length) Z.color = colours[i % 2 ? count % colours.length : M];
    else if (M < 2 * colours.length) Z.color = colours[count % colours.length];
    else Z.color = colours[i % colours.length];
    Z.fontSize = '13px';
    Z.visibility = 'visible';
  }
  cancelAnimationFrame(timers[N]);
  bang(N);
}

function set_width() {
  var sw_min = Math.min(
    document.documentElement.clientWidth || Infinity,
    self.innerWidth || Infinity,
    document.body.clientWidth || Infinity
  );
  var sh_min = Math.min(
    document.documentElement.clientHeight || Infinity,
    self.innerHeight || Infinity,
    document.body.clientHeight || Infinity
  );
  swide = sw_min === Infinity ? 800 : sw_min - 7;
  shigh = sh_min === Infinity ? 600 : sh_min - 7;
}

function set_scroll() {
  sdown = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  sleft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}
