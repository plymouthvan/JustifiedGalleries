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
- ✅ Compatible with WordPress `[gallery]` shortcodes (with small functions.php modification)
- ✅ Works with native lazy-loading (`loading="lazy"`)
- ✅ No forced image loading or layout jank
- ✅ Responsive: Resizes layout on window resize
- ✅ Configurable via `window.JGConfig` global

## ⚙️ Configuration

### Configuration Options Reference

All configuration options with their default values and detailed explanations:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selector` | String | `'.jgs-gallery'` | CSS selector for gallery containers. The script will process all elements matching this selector. |
| `rowHeight` | Number | `300` | Target height in pixels for each row of images. Images will be scaled to approximately this height while maintaining aspect ratios. |
| `gap` | Number | `8` | Space in pixels between images, both horizontally and vertically. Applied as margins between images. |
| `strictRowHeight` | Boolean | `false` | **Currently unused in implementation.** Reserved for future feature to enforce exact row heights with cropping. |
| `cropTolerance` | Number | `0.15` | **Currently unused in implementation.** Reserved for future feature to control maximum crop percentage when `strictRowHeight` is enabled. |

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
  strictRowHeight: false,   // Reserved for future use
  cropTolerance: 0.15       // Reserved for future use
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

### Configuration Examples

**Compact gallery with small images:**
```js
JustifiedGalleries.init({
  selector: '.compact-gallery',
  rowHeight: 180,
  gap: 4
});
```

**Large hero gallery:**
```js
JustifiedGalleries.init({
  selector: '.hero-gallery',
  rowHeight: 500,
  gap: 16
});
```

**Tight grid with no gaps:**
```js
JustifiedGalleries.init({
  selector: '.tight-gallery',
  rowHeight: 250,
  gap: 0
});
```

### API Methods

The script provides several methods for managing galleries dynamically:

| Method | Parameters | Description |
|--------|------------|-------------|
| `JustifiedGalleries.init(config)` | `config` (Object) | Initialize galleries with the specified configuration. Can be called multiple times with different selectors. |
| `JustifiedGalleries.reset(container)` | `container` (Element) | Reset and re-layout a specific gallery container. Useful when gallery content changes dynamically. |
| `JustifiedGalleries.resetAll()` | None | Reset and re-layout all initialized galleries. Clears all styles and re-processes all galleries. |
| `JustifiedGalleries.refreshAllGalleries()` | None | Immediately refresh all galleries (used internally for resize events). Forces immediate re-layout without waiting. |

**API Usage Examples:**

```js
// Initialize a gallery
JustifiedGalleries.init({
  selector: '.my-gallery',
  rowHeight: 300,
  gap: 10
});

// Reset a specific gallery after adding/removing images
const galleryContainer = document.querySelector('.my-gallery');
JustifiedGalleries.reset(galleryContainer);

// Reset all galleries (useful after major layout changes)
JustifiedGalleries.resetAll();

// Force immediate refresh of all galleries
JustifiedGalleries.refreshAllGalleries();
```

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

## 🔗 WordPress Integration

WordPress native `[gallery]` shortcodes don't generate the markup structure that JustifiedGalleries expects. To use this script with WordPress galleries, you'll need to customize the gallery output.

### Adding the Custom Function

Add the following code to your WordPress theme's `functions.php` file:

```php
add_filter('post_gallery', 'custom_justified_gallery_output', 10, 2);

function custom_justified_gallery_output($output, $atts) {
  $ids = explode(',', $atts['ids']);
  
  // Allow custom class via shortcode attribute, default to 'jgs-gallery'
  $gallery_class = isset($atts['class']) ? esc_attr($atts['class']) : 'jgs-gallery';
  
  // Allow custom image size via shortcode attribute, default to 'large'
  $image_size = isset($atts['size']) ? esc_attr($atts['size']) : 'large';
  
  $html = "<div class='{$gallery_class}'>";
  
  foreach ($ids as $id) {
    $img = wp_get_attachment_image_src($id, $image_size);
    $full = wp_get_attachment_image_src($id, 'full');
    if (!$img || !$full) continue;
    
    $src = esc_url($img[0]);
    $width = intval($img[1]);
    $height = intval($img[2]);
    $href = esc_url($full[0]);
    $alt = esc_attr(get_post_meta($id, '_wp_attachment_image_alt', true));
    
    $html .= "<a href='{$href}' class='gallery-item'><img src='{$src}' alt='{$alt}' loading='lazy' width='{$width}' height='{$height}' /></a>";
  }
  
  $html .= '</div>';
  return $html;
}
```

### How It Works

This custom function:
- **Intercepts** WordPress `[gallery]` shortcode output before it's rendered
- **Converts** the default WordPress gallery markup to the structure JustifiedGalleries expects
- **Uses** the 'large' image size for display (optimized for web viewing)
- **Links** to the 'full' size image (perfect for lightboxes or full-screen viewing)
- **Includes** proper `width` and `height` attributes required by the script
- **Preserves** alt text and implements lazy loading for performance

### Implementation Steps

1. **Add the function** to your active theme's `functions.php` file
2. **Include the JustifiedGalleries script** in your theme (see Usage Instructions above)
3. **Initialize the script** in your theme's JavaScript
4. **Use standard WordPress galleries** - just add `[gallery ids="1,2,3,4"]` to your posts/pages

### WordPress Gallery Usage

Once implemented, you can use WordPress galleries with optional custom classes and image sizes:

**Standard gallery (uses default `.jgs-gallery` class and 'large' image size):**
```
[gallery ids="123,124,125,126"]
```

**Custom gallery class for different configurations:**
```
[gallery class="big-gallery" ids="123,124,125,126"]
[gallery class="small-gallery" ids="127,128,129,130"]
```

**Custom image size (useful for performance optimization):**
```
[gallery size="medium_large" ids="123,124,125,126"]
[gallery size="thumbnail" ids="127,128,129,130"]
```

**Combined custom class and size:**
```
[gallery class="hero-gallery" size="full" ids="123,124,125,126"]
[gallery class="thumbnail-grid" size="medium" ids="127,128,129,130"]
```

**Available WordPress Image Sizes:**
- `thumbnail` - Default 150px × 150px (cropped)
- `medium` - Default 300px × 300px (max height/width)
- `medium_large` - Default 768px × 0 (max width, unlimited height)
- `large` - Default 1024px × 1024px (max height/width) - **Default**
- `full` - Original uploaded image size
- Custom sizes defined by your theme

**JavaScript initialization for multiple gallery types:**
```js
// Initialize different gallery types with custom settings
JustifiedGalleries.init({ 
  selector: '.jgs-gallery',  // Default galleries
  rowHeight: 280,
  gap: 8
});

JustifiedGalleries.init({ 
  selector: '.big-gallery',  // Large galleries
  rowHeight: 400,
  gap: 12
});

JustifiedGalleries.init({ 
  selector: '.small-gallery', // Compact galleries
  rowHeight: 200,
  gap: 4
});
```

The custom function will automatically generate the proper markup structure with your specified class and image size, and JustifiedGalleries will handle the layout based on your configurations.
