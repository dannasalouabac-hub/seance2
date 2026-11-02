const form = document.getElementById('signup-form');
const successBox = document.getElementById('success');
const bar = document.getElementById('meter-bar');
const meterText = document.getElementById('meter-text');

const fields = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  confirm: document.getElementById('confirm'),
  terms: document.getElementById('terms'),
};

/* ---------- Helpers ---------- */
function setError(key, message) {
  const input = fields[key];
  const holder = input.closest('.field');
  document.getElementById(`${key}-error`).textContent = message;
  holder.classList.toggle('invalid', Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
}

function passwordScore(value) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

/* ---------- Validators ---------- */
const validators = {
  name() {
    const v = fields.name.value.trim();
    if (!v) return setError('name', 'Enter your full name.');
    if (v.length < 2) return setError('name', 'Your name must have at least 2 characters.');
    return setError('name', '');
  },
  email() {
    const v = fields.email.value.trim();
    if (!v) return setError('email', 'Enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setError('email', 'Enter a valid email, like name@example.com.');
    return setError('email', '');
  },
  password() {
    const v = fields.password.value;
    if (!v) return setError('password', 'Create a password.');
    if (v.length < 8) return setError('password', 'Use at least 8 characters.');
    if (!/[A-Z]/.test(v) || !/[0-9]/.test(v)) return setError('password', 'Add a capital letter and a number.');
    return setError('password', '');
  },
  confirm() {
    if (!fields.confirm.value) return setError('confirm', 'Repeat your password.');
    if (fields.confirm.value !== fields.password.value) return setError('confirm', 'The passwords do not match.');
    return setError('confirm', '');
  },
  terms() {
    if (!fields.terms.checked) return setError('terms', 'Accept the terms to continue.');
    return setError('terms', '');
  },
};

/* ---------- Live feedback ---------- */
Object.keys(validators).forEach((key) => {
  const input = fields[key];
  input.addEventListener('blur', () => { if (input.value || key === 'terms') validators[key](); });
  input.addEventListener('input', () => {
    if (input.closest('.field').classList.contains('invalid')) validators[key]();
  });
});

fields.password.addEventListener('input', () => {
  const score = passwordScore(fields.password.value);
  const levels = [
    { w: '0%',   c: '#c62d3f', t: 'Use at least 8 characters with a number and a capital letter.' },
    { w: '25%',  c: '#c62d3f', t: 'Weak password.' },
    { w: '50%',  c: '#e08a1e', t: 'Fair password.' },
    { w: '75%',  c: '#8aa81f', t: 'Good password.' },
    { w: '100%', c: '#1d8a5b', t: 'Strong password.' },
  ];
  const level = fields.password.value ? levels[score] : levels[0];
  bar.style.width = level.w;
  bar.style.background = level.c;
  meterText.textContent = level.t;
  if (fields.confirm.value) validators.confirm();
});

/* ---------- Show / hide password ---------- */
document.querySelectorAll('.toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
});

/* ---------- Submit ---------- */
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const results = Object.keys(validators).map((key) => validators[key]());
  if (results.includes(false)) {
    const firstInvalid = form.querySelector('.invalid input');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const submitBtn = form.querySelector('.submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account…';

  const payload = {
    name: fields.name.value.trim(),
    email: fields.email.value.trim(),
    password: fields.password.value,
  };

  try {
    /* Replace this with your real API call, for example:
       const res = await fetch('/api/register', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
       });
       if (!res.ok) throw new Error('Registration failed');
    */
    await new Promise((resolve) => setTimeout(resolve, 800));

    document.getElementById('success-name').textContent = payload.name;
    document.getElementById('success-email').textContent = payload.email;
    form.hidden = true;
    successBox.hidden = false;
  } catch (err) {
    setError('email', 'Something went wrong. Try again in a moment.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create account';
  }
});