const counts = { adults: 2, children: 0 };

// ── Counter buttons ───────────────────────────────────────────────────────────
function adjust(key, delta) {
  const min = key === 'adults' ? 1 : 0;
  counts[key] = Math.max(min, counts[key] + delta);
  document.getElementById(key + '-val').textContent = counts[key];
  document.getElementById('f-' + key).value = counts[key];
}

// ── Trip-type chips ───────────────────────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('f-trip-type').value = chip.dataset.val;
  });
});

// ── Validation helpers ────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows digits, +, spaces, dashes, parentheses (international formats)
const PHONE_ALLOWED = /^[0-9+\s\-()\-]*$/;

function showError(inputEl, msgEl, message) {
  inputEl.classList.add('error');
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.style.display = 'block';
  }
}

function clearError(inputEl, msgEl) {
  inputEl.classList.remove('error');
  if (msgEl) msgEl.style.display = 'none';
}

function validateEmail() {
  const el  = document.getElementById('f-email');
  const msg = document.getElementById('email-error');
  if (el.value && !EMAIL_REGEX.test(el.value)) {
    showError(el, msg, 'Please enter a valid email address.');
    return false;
  }
  clearError(el, msg);
  return true;
}

function validatePhone() {
  const el  = document.getElementById('f-phone');
  const msg = document.getElementById('phone-error');
  if (el.value && !PHONE_ALLOWED.test(el.value)) {
    showError(el, msg, 'Phone number must contain only digits.');
    return false;
  }
  clearError(el, msg);
  return true;
}

// ── Phone: block non-numeric keys & clean pasted text ────────────────────────
const phoneInput = document.getElementById('f-phone');

phoneInput.setAttribute('inputmode', 'numeric');
phoneInput.setAttribute('pattern', '[0-9+\\s\\-()]*');

phoneInput.addEventListener('keypress', e => {
  if (!/[0-9+\s\-()\-]/.test(e.key)) e.preventDefault();
});

phoneInput.addEventListener('input', () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9+\s\-()\-]/g, '');
  validatePhone();
});

phoneInput.addEventListener('paste', e => {
  e.preventDefault();
  const pasted  = (e.clipboardData || window.clipboardData).getData('text');
  phoneInput.value = pasted.replace(/[^0-9+\s\-()\-]/g, '');
  validatePhone();
});

// ── Email: validate on input ──────────────────────────────────────────────────
document.getElementById('f-email').addEventListener('input', validateEmail);

// ── Clear error styling on any input/select change ───────────────────────────
const requiredFields = ['f-name', 'f-email', 'f-phone', 'f-date', 'f-pickup'];

document.querySelectorAll('input, select').forEach(el => {
  el.addEventListener('input', () => {
    // Only remove the generic .error class; format errors stay until fixed
    if (el.id !== 'f-email' && el.id !== 'f-phone') {
      el.classList.remove('error');
    }
  });
});

// ── Form submission ───────────────────────────────────────────────────────────
function submitForm() {
  let valid = true;

  // 1. Required-field presence check
  requiredFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('error');
      valid = false;
    } else {
      // Don't clear email/phone yet — format checks run next
      if (id !== 'f-email' && id !== 'f-phone') el.classList.remove('error');
    }
  });

  // 2. Format checks
  if (!validateEmail()) valid = false;
  if (!validatePhone())  valid = false;

  if (!valid) return;

  const form     = document.getElementById('inquiry-form');
  const formData = new FormData(form);

  // Disable button to prevent double submission
  const btn = document.querySelector('.submit-btn');
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  fetch(form.action, {
    method: 'POST',
    headers: { 'X-CSRFToken': formData.get('csrfmiddlewaretoken') },
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'flex';
        // Close modal when clicking the dark backdrop
        modal.addEventListener('click', function handleBackdrop(e) {
          if (e.target === modal) {
            resetForm();
            modal.removeEventListener('click', handleBackdrop);
          }
        });
      } else {
        console.error('Form errors:', data.errors);
        alert('Please check your details and try again.');
        btn.disabled    = false;
        btn.textContent = 'Send Inquiry →';
      }
    })
    .catch(err => {
      console.error('Submission error:', err);
      alert('Something went wrong. Please try again.');
      btn.disabled    = false;
      btn.textContent = 'Send Inquiry →';
    });
}

// ── Reset form ────────────────────────────────────────────────────────────────
function resetForm() {
  document.getElementById('success-modal').style.display = 'none';
  document.getElementById('inquiry-form').reset();

  counts.adults   = 2;
  counts.children = 0;
  document.getElementById('adults-val').textContent  = 2;
  document.getElementById('children-val').textContent = 0;
  document.getElementById('f-adults').value   = 2;
  document.getElementById('f-children').value = 0;

  document.querySelectorAll('.chip').forEach((c, i) => {
    c.classList.toggle('active', i === 0);
  });
  document.getElementById('f-trip-type').value = 'cultural';

  // Clear all validation states
  document.querySelectorAll('input, select').forEach(el => el.classList.remove('error'));
  ['email-error', 'phone-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const btn       = document.querySelector('.submit-btn');
  btn.disabled    = false;
  btn.textContent = 'Send Inquiry →';
}