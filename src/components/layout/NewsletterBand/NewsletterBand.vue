<script setup lang="ts">
/**
 * NewsletterBand — the orange "Connect with Us" band between the page and the
 * footer, as drawn in the premium design.
 *
 * There is no list provider and the CSP allows `form-action 'self'` only, so
 * submitting composes a subscribe request in the visitor's own mail client (see
 * data/newsletter.ts). Consent is a real, required, unticked checkbox.
 */
import { computed, ref } from 'vue'
import { CONTACT } from '@/lib/constants'
import { NEWSLETTER_COPY as copy } from '@/data/newsletter'

const email = ref('')
const consent = ref(false)
const error = ref('')
const sent = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)
const consentInput = ref<HTMLInputElement | null>(null)

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const draft = computed(
  () =>
    `mailto:${CONTACT.general}` +
    `?subject=${encodeURIComponent(copy.mailSubject)}` +
    `&body=${encodeURIComponent(`${copy.mailBody}\n\n${email.value.trim()}`)}`,
)

function submit() {
  sent.value = false
  if (!EMAIL.test(email.value.trim())) {
    error.value = copy.errors.email
    emailInput.value?.focus()
    return
  }
  if (!consent.value) {
    error.value = copy.errors.consent
    consentInput.value?.focus()
    return
  }
  error.value = ''
  sent.value = true
  window.location.href = draft.value
}
</script>

<template>
  <section class="band" aria-labelledby="newsletter-title">
    <div class="band__inner">
      <h2 id="newsletter-title" class="band__title">{{ copy.title }}</h2>
      <form novalidate @submit.prevent="submit">
        <div class="band__row">
          <label class="band__field">
            {{ copy.emailLabel }} *
            <input
              ref="emailInput"
              v-model="email"
              type="email"
              autocomplete="email"
              :placeholder="copy.emailPlaceholder"
              aria-required="true"
              :aria-invalid="error === copy.errors.email ? 'true' : undefined"
              class="band__input"
              @input="error = ''"
            />
          </label>
          <button type="submit" class="band__submit">
            {{ copy.submit }} <span class="band__arrow" aria-hidden="true">→</span>
          </button>
        </div>
        <label class="band__consent">
          <input
            ref="consentInput"
            v-model="consent"
            type="checkbox"
            aria-required="true"
            :aria-invalid="error === copy.errors.consent ? 'true' : undefined"
            class="band__check"
            @change="error = ''"
          />
          {{ copy.consentLabel }} *
        </label>
        <p v-if="error" class="band__error" role="alert">{{ error }}</p>
        <p class="visually-hidden" aria-live="polite">{{ sent ? copy.sent : '' }}</p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.band {
  background: var(--orange);
}

.band__inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 56px 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: 44px;
  align-items: center;
}

.band__title {
  font-family: var(--font-body);
  font-size: 30px;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.02em;
  color: var(--black);
  font-variation-settings: normal;
}

.band__row {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}

.band__field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: min(220px, 100%);
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
}

.band__input {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid var(--black);
  border-radius: 0;
  background: transparent;
  padding: 9px 0;
  font-size: 20px;
  color: var(--black);
  outline: none;
}

.band__input::placeholder {
  color: var(--placeholder-on-orange);
  opacity: 1;
}

.band__input:focus-visible {
  box-shadow: 0 1px 0 0 var(--black);
}

.band__submit {
  background: var(--black);
  color: var(--paper);
  border: none;
  padding: 15px 30px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.band__submit:hover {
  background: var(--black-hover);
}

.band__submit:focus-visible,
.band__check:focus-visible {
  outline-color: var(--black);
}

.band__arrow {
  font-size: 15px;
}

.band__consent {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  font-size: 15px;
  color: var(--black);
  cursor: pointer;
}

.band__check {
  width: 18px;
  height: 18px;
  accent-color: var(--black);
  cursor: pointer;
}

.band__error {
  margin-top: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--black);
}

@media (max-width: 640px) {
  .band__inner {
    padding: 48px 20px;
  }
}
</style>
