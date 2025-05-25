Meteor.startup(() => {
  function div(a, b) { return Math.floor(a / b); }
  function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    const gy2    = gm > 2 ? gy + 1 : gy;
    let   days   = 355666
                 + 365*gy
                 + div(gy2+3, 4)
                 - div(gy2+99, 100)
                 + div(gy2+399, 400)
                 + gd
                 + g_d_m[gm-1];
    let   jy     = -1595 + 33*div(days,12053) + 4*div(days%12053,1461);
    days        = (days%12053)%1461;
    if (days > 365) {
      jy    += div(days-1,365);
      days   = (days-1)%365;
    }
    const jm = days < 186
             ? 1 + div(days,31)
             : 7 + div(days-186,30);
    const jd = 1 + (days < 186 ? (days%31) : ((days-186)%30));
    return [jy, jm, jd];
  }
  // ---------------------------------------------------

  const pad2 = n => String(n).padStart(2, '0');

  function convertTimestamps() {
    document.querySelectorAll('.rcx-message-header__time').forEach(el => {
      if (el.dataset.jalaliDone) return;

     
      const orig = el.getAttribute('data-title') || el.getAttribute('title');
      if (!orig) return;
      const d = new Date(orig);
      if (isNaN(d)) return;

      const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth()+1, d.getDate());

      let hrs    = d.getHours() % 12; 
      hrs = hrs === 0 ? 12 : hrs;
      const mins   = pad2(d.getMinutes());
      const suffix = d.getHours() >= 12 ? 'بعد از ظهر' : 'صبح';
      const jTime  = `${hrs}:${mins} ${suffix}`;

      const tooltip = `${jy}/${pad2(jm)}/${pad2(jd)} ${jTime}`;
      el.setAttribute('title', tooltip);
      el.setAttribute('data-title', tooltip);

      el.textContent = jTime;

      el.dataset.jalaliDone = '1';
    });
  }

  function convertDividers() {
    document.querySelectorAll(
      '.rcx-message-divider__wrapper .rcx-bubble__item--secondary > span,' +
      '.bubble-visible .rcx-bubble__item--secondary'
    ).forEach(el => {
      if (el.dataset.jalaliDividerDone) return;
      const orig = el.textContent.trim();
      if (!orig) return;
      const d = new Date(orig);
      if (isNaN(d)) return;
      const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth()+1, d.getDate());
      el.textContent = `${jy}/${pad2(jm)}/${pad2(jd)}`;
      el.dataset.jalaliDividerDone = '1';
    });
  }

  function convertAll() {
    convertTimestamps();
    convertDividers();
  }
  convertAll();
  new MutationObserver(convertAll).observe(document.body, {
    childList: true,
    subtree:   true
  });
});
