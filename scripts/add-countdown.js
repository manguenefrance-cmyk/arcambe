const fs = require('fs');

// Add Countdown CSS
let css = fs.readFileSync('assets/css/site.css', 'utf8');
const countdownCss = `
.countdown-timer {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--soft);
  border: 1px solid var(--line);
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.countdown-timer strong {
  color: var(--green-dark);
  font-size: .9rem;
  text-transform: uppercase;
  letter-spacing: .05em;
}
.time-blocks {
  display: flex;
  gap: 12px;
}
.time-blocks div {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 6px;
  min-width: 52px;
  padding: 8px 6px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}
.time-blocks span {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1;
  color: var(--green);
}
.time-blocks small {
  font-size: .65rem;
  color: var(--muted);
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 4px;
}
.countdown-timer.expired {
  background: #ffebe6;
  border-color: #ffbdad;
}
.countdown-timer.expired strong { color: #d93025; }
.countdown-timer.expired .time-blocks { display: none; }
`;
if (!css.includes('.countdown-timer')) {
  css += '\n' + countdownCss;
  fs.writeFileSync('assets/css/site.css', css, 'utf8');
  console.log('Added Countdown CSS to site.css');
}

// Add Countdown JS
let js = fs.readFileSync('assets/js/site.js', 'utf8');
const countdownJs = `
// ══════════════════════════════════════════
// COUNTDOWN TIMER
// ══════════════════════════════════════════
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const timers = document.querySelectorAll('.countdown-timer');
    if(timers.length === 0) return;
    
    function updateTimers() {
      const now = new Date().getTime();
      
      timers.forEach(timer => {
        const deadlineStr = timer.getAttribute('data-deadline');
        if(!deadlineStr) return;
        
        const deadline = new Date(deadlineStr).getTime();
        const distance = deadline - now;
        
        if(distance < 0) {
          timer.classList.add('expired');
          timer.querySelector('strong').textContent = 'Inscrições Encerradas';
          return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const elDays = timer.querySelector('.days');
        const elHours = timer.querySelector('.hours');
        const elMins = timer.querySelector('.minutes');
        const elSecs = timer.querySelector('.seconds');
        
        if(elDays) elDays.textContent = days < 10 ? '0'+days : days;
        if(elHours) elHours.textContent = hours < 10 ? '0'+hours : hours;
        if(elMins) elMins.textContent = minutes < 10 ? '0'+minutes : minutes;
        if(elSecs) elSecs.textContent = seconds < 10 ? '0'+seconds : seconds;
      });
    }
    
    updateTimers();
    setInterval(updateTimers, 1000);
  });
})();
`;
if (!js.includes('COUNTDOWN TIMER')) {
  js += '\n' + countdownJs;
  fs.writeFileSync('assets/js/site.js', js, 'utf8');
  console.log('Added Countdown JS to site.js');
}

// Add Countdown HTML to landing pages
const pages = [
  { file: 'lp-curso-aia.html', date: '2026-08-21T23:59:59' },
  { file: 'lp-qgis.html', date: '2026-08-21T23:59:59' },
  { file: 'lp-curso-sso.html', date: '2026-08-28T23:59:59' },
  { file: 'lp-sensoriamento-remoto.html', date: '2026-09-04T23:59:59' }
];

for (const p of pages) {
  if (!fs.existsSync(p.file)) continue;
  let html = fs.readFileSync(p.file, 'utf8');
  
  if (!html.includes('countdown-timer')) {
    const timerHtml = `
<div class="countdown-timer" data-deadline="\${p.date}">
  <strong>Encerra em:</strong>
  <div class="time-blocks">
    <div><span class="days">--</span><small>Dias</small></div>
    <div><span class="hours">--</span><small>Horas</small></div>
    <div><span class="minutes">--</span><small>Min</small></div>
    <div><span class="seconds">--</span><small>Seg</small></div>
  </div>
</div>`;
    
    // Inject right after <div class="hero-actions">...</div>
    html = html.replace(/(<div class="hero-actions">.*?<\/div>)/, '$1' + timerHtml);
    
    fs.writeFileSync(p.file, html, 'utf8');
    console.log('Added countdown to ' + p.file);
  }
}
