// Moving Company for YouTube™: lets this website talk to the installed extension (manifest "externally_connectable").
// One-click activation after checkout, this browser's license, and the key's other browsers (via Chrome sync),
// without any server. YTMCExt.mount(el, { lang, key }) renders the panel; YTMCExt.call(msg) talks to the extension.
(function () {
  'use strict';
  const IDS = ['cmgadokilonjjigdjafidjdggacbcmdm'];   // Chrome Web Store (Edge installs it from there too)
  const CWS = 'https://chromewebstore.google.com/detail/cmgadokilonjjigdjafidjdggacbcmdm';
  const DEVICES_API = 'https://ytmc-devices.speed132454.workers.dev/';   // device-list service (Cloudflare Worker URL): every browser a key is active in
  const DODO = { live: 'https://live.dodopayments.com/licenses/', test: 'https://test.dodopayments.com/licenses/' };

  // without the extension: list a key's browsers through the device-list service, free a slot through Dodo's public API
  async function webDevices(key) {
    if (!DEVICES_API) return null;
    try {
      const r = await fetch(DEVICES_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, mode: window.YTMC_DODO_MODE === 'test' ? 'test' : 'live' }), cache: 'no-store' });
      const j = await r.json();
      if (j && j.ok) return { ok: true, devices: j.devices.map((d) => ({ id: d.id, name: d.name, mode: window.YTMC_DODO_MODE === 'test' ? 'test' : 'live', remote: true })) };
      return { ok: false, error: (j && j.error) === 'notfound' ? 'notfound' : 'network' };
    } catch (e) { return { ok: false, error: 'network' }; }
  }
  async function webRemove(key, id, mode) {
    try {
      const r = await fetch(DODO[mode === 'test' ? 'test' : 'live'] + 'deactivate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ license_key: key, license_key_instance_id: id }) });
      return { ok: r.ok || r.status === 404 || r.status === 403 };
    } catch (e) { return { ok: false, error: 'network' }; }
  }

  function ids() {
    // ?ext=<id> points the page at an unpacked copy for testing; only honoured while the page runs in Dodo test mode
    if (window.YTMC_DODO_MODE !== 'test') return IDS;
    let s = new URLSearchParams(location.search).get('ext');
    try { if (s) sessionStorage.setItem('ytmc_ext', s); s = s || sessionStorage.getItem('ytmc_ext'); } catch (e) { /* ignore */ }
    return s && /^[a-p]{32}$/.test(s) ? [s, ...IDS.filter((i) => i !== s)] : IDS;
  }
  function send(id, msg, ms) {
    return new Promise((resolve) => {
      const rt = window.chrome && window.chrome.runtime;
      if (!rt || typeof rt.sendMessage !== 'function') return resolve(null);
      let done = false;
      const timer = setTimeout(() => { done = true; resolve(null); }, ms || 4000);
      try {
        rt.sendMessage(id, msg, (res) => {
          void (window.chrome.runtime && window.chrome.runtime.lastError);
          if (done) return; done = true; clearTimeout(timer); resolve(res || null);
        });
      } catch (e) { done = true; clearTimeout(timer); resolve(null); }
    });
  }
  let found;
  async function find() {
    if (found !== undefined) return found;
    for (const id of ids()) { const r = await send(id, { type: 'YTMC_PING' }, 1500); if (r && r.ok) return (found = id); }
    return (found = null);
  }
  async function call(msg) { const id = await find(); return id ? send(id, msg, 30000) : null; }

  // ---------- strings ----------
  const TX = {
    zh: {
      web_list_t: '使用中的瀏覽器', dev_note_all: '這裡列出這組授權碼目前啟用中的所有瀏覽器。被移除的瀏覽器會在下次檢查時回到免費版。', web_t: '用授權碼管理使用中的瀏覽器', web_p: '舊電腦壞了或不在身邊？輸入授權碼，就能看到並移除它。', web_btn: '查看使用中的瀏覽器', web_none: '這組授權碼目前沒有啟用中的瀏覽器。', 
      detect: '正在偵測擴充功能…', noext_t: '這個瀏覽器還沒有安裝 Moving Company for YouTube™ 3.0 以上版本',
      noext_p: '安裝或更新後重新整理這一頁，就能在這裡一鍵開通；也可以複製授權碼，到擴充功能的「設定 → 升級 Pro」貼上。',
      install: '前往 Chrome Web Store', free_t: '在這個瀏覽器開通 Pro', key_ph: '貼上授權碼', activate: '一鍵開通這個瀏覽器',
      copy: '複製', copied: '已複製', working: '處理中…', done: '開通完成！這個瀏覽器已經是 Pro，打開擴充功能就能使用。',
      pro_t: '這個瀏覽器已開通 Pro', r_plan: '方案', r_key: '授權碼', r_dev: '這台裝置', r_mail: '信箱',
      plans: { m1: '1 個月', y1: '1 年', life: '永久' }, others: '這組授權碼的其他瀏覽器', limit_t: '移除一個不再使用的瀏覽器，就會自動開通這個瀏覽器：',
      remove: '移除', remove_c: '確定移除？', removed: '已移除，名額已釋出。', signout: '登出這台裝置', signout_c: '確定登出？', signed_out: '已登出，名額已釋出。',
      dev_note: '清單透過 Chrome 同步取得，只會列出登入同一個 Google 帳號並開啟同步的瀏覽器。被移除的瀏覽器會在下次檢查時回到免費版。',
      nodev: '找不到其他瀏覽器的記錄（它們沒有登入同一個 Google 帳號或沒開同步）。請在那個瀏覽器的擴充功能按「登出這台裝置」，或直接移除擴充功能，名額就會釋出。',
      e: { network: '連線失敗，請檢查網路後再試一次。', notfound: '找不到這組授權碼，請確認有沒有複製完整。', limit: '這組授權碼的瀏覽器名額已經用完。',
        expired: '這組授權碼目前無法使用（訂閱已到期、已取消或被停用）。', invalid: '這組授權碼無法使用。', disabled: '這組授權碼已被停用。',
        wrong_product: '這不是 Moving Company for YouTube™ 的授權碼。', empty: '請先貼上授權碼。', noresp: '擴充功能沒有回應，請重新整理頁面再試一次。' }
    },
    cn: {
      web_list_t: '使用中的浏览器', dev_note_all: '这里列出这组授权码目前激活中的所有浏览器。被移除的浏览器会在下次检查时回到免费版。', web_t: '用授权码管理使用中的浏览器', web_p: '旧电脑坏了或不在身边？输入授权码，就能看到并移除它。', web_btn: '查看使用中的浏览器', web_none: '这组授权码目前没有激活中的浏览器。', 
      detect: '正在检测扩展程序…', noext_t: '这个浏览器还没有安装 Moving Company for YouTube™ 3.0 以上版本',
      noext_p: '安装或更新后刷新这一页，就能在这里一键激活；也可以复制授权码，到扩展程序的“设置 → 升级 Pro”粘贴。',
      install: '前往 Chrome Web Store', free_t: '在这个浏览器激活 Pro', key_ph: '粘贴授权码', activate: '一键激活这个浏览器',
      copy: '复制', copied: '已复制', working: '处理中…', done: '激活完成！这个浏览器已经是 Pro，打开扩展程序即可使用。',
      pro_t: '这个浏览器已激活 Pro', r_plan: '方案', r_key: '授权码', r_dev: '这台设备', r_mail: '邮箱',
      plans: { m1: '1 个月', y1: '1 年', life: '永久' }, others: '这组授权码的其他浏览器', limit_t: '移除一个不再使用的浏览器，就会自动激活这个浏览器：',
      remove: '移除', remove_c: '确定移除？', removed: '已移除，名额已释放。', signout: '退出这台设备', signout_c: '确定退出？', signed_out: '已退出，名额已释放。',
      dev_note: '列表通过 Chrome 同步获取，只会列出登录同一个 Google 账号并开启同步的浏览器。被移除的浏览器会在下次检查时回到免费版。',
      nodev: '找不到其他浏览器的记录（它们没有登录同一个 Google 账号或没开同步）。请在那个浏览器的扩展程序点击“退出这台设备”，或直接移除扩展程序，名额就会释放。',
      e: { network: '连接失败，请检查网络后再试一次。', notfound: '找不到这组授权码，请确认是否复制完整。', limit: '这组授权码的浏览器名额已经用完。',
        expired: '这组授权码目前无法使用（订阅已到期、已取消或被停用）。', invalid: '这组授权码无法使用。', disabled: '这组授权码已被停用。',
        wrong_product: '这不是 Moving Company for YouTube™ 的授权码。', empty: '请先粘贴授权码。', noresp: '扩展程序没有响应，请刷新页面再试一次。' }
    },
    en: {
      web_list_t: 'Active browsers', dev_note_all: 'This lists every browser the key is active in right now. A removed browser returns to the free version at its next check.', web_t: 'Manage browsers with your key', web_p: 'Old computer broken or out of reach? Enter your key to see and remove it.', web_btn: 'Show active browsers', web_none: 'This key is not active in any browser right now.', 
      detect: 'Looking for the extension…', noext_t: 'Moving Company for YouTube™ 3.0 or later is not installed in this browser',
      noext_p: 'Install or update it, then reload this page to activate with one click. Or copy your key and paste it in the extension under Settings → Upgrade to Pro.',
      install: 'Open the Chrome Web Store', free_t: 'Activate Pro in this browser', key_ph: 'Paste your license key', activate: 'Activate this browser',
      copy: 'Copy', copied: 'Copied', working: 'Working…', done: 'Activated! This browser now has Pro. Open the extension to use it.',
      pro_t: 'Pro is active in this browser', r_plan: 'Plan', r_key: 'Key', r_dev: 'This device', r_mail: 'Email',
      plans: { m1: '1 Month', y1: '1 Year', life: 'Lifetime' }, others: 'Other browsers using this key', limit_t: 'Remove a browser you no longer use and this one is activated automatically:',
      remove: 'Remove', remove_c: 'Remove it?', removed: 'Removed. The slot is free again.', signout: 'Sign out this device', signout_c: 'Sign out?', signed_out: 'Signed out. The slot is free again.',
      dev_note: 'This list comes from Chrome sync, so it only shows browsers signed in to the same Google account with sync on. A removed browser returns to the free version at its next check.',
      nodev: 'No other browsers were found (they are not signed in to the same Google account, or sync is off). Click “Sign out this device” in the extension on that browser, or uninstall it there, to free the slot.',
      e: { network: 'Connection failed. Check your network and try again.', notfound: 'This key was not found. Make sure you copied all of it.', limit: 'This key has no free browser slots left.',
        expired: 'This key can’t be used right now (the subscription expired, was cancelled or disabled).', invalid: 'This key can’t be used.', disabled: 'This key has been disabled.',
        wrong_product: 'This is not a Moving Company for YouTube™ key.', empty: 'Paste your key first.', noresp: 'The extension did not respond. Reload the page and try again.' }
    },
    ja: {
      web_list_t: '利用中のブラウザ', dev_note_all: 'このキーが現在有効になっているすべてのブラウザです。削除されたブラウザは次回のチェックで無料版に戻ります。', web_t: 'キーで利用中のブラウザを管理', web_p: '古いパソコンが壊れた・手元にない場合も、キーを入力すれば確認して削除できます。', web_btn: '利用中のブラウザを表示', web_none: 'このキーは現在どのブラウザでも有効になっていません。', 
      detect: '拡張機能を確認しています…', noext_t: 'このブラウザには Moving Company for YouTube™ 3.0 以降がインストールされていません',
      noext_p: 'インストールまたは更新してからこのページを再読み込みすると、ここでワンクリックで有効化できます。キーをコピーして、拡張機能の「設定 → Pro にアップグレード」に貼り付けることもできます。',
      install: 'Chrome ウェブストアを開く', free_t: 'このブラウザで Pro を有効化', key_ph: 'ライセンスキーを貼り付け', activate: 'このブラウザを有効化',
      copy: 'コピー', copied: 'コピーしました', working: '処理中…', done: '有効化しました！このブラウザで Pro が使えます。拡張機能を開いてご利用ください。',
      pro_t: 'このブラウザで Pro が有効です', r_plan: 'プラン', r_key: 'キー', r_dev: 'このデバイス', r_mail: 'メール',
      plans: { m1: '1 か月', y1: '1 年', life: '買い切り' }, others: 'このキーを使っているほかのブラウザ', limit_t: '使わなくなったブラウザを削除すると、このブラウザが自動で有効になります：',
      remove: '削除', remove_c: '削除しますか？', removed: '削除しました。枠が空きました。', signout: 'このデバイスからサインアウト', signout_c: 'サインアウトしますか？', signed_out: 'サインアウトしました。枠が空きました。',
      dev_note: 'この一覧は Chrome の同期から取得しているため、同じ Google アカウントでログインし同期をオンにしているブラウザだけが表示されます。削除されたブラウザは次回のチェックで無料版に戻ります。',
      nodev: 'ほかのブラウザが見つかりません（同じ Google アカウントでログインしていないか、同期がオフです）。そのブラウザの拡張機能で「このデバイスからサインアウト」を押すか、拡張機能を削除すると枠が空きます。',
      e: { network: '接続に失敗しました。ネットワークを確認して、もう一度お試しください。', notfound: 'このキーが見つかりません。すべてコピーできているか確認してください。', limit: 'このキーのブラウザ枠がいっぱいです。',
        expired: 'このキーは現在使えません（サブスクリプションの期限切れ、解約、または停止）。', invalid: 'このキーは使えません。', disabled: 'このキーは停止されています。',
        wrong_product: 'Moving Company for YouTube™ のキーではありません。', empty: '先にキーを貼り付けてください。', noresp: '拡張機能が応答しません。ページを再読み込みして、もう一度お試しください。' }
    }
  };

  const CSS = `
  .ytx { text-align: left; background: var(--card, #15171c); border: 1px solid var(--line, rgba(255,255,255,.1)); border-radius: 18px; padding: 20px; color: var(--text, inherit); }
  .ytx h4 { margin: 0 0 10px; font-size: 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ytx .pro { font-weight: 800; font-size: 11px; line-height: 1; letter-spacing: .5px; padding: 4px 7px; border-radius: 6px; color: #2a1d00; background: linear-gradient(135deg, #ffd36e, #f5c451 45%, #e0a526); }
  .ytx p { color: var(--sub, #9aa0aa); font-size: 13.5px; margin: 6px 0 0; }
  .ytx .row { display: flex; gap: 8px; margin-top: 12px; }
  .ytx input { flex: 1; min-width: 0; padding: 11px 12px; border-radius: 11px; font: 13px ui-monospace, Consolas, monospace; border: 1px solid var(--line, rgba(128,128,128,.35));
    background: rgba(128,128,128,.10); color: inherit; outline: none; }
  .ytx input:focus { border-color: #e0a526; box-shadow: 0 0 0 3px rgba(245,196,81,.2); }
  .ytx button, .ytx a.b { flex: none; border: 0; border-radius: 11px; padding: 11px 16px; font: 800 14px inherit; font-family: inherit; cursor: pointer; text-decoration: none; display: inline-block;
    transition: transform .2s cubic-bezier(.34,1.56,.64,1), filter .2s; }
  .ytx button:hover:not(:disabled), .ytx a.b:hover { transform: translateY(-2px); }
  .ytx button:disabled { opacity: .5; cursor: default; }
  .ytx .gold { color: #2a1d00; background: linear-gradient(135deg, #ffd36e, #f5c451 45%, #e0a526); box-shadow: 0 6px 18px rgba(245,196,81,.25); }
  .ytx .ghost { background: rgba(128,128,128,.16); color: inherit; }
  .ytx .bad { color: #fb7185; background: rgba(251,113,133,.12); }
  .ytx .bad.arm { background: #e11d48; color: #fff; }
  .ytx .big { width: 100%; margin-top: 10px; padding: 13px 16px; font-size: 15px; }
  .ytx .msg { font-size: 13.5px; margin-top: 10px; min-height: 0; }
  .ytx .msg.ok { color: #34d399; } .ytx .msg.err { color: #fb7185; }
  .ytx .rows { display: grid; grid-template-columns: max-content 1fr; gap: 6px 14px; font-size: 13.5px; margin: 6px 0 4px; }
  .ytx .rows span:nth-child(odd) { color: var(--sub, #9aa0aa); }
  .ytx .rows span:nth-child(even) { word-break: break-all; }
  .ytx .devs { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line, rgba(128,128,128,.22)); }
  .ytx .devs b { display: block; font-size: 13.5px; margin-bottom: 6px; }
  .ytx .dev { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 13.5px; border-bottom: 1px dashed var(--line, rgba(128,128,128,.2)); }
  .ytx .dev:last-of-type { border-bottom: 0; }
  .ytx .dev span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ytx .dev small { color: var(--sub, #9aa0aa); margin-left: 6px; }
  .ytx .dev button { padding: 6px 12px; font-size: 12.5px; }
  .ytx .note { font-size: 12px; color: var(--sub, #9aa0aa); margin-top: 8px; }
  .ytx .spin { display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 2px solid currentColor; border-top-color: transparent; animation: ytxr .7s linear infinite; vertical-align: -2px; margin-right: 6px; }
  @keyframes ytxr { to { transform: rotate(360deg); } }
  @media (max-width: 480px) { .ytx .row { flex-wrap: wrap; } .ytx .row input { flex-basis: 100%; } }`;

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else e.setAttribute(k, v); });
    kids.flat().forEach((k) => k != null && e.append(k));
    return e;
  }
  // a button that asks once more before it acts
  function armed(btn, label, confirmLabel, act) {
    btn.onclick = async () => {
      if (!btn.classList.contains('arm')) {
        btn.classList.add('arm'); btn.textContent = confirmLabel;
        setTimeout(() => { if (btn.isConnected && !btn.disabled) { btn.classList.remove('arm'); btn.textContent = label; } }, 4000);
        return;
      }
      btn.disabled = true; btn.innerHTML = '<span class="spin"></span>';
      const ok = await act();
      if (!ok && btn.isConnected) { btn.disabled = false; btn.classList.remove('arm'); btn.textContent = label; }
    };
    return btn;
  }

  // opts: { lang, key, onSize }   returns { render(lang) }
  function mount(root, opts) {
    opts = opts || {};
    if (!document.getElementById('ytx-css')) document.head.append(h('style', { id: 'ytx-css', text: CSS }));
    let lang = TX[opts.lang] ? opts.lang : 'zh';
    let key = String(opts.key || '').trim();
    let note = null;   // { cls, text } shown after a re-render
    const t = () => TX[lang];
    const box = h('div', { class: 'ytx' });
    const fill = (...kids) => box.replaceChildren(...kids.flat().filter((k) => k != null && k !== false));
    root.replaceChildren(box);
    const sized = () => { if (opts.onSize) requestAnimationFrame(() => opts.onSize()); };
    const msgEl = (n) => h('div', { class: 'msg' + (n ? ' ' + n.cls : ''), text: n ? n.text : '' });
    const errText = (r) => t().e[(r && r.error) || 'noresp'] || t().e.invalid;

    function devList(list, title, keyForRemove, onFreed, remover) {
      const wrap = h('div', { class: 'devs' }, h('b', { text: title }));
      list.forEach((d) => {
        const b = h('button', { type: 'button', class: 'bad', text: t().remove });
        const row = h('div', { class: 'dev' }, h('span', { title: d.name || '', text: d.name || '-' }), b);
        armed(b, t().remove, t().remove_c, async () => {
          const r = remover ? await remover(d) : await call({ type: 'YTMC_REMOVE_DEVICE', key: keyForRemove, id: d.id, mode: d.mode });
          if (r && r.ok) { row.remove(); onFreed(); return true; }
          b.title = errText(r); return false;
        });
        wrap.append(row);
      });
      wrap.append(h('div', { class: 'note', text: list.some((d) => d.remote) ? t().dev_note_all : t().dev_note }));
      return wrap;
    }

    // no extension here: see / free a key's browsers with just the key
    function webManage() {
      const wrap = h('div', { class: 'devs' }, h('b', { text: t().web_t }), h('p', { class: 'note', text: t().web_p }));
      const inp = h('input', { type: 'text', placeholder: t().key_ph, spellcheck: 'false', autocomplete: 'off', 'aria-label': t().key_ph });
      inp.value = key;
      const btn = h('button', { type: 'button', class: 'ghost', text: t().web_btn });
      const out = h('div');
      wrap.append(h('div', { class: 'row' }, inp, btn), out);
      const show = async () => {
        const k = inp.value.trim();
        if (!k) { out.replaceChildren(h('p', { class: 'msg err', text: t().e.empty })); sized(); return; }
        btn.disabled = true; out.replaceChildren(h('p', { class: 'msg' }, h('span', { class: 'spin' }), t().working)); sized();
        const r = await webDevices(k);
        btn.disabled = false;
        if (!r || !r.ok) { out.replaceChildren(h('p', { class: 'msg err', text: t().e[(r && r.error) || 'network'] })); sized(); return; }
        const shown = () => { if (!out.querySelector('.dev')) out.replaceChildren(h('p', { class: 'note', text: t().web_none })); sized(); };
        out.replaceChildren(r.devices.length ? devList(r.devices, t().web_list_t, k, shown, (d) => webRemove(k, d.id, d.mode)) : h('p', { class: 'note', text: t().web_none }));
        sized();
      };
      btn.onclick = show;
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') show(); });
      return wrap;
    }

    async function render(newLang) {
      if (newLang && TX[newLang]) lang = newLang;
      if (!box.childNodes.length) { box.append(h('p', {}, h('span', { class: 'spin' }), t().detect)); sized(); }
      const id = await find();
      if (!id) {
        const inp = key ? h('input', { type: 'text', readonly: '', value: key, 'aria-label': t().r_key }) : null;
        const cp = key ? h('button', { type: 'button', class: 'ghost', text: t().copy }) : null;
        if (cp) cp.onclick = async () => { try { await navigator.clipboard.writeText(key); } catch (e) { inp.select(); document.execCommand('copy'); } cp.textContent = t().copied; setTimeout(() => { cp.textContent = t().copy; }, 1500); };
        fill(
          h('h4', { text: t().noext_t }), h('p', { text: t().noext_p }),
          key ? h('div', { class: 'row' }, inp, cp) : null,
          h('a', { class: 'b gold big', href: CWS, target: '_blank', rel: 'noopener', text: t().install + ' ↗', style: 'text-align:center' }),
          DEVICES_API ? webManage() : null
        );
        sized(); return;
      }
      const s = await call({ type: 'YTMC_STATUS' });
      if (!s) { fill(h('p', { class: 'msg err', text: t().e.noresp })); sized(); return; }
      if (s.pro) {
        const others = (s.devices || []).filter((d) => !d.self);
        const so = h('button', { type: 'button', class: 'bad big', text: t().signout });
        fill(
          h('h4', {}, t().pro_t, h('span', { class: 'pro', text: 'PRO' })),
          h('div', { class: 'rows' },
            h('span', { text: t().r_plan }), h('span', { text: t().plans[s.plan] || s.plan || '-' }),
            h('span', { text: t().r_key }), h('span', { text: s.key || '-' }),
            s.email ? [h('span', { text: t().r_mail }), h('span', { text: s.email })] : [],
            h('span', { text: t().r_dev }), h('span', { text: s.device || '-' })),
          msgEl(note),
          others.length ? devList(others, t().others, '', () => { note = { cls: 'ok', text: t().removed }; render(); }) : null,
          so
        );
        armed(so, t().signout, t().signout_c, async () => {
          const r = await call({ type: 'YTMC_SIGNOUT' });
          if (r && r.ok) { note = { cls: 'ok', text: t().signed_out }; render(); return true; }
          note = { cls: 'err', text: errText(r) }; render(); return false;
        });
        note = null; sized(); return;
      }
      // not activated here
      const inp = h('input', { type: 'text', placeholder: t().key_ph, spellcheck: 'false', autocomplete: 'off', 'aria-label': t().key_ph });
      inp.value = key;
      const go = h('button', { type: 'button', class: 'gold big', text: t().activate });
      const msg = msgEl(note); note = null;
      const extra = h('div');
      fill(h('h4', {}, t().free_t, h('span', { class: 'pro', text: 'PRO' })), h('div', { class: 'row' }, inp), go, msg, extra);
      const activate = async () => {
        if (go.disabled) return;
        key = inp.value.trim();
        if (!key) { msg.className = 'msg err'; msg.textContent = t().e.empty; return; }
        go.disabled = true; msg.className = 'msg'; msg.innerHTML = `<span class="spin"></span>${t().working}`; extra.replaceChildren(); sized();
        const r = await call({ type: 'YTMC_ACTIVATE', key });
        go.disabled = false;
        if (r && r.ok) { note = { cls: 'ok', text: t().done }; render(); if (opts.onActivated) opts.onActivated(); return; }
        msg.className = 'msg err'; msg.textContent = errText(r);
        if (r && r.error === 'limit') {
          const d = await call({ type: 'YTMC_DEVICES', key });
          const list = ((d && d.devices) || []).filter((x) => !x.self);
          extra.replaceChildren(list.length ? devList(list, t().limit_t, key, () => setTimeout(activate, 300)) : h('p', { class: 'note', text: t().nodev }));
        }
        sized();
      };
      go.onclick = activate;
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') activate(); });
      sized();
    }
    render();
    return { render };
  }

  window.YTMCExt = { find, call, mount, CWS };
})();
