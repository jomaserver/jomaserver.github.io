(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const violet = cssVar('--matrix-violet', '#B800FF');
  const highlight = '#fad6ff';

  /* ---------- 1) canvas de fundo (todas as paginas) ---------- */
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
    ctx.fillStyle = 'rgba(6,2,12,0.16)';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '15px "JetBrains Mono", monospace';
    for (let i = 0; i < cols; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const x = i * 16;
      const y = drops[i] * 16;
      ctx.fillStyle = Math.random() > 0.96 ? highlight : violet;
      ctx.globalAlpha = Math.random() > 0.96 ? 1 : 0.85;
      ctx.fillText(ch, x, y);
      ctx.globalAlpha = 1;
      if (y > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  if (!reduceMotion) {
    (function loop() { draw(); requestAnimationFrame(loop); })();
  } else {
    ctx.fillStyle = '#06020c';
    ctx.fillRect(0, 0, w, h);
  }

  /* ---------- 2) boot sequence (so na home) ---------- */
  const isHome = /(^\/$|\/index\.html$)/.test(window.location.pathname);

  if (isHome && !reduceMotion) {
    const boot = document.createElement('div');
    boot.id = 'boot-overlay';
    boot.innerHTML = '<pre id="boot-text"></pre>';
    document.body.appendChild(boot);
    const pre = boot.querySelector('#boot-text');

    const lines = [
      '$ source ~/.bashrc && ./awaken.sh --user jomaserver',
      '[ return ] Solve et Coagula',
      '> bem-vindo de volta.'
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

  /* ---------- 3) glitch hover em elementos clicaveis ---------- */
  if (!reduceMotion) {
    const glitchChars = '!<>-_\\/[]{}—=+*^?#0123456789';
    const glitchTargets = document.querySelectorAll(
      'nav a, .quarto-listing-grid .list-card a, .category-card, footer a, .category-nav a, h1 a, h2 a, h3 a'
    );

    glitchTargets.forEach((el) => {
      // Para cards, pegamos o texto do primeiro filho relevante ou do proprio elemento
      let target = el;
      let original = el.textContent;

      // Se for um card de categoria, guardamos o estado original de todo o card
      if (el.classList.contains('category-card')) {
        original = el.innerHTML;
      }

      let interval;

      el.addEventListener('mouseenter', () => {
        let iterations = 0;
        clearInterval(interval);

        if (el.classList.contains('category-card')) {
          // Para cards, aplicamos glitch apenas no texto da caption se existir,
          // ou no alt da imagem, ou mantemos o innerHTML e glitchamos textNodes
          const textNodes = [];
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
          let node;
          while (node = walker.nextNode()) {
            if (node.textContent.trim()) textNodes.push({ node: node, original: node.textContent });
          }

          interval = setInterval(() => {
            textNodes.forEach((tn, idx) => {
              const orig = tn.original;
              tn.node.textContent = orig
                .split('')
                .map((letter, index) => {
                  if (index < iterations - (idx * 2)) return orig[index];
                  if (letter === ' ' || letter === '\n') return letter;
                  return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            });
            if (iterations >= 20) clearInterval(interval);
            iterations += 1 / 2;
          }, 28);
        } else {
          interval = setInterval(() => {
            target.textContent = original
              .split('')
              .map((letter, index) => {
                if (index < iterations) return original[index];
                if (letter === ' ' || letter === '\n') return letter;
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
              })
              .join('');
            if (iterations >= original.length) clearInterval(interval);
            iterations += 1 / 2;
          }, 28);
        }
      });

      el.addEventListener('mouseleave', () => {
        clearInterval(interval);
        if (el.classList.contains('category-card')) {
          el.innerHTML = original;
        } else {
          target.textContent = original;
        }
      });
    });
  }

  /* ---------- 4) ano dinamico no rodape ---------- */
  (function updateFooterYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('footer').forEach(ft => {
      let yearSpan = ft.querySelector('.year-dynamic');
      if (!yearSpan) {
        yearSpan = document.createElement('span');
        yearSpan.className = 'year-dynamic';
        // Adiciona ao final do footer com separador
        if (ft.lastChild && ft.lastChild.nodeType === Node.TEXT_NODE && ft.lastChild.textContent.trim()) {
          ft.appendChild(document.createTextNode(' | '));
        } else if (ft.children.length > 0) {
          ft.appendChild(document.createTextNode(' | '));
        }
        ft.appendChild(yearSpan);
      }
      yearSpan.textContent = '© ' + year + ' Jomaserver';
    });
  })();

})();
