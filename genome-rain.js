
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const green = cssVar('--matrix-green', '#3ddc84');
  const highlight = '#eafff2';

  /* ---------- 1) canvas de fundo (todas as páginas) ---------- */
  const canvas = document.createElement('canvas');
  canvas.id = 'genome-rain';
  document.body.prepend(canvas);

  const scan = document.createElement('div');
  scan.id = 'genome-scan';
  document.body.prepend(scan);

  const ctx = canvas.getContext('2d');
  let w, h, cols, drops;
  const chars = 'ACGT';

  function setup() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const fontSize = 16;
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(0).map(() => Math.random() * -50);
  }
  setup();
  window.addEventListener('resize', setup);

  function draw() {
    ctx.fillStyle = 'rgba(6,10,9,0.18)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '15px "JetBrains Mono", monospace';
    for (let i = 0; i < cols; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 16;
      const y = drops[i] * 16;
      ctx.fillStyle = Math.random() > 0.96 ? highlight : green;
      ctx.globalAlpha = Math.random() > 0.96 ? 1 : 0.55;
      ctx.fillText(ch, x, y);
      ctx.globalAlpha = 1;
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  if (!reduceMotion) {
    (function loop() { draw(); requestAnimationFrame(loop); })();
  } else {
    ctx.fillStyle = '#060a09';
    ctx.fillRect(0, 0, w, h);
  }

  /* ---------- 2) boot sequence (só na home) ---------- */
  const isHome = /(^\/$|\/index\.html$)/.test(window.location.pathname);

  if (isHome && !reduceMotion) {
    const boot = document.createElement('div');
    boot.id = 'boot-overlay';
    boot.innerHTML = '<pre id="boot-text"></pre>';
    document.body.appendChild(boot);
    const pre = boot.querySelector('#boot-text');

  const lines = [
      '$ source ~/.bashrc && ./awaken.sh --user jomaserver',
      '[ INFO ] Somos o próprio universo tentando compreender a si mesmo.',
      '[INFO] Somos um arranjo único de uma memória que é coletiva.',
      '[ OK ] Conformações estruturais adaptadas.',
      '[ OK ] Avaliando completude dos dados',
      '[Jomaserver] Compilação autorizada.',
      '> bem-vindo de volta, Jomas.'
    ];
    let li = 0, ci = 0;
    function typeStep() {
      if (li >= lines.length) {
        setTimeout(() => {
          boot.style.opacity = '0';
          setTimeout(() => boot.remove(), 550);
        }, 350);
        return;
      }
      const line = lines[li];
      if (ci <= line.length) {
        pre.textContent = lines.slice(0, li).join('\n') + (li > 0 ? '\n' : '') + line.slice(0, ci) + '▌';
        ci++;
        setTimeout(typeStep, 14);
      } else {
        li++; ci = 0;
        setTimeout(typeStep, 90);
      }
    }
    typeStep();
  }

  /* ---------- 3) glitch hover nos links do <nav> ---------- */
  if (!reduceMotion) {
    const glitchChars = '!<>-_\\/[]{}—=+*^?#0123456789';
    document.querySelectorAll('nav a').forEach((a) => {
      const original = a.textContent;
      let interval;
      a.addEventListener('mouseenter', () => {
        let iterations = 0;
        clearInterval(interval);
        interval = setInterval(() => {
          a.textContent = original
            .split('')
            .map((letter, index) => {
              if (index < iterations) return original[index];
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');
          if (iterations >= original.length) clearInterval(interval);
          iterations += 1 / 2;
        }, 28);
      });
      a.addEventListener('mouseleave', () => {
        clearInterval(interval);
        a.textContent = original;
      });
    });
  }
})();
