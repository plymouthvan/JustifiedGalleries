/**
 * Justified Galleries - Vanilla JS
 * A lightweight, dependency-free JavaScript solution for rendering image galleries
 * in a justified layout with native lazy-loading support.
 */

(function() {
  'use strict';

  // Internal fallback configuration (immutable)
  const FALLBACK_CONFIG = {
    selector: '.jgs-gallery',
    rowHeight: 300,
    gap: 8,
    strictRowHeight: false,
    cropTolerance: 0.15
  };

  // Throttle utility function
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function(...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Validate markup and collect valid images
  function validateAndCollectImages(container) {
    const validImages = [];
    const galleryItems = container.querySelectorAll('a.gallery-item');
    
    galleryItems.forEach((link, index) => {
      // Check if link is direct child of container
      if (link.parentElement !== container) {
        console.warn(`JustifiedGalleries: Gallery item ${index} is not a direct child of container`);
        return;
      }
      
      // Check for img as direct child of link
      const img = link.querySelector('img');
      if (!img || img.parentElement !== link) {
        console.warn(`JustifiedGalleries: Gallery item ${index} missing direct img child`);
        return;
      }
      
      // Validate width/height attributes
      const width = parseInt(img.getAttribute('width'));
      const height = parseInt(img.getAttribute('height'));
      
      if (!width || !height || width <= 0 || height <= 0) {
        console.warn(`JustifiedGalleries: Image ${index} missing valid width/height attributes`);
        return;
      }
      
      // Image passed all validations
      validImages.push({
        img: img,
        link: link,
        width: width,
        height: height,
        aspectRatio: width / height
      });
    });
    
    return validImages;
  }

  // Calculate rows of images for justified layout
  function calculateRows(images, containerWidth, config) {
    const rows = [];
    let currentRow = [];
    let currentRowWidth = 0;
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      // Calculate width at target row height
      const imageWidthAtRowHeight = image.aspectRatio * config.rowHeight;
      
      // Check if adding this image would exceed container width
      const gapsInRow = currentRow.length; // gaps needed if we add this image
      const totalGapWidth = gapsInRow * config.gap;
      const projectedRowWidth = currentRowWidth + imageWidthAtRowHeight + (gapsInRow > 0 ? config.gap : 0);
      
      // If this would exceed container width and we have images in current row, finish the row
      if (projectedRowWidth > containerWidth && currentRow.length > 0) {
        rows.push([...currentRow]);
        currentRow = [image];
        currentRowWidth = imageWidthAtRowHeight;
      } else {
        // Add image to current row
        currentRow.push(image);
        currentRowWidth += imageWidthAtRowHeight + (currentRow.length > 1 ? config.gap : 0);
      }
    }
    
    // Add the last row if it has images
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
    
    return rows;
  }

  // Distribute widths with pixel-perfect alignment
  function distributeRowWidths(row, targetTotalWidth, gap) {
    const availableWidth = targetTotalWidth - ((row.length - 1) * gap);
    
    // Calculate scale factor to fit available width
    const totalAspectRatio = row.reduce((sum, img) => sum + img.aspectRatio, 0);
    const scaleFactor = availableWidth / totalAspectRatio;
    
    // Calculate ideal widths and floor them
    const flooredWidths = row.map(img => Math.floor(img.aspectRatio * scaleFactor));
    const totalFlooredWidth = flooredWidths.reduce((sum, w) => sum + w, 0);
    
    // Calculate leftover pixels and assign to last image
    const leftoverPixels = availableWidth - totalFlooredWidth;
    flooredWidths[flooredWidths.length - 1] += leftoverPixels;
    
    return flooredWidths;
  }

  // Clear all inline styles from container and its elements
  function clearStyles(container) {
    // Clear container styles
    container.style.display = '';
    container.style.flexWrap = '';
    container.style.alignItems = '';
    
    // Clear all image and link styles
    const images = container.querySelectorAll('img');
    const links = container.querySelectorAll('a.gallery-item');
    
    images.forEach(img => {
      img.style.objectFit = '';
      img.style.display = '';
      img.style.width = '';
      img.style.height = '';
      img.style.marginRight = '';
      img.style.marginBottom = '';
      img.style.boxSizing = '';
    });
    
    links.forEach(link => {
      link.style.display = '';
      link.style.lineHeight = '';
    });
  }

  // Apply inline styles to elements
  function applyImageStyles(img, width, height, marginRight, gap) {
    img.style.objectFit = 'cover';
    img.style.display = 'block';
    img.style.width = width + 'px';
    img.style.height = height + 'px';
    img.style.marginRight = marginRight + 'px';
    img.style.marginBottom = gap + 'px';
    img.style.boxSizing = 'border-box';
  }

  function applyLinkStyles(link) {
    link.style.display = 'block';
    link.style.lineHeight = '0';
  }

  function applyContainerStyles(container) {
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.alignItems = 'flex-start';
  }

  // Apply calculated layout to DOM
  function applyLayout(container, rows, config) {
    const containerWidth = container.getBoundingClientRect().width;
    
    // Apply container styles
    applyContainerStyles(container);
    
    rows.forEach((row, rowIndex) => {
      // Calculate distributed widths for this row
      const widths = distributeRowWidths(row, containerWidth, config.gap);
      
      // Calculate unified row height once for the entire row
      const totalAspectRatio = row.reduce((sum, img) => sum + img.aspectRatio, 0);
      const availableWidth = containerWidth - ((row.length - 1) * config.gap);
      const scaleFactor = availableWidth / totalAspectRatio;
      const unifiedRowHeight = Math.round(scaleFactor);
      
      // Apply styles to each image in the row using unified height
      row.forEach((imageData, imageIndex) => {
        const width = widths[imageIndex];
        const height = unifiedRowHeight; // Same height for all images in this row
        const isLastInRow = imageIndex === row.length - 1;
        const marginRight = isLastInRow ? 0 : config.gap;
        
        // Apply styles to image and link
        applyImageStyles(imageData.img, width, height, marginRight, config.gap);
        applyLinkStyles(imageData.link);
      });
    });
  }

  // Process individual gallery container
  function processGallery(container, config, forceReset = false) {
    // Check duplicate initialization (skip if forcing reset)
    if (container.dataset.jgProcessed === 'true' && !forceReset) {
      return;
    }
    
    // Clear existing styles if this is a reset
    if (forceReset || container.dataset.jgProcessed === 'true') {
      clearStyles(container);
    }
    
    // Check container width
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    if (containerWidth <= 0) {
      console.warn('JustifiedGalleries: Container has zero width, skipping layout');
      
      // Retry after next animation frame
      requestAnimationFrame(() => {
        delete container.dataset.jgProcessed;
        processGallery(container, config, true);
      });
      
      return;
    }
    
    // Always re-validate markup and collect fresh image data
    const validImages = validateAndCollectImages(container);
    if (validImages.length === 0) {
      console.warn('JustifiedGalleries: No valid images found in container');
      return;
    }
    
    // Calculate rows with fresh container width
    const rows = calculateRows(validImages, containerWidth, config);
    
    // Apply layout
    applyLayout(container, rows, config);
    
    // Mark as processed
    container.dataset.jgProcessed = 'true';
  }

  // Resize handler with throttling
  const handleResize = throttle(() => {
    // Use refreshAllGalleries() for immediate reprocessing
    if (window.JustifiedGalleries && window.JustifiedGalleries._galleryConfigs.length > 0) {
      window.JustifiedGalleries.refreshAllGalleries();
    }
  }, 250);

  // Main JustifiedGalleries object
  window.JustifiedGalleries = {
    // Store all gallery configurations for resize handling
    _galleryConfigs: [],
    
    // Public defaults that users can modify
    defaults: Object.assign({}, FALLBACK_CONFIG),
    
    // Initialize galleries
    init: function(userConfig = {}) {
      try {
        // Merge user config with public defaults
        const config = Object.assign({}, this.defaults, userConfig);
        
        // Check if this selector already exists in our configs
        const existingIndex = this._galleryConfigs.findIndex(gc => gc.selector === config.selector);
        
        if (existingIndex >= 0) {
          // Update existing config
          this._galleryConfigs[existingIndex] = { selector: config.selector, config: config };
        } else {
          // Add new config
          this._galleryConfigs.push({ selector: config.selector, config: config });
        }
        
        // Find and process gallery containers for this specific selector
        const containers = document.querySelectorAll(config.selector);
        
        if (containers.length === 0) {
          console.warn(`JustifiedGalleries: No containers found with selector "${config.selector}"`);
          return;
        }
        
        // Process each container
        containers.forEach(container => {
          processGallery(container, config);
        });
        
        // Set up resize handler (only once)
        if (!this._resizeHandlerAttached) {
          window.addEventListener('resize', handleResize);
          this._resizeHandlerAttached = true;
        }
        
        console.log(`JustifiedGalleries: Initialized ${containers.length} galleries with selector "${config.selector}"`);
        
      } catch (error) {
        console.error('JustifiedGalleries initialization failed:', error);
      }
    },
    
    // Reset a specific gallery (useful for dynamic content)
    reset: function(container) {
      if (container && container.dataset.jgProcessed === 'true') {
        clearStyles(container);
        delete container.dataset.jgProcessed;
        
        // Find the appropriate config for this container
        const matchingConfig = this._galleryConfigs.find(gc => 
          container.matches(gc.selector)
        );
        
        if (matchingConfig) {
          processGallery(container, matchingConfig.config, true);
        }
      }
    },
    
    // Reset all galleries
    resetAll: function() {
      // Clear styles and processed flags for all galleries
      this._galleryConfigs.forEach(galleryConfig => {
        const containers = document.querySelectorAll(galleryConfig.selector);
        containers.forEach(container => {
          clearStyles(container);
          delete container.dataset.jgProcessed;
        });
      });
      
      // Re-initialize all configurations
      this._galleryConfigs.forEach(galleryConfig => {
        const containers = document.querySelectorAll(galleryConfig.selector);
        containers.forEach(container => {
          processGallery(container, galleryConfig.config);
        });
      });
    },
    
    // Refresh all galleries immediately (for resize events)
    refreshAllGalleries: function() {
      if (this._galleryConfigs.length === 0) {
        console.warn('JustifiedGalleries: No gallery configs available for refresh');
        return;
      }
      
      let totalRefreshed = 0;
      
      // Process each stored gallery configuration
      this._galleryConfigs.forEach(galleryConfig => {
        const containers = document.querySelectorAll(galleryConfig.selector);
        
        containers.forEach(container => {
          // Clear styles and processed flag
          clearStyles(container);
          delete container.dataset.jgProcessed;
          
          // Immediately re-process with force reset using the correct config
          processGallery(container, galleryConfig.config, true);
          totalRefreshed++;
        });
      });
      
      console.log(`JustifiedGalleries: Refreshed ${totalRefreshed} galleries across ${this._galleryConfigs.length} configurations`);
    }
  };

})();
