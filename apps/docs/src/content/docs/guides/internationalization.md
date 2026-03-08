---
title: Internationalization (i18n)
description: Translate Traek's UI into any language with built-in locale bundles or custom translations.
---

Traek ships with a complete i18n system that lets you display the canvas UI in any language. All user-facing strings are extracted into locale bundles that you can swap or override without touching library code.

## Built-in Locales

Traek includes five locale bundles out of the box:

| Locale | Language          | Import key |
|--------|-------------------|------------|
| `en`   | English (default) | `DEFAULT_TRANSLATIONS` |
| `de`   | Deutsch           | `de` |
| `fr`   | Français          | `fr` |
| `ja`   | 日本語             | `ja` |
| `zh`   | 简体中文            | `zh` |

## Svelte

### Using a built-in locale

Wrap your canvas with `TraekI18nProvider` and pass the desired locale bundle as `translations`:

```svelte
<script lang="ts">
  import { TraekCanvas, TraekI18nProvider, de } from '@traek/svelte';
</script>

<TraekI18nProvider translations={de}>
  <TraekCanvas {engine} {onSendMessage} />
</TraekI18nProvider>
```

### Overriding individual strings

Pass a partial object — only the keys you provide are overridden; everything else falls back to English defaults:

```svelte
<script lang="ts">
  import { TraekCanvas, TraekI18nProvider } from '@traek/svelte';

  const customTranslations = {
    input: { placeholder: 'Ask your question…' },
    canvas: { emptyStateTitle: 'No messages yet' }
  };
</script>

<TraekI18nProvider translations={customTranslations}>
  <TraekCanvas {engine} {onSendMessage} />
</TraekI18nProvider>
```

### Combining a locale with overrides

```svelte
<script lang="ts">
  import { TraekCanvas, TraekI18nProvider, mergeTranslations, de } from '@traek/svelte';

  // Start with German, then patch a few strings
  const translations = mergeTranslations({
    ...de,
    input: { ...de.input, placeholder: 'Frag hier…' }
  });
</script>

<TraekI18nProvider {translations}>
  <TraekCanvas {engine} {onSendMessage} />
</TraekI18nProvider>
```

### RTL support

For right-to-left languages (Arabic, Hebrew, etc.) pass `dir="rtl"` to the provider. The `direction` CSS property is inherited by all child components:

```svelte
<TraekI18nProvider translations={arTranslations} dir="rtl">
  <TraekCanvas {engine} {onSendMessage} />
</TraekI18nProvider>
```

### Programmatic context (without the provider component)

You can also call `setTraekI18n` directly inside a Svelte component that is an ancestor of `TraekCanvas`:

```svelte
<script lang="ts">
  import { setTraekI18n, fr } from '@traek/svelte';
  setTraekI18n(fr);
</script>
```

## Vue

### Using a built-in locale

Call `provideTraekI18n` in a parent component's `setup`:

```vue
<script setup lang="ts">
import { provideTraekI18n, ja } from '@traek/vue';
provideTraekI18n({ translations: ja });
</script>

<template>
  <TraekCanvas :engine="engine" :on-send-message="onSendMessage" />
</template>
```

### Overriding individual strings

```vue
<script setup lang="ts">
import { provideTraekI18n } from '@traek/vue';
provideTraekI18n({
  translations: {
    input: { placeholder: '请输入您的问题…' }
  }
});
</script>
```

### RTL support

Wrap the canvas in an element with `dir="rtl"`:

```vue
<template>
  <div dir="rtl">
    <TraekCanvas :engine="engine" :on-send-message="onSendMessage" />
  </div>
</template>
```

## Adding a custom locale

Create a file that satisfies `TraekTranslations` (or `PartialTraekTranslations` for partial overrides):

```ts
// locales/ar.ts  — Arabic example
import type { TraekTranslations } from '@traek/svelte';

export const ar: TraekTranslations = {
  canvas: {
    viewportAriaLabel: 'شجرة المحادثة',
    emptyStateTitle: 'ابدأ محادثة',
    emptyStateSubtitle: 'اكتب رسالة أدناه للبدء',
    regenerateResponse: 'إعادة توليد الرد',
    branchCelebration: 'أنشأت فرعاً! استكشف اتجاهات مختلفة.',
    nodesDeleted: (count) => `تم حذف ${count} عقدة`,
    gestureHintDrag: 'اسحب للتحريك',
    gestureHintZoom: 'قم بالتمرير للتكبير'
  },
  input: {
    placeholder: 'اسأل الخبير...',
    sendAriaLabel: 'إرسال الرسالة',
    branchingFromSelected: 'تفريع من الرسالة المحددة',
    replyingToSelected: 'رد على الرسالة المحددة',
    startingNewConversation: 'بدء محادثة جديدة'
  },
  // ... (provide all required sections)
};
```

Then use it with `dir="rtl"`:

```svelte
<script lang="ts">
  import { TraekCanvas, TraekI18nProvider } from '@traek/svelte';
  import { ar } from './locales/ar';
</script>

<TraekI18nProvider translations={ar} dir="rtl">
  <TraekCanvas {engine} {onSendMessage} />
</TraekI18nProvider>
```

## Pluralization and date/number formatting

The `nodesDeleted`, `resultCount`, and `withDescendants` keys accept functions for pluralization:

```ts
const myLocale: PartialTraekTranslations = {
  canvas: {
    nodesDeleted: (count) =>
      count === 1 ? '1 node deleted' : `${count} nodes deleted`
  },
  fuzzySearch: {
    resultCount: (count) =>
      new Intl.NumberFormat('en').format(count) + (count !== 1 ? ' results' : ' result')
  }
};
```

For date and number formatting, use the standard [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) API inside these functions.

## TypeScript

All locale types are exported from both packages:

```ts
import type { TraekTranslations, PartialTraekTranslations } from '@traek/svelte';
// or
import type { TraekTranslations, PartialTraekTranslations } from '@traek/vue';
```

Use `PartialTraekTranslations` when providing partial overrides — TypeScript will not require you to supply every key. Use `TraekTranslations` when building a complete locale bundle to get exhaustive type-checking.
