/**
 * Progressive enhancements for the Bright House site.
 * Every feature works (or degrades gracefully) without JavaScript.
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/* ---------------------------------------------------------------- Header */
function initHeader() {
  const header = $('[data-header]');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-compact', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ----------------------------------------------------------- Mobile menu */
function initMenu() {
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const header = $('[data-header]');
  if (!toggle || !menu || !header) return;
  const label = $('[data-menu-label]', toggle);

  const setOpen = (open: boolean, returnFocus = true) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.style.setProperty('--menu-top', `${header.getBoundingClientRect().bottom}px`);
      $<HTMLAnchorElement>('a', menu)?.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('[data-menu-link]', menu).forEach((a) => a.addEventListener('click', () => setOpen(false, false)));

  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') {
      // Keep focus inside the header while the menu is open.
      const focusables = [toggle, ...$$<HTMLElement>('a, button', menu)];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => {
    if (e.matches && !menu.hidden) setOpen(false, false);
  });
}

/* ---------------------------------------------------------- Reveal on scroll */
function initReveal() {
  const els = $$('.reveal');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------------------------------------------------------------- FAQ */
function initAccordion() {
  $$<HTMLButtonElement>('[data-accordion-btn]').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls') || '');
    if (!panel) return;
    panel.classList.add('is-collapsed');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-collapsed', open);
    });
  });
}

/* ---------------------------------------------------------------- Lightbox */
function initLightbox() {
  const dialog = $<HTMLDialogElement>('[data-lightbox]');
  const triggers = $$<HTMLButtonElement>('[data-lightbox-open]');
  if (!dialog || !triggers.length || typeof dialog.showModal !== 'function') return;
  const img = $<HTMLImageElement>('[data-lightbox-img]', dialog)!;
  const caption = $('[data-lightbox-caption]', dialog)!;
  const count = $('[data-lightbox-count]', dialog)!;
  let current = 0;
  let opener: HTMLElement | null = null;

  const render = (i: number) => {
    current = (i + triggers.length) % triggers.length;
    const t = triggers[current];
    img.src = t.dataset.full || '';
    img.alt = t.dataset.alt || '';
    caption.textContent = t.dataset.caption || '';
    count.textContent = `${current + 1} / ${triggers.length}`;
  };

  triggers.forEach((t, i) =>
    t.addEventListener('click', () => {
      opener = t;
      render(i);
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    }),
  );
  $('[data-lightbox-close]', dialog)?.addEventListener('click', () => dialog.close());
  $('[data-lightbox-prev]', dialog)?.addEventListener('click', () => render(current - 1));
  $('[data-lightbox-next]', dialog)?.addEventListener('click', () => render(current + 1));
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });
  // Click on the backdrop area closes the viewer
  dialog.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === dialog || target.classList.contains('lightbox__inner')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    opener?.focus();
  });
}

/* ------------------------------------------------ Service → quote preselect */
function initServiceLinks() {
  const select = $<HTMLSelectElement>('#f-service');
  const contact = $('#contact');
  if (!select || !contact) return;

  const choose = (id: string | null) => {
    if (!id) return false;
    const option = Array.from(select.options).find((o) => o.dataset.id === id);
    if (!option) return false;
    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  $$<HTMLAnchorElement>('[data-service]').forEach((a) =>
    a.addEventListener('click', (e) => {
      if (!choose(a.dataset.service || null)) return;
      e.preventDefault();
      contact.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      history.replaceState(null, '', '#contact');
      window.setTimeout(() => $<HTMLInputElement>('#f-name')?.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 700);
    }),
  );

  // Support links from other pages: /?service=deep#contact
  const param = new URLSearchParams(location.search).get('service');
  if (choose(param)) history.replaceState(null, '', location.pathname + location.hash);
}

/* ------------------------------------------------------------ Quote form */
function initForm() {
  const form = $<HTMLFormElement>('[data-quote-form]');
  if (!form) return;
  // Custom inline validation replaces the browser's; without JS the native checks still apply.
  form.noValidate = true;
  const summary = $('[data-error-summary]', form)!;
  const list = $('[data-error-list]', form)!;
  let attempted = false;

  const date = $<HTMLInputElement>('#f-date', form);
  if (date) {
    const d = new Date();
    date.min = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const fields = $$<Field>('[data-label]', form);

  const validate = (el: Field): string => {
    const value = el.value.trim();
    const label = el.dataset.label || 'This field';
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      return el.required && !el.checked ? 'Please confirm we may contact you about your quote.' : '';
    }
    if (el.required && !value) {
      if (el instanceof HTMLSelectElement) return 'Please choose the service you need.';
      return `Please enter your ${label.toLowerCase()}.`;
    }
    if (!value) return '';
    if (el.name === 'name' && value.length < 2) return 'Please enter your full name.';
    if (el.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
      return 'Please enter a valid email address, like name@example.com.';
    if (el.name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) return 'Please enter a phone number with at least 10 digits.';
    }
    if (el instanceof HTMLInputElement && el.type === 'number') {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0 || n > 20) return `Please enter a number between 0 and 20.`;
    }
    if (el instanceof HTMLInputElement && el.type === 'date' && el.min && value < el.min)
      return 'Please choose a date from today onward.';
    return '';
  };

  const show = (el: Field, message: string) => {
    const err = document.getElementById(`${el.id}-err`);
    if (err) err.textContent = message;
    if (message) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };

  fields.forEach((el) => {
    const evt = el instanceof HTMLInputElement && el.type === 'checkbox' ? 'change' : 'blur';
    el.addEventListener(evt, () => {
      if (attempted || el.value.trim()) show(el, validate(el));
    });
    el.addEventListener('input', () => {
      if (el.getAttribute('aria-invalid') === 'true') show(el, validate(el));
    });
    el.addEventListener('change', () => {
      if (el.getAttribute('aria-invalid') === 'true') show(el, validate(el));
    });
  });

  const renderSummary = (errors: { el: Field; message: string }[]) => {
    list.innerHTML = '';
    errors.forEach(({ el, message }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${el.id}`;
      a.textContent = `${el.dataset.label}: ${message}`;
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        el.focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });
    summary.hidden = errors.length === 0;
  };
  const currentErrors = () => fields.map((el) => ({ el, message: validate(el) })).filter((x) => x.message);

  /* Preferred contact method decides whether phone or email is required.
     Without JavaScript the markup defaults to phone required, email optional. */
  const email = $<HTMLInputElement>('#f-email', form);
  const phone = $<HTMLInputElement>('#f-phone', form);
  const methods = $$<HTMLInputElement>('[data-contact-method]', form);
  const hint = $('[data-method-hint]', form);
  const hints: Record<string, string> = {
    WhatsApp: 'We’ll reply by WhatsApp, so your phone number is required.',
    Phone: 'We’ll reply by phone, so your phone number is required.',
    Email: 'We’ll reply by email, so your email address is required.',
  };

  const setRequired = (el: HTMLInputElement, key: string, required: boolean) => {
    el.required = required;
    el.setAttribute('aria-required', String(required));
    const req = $(`[data-req-for="${key}"]`, form);
    const opt = $(`[data-opt-for="${key}"]`, form);
    if (req) req.hidden = !required;
    if (opt) opt.hidden = required;
    // Re-check: clears an obsolete "required" error, keeps a real format error.
    if (attempted || el.getAttribute('aria-invalid') === 'true') show(el, validate(el));
  };

  const applyMethod = () => {
    const method = methods.find((m) => m.checked)?.value ?? 'WhatsApp';
    const emailRequired = method === 'Email';
    if (email) setRequired(email, 'email', emailRequired);
    if (phone) setRequired(phone, 'phone', !emailRequired);
    if (hint) hint.textContent = hints[method] ?? hints.WhatsApp;
    if (!summary.hidden) renderSummary(currentErrors());
  };
  methods.forEach((m) => m.addEventListener('change', applyMethod));
  applyMethod();

  form.addEventListener('submit', (e) => {
    attempted = true;
    const errors = currentErrors();
    fields.forEach((el) => show(el, validate(el)));

    if (errors.length) {
      e.preventDefault();
      renderSummary(errors);
      errors[0].el.focus();
      return;
    }

    summary.hidden = true;
    const btn = $<HTMLButtonElement>('[data-submit]', form);
    if (btn) {
      btn.disabled = true;
      btn.firstChild!.textContent = 'Sending… ';
    }
  });
}

/* ------------------------------------------------------ Floating WhatsApp */
function initWhatsAppFloat() {
  const btn = $('[data-wa-float]');
  if (!btn || !('IntersectionObserver' in window)) return;
  const hiding = new Set<Element>();

  const update = () => btn.classList.toggle('is-hidden', hiding.size > 0 || document.body.classList.contains('menu-open'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? hiding.add(e.target) : hiding.delete(e.target)));
      update();
    },
    { threshold: 0 },
  );
  // Hidden while a hero (with its own WhatsApp button), the quote form, or the footer is on screen.
  $$('[data-wa-hide]').forEach((el) => io.observe(el));
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

/* ---------------------------------------------------- Active nav highlight */
function initActiveNav() {
  const links = $$<HTMLAnchorElement>('.header__nav a');
  const map = new Map<Element, HTMLAnchorElement>();
  links.forEach((a) => {
    const id = a.hash.slice(1);
    const section = id && document.getElementById(id);
    if (section) map.set(section, a);
  });
  if (!map.size || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  map.forEach((_, section) => io.observe(section));
}

initHeader();
initMenu();
initReveal();
initAccordion();
initLightbox();
initServiceLinks();
initForm();
initWhatsAppFloat();
initActiveNav();
