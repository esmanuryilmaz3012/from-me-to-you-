let currentTheme = 'romantic';
  let envColor = '#fde8cc';
  let flapColor = '#f5c9a0';
  let chosenStamp = '🌹';
  let currentPattern = 'none';
  let customFont = '';
  let isReading = false;

  const themeConfig = {
    romantic: { wax: '#c07850', waxEmoji: '🌹', font: "'Playfair Display', serif", paperBg: '#fffef9', accentLine: '#f0c8c0' },
    modern: { wax: '#2c6ea0', waxEmoji: '✉️', font: "'Quicksand', sans-serif", paperBg: '#f8fbff', accentLine: '#c0d8f0' },
    whimsical: { wax: '#8b45b5', waxEmoji: '🦋', font: "'Pacifico', cursive", paperBg: '#fdf8ff', accentLine: '#e0b8f8' },
    poetic: { wax: '#3a3060', waxEmoji: '🌙', font: "'Space Mono', monospace", paperBg: '#1a1a2e', accentLine: '#3a3060' }
  };

  function setFont(font, btn) {
    document.querySelectorAll('.font-opt').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    customFont = font;
    document.querySelector('.letter-textarea').style.fontFamily = font || themeConfig[currentTheme].font;
  }

  function setTheme(theme, btn) {
    document.querySelectorAll('.theme-pill').forEach(p => p.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.body.className = 'theme-' + theme;
    currentTheme = theme;
    const cfg = themeConfig[theme];
    document.querySelector('.letter-textarea').style.fontFamily = customFont || cfg.font;
    document.querySelector('.letter-paper').style.background = cfg.paperBg;
    document.querySelector('.letter-paper').style.setProperty('--accent', cfg.accentLine);
  }

  function setEnvColor(el) {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    envColor = el.dataset.color;
    flapColor = el.dataset.flap;
    document.getElementById('envBody').style.background = envColor;
    renderPattern(currentPattern);
  }

  function setPattern(type, btn) {
    document.querySelectorAll('.pattern-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    currentPattern = type;
    renderPattern(type);
  }

  function renderPattern(type) {
    const svg = document.getElementById('envPattern');
    let content = '';
    const cols = ['rgba(0,0,0,0.12)', 'rgba(0,0,0,0.08)'];

    if (type === 'dots') {
      for (let x = 20; x < 340; x += 24) {
        for (let y = 20; y < 220; y += 24) {
          content += `<circle cx="${x}" cy="${y}" r="2.5" fill="${cols[0]}"/>`;
        }
      }
    } else if (type === 'lines') {
      for (let x = 0; x < 500; x += 18) {
        content += `<line x1="${x}" y1="0" x2="${x-60}" y2="220" stroke="${cols[0]}" stroke-width="1.5"/>`;
      }
    } else if (type === 'stars') {
      const starPts = (cx, cy, r, n) => {
        let d = '';
        for (let i = 0; i < n * 2; i++) {
          const angle = (i * Math.PI) / n - Math.PI / 2;
          const rad = i % 2 === 0 ? r : r * 0.4;
          const x = cx + rad * Math.cos(angle);
          const y = cy + rad * Math.sin(angle);
          d += (i === 0 ? 'M' : 'L') + x + ',' + y;
        }
        return d + 'Z';
      };
      for (let x = 30; x < 340; x += 50) {
        for (let y = 30; y < 220; y += 50) {
          content += `<path d="${starPts(x,y,8,5)}" fill="${cols[0]}"/>`;
        }
      }
    } else if (type === 'hearts') {
      const heart = (cx, cy, s) =>
        `<path d="M${cx},${cy+s*0.4} C${cx},${cy} ${cx-s},${cy} ${cx-s},${cy-s*0.3} C${cx-s},${cy-s*0.8} ${cx},${cy-s*0.8} ${cx},${cy-s*0.3} C${cx},${cy-s*0.8} ${cx+s},${cy-s*0.8} ${cx+s},${cy-s*0.3} C${cx+s},${cy} ${cx},${cy} ${cx},${cy+s*0.4}Z" fill="${cols[0]}"/>`;
      for (let x = 30; x < 340; x += 46) {
        for (let y = 30; y < 220; y += 40) {
          content += heart(x, y, 9);
        }
      }
    } else if (type === 'waves') {
      for (let y = 20; y < 220; y += 22) {
        let d = `M0,${y}`;
        for (let x = 0; x < 340; x += 30) {
          d += ` Q${x+15},${y-10} ${x+30},${y}`;
        }
        content += `<path d="${d}" stroke="${cols[0]}" stroke-width="1.5" fill="none"/>`;
      }
    }

    svg.innerHTML = content;
    svg.style.opacity = type === 'none' ? '0' : '0.9';
    document.getElementById('envFlap').style.borderTopColor = flapColor;
  }

  function pickStamp(emoji, btn) {
    document.querySelectorAll('.stamp-opt').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    chosenStamp = emoji;
    const stamped = document.getElementById('placedStamp');
    stamped.style.display = 'flex';
    stamped.textContent = emoji;
  }

  function updateToName(val) {
    document.getElementById('envToDisplay').textContent = val.trim() || 'someone dear';
  }

  function countWords() {
    const text = document.getElementById('letterText').value;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const counter = document.getElementById('wordCounter');
    counter.textContent = words + (words === 1 ? ' word' : ' words');
    counter.className = 'word-counter' + (words > 300 ? ' warn' : '');
    document.getElementById('sealBtn').disabled = words < 1;
  }

  function goStep(n) {
    document.querySelectorAll('.step-card').forEach((c, i) => {
      c.classList.toggle('active', i === n);
    });
    document.querySelectorAll('.step-indicator span').forEach((s, i) => {
      s.classList.toggle('active', i === n);
    });

    if (n === 2) buildSealedEnvelope();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function sealLetter() {
    spawnSparkles();
    setTimeout(() => goStep(2), 600);
  }

  function buildSealedEnvelope() {
    const cfg = themeConfig[currentTheme];
    const toName = document.getElementById('toInput').value.trim() || 'someone dear';
    const container = document.getElementById('sealedEnvelope');

    container.innerHTML = `
      <div class="env-body" style="width:360px; height:240px; background:${envColor}; border-radius:8px; border:2px solid rgba(0,0,0,0.12); position:relative; overflow:hidden;">
        <div style="position:absolute;top:0;left:0;width:0;height:0;border-left:180px solid transparent;border-right:180px solid transparent;border-top:95px solid ${flapColor};z-index:2;"></div>
        <div style="position:absolute;bottom:0;left:0;width:0;height:0;border-bottom:120px solid rgba(0,0,0,0.05);border-right:180px solid transparent;"></div>
        <div style="position:absolute;bottom:0;right:0;width:0;height:0;border-bottom:120px solid rgba(0,0,0,0.06);border-left:180px solid transparent;"></div>
        <div style="position:absolute;top:14px;right:16px;z-index:3;width:36px;height:44px;border:2px solid rgba(0,0,0,0.2);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:20px;background:white;">${chosenStamp}</div>
        <div style="position:absolute;bottom:28px;left:28px;z-index:3;">
          <span style="font-size:9px;text-transform:uppercase;letter-spacing:1.5px;opacity:0.5;display:block;margin-bottom:2px;">To</span>
          <span style="font-family:'Playfair Display',serif;font-style:italic;font-size:1.1rem;opacity:0.85;">${toName}</span>
        </div>
        <div class="wax-seal" style="background:${cfg.wax}; color:white; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; z-index:4; box-shadow:0 2px 8px rgba(0,0,0,0.25);">${cfg.waxEmoji}</div>
      </div>`;

    if (!isReading) {
      document.getElementById('shareLink').value = generateLink();
    }
  }

  function spawnSparkles() {
    const container = document.getElementById('sparkles');
    container.style.display = 'block';
    const colors = ['#f5a0c0', '#c0a0f5', '#a0c0f5', '#f5c0a0', '#a0f5c0'];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const sp = document.createElement('div');
        sp.className = 'sparkle';
        sp.style.left = 20 + Math.random() * 60 + '%';
        sp.style.top = 20 + Math.random() * 60 + '%';
        sp.style.background = colors[Math.floor(Math.random() * colors.length)];
        sp.style.animationDelay = Math.random() * 0.3 + 's';
        container.appendChild(sp);
        setTimeout(() => sp.remove(), 1000);
      }, i * 30);
    }
    setTimeout(() => { container.style.display = 'none'; }, 1200);
  }

  function startOver() {
    document.getElementById('letterText').value = '';
    document.getElementById('toInput').value = '';
    document.getElementById('envToDisplay').textContent = 'someone dear';
    document.getElementById('wordCounter').textContent = '0 words';
    document.getElementById('sealBtn').disabled = true;
    goStep(0);
  }

  function generateLink() {
    const data = {
      t: currentTheme,
      c: envColor,
      f: flapColor,
      p: currentPattern,
      s: chosenStamp,
      to: document.getElementById('toInput').value.trim() || 'someone dear',
      txt: document.getElementById('letterText').value,
      font: customFont
    };
    const json = JSON.stringify(data);
    const b64 = btoa(encodeURIComponent(json));
    const url = new URL(window.location.href);
    url.searchParams.set('letter', b64);
    return url.href;
  }

  function copyLink(btn) {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = originalText, 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  function initFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const letterData = urlParams.get('letter');
    if (letterData) {
      try {
        const json = decodeURIComponent(atob(letterData));
        const data = JSON.parse(json);
        
        isReading = true;
        
        currentTheme = data.t;
        envColor = data.c;
        flapColor = data.f;
        currentPattern = data.p;
        chosenStamp = data.s;
        customFont = data.font || '';
        
        const toName = data.to;
        const text = data.txt;
        
        document.body.className = 'theme-' + currentTheme;
        const cfg = themeConfig[currentTheme];
        document.querySelector('.letter-paper').style.background = cfg.paperBg;
        document.querySelector('.letter-paper').style.setProperty('--accent', cfg.accentLine);
        
        document.getElementById('toInput').value = toName;
        document.getElementById('envToDisplay').textContent = toName;
        document.getElementById('letterText').value = text;
        document.getElementById('letterText').readOnly = true;
        document.querySelector('.letter-textarea').style.fontFamily = customFont || cfg.font;
        
        document.getElementById('stepIndicator').style.display = 'none';
        document.querySelector('.page-title').textContent = 'A Letter For You';
        document.querySelector('.subtitle').textContent = 'Someone sent you a letter';
        
        document.getElementById('letterSubtext').style.display = 'none';
        document.getElementById('wordCounter').style.display = 'none';
        document.getElementById('fontPickerGroup').style.display = 'none';
        
        document.getElementById('step1Buttons').innerHTML = '<button class="btn-primary" onclick="window.location.search=\'\'">Write your own letter</button>';
        
        document.getElementById('sealedMsgTitle').textContent = `For ${toName}`;
        document.getElementById('sealedSub').textContent = 'Click the envelope to open it.';
        document.getElementById('linkContainer').style.display = 'none';
        document.getElementById('btnStartOver').style.display = 'none';
        
        const env = document.getElementById('sealedEnvelope');
        env.style.cursor = 'pointer';
        env.onclick = function() {
           spawnSparkles();
           setTimeout(() => goStep(1), 600);
        };
        
        buildSealedEnvelope();
        goStep(2);
        
      } catch (e) {
        console.error("Invalid letter link", e);
      }
    }
  }

  // Init
  document.getElementById('envBody').style.background = envColor;
  document.getElementById('envFlap').style.borderTopColor = flapColor;
  document.getElementById('placedStamp').style.display = 'flex';
  document.getElementById('placedStamp').textContent = '🌹';
  document.querySelectorAll('.stamp-opt')[0].classList.add('active');

  initFromUrl();