# Justified Galleries (Vanilla JS)

A lightweight, dependency-free JavaScript and CSS solution for rendering image galleries in a justified layout, similar to the behavior of the original jQuery-based [JustifiedGallery](https://miromannino.github.io/Justified-Gallery/) plugin — but with full native support for lazy-loading and modern image practices.

## 🔧 Overview

This script applies a justified layout to any gallery container using the `.jgs-gallery` class (or any other selector defined via configuration). It works with a simplified gallery markup structure (not standard WordPress markup):

```html
<div class="jgs-gallery">
  <a href="full.jpg" class="gallery-item">
    <img src="thumb.jpg" width="1024" height="683" loading="lazy" alt="">
  </a>
</div>
```

Images are arranged into rows that fill the container width exactly, preserving their aspect ratios and cropping as needed (via `object-fit: cover`), without stretching or distorting.

## ✅ Key Features

- ✅ Fully native: No jQuery, no dependencies, no build step
- ✅ Designed for WordPress `[gallery]` shortcode markup
- ✅ Works with native lazy-loading (`loading="lazy"`)
- ✅ No forced image loading or layout jank
- ✅ Responsive: Resizes layout on window resize
- ✅ Configurable via `window.JGConfig` global

## ⚙️ Configuration

### Global Defaults

You can set global default configurations that will be used by all galleries unless overridden:

```js
// Set global defaults (optional)
JustifiedGalleries.defaults.rowHeight = 240;
JustifiedGalleries.defaults.gap = 6;
JustifiedGalleries.defaults.strictRowHeight = false;
JustifiedGalleries.defaults.cropTolerance = 0.15;

// Initialize galleries using global defaults
JustifiedGalleries.init({
  selector: '.jgs-gallery'
});
```

### Per-Gallery Configuration

You can also initialize galleries with specific configurations:

```js
JustifiedGalleries.init({
  selector: '.jgs-gallery', // The gallery container selector
  rowHeight: 300,           // Target height for rows (in pixels)
  gap: 8,                   // Gap between images (in pixels)
  strictRowHeight: false,   // If true, enforce exact rowHeight and crop images
  cropTolerance: 0.15       // Max % of image width that can be cropped (only applies if strictRowHeight is true)
});
```

### Multiple Gallery Types

You can initialize different gallery types with different configurations:

```js
// Set global defaults
JustifiedGalleries.defaults.rowHeight = 240;
JustifiedGalleries.defaults.gap = 6;

// Initialize standard galleries with global defaults
JustifiedGalleries.init({ selector: '.jgs-gallery' });

// Initialize special galleries with custom settings
JustifiedGalleries.init({ 
  selector: '.jgs-gallery-large',
  rowHeight: 400,
  gap: 12
});
```

You can call the `init()` function as many times as needed with different selectors and configurations.

## 🧠 How It Works

1. When you call `JustifiedGalleries.init()`, the script scans for gallery containers using the specified selector.
2. Each `<img>` tag must include `width` and `height` attributes so the layout can be calculated immediately (without waiting for image load).
3. Images are grouped into rows based on their aspect ratios to fit the container width.
4. Each row's image widths are scaled proportionally to ensure perfect justification.
5. CSS ensures images are cropped, not stretched, for a clean presentation.
6. The layout automatically reflows responsively on window resize (with throttling) - **no additional event listeners needed**.

## 🖼 Requirements

- All `<img>` tags **must** have valid `width` and `height` attributes.
- The script assumes markup follows the `.jgs-gallery > a > img` structure.
- This does not include any lightbox, zoom, or click behavior — those are handled elsewhere.

## 🚫 Limitations

- This script does not auto-detect image dimensions.
- Does not support older browsers or legacy polyfills.
- Images are visually cropped to preserve justification.

## 📁 Files

- `justified-galleries.js` – main script

There is no separate CSS file. All necessary layout, spacing, and cropping styles are injected directly by the script using inline styles. This approach avoids the limitations of CSS-based gaps and ensures perfect justification across all rows.

## 📌 TODO (For Development)

- Add optional debug mode for visualizing row groupings
- Expose resize trigger manually for SPA compatibility

## 🚀 Usage Instructions

### 1. Include the Script

Include the JavaScript file just before `</body>` or with `defer` in the `<head>`:

```html
<script src="/path/to/justified-galleries.js" defer></script>
```

### 2. Initialize the Script

Call the `JustifiedGalleries.init()` function after the DOM has loaded:

```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    JustifiedGalleries.init({
      selector: '.jgs-gallery',
      rowHeight: 280,
      gap: 10,
      strictRowHeight: false,
      cropTolerance: 0.15
    });
  });
</script>
```

**Note:** The script automatically handles window resize events with throttling. You don't need to add any additional event listeners for responsive behavior.

### 3. Use Proper Markup

Each gallery should follow this structure:

```html
<div class="jgs-gallery">
  <a href="full1.jpg" class="gallery-item">
    <img src="thumb1.jpg" width="1024" height="683" loading="lazy" alt="">
  </a>
  <a href="full2.jpg" class="gallery-item">
    <img src="thumb2.jpg" width="800" height="533" loading="lazy" alt="">
  </a>
  <!-- more items... -->
</div>
```

**Important:** All `<img>` elements must include `width` and `height` attributes so the layout can be calculated without forcing the images to load.

### 4. Multiple Galleries

You can place as many `.jgs-gallery` containers on the page as needed. The script will apply layout logic to each one independently.
