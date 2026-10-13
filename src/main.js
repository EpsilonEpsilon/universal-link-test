import './style.css'

const PACKAGE_NAME = 'com.goodevas.family'
const TEST_PATHS = ['/', '/invite/abc123', '/profile/42?ref=test', '/open?screen=home']

const { origin, host, pathname, search, hash } = window.location

// intent:// forces Chrome to hand the URL to the app, bypassing the
// "same-domain navigation stays in the browser" rule.
const intentUrl = (path) =>
  `intent://${host}${path}#Intent;scheme=https;package=${PACKAGE_NAME};S.browser_fallback_url=${encodeURIComponent(origin + path)};end`

document.querySelector('#app').innerHTML = `
  <h1>Universal Link Test</h1>
  <p class="warn">You are seeing this page in the browser, so the app did <b>not</b> intercept this link.</p>

  <h2>Current URL</h2>
  <table>
    <tr><th>host</th><td>${host}</td></tr>
    <tr><th>path</th><td>${pathname}</td></tr>
    <tr><th>query</th><td>${search || '—'}</td></tr>
    <tr><th>hash</th><td>${hash || '—'}</td></tr>
  </table>

  <h2>Test links</h2>
  <ul>
    ${TEST_PATHS.map(
      (p) => `
      <li>
        <code>${p}</code>
        <a href="${origin + p}">https</a>
        <a href="${intentUrl(p)}">intent</a>
        <button data-copy="${origin + p}">copy</button>
      </li>`,
    ).join('')}
  </ul>
  <p class="hint">
    Tapping an <b>https</b> link on this same domain usually stays in the browser. Copy the link and
    open it from another app (Notes, Slack, a message), or use <b>intent</b>.
  </p>

  <h2>Verification</h2>
  <ul>
    <li><a href="/.well-known/assetlinks.json">/.well-known/assetlinks.json</a></li>
    <li><a href="https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=${encodeURIComponent(origin)}&relation=delegate_permission/common.handle_all_urls">Google Digital Asset Links check</a></li>
  </ul>
`

document.querySelectorAll('[data-copy]').forEach((btn) =>
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(btn.dataset.copy)
    btn.textContent = 'copied'
    setTimeout(() => (btn.textContent = 'copy'), 1200)
  }),
)
