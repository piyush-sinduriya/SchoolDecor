/* School Decor Architectural — Vanilla JS Storefront Controller */
(function () {
  'use strict';

  const cfg = window.SchoolDecor || { routes: {} };

  // 1. Sticky Header Scroll Shadow
  const header = document.querySelector('[data-header]');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  // 2. Mobile Navigation Drawer
  const mobileDrawer = document.getElementById('sd-mobile-drawer');
  document.querySelectorAll('[data-mobile-menu-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!mobileDrawer) return;
      mobileDrawer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelectorAll('[data-close-mobile-drawer]').forEach((el) => {
    el.addEventListener('click', () => {
      if (!mobileDrawer) return;
      mobileDrawer.hidden = true;
      document.body.style.overflow = '';
    });
  });

  // 3. Big 5-Banner Hero Carousel
  document.querySelectorAll('[data-hero-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) return;

    let current = 0;
    let isPaused = false;
    const goTo = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => {
        const active = i === current;
        d.classList.toggle('is-active', active);
        d.setAttribute('aria-selected', String(active));
      });
    };

    slider.querySelector('[data-hero-prev]')?.addEventListener('click', () => goTo(current - 1));
    slider.querySelector('[data-hero-next]')?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    slider.addEventListener('mouseenter', () => { isPaused = true; });
    slider.addEventListener('mouseleave', () => { isPaused = false; });

    if (slider.dataset.autoplay === 'true') {
      const ms = parseInt(slider.dataset.interval || '6000', 10);
      setInterval(() => {
        if (!isPaused) goTo(current + 1);
      }, ms);
    }
  });

  // 4. Tabbed Sections (Featured Products & PDP Details)
  document.querySelectorAll('[data-tabbed-products], [data-pdp-tabs]').forEach((container) => {
    const triggers = container.querySelectorAll('[data-tab-trigger]');
    const panels = container.querySelectorAll('[data-tab-panel]');
    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.tabTrigger;
        triggers.forEach((t) => {
          const active = t.dataset.tabTrigger === idx;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        panels.forEach((p) => {
          const active = p.dataset.tabPanel === idx;
          p.hidden = !active;
          p.classList.toggle('is-active', active);
        });
      });
    });
  });

  // 5. Predictive Search
  const searchBar = document.getElementById('sd-predictive-search-bar');
  const searchInput = document.querySelector('[data-predictive-input]');
  const searchResults = document.getElementById('sd-predictive-results');

  document.querySelectorAll('[data-search-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!searchBar) return;
      searchBar.hidden = !searchBar.hidden;
      if (!searchBar.hidden && searchInput) searchInput.focus();
    });
  });
  document.querySelectorAll('[data-search-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (searchBar) searchBar.hidden = true;
    });
  });

  if (searchInput && searchResults && cfg.enablePredictiveSearch) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const q = searchInput.value.trim();
      if (q.length < 2) {
        searchResults.hidden = true;
        searchResults.innerHTML = '';
        return;
      }
      debounceTimer = setTimeout(async () => {
        try {
          const base = cfg.routes.predictive_search_url || '/search/suggest';
          const res = await fetch(`${base}.json?q=${encodeURIComponent(q)}&resources[type]=product,collection&resources[limit]=6`);
          if (!res.ok) return;
          const data = await res.json();
          const products = data?.resources?.results?.products || [];
          if (products.length === 0) {
            searchResults.innerHTML = '<p style="margin:0;font-size:0.9rem;color:#525852;">No matching products found.</p>';
          } else {
            searchResults.innerHTML = products.map((p) => `
              <a href="${p.url}" class="sd-pred-card">
                ${p.image ? `<img src="${p.image}" alt="${p.title.replace(/"/g, '&quot;')}">` : ''}
                <div>
                  <strong style="display:block;font-size:0.88rem;">${p.title}</strong>
                  <span style="font-size:0.8rem;color:#525852;">${p.price ? p.price : 'Request Quote'}</span>
                </div>
              </a>
            `).join('');
          }
          searchResults.hidden = false;
        } catch (err) {
          console.error('Predictive search error:', err);
        }
      }, 240);
    });
  }

  // 6. Ajax Cart Drawer
  const cartDrawer = document.getElementById('sd-cart-drawer');
  const openCartDrawer = () => {
    if (!cartDrawer) return;
    cartDrawer.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeCartDrawer = () => {
    if (!cartDrawer) return;
    cartDrawer.hidden = true;
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-cart-drawer]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (!cfg.enableCartDrawer || !cartDrawer) return;
      e.preventDefault();
      openCartDrawer();
    });
  });
  cartDrawer?.querySelectorAll('[data-close-drawer]').forEach((el) => {
    el.addEventListener('click', closeCartDrawer);
  });

  const formatMoney = (cents) => {
    const val = (Number(cents || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₹${val}`;
  };

  const refreshCartDrawer = async () => {
    try {
      const res = await fetch(`${cfg.routes.cart_url || '/cart'}.js`);
      if (!res.ok) return;
      const cart = await res.json();
      document.querySelectorAll('[data-cart-count]').forEach((el) => {
        el.textContent = el.classList.contains('sd-drawer__count') ? `(${cart.item_count})` : String(cart.item_count);
      });
      const bodyEl = document.getElementById('sd-cart-drawer-body');
      const footerEl = document.getElementById('sd-cart-drawer-footer');
      const subtotalEl = document.querySelector('[data-cart-subtotal]');
      if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

      if (bodyEl && footerEl) {
        if (cart.item_count === 0) {
          footerEl.hidden = true;
          bodyEl.innerHTML = `<div class="sd-cart-empty"><p>Your cart is currently empty.</p><a href="/collections/all" class="sd-btn sd-btn--primary" data-close-drawer>Continue Shopping</a></div>`;
        } else {
          footerEl.hidden = false;
          bodyEl.innerHTML = `<ul class="sd-cart-items">${cart.items.map((item, idx) => `
            <li class="sd-cart-item" data-line="${idx + 1}">
              <a href="${item.url}" class="sd-cart-item__img">${item.image ? `<img src="${item.image}" alt="${item.product_title}">` : ''}</a>
              <div class="sd-cart-item__details">
                <a href="${item.url}" class="sd-cart-item__title">${item.product_title}</a>
                ${item.variant_title ? `<p class="sd-cart-item__variant">${item.variant_title}</p>` : ''}
                <p class="sd-cart-item__price">${formatMoney(item.final_line_price)}</p>
                <div class="sd-cart-item__controls">
                  <div class="sd-qty-stepper">
                    <button type="button" class="sd-qty-btn" data-cart-qty="${idx + 1}" data-delta="-1" aria-label="Decrease quantity">-</button>
                    <input type="number" class="sd-qty-input" value="${item.quantity}" min="0" data-cart-qty-input="${idx + 1}">
                    <button type="button" class="sd-qty-btn" data-cart-qty="${idx + 1}" data-delta="1" aria-label="Increase quantity">+</button>
                  </div>
                  <button type="button" class="sd-cart-remove" data-cart-remove="${idx + 1}" aria-label="Remove">Remove</button>
                </div>
              </div>
            </li>
          `).join('')}</ul>`;
        }
      }
    } catch (err) {
      console.error('Cart refresh error:', err);
    }
  };

  const changeCartLine = async (line, quantity) => {
    await fetch(`${cfg.routes.cart_change_url || '/cart/change'}.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: Number(line), quantity: Math.max(0, Number(quantity)) })
    });
    await refreshCartDrawer();
  };

  document.addEventListener('click', async (e) => {
    const addBtn = e.target.closest('[data-quick-add]');
    if (addBtn) {
      const variantId = addBtn.dataset.quickAdd;
      addBtn.disabled = true;
      try {
        const res = await fetch(`${cfg.routes.cart_add_url || '/cart/add'}.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] })
        });
        if (res.ok) {
          await refreshCartDrawer();
          openCartDrawer();
        }
      } finally {
        addBtn.disabled = false;
      }
    }

    const qtyBtn = e.target.closest('[data-cart-qty]');
    if (qtyBtn) {
      const line = qtyBtn.dataset.cartQty;
      const delta = Number(qtyBtn.dataset.delta);
      const input = document.querySelector(`[data-cart-qty-input="${line}"]`);
      const next = Math.max(0, Number(input?.value || 1) + delta);
      await changeCartLine(line, next);
    }

    const remBtn = e.target.closest('[data-cart-remove]');
    if (remBtn) {
      await changeCartLine(remBtn.dataset.cartRemove, 0);
    }
  });

  // PDP Ajax Add to Cart
  const pdpForm = document.getElementById('sd-pdp-form');
  if (pdpForm && cfg.enableCartDrawer) {
    pdpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(pdpForm);
      const res = await fetch(`${cfg.routes.cart_add_url || '/cart/add'}.js`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        await refreshCartDrawer();
        openCartDrawer();
      }
    });
  }

  // 7. Quick View Modal
  const qvModal = document.getElementById('sd-quick-view-modal');
  const qvContent = document.getElementById('sd-quick-view-content');
  document.addEventListener('click', async (e) => {
    const qvBtn = e.target.closest('[data-quick-view]');
    if (!qvBtn || !qvModal || !qvContent) return;
    const handle = qvBtn.dataset.quickView;
    qvModal.hidden = false;
    qvContent.innerHTML = '<div class="sd-qv-loading">Loading product details...</div>';
    try {
      const res = await fetch(`/products/${handle}.js`);
      if (!res.ok) throw new Error('Failed to load product');
      const product = await res.json();
      const firstVariant = product.variants?.[0];
      const isQuote = product.tags?.includes('quote-only') || product.price === 0;
      qvContent.innerHTML = `
        <div class="sd-split" style="gap:28px;">
          <div class="sd-split__media">
            ${product.featured_image ? `<img src="${product.featured_image}" alt="${product.title}">` : ''}
          </div>
          <div class="sd-split__content">
            <p class="sd-eyebrow">${product.type || 'School Decor'}</p>
            <h2 id="sd-qv-title" class="sd-heading">${product.title}</h2>
            <p style="font-weight:700;margin:10px 0;">${isQuote ? 'Custom Institutional Pricing' : formatMoney(product.price)}</p>
            <p style="font-size:0.92rem;color:#525852;">${(product.description || '').replace(/<[^>]+>/g, '').slice(0, 220)}...</p>
            <div class="sd-split__actions">
              ${isQuote || !firstVariant?.available ? `
                <button type="button" class="sd-btn sd-btn--primary" data-open-quote data-product-title="${product.title}" data-product-url="${window.location.origin}${product.url}">Request a Quote</button>
              ` : `
                <button type="button" class="sd-btn sd-btn--primary" data-quick-add="${firstVariant.id}">Add to Cart</button>
              `}
              <a href="${product.url}" class="sd-btn sd-btn--outline">View Full Details</a>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      qvContent.innerHTML = '<p>Unable to load product preview right now. Please open the product page directly.</p>';
    }
  });

  // 8. Request a Quote Modal & Genuine Form Submission
  const quoteModal = document.getElementById('sd-quote-modal');
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-quote]');
    if (trigger && quoteModal) {
      const title = trigger.dataset.productTitle || '';
      const url = trigger.dataset.productUrl || window.location.href;
      const productInput = document.getElementById('sd-quote-product');
      const urlInput = document.getElementById('sd-quote-product-url');
      if (productInput && title) productInput.value = title;
      if (urlInput) urlInput.value = url;
      if (qvModal) qvModal.hidden = true;
      quoteModal.hidden = false;
    }
    if (e.target.closest('[data-close-modal]')) {
      document.querySelectorAll('.sd-modal').forEach((m) => { m.hidden = true; });
    }
  });

  // Optional external webhook submission (never shows fake success on failure)
  document.querySelectorAll('#sd-quote-modal-form, #sd-quote-page-form').forEach((formEl) => {
    if (!cfg.quoteWebhookUrl) return;
    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusBox = formEl.querySelector('[data-quote-status]');
      const btn = formEl.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        const res = await fetch(cfg.quoteWebhookUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(formEl)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (statusBox) {
          statusBox.hidden = false;
          statusBox.className = 'sd-alert sd-alert--success';
          statusBox.textContent = 'Thank you! Your quotation request has been received.';
        }
        formEl.reset();
      } catch (err) {
        if (statusBox) {
          statusBox.hidden = false;
          statusBox.className = 'sd-alert sd-alert--error';
          statusBox.textContent = 'Submission failed. Please try again or contact us via WhatsApp.';
        }
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  });

  // 9. PDP Gallery, Zoom, Variants & Related Products
  const pdpSection = document.querySelector('[data-product-section]');
  if (pdpSection) {
    const thumbs = pdpSection.querySelectorAll('[data-media-thumb]');
    const slides = pdpSection.querySelectorAll('[data-media-id]');
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const id = thumb.dataset.mediaThumb;
        thumbs.forEach((t) => t.classList.toggle('is-active', t.dataset.mediaThumb === id));
        slides.forEach((s) => s.classList.toggle('is-active', s.dataset.mediaId === id));
      });
    });

    const zoomContainer = pdpSection.querySelector('[data-zoom-container]');
    pdpSection.querySelector('[data-toggle-zoom]')?.addEventListener('click', () => {
      zoomContainer?.classList.toggle('is-zoomed');
    });

    pdpSection.querySelectorAll('[data-pdp-qty]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('sd-pdp-qty');
        if (!input) return;
        input.value = String(Math.max(1, Number(input.value || 1) + Number(btn.dataset.pdpQty)));
      });
    });

    pdpSection.querySelector('[data-mobile-sticky-add]')?.addEventListener('click', () => {
      pdpSection.querySelector('[data-pdp-add-btn]')?.click();
    });

    // Variant switching
    const variantsJsonEl = document.getElementById('sd-product-variants-json');
    if (variantsJsonEl) {
      const variants = JSON.parse(variantsJsonEl.textContent || '[]');
      const hiddenId = pdpSection.querySelector('[data-variant-id-input]');
      pdpSection.querySelectorAll('[data-variant-option]').forEach((radio) => {
        radio.addEventListener('change', () => {
          const selected = Array.from(pdpSection.querySelectorAll('fieldset.sd-variant-group')).map((fs) => {
            return fs.querySelector('input:checked')?.value;
          });
          const match = variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
          if (match && hiddenId) {
            hiddenId.value = match.id;
            const addBtn = pdpSection.querySelector('[data-pdp-add-btn]');
            if (addBtn) {
              addBtn.disabled = !match.available;
              addBtn.textContent = match.available ? 'Add to Cart' : 'Currently Unavailable';
            }
          }
        });
      });
    }

    // Related Products Recommendation Fetch
    const recEl = pdpSection.querySelector('[data-product-recommendations]');
    if (recEl && recEl.dataset.url) {
      fetch(recEl.dataset.url)
        .then((r) => r.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const inner = doc.querySelector('[data-product-recommendations]');
          if (inner && inner.innerHTML.trim()) recEl.innerHTML = inner.innerHTML;
        })
        .catch(() => {});
    }

    // Recently Viewed
    const recentWrap = pdpSection.querySelector('[data-recently-viewed]');
    const currentHandle = recentWrap?.dataset.currentHandle;
    if (recentWrap && currentHandle) {
      try {
        const key = 'sd_recently_viewed';
        const stored = JSON.parse(localStorage.getItem(key) || '[]').filter((h) => h !== currentHandle);
        const toShow = stored.slice(0, 4);
        localStorage.setItem(key, JSON.stringify([currentHandle, ...stored].slice(0, 8)));
        if (toShow.length > 0) {
          Promise.all(toShow.map((h) => fetch(`/products/${h}.js`).then((r) => (r.ok ? r.json() : null))))
            .then((prods) => {
              const valid = prods.filter(Boolean);
              const grid = recentWrap.querySelector('[data-recently-viewed-grid]');
              if (valid.length && grid) {
                grid.innerHTML = valid.map((p) => `
                  <article class="sd-product-card">
                    <div class="sd-product-card__media sd-ratio-4-3">
                      <a href="${p.url}" class="sd-product-card__img-link">
                        ${p.featured_image ? `<img src="${p.featured_image}" alt="${p.title}" class="sd-product-card__img" loading="lazy">` : ''}
                      </a>
                    </div>
                    <div class="sd-product-card__info">
                      <h3 class="sd-product-card__title"><a href="${p.url}">${p.title}</a></h3>
                      <div class="sd-product-card__pricing"><span class="sd-price">${p.price === 0 ? 'Request Quote' : formatMoney(p.price)}</span></div>
                    </div>
                  </article>
                `).join('');
                recentWrap.hidden = false;
              }
            });
        }
      } catch (e) {}
    }
  }

  // 10. Collection Sort & Mobile Filters
  document.querySelector('[data-collection-sort]')?.addEventListener('change', (e) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', e.target.value);
    window.location.href = url.toString();
  });
  document.querySelector('[data-toggle-filters]')?.addEventListener('click', () => {
    document.getElementById('sd-filters-sidebar')?.classList.toggle('is-open');
  });

  // 11. Testimonial Slider Navigation
  document.querySelectorAll('[data-testimonial-slider]').forEach((wrap) => {
    const track = wrap.querySelector('[data-slider-track]');
    if (!track) return;
    wrap.querySelector('[data-slider-prev]')?.addEventListener('click', () => {
      track.scrollBy({ left: -360, behavior: 'smooth' });
    });
    wrap.querySelector('[data-slider-next]')?.addEventListener('click', () => {
      track.scrollBy({ left: 360, behavior: 'smooth' });
    });
  });

  // 12. Scroll-Triggered Entry Animations (Theme-Editor & Reduced-Motion Safe)
  const revealNodes = document.querySelectorAll('[data-sd-reveal]');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inDesignMode = Boolean(window.Shopify && window.Shopify.designMode);

  if (revealNodes.length && !reduceMotion && !inDesignMode && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('sd-anim-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealNodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        el.classList.add('is-revealed');
      } else {
        io.observe(el);
      }
    });
  } else {
    revealNodes.forEach((el) => el.classList.add('is-revealed'));
  }

  // 12b. Scroll-Linked Parallax Depth for Cutout Showcase Columns
  const parallaxNodes = Array.from(document.querySelectorAll('[data-sd-parallax]'));
  if (parallaxNodes.length && !reduceMotion && !inDesignMode) {
    let parallaxTicking = false;
    const updateParallax = () => {
      parallaxTicking = false;
      const vh = window.innerHeight || 900;
      parallaxNodes.forEach((el) => {
        const range = parseFloat(el.dataset.sdParallax || '0');
        const rect = el.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, ((rect.top + rect.height * 0.5) / vh - 0.5) * 2));
        el.style.setProperty('--sd-parallax-y', `${(progress * range).toFixed(2)}px`);
      });
    };
    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        parallaxTicking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }, { passive: true });
    updateParallax();
  }

  // 13. Entry Logo Architectural Split-Shutter Controller
  const entryLogoEl = document.querySelector('[data-entry-logo]');
  if (entryLogoEl && !entryLogoEl.hidden) {
    const dismissEntryLogo = () => {
      if (entryLogoEl.classList.contains('is-exiting')) return;
      entryLogoEl.classList.add('is-exiting');
      try {
        window.sessionStorage?.setItem('sd_logo_intro_done', '1');
      } catch (err) {}
      window.setTimeout(() => {
        entryLogoEl.hidden = true;
      }, 380);
    };

    const autoTimer = window.setTimeout(dismissEntryLogo, 720);
    entryLogoEl.querySelector('[data-entry-logo-skip]')?.addEventListener('click', () => {
      window.clearTimeout(autoTimer);
      dismissEntryLogo();
    });
    entryLogoEl.addEventListener('click', (e) => {
      if (e.target === entryLogoEl) {
        window.clearTimeout(autoTimer);
        dismissEntryLogo();
      }
    });
  }

  // 14. Hero Cursor Parallax Stage (rAF throttled)
  const heroEl = document.querySelector('[data-hero-slider]');
  if (heroEl && !reduceMotion && !inDesignMode) {
    const stages = Array.from(heroEl.querySelectorAll('[data-hero-parallax]'));
    if (stages.length) {
      let parallaxMouseRaf = 0;
      let latestClientX = 0;
      let latestClientY = 0;
      heroEl.addEventListener('mousemove', (e) => {
        latestClientX = e.clientX;
        latestClientY = e.clientY;
        if (parallaxMouseRaf) return;
        parallaxMouseRaf = window.requestAnimationFrame(() => {
          parallaxMouseRaf = 0;
          const rect = heroEl.getBoundingClientRect();
          const nx = (latestClientX - rect.left) / Math.max(1, rect.width) - 0.5;
          const ny = (latestClientY - rect.top) / Math.max(1, rect.height) - 0.5;
          stages.forEach((s) => {
            s.style.transform = `translate3d(${(nx * 18).toFixed(1)}px, ${(ny * 14).toFixed(1)}px, 0)`;
          });
        });
      }, { passive: true });
      heroEl.addEventListener('mouseleave', () => {
        if (parallaxMouseRaf) {
          window.cancelAnimationFrame(parallaxMouseRaf);
          parallaxMouseRaf = 0;
        }
        stages.forEach((s) => { s.style.transform = 'translate3d(0, 0, 0)'; });
      });
    }
  }

  // 15. Interactive Color-Shifting Cutout Stage (myfrida.com signature)
  document.querySelectorAll('[data-cutout-stage-section]').forEach((sec) => {
    const tabs = Array.from(sec.querySelectorAll('[data-stage-tab]'));
    const outScript = sec.querySelector('[data-stage-out-script]');
    const outTitle = sec.querySelector('[data-stage-out-title]');
    const outPrice = sec.querySelector('[data-stage-out-price]');
    const outDims = sec.querySelector('[data-stage-out-dims]');
    const outAge = sec.querySelector('[data-stage-out-age]');
    const outMat = sec.querySelector('[data-stage-out-mat]');
    const outImg = sec.querySelector('[data-stage-out-img]');
    const outLink = sec.querySelector('[data-stage-out-link]');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        if (tab.dataset.stageBg) sec.style.setProperty('--sd-section-bg', tab.dataset.stageBg);
        if (outScript) outScript.textContent = tab.dataset.stageScript || '';
        if (outTitle) outTitle.textContent = tab.dataset.stageTitle || '';
        if (outPrice) outPrice.textContent = tab.dataset.stagePrice || '';
        if (outDims) outDims.textContent = tab.dataset.stageDims || '';
        if (outAge) outAge.textContent = tab.dataset.stageAge || '';
        if (outMat) outMat.textContent = tab.dataset.stageMat || '';
        if (outImg && tab.dataset.stageImg) {
          outImg.src = tab.dataset.stageImg;
          outImg.alt = tab.dataset.stageTitle || 'School Decor Product';
        }
        if (outLink && tab.dataset.stageUrl) outLink.setAttribute('href', tab.dataset.stageUrl);
      });
    });
  });

  // 16. Tactile Numbered Process Accordion (webdesign.kernjosh.com signature)
  document.querySelectorAll('[data-process-accordion]').forEach((acc) => {
    const items = Array.from(acc.querySelectorAll('[data-process-item]'));
    const stepLabel = acc.querySelector('[data-process-step-label]');
    const previewImg = acc.querySelector('[data-process-preview-img]');
    const previewTitle = acc.querySelector('[data-process-preview-title]');
    const previewSpecs = acc.querySelector('[data-process-preview-specs]');
    const previewLink = acc.querySelector('[data-process-preview-link]');

    items.forEach((item, idx) => {
      const btn = item.querySelector('[data-process-trigger]');
      btn?.addEventListener('click', () => {
        items.forEach((other, oIdx) => {
          const open = oIdx === idx;
          other.classList.toggle('is-open', open);
          const obtn = other.querySelector('[data-process-trigger]');
          const opanel = other.querySelector('[data-process-panel]');
          obtn?.setAttribute('aria-expanded', String(open));
          if (opanel) opanel.hidden = !open;
        });
        if (stepLabel) stepLabel.textContent = `Step 0${idx + 1} Studio Match`;
        if (previewImg && item.dataset.cutoutSrc) previewImg.src = item.dataset.cutoutSrc;
        if (previewTitle && item.dataset.cutoutTitle) previewTitle.textContent = item.dataset.cutoutTitle;
        if (previewSpecs && item.dataset.cutoutSpecs) previewSpecs.textContent = item.dataset.cutoutSpecs;
        if (previewLink && item.dataset.cutoutLink) previewLink.setAttribute('href', item.dataset.cutoutLink);
      });
    });
  });

  // 17. Top 4-Color Scroll Progress Hairline
  const scrollBar = document.querySelector('[data-sd-scroll-progress]');
  if (scrollBar && !reduceMotion) {
    let scrollTicking = false;
    const updateScrollProgress = () => {
      scrollTicking = false;
      const docEl = document.documentElement;
      const maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      scrollBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateScrollProgress);
      }
    }, { passive: true });
    updateScrollProgress();
  }

  // 18. Smart Campus Room & BOQ Planner Controller
  document.querySelectorAll('[data-smart-planner]').forEach((sec) => {
    const wings = Array.from(sec.querySelectorAll('[data-sp-wing]'));
    const swatches = Array.from(sec.querySelectorAll('[data-sp-finish]'));
    const inLen = sec.querySelector('[data-sp-in-len]');
    const inWid = sec.querySelector('[data-sp-in-wid]');
    const inStu = sec.querySelector('[data-sp-in-stu]');
    const outLen = sec.querySelector('[data-sp-out-len]');
    const outWid = sec.querySelector('[data-sp-out-wid]');
    const outStu = sec.querySelector('[data-sp-out-stu]');
    const outArea = sec.querySelector('[data-sp-out-area]');
    const outFlow = sec.querySelector('[data-sp-out-flow]');
    const outDensity = sec.querySelector('[data-sp-out-density]');
    const outErgo = sec.querySelector('[data-sp-out-ergo]');
    const outFinish = sec.querySelector('[data-sp-out-finish]');
    const outWingTitle = sec.querySelector('[data-sp-out-wing-title]');
    const outUnits = sec.querySelector('[data-sp-out-units]');
    const outTotal = sec.querySelector('[data-sp-out-total]');
    const boqList = sec.querySelector('[data-sp-boq-list]');
    const roomGrid = sec.querySelector('[data-sp-room-grid]');
    const roomBox = sec.querySelector('[data-sp-room-box]');
    const waLink = sec.querySelector('[data-sp-wa-link]');
    const quoteBtn = sec.querySelector('[data-sp-quote-trigger]');
    const resetBtn = sec.querySelector('[data-sp-reset]');

    const deskPrice = Number(sec.dataset.deskPrice || 9450);
    const shelfPrice = Number(sec.dataset.shelfPrice || 16800);
    const climberPrice = Number(sec.dataset.climberPrice || 24500);
    const waPhone = sec.dataset.whatsappNumber || '919312254660';

    let activeWing = wings.find((w) => w.classList.contains('is-active')) || wings[2] || wings[0];
    let activeFinish = swatches.find((s) => s.classList.contains('is-active')) || swatches[0];

    const renderPlan = () => {
      if (!activeWing || !inLen || !inWid || !inStu) return;
      const len = Number(inLen.value);
      const wid = Number(inWid.value);
      const stu = Number(inStu.value);
      const area = len * wid;
      const density = (area / stu).toFixed(1);
      const wingId = activeWing.dataset.spWing;

      if (outLen) outLen.textContent = `${len} ft`;
      if (outWid) outWid.textContent = `${wid} ft`;
      if (outStu) outStu.textContent = String(stu);
      if (outArea) outArea.textContent = `${len} ft × ${wid} ft · ${area} sq.ft`;
      if (outDensity) outDensity.textContent = `${density} sq.ft / student`;
      if (outErgo) outErgo.textContent = activeWing.dataset.ergo || '';
      if (outWingTitle) outWingTitle.textContent = activeWing.querySelector('strong')?.textContent || 'Classroom Kit';

      const flowThreshold = wingId === 'stem-lab' || wingId === 'active-play' ? 28 : 22;
      const flowLabel = Number(density) >= flowThreshold ? 'Spacious Flow' : Number(density) >= 16 ? 'Balanced Layout' : 'Compact Fit';
      if (outFlow) outFlow.textContent = flowLabel;

      const items = [];
      if (wingId === 'stem-lab') {
        const islands = Math.max(2, Math.ceil(stu / 6));
        const bays = Math.max(2, Math.ceil(islands / 2));
        items.push({ qty: islands, title: 'Composite STEM Island Workbench', line: 0, quote: true });
        items.push({ qty: bays, title: 'Instrument Storage Shelf', line: bays * shelfPrice, quote: false });
      } else if (wingId === 'active-play') {
        const sets = Math.max(1, Math.ceil(stu / 10));
        items.push({ qty: sets, title: 'Modular Soft-Play Climber Set', line: sets * climberPrice, quote: false });
        items.push({ qty: 1, title: `Impact Safety Flooring (${area} sq.ft)`, line: 0, quote: true });
      } else if (wingId === 'preschool' || wingId === 'montessori') {
        const shelves = Math.max(2, Math.ceil(stu / 6));
        items.push({ qty: shelves, title: 'Curved Montessori Birch Activity Unit', line: shelves * shelfPrice, quote: false });
        items.push({ qty: 1, title: 'Soft-Play Discovery Corner', line: climberPrice, quote: false });
      } else {
        const shelves = Math.max(1, Math.ceil(stu / 15));
        items.push({ qty: stu, title: 'Ergonomic Birch & Steel Desk Set', line: stu * deskPrice, quote: false });
        items.push({ qty: shelves, title: 'Curved Montessori Resource Unit', line: shelves * shelfPrice, quote: false });
      }

      const totalUnits = items.reduce((s, i) => s + i.qty, 0);
      const totalAmt = items.reduce((s, i) => s + i.line, 0);
      if (outUnits) outUnits.textContent = `${totalUnits} Units`;
      if (outTotal) outTotal.textContent = `₹${totalAmt.toLocaleString('en-IN')}`;

      if (boqList) {
        boqList.innerHTML = items.map((i) => `
          <li>
            <span><strong>${i.qty}×</strong> ${i.title}</span>
            <strong>${i.quote ? 'Custom Quote' : `₹${i.line.toLocaleString('en-IN')}`}</strong>
          </li>
        `).join('');
      }

      if (roomGrid) {
        const visualCount = wingId === 'stem-lab' ? Math.max(2, Math.ceil(stu / 6)) : Math.min(30, stu);
        roomGrid.innerHTML = Array.from({ length: visualCount }).map(() => `<div class="sd-sp-cell"><span></span></div>`).join('');
      }

      const summary = `School Decor Room Brief: ${outWingTitle?.textContent} (${len}x${wid} ft, ${stu} students, ${activeFinish?.dataset.spFinish}) · Est ₹${totalAmt.toLocaleString('en-IN')}`;
      if (quoteBtn) quoteBtn.dataset.productTitle = summary;
      if (waLink) waLink.setAttribute('href', `https://wa.me/${waPhone}?text=${encodeURIComponent(summary)}`);
    };

    wings.forEach((btn) => {
      btn.addEventListener('click', () => {
        activeWing = btn;
        wings.forEach((w) => w.classList.toggle('is-active', w === btn));
        if (inLen && btn.dataset.len) inLen.value = btn.dataset.len;
        if (inWid && btn.dataset.wid) inWid.value = btn.dataset.wid;
        if (inStu && btn.dataset.stu) inStu.value = btn.dataset.stu;
        renderPlan();
      });
    });

    swatches.forEach((sw) => {
      sw.addEventListener('click', () => {
        activeFinish = sw;
        swatches.forEach((s) => s.classList.toggle('is-active', s === sw));
        if (outFinish) outFinish.textContent = sw.dataset.spFinish || '';
        if (roomBox && sw.dataset.accent) {
          roomBox.style.borderColor = sw.dataset.accent;
          roomBox.style.backgroundColor = sw.dataset.bg || '#EFF7F2';
        }
        renderPlan();
      });
    });

    [inLen, inWid, inStu].forEach((inp) => inp?.addEventListener('input', renderPlan));
    resetBtn?.addEventListener('click', () => activeWing?.click());
    renderPlan();
  });

  // 19. Regional Campus Studio Locator Controller
  document.querySelectorAll('[data-campus-map-section]').forEach((sec) => {
    const triggers = Array.from(sec.querySelectorAll('[data-hub-trigger]'));
    const outTitle = sec.querySelector('[data-map-active-title]');
    const outAddr = sec.querySelector('[data-map-active-addr]');
    const outHours = sec.querySelector('[data-map-active-hours]');
    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        triggers.forEach((t) => {
          const active = t === btn;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', String(active));
        });
        if (outTitle) outTitle.textContent = btn.dataset.hubTitle || '';
        if (outAddr) outAddr.textContent = btn.dataset.hubAddress || '';
        if (outHours) outHours.textContent = btn.dataset.hubHours || '';
      });
    });
  });

  // 20. Turnkey Wing Starter Kits Controller
  document.querySelectorAll('[data-wing-packages]').forEach((sec) => {
    const tabs = Array.from(sec.querySelectorAll('[data-wp-tab]'));
    const editionBtns = Array.from(sec.querySelectorAll('[data-wp-edition]'));
    const outMeta = sec.querySelector('[data-wp-out-meta]');
    const outTitle = sec.querySelector('[data-wp-out-title]');
    const outSummary = sec.querySelector('[data-wp-out-summary]');
    const outDispatch = sec.querySelector('[data-wp-out-dispatch]');
    const outWarranty = sec.querySelector('[data-wp-out-warranty]');
    const outSafety = sec.querySelector('[data-wp-out-safety]');
    const outLink = sec.querySelector('[data-wp-out-link]');
    const outEditionNote = sec.querySelector('[data-wp-out-edition-note]');
    const outList = sec.querySelector('[data-wp-out-list]');
    const outTotal = sec.querySelector('[data-wp-out-total]');
    const quoteBtn = sec.querySelector('[data-wp-quote-btn]');
    const waLink = sec.querySelector('[data-wp-wa-link]');

    let activeTab = tabs.find((t) => t.classList.contains('is-active')) || tabs[0];
    let activeEdition = 'standard-pack';

    const syncWingUI = () => {
      if (!activeTab) return;
      const title = activeTab.dataset.wpTitle || '';
      const baseNum = Number(activeTab.dataset.wpPrice || 0);
      const mult = activeEdition === 'custom-branding' ? 1.045 : 1;
      const estNum = baseNum > 0 ? Math.round(baseNum * mult) : 0;

      if (outMeta) outMeta.textContent = `${activeTab.dataset.wpAge || ''} · ${activeTab.dataset.wpCap || ''}`;
      if (outTitle) outTitle.textContent = title;
      if (outSummary) outSummary.textContent = activeTab.dataset.wpSummary || '';
      if (outDispatch) outDispatch.textContent = activeTab.dataset.wpDispatch || '';
      if (outWarranty) outWarranty.textContent = activeTab.dataset.wpWarranty || '';
      if (outSafety) outSafety.textContent = activeTab.dataset.wpSafety || '';
      if (outLink && activeTab.dataset.wpLink) outLink.setAttribute('href', activeTab.dataset.wpLink);
      if (outEditionNote) {
        outEditionNote.textContent = activeEdition === 'standard-pack'
          ? 'Ready-to-Ship Standard Pack (10% Wing Bundle Savings)'
          : 'Custom School Branding & RAL Finishes (6% Institutional Savings)';
      }
      if (outList && activeTab.dataset.wpItems) {
        outList.innerHTML = activeTab.dataset.wpItems.split('|').map((row) => `<li>${row.trim()}</li>`).join('');
      }
      if (outTotal) {
        outTotal.textContent = estNum > 0 ? `₹${estNum.toLocaleString('en-IN')}` : 'Custom Institutional BOQ';
      }
      if (quoteBtn) quoteBtn.dataset.productTitle = `Turnkey Kit: ${title}`;
      if (waLink) {
        const msg = `School Decor Turnkey Wing Kit: ${title} (${activeEdition === 'standard-pack' ? 'Ready-to-Ship' : 'Custom RAL Branding'})`;
        waLink.setAttribute('href', `https://wa.me/919312254660?text=${encodeURIComponent(msg)}`);
      }
    };

    tabs.forEach((t) => {
      t.addEventListener('click', () => {
        activeTab = t;
        tabs.forEach((other) => {
          const sel = other === t;
          other.classList.toggle('is-active', sel);
          other.setAttribute('aria-selected', String(sel));
        });
        syncWingUI();
      });
    });

    editionBtns.forEach((b) => {
      b.addEventListener('click', () => {
        activeEdition = b.dataset.wpEdition || 'standard-pack';
        editionBtns.forEach((other) => other.classList.toggle('is-active', other === b));
        syncWingUI();
      });
    });

    syncWingUI();
  });

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.sd-modal, .sd-drawer').forEach((el) => { el.hidden = true; });
      if (searchBar) searchBar.hidden = true;
      document.body.style.overflow = '';
    }
  });
})();
