<<<<<<< HEAD
/**
 * Page de connexion
 * - validation des champs
 * - affichage et effacement des erreurs
 * - bouton d'affichage du mot de passe
 * - état de chargement pendant la requête
 */
(() => {
  'use strict';

  /* ------------------------------------------------------------------------
   * Éléments du DOM
   * --------------------------------------------------------------------- */

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const toggleButton = document.getElementById('toggle-password');
  const submitButton = form.querySelector('.submit');
  const alertBox = document.getElementById('alert');

  /* ------------------------------------------------------------------------
   * Configuration
   * --------------------------------------------------------------------- */

  const MIN_PASSWORD_LENGTH = 8;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const MESSAGES = {
    emailRequired: 'Saisissez votre adresse e-mail.',
    emailInvalid: "Cette adresse e-mail n'est pas valide.",
    passwordRequired: 'Saisissez votre mot de passe.',
    passwordTooShort: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
    invalidCredentials: 'Adresse e-mail ou mot de passe incorrect.',
    networkError: 'Connexion impossible. Vérifiez votre réseau et réessayez.',
    success: 'Connexion réussie. Redirection en cours…',
  };

  /* ------------------------------------------------------------------------
   * Règles de validation
   * Chaque champ renvoie un message d'erreur, ou une chaîne vide si valide.
   * --------------------------------------------------------------------- */

  const fields = [
    {
      input: emailInput,
      validate() {
        const value = emailInput.value.trim();
        if (!value) return MESSAGES.emailRequired;
        if (!EMAIL_PATTERN.test(value)) return MESSAGES.emailInvalid;
        return '';
      },
    },
    {
      input: passwordInput,
      validate() {
        const value = passwordInput.value;
        if (!value) return MESSAGES.passwordRequired;
        if (value.length < MIN_PASSWORD_LENGTH) return MESSAGES.passwordTooShort;
        return '';
      },
    },
  ];

  /* ------------------------------------------------------------------------
   * Affichage
   * --------------------------------------------------------------------- */

  function setFieldError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.textContent = message;

    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert--${type}`;
    alertBox.hidden = false;
  }

  function hideAlert() {
    alertBox.hidden = true;
    alertBox.textContent = '';
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? 'Connexion en cours…' : 'Se connecter';
    form.setAttribute('aria-busy', String(isLoading));
  }

  /* ------------------------------------------------------------------------
   * Requête de connexion
   *
   * Remplacez le contenu de cette fonction par votre appel au serveur.
   * Exemple :
   *
   *   const response = await fetch('/api/login', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ email, password, remember }),
   *   });
   *   if (response.status === 401) {
   *     throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS' });
   *   }
   *   if (!response.ok) throw new Error('Server error');
   *   return response.json();
   * ------------------------------------------------------------------------ */

  async function requestLogin({ email, password, remember }) {
    // Simulation d'un délai réseau, à supprimer avec le vrai appel.
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Identifiants de démonstration : demo@exemple.fr / motdepasse123
    const isValid = email === 'demo@exemple.fr' && password === 'motdepasse123';

    if (!isValid) {
      throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS' });
    }

    return { token: 'demo-token', remember };
  }

  /* ------------------------------------------------------------------------
   * Gestionnaires d'événements
   * --------------------------------------------------------------------- */

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert();

    // Valide tous les champs et garde ceux qui sont en erreur.
    const invalidInputs = fields
      .map(({ input, validate }) => {
        const message = validate();
        setFieldError(input, message);
        return message ? input : null;
      })
      .filter(Boolean);

    if (invalidInputs.length > 0) {
      invalidInputs[0].focus();
      return;
    }

    setLoading(true);

    try {
      await requestLogin({
        email: emailInput.value.trim(),
        password: passwordInput.value,
        remember: form.elements.remember.checked,
      });

      showAlert(MESSAGES.success, 'success');
      // Redirection après connexion : adaptez l'URL à votre application.
      // window.location.href = '/tableau-de-bord';
    } catch (error) {
      const message =
        error.code === 'INVALID_CREDENTIALS' ? MESSAGES.invalidCredentials : MESSAGES.networkError;

      showAlert(message, 'error');
      setLoading(false);
      passwordInput.focus();
    }
  });

  // Met à jour le message d'erreur pendant la saisie, une fois le champ marqué en erreur.
  fields.forEach(({ input, validate }) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        setFieldError(input, validate());
      }
    });
  });

  // Affiche ou masque le mot de passe.
  toggleButton.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';

    passwordInput.type = isHidden ? 'text' : 'password';
    toggleButton.textContent = isHidden ? 'Masquer' : 'Afficher';
  });
})();
=======
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
>>>>>>> ranya
