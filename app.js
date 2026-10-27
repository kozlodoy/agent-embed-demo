// One page, one conversation, no framework: this exists to measure how much effort it takes to
// plug a third-party page into the platform. Everything that is not the integration is
// deliberately absent.

const els = {
  log: document.getElementById('log'),
  form: document.getElementById('composer'),
  text: document.getElementById('text'),
  send: document.getElementById('send'),
  endpoint: document.getElementById('endpoint'),
  key: document.getElementById('key'),
  status: document.getElementById('status'),
  saved: document.getElementById('saved'),
};

const store = {
  endpoint: 'demo.endpoint',
  key: 'demo.key',
};

function config() {
  return {
    endpoint: (els.endpoint.value || '').trim().replace(/\/+$/, ''),
    key: (els.key.value || '').trim(),
  };
}

function renderStatus() {
  const { endpoint } = config();
  els.status.textContent = endpoint || 'not configured';
  els.status.title = endpoint || '';
}

function restore() {
  els.endpoint.value = localStorage.getItem(store.endpoint) || '';
  els.key.value = localStorage.getItem(store.key) || '';
  renderStatus();
}

function save() {
  const { endpoint, key } = config();
  localStorage.setItem(store.endpoint, endpoint);
  localStorage.setItem(store.key, key);
  renderStatus();
  flash('saved');
}

function clear() {
  els.endpoint.value = '';
  els.key.value = '';
  localStorage.removeItem(store.endpoint);
  localStorage.removeItem(store.key);
  renderStatus();
  flash('cleared');
}

function flash(text) {
  els.saved.textContent = text;
  setTimeout(() => (els.saved.textContent = ''), 1500);
}

function add(role, text) {
  const el = document.createElement('div');
  el.className = 'msg ' + role;
  const label = document.createElement('span');
  label.className = 'role';
  label.textContent = role === 'notice' ? 'notice' : role;
  el.append(label, document.createTextNode(text));
  els.log.append(el);
  els.log.scrollTop = els.log.scrollHeight;
  return el;
}

// ---- the integration surface: the only part that changes when we wire it up ---------------
// Everything above is the demo page. Everything below is what a customer's developer would
// write, and what we are measuring the effort of.

/**
 * Sends one message and returns the assistant's reply.
 *
 * TODO(integration): replace the body with the platform's chat call, once the contract is
 * fixed (auth, streaming, files). Two questions it has to answer:
 *   - how the caller proves who it is (API key? OAuth? session?),
 *   - whether the reply arrives whole or token by token.
 */
async function ask(text) {
  const { endpoint } = config();
  if (!endpoint) {
    throw new Error('No API base URL set. Open Connection settings and paste it.');
  }
  throw new Error(
    'Integration not wired yet: the platform has not published the chat contract.',
  );
  // Shape it will likely take (kept here so the effort stays visible):
  // const res = await fetch(endpoint + '/api/chat/messages', {
  //   method: 'POST',
  //   credentials: 'include',                       // cookie session, or an auth header
  //   headers: { 'content-type': 'application/json', /* authorization?: ... */ },
  //   body: JSON.stringify({ text }),
  // });
  // if (!res.ok) throw new Error('Chat failed: HTTP ' + res.status);
  // return readReply(...);                          // whole reply, or the stream
}

// ---- page wiring -------------------------------------------------------------------------

els.text.addEventListener('input', () => {
  els.text.style.height = 'auto';
  els.text.style.height = Math.min(els.text.scrollHeight, 160) + 'px';
});

els.text.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    els.form.requestSubmit();
  }
});

els.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = els.text.value.trim();
  if (!text) return;
  els.text.value = '';
  els.text.style.height = 'auto';
  add('user', text);
  els.send.disabled = true;
  try {
    const reply = await ask(text);
    add('assistant', reply);
  } catch (error) {
    add('notice', error.message);
  } finally {
    els.send.disabled = false;
    els.text.focus();
  }
});

document.getElementById('save').addEventListener('click', save);
document.getElementById('clear').addEventListener('click', clear);

restore();
add(
  'assistant',
  'Hello. This page is a demo shell: one page, one conversation. The connection to the platform is not wired yet.',
);
