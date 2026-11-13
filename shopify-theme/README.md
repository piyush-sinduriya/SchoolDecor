# School Decor — Shopify Online Store 2.0 Theme

A complete, modular Shopify Online Store 2.0 theme built specifically for **School Decor** (`schooldecor.in`), designed for easy visual editing inside the Shopify Theme Editor with zero coding required.

---

## 1. How to Install This Theme on Shopify (Step-by-Step)

1. Download **`school-decor-shopify-theme.zip`**.
2. Log in to your **Shopify Admin** (`yourstore.myshopify.com/admin`).
3. Go to **Online Store → Themes**.
4. In the **Theme library** section, click **Add theme → Upload zip file**.
5. Select `school-decor-shopify-theme.zip` and click **Upload file**.
6. Wait ~30 seconds for Shopify to import the theme.
7. Click **Customize** to preview and edit your pages safely before publishing.
8. When ready to go live, click **Publish**.

> **Important:** All your existing Shopify products, collections, URLs, customers, and checkout settings remain untouched.

---

## 2. How to Replace or Adjust Your Logo & Upload Website Images

### Logo
- Your original **School Decor** logo (`school-decor-logo.png`) is already built into the theme untouched.
- If you ever want to upload a different file, open **Customize → Theme settings (gear icon) → Brand Identity & Logo → Custom Logo Override**.
- Adjust **Desktop Logo Width** (`90px–240px`) and **Mobile Logo Width** (`80px–180px`) with the slider.

### Website Images (Hero, Collections, Gallery, Projects)
1. In Shopify Admin, click **Online Store → Themes → Customize**.
2. Click any section in the left sidebar (for example, **Hero Slider → Hero Slide**).
3. Click **Select image** under **Desktop Hero Image** (and optionally **Mobile Hero Image**), then upload or pick from your Shopify Files library.
4. Repeat for **Explore Our Collections**, **About School Decor Split**, **Category Showcase Editorial**, **School Environment Gallery**, and **Featured School Projects**.

---

## 3. How to Connect Existing Shopify Products & Collections

### Featured Products Tabs (Best Sellers / New Arrivals / Featured)
1. Open **Customize → Home page → Featured Products Tabs**.
2. Click each **Product Tab** block (`Best Sellers`, `New Arrivals`, `Featured Products`).
3. Click **Select collection** and pick your matching Shopify collection. Products, prices, compare-at prices, sale tags, and availability load dynamically from Shopify.

### Explore Our Collections Cards
1. Open **Customize → Home page → Explore Our Collections**.
2. Click each **Category Card** block (`School Furniture`, `Kindergarten Furniture`, `Science Laboratories`, etc.).
3. Pick your Shopify collection in **Select Shopify Collection** (default links already preserve `schooldecor.in` URLs like `/collections/kindergarten-furniture`, `/collections/soft-play-zones`, `/collections/science-lab`, `/collections/outdoor-fun-equipment`).

### Direct Purchase vs. Quotation-Only Products
This theme supports **both** online checkout products and custom institutional quotation products:
- **Standard Products (with price > 0):** Show **Add to Cart**, **Buy Now**, **Request a Quote**, and **WhatsApp Enquiry**.
- **Quotation-Only Products:** Any product tagged **`quote-only`** (or `enquiry-only` / `request-quote`), OR priced at `0`, OR having boolean metafield `custom.enquiry_only = true`, automatically hides Add to Cart and displays **Request a Quote** + **WhatsApp Enquiry** instead.

### Product Specifications & Metafields (Optional)
Create these Product Metafields in **Shopify Admin → Settings → Custom data → Products**:
- `custom.dimensions` (Single line text)
- `custom.materials` (Single line text)
- `custom.age_group` (Single line text)
- `custom.features` (Rich text)
- `custom.additional_info` (Rich text)
- `custom.enquiry_only` (True/false)

---

## 4. How to Configure WhatsApp, Quote Requests & Store Filters

1. **WhatsApp Number:** Go to **Customize → Theme settings → WhatsApp & Quotation System**, enter your number with country code and no `+` or spaces (e.g., `9198XXXXXXXX`), and edit your default greeting.
2. **Request a Quote Form:** Submissions automatically go to your Shopify Store Contact Email via Shopify's native `contact` form. If you also want submissions sent to an external CRM/Formspree URL, paste that URL into **Optional External Quote Form Endpoint URL**.
3. **Collection Filters (Price, Availability, Product Type):** Install Shopify's free **Search & Discovery** app in your Shopify Admin, go to **Filters**, and enable **Price**, **Availability**, and **Product type**. They appear automatically in the theme's collection sidebar.
4. **Custom Pages:** Create pages in **Online Store → Pages** and select the matching template in the right sidebar (`about-us`, `contact`, `projects`, `project-detail`, `faq`, `request-quote`, `privacy-policy`, `terms-and-conditions`, `shipping-returns`).

---

## 5. Complete Configurable Theme Editor Settings Reference

- **Theme Settings:** Logo override, desktop/mobile logo width, favicon, primary/hover/accent/surface/text/sale colors, heading & body fonts, base font size, floating WhatsApp toggle & number, quote webhook URL, quote-only tag, product card hover image/availability/quick-view/quick-add toggles, card image ratio (`4:3` or `1:1`), cart drawer toggle, cart note toggle, predictive search toggle, social media URLs.
- **Section Settings (Every Homepage Section):** Enable/disable visibility (eye icon), drag-and-drop section reordering, background color, vertical spacing slider, text alignment, desktop & mobile image pickers, headings, rich text descriptions, button labels & links, collection pickers, and add/remove repeatable blocks.

---

## 6. Pre-Launch Testing Checklist

- [ ] Upload `school-decor-shopify-theme.zip` to Shopify Admin without errors.
- [ ] Verify original School Decor logo displays cleanly on desktop and mobile headers and footer.
- [ ] Configure your real WhatsApp number in Theme Settings and test clicking a product's **WhatsApp Enquiry** button (verify product name & URL are included in the message).
- [ ] Test **Mega Menus** on desktop (`Furniture`, `Active Play`, `Laboratory`, `Outdoor`, `Flooring`) and **Mobile Drawer** on a 390px phone screen.
- [ ] Test **Predictive Search** in the header by typing a product name.
- [ ] Test **Collection Filters & Sorting** on `/collections/kindergarten-furniture`.
- [ ] Test a purchasable product (**Add to Cart** → **Cart Drawer** quantity update → **Proceed to Checkout**).
- [ ] Test a `quote-only` tagged product (**Request a Quote** modal → submit valid enquiry).
- [ ] Assign page templates (`about-us`, `contact`, `projects`, `faq`, `request-quote`, policies) in Shopify Admin → Pages.
- [ ] Run Google Lighthouse / PageSpeed check on mobile and desktop before publishing.
