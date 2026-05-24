# Hotel Bhavani Udupi

Budget-friendly hotel website for **Hotel Bhavani Boarding & Lodging**, located at Chitranjan Circle, Udupi, Karnataka.

🌐 **Live:** https://www.hotelbhavaniudupi.in/

📍 **Location:** [Google Maps](https://maps.app.goo.gl/Fn6qMLiw7N8J1hVw6)

---

## Features

- **Modern responsive design** — works on mobile, tablet, and desktop
- **Dark/Light theme** toggle with system preference detection
- **Auto-playing review carousel** with scroll-snap and navigation arrows
- **WhatsApp booking** — form generates pre-filled WhatsApp message
- **Floating action buttons** — WhatsApp (right) + Google Maps (left)
- **SEO optimized** — JSON-LD schema, Open Graph, sitemap.xml, robots.txt
- **Google Maps embed** in contact section
- **Nearby attractions** section with distances
- **Mobile hamburger menu** with slide-in drawer

## Tech Stack

- HTML, CSS, JavaScript (vanilla — no frameworks)
- CSS Variables for theming
- Google Fonts (Inter + Playfair Display)
- Vercel serverless function for phone number API
- Deployed on **Vercel Free Tier**

## Color Palette

| Color | Usage |
|-------|-------|
| `#e88a1a` Warm Marigold | Accent, buttons, CTAs |
| `#3b2a1a` Deep Earth Brown | Text, hero background |
| `#2e8b57` Green | Stats bar, checkmarks, review avatars |
| `#ffffff` White | Backgrounds, readability |

## Project Structure

```
├── index.html          # Main website (single page)
├── styles.css          # All styling with CSS variables
├── script.js           # Theme, menu, carousel, WhatsApp, form
├── api/
│   └── config.js       # Vercel serverless function (phone number)
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler directives
└── README.md
```

## Room Types

| Room | Price | Description |
|------|-------|-------------|
| Single Bedded Room | ₹500/night | 1 bed, ideal for solo travelers |
| Double Bedded Room | ₹700/night | 2 beds, for couples or friends |
| Three Bedded Room | ₹900/night | 3 beds, for families or groups |

## Hotel Info

- **Check-in:** 6 AM - 11 PM
- **Stay duration:** 24 hours from check-in
- **Phone:** 0820-2526980 (6 AM to 10 PM)
- **Location:** Chitranjan Circle, Udupi City Center, Karnataka 576101
- **Distance to Krishna Temple:** 600m (5 min walk)

## Deployment

Hosted on Vercel: https://vercel.com/keerthan-shettys-projects/hotel-bhavani-udupi

### Environment Variables (Vercel Dashboard)

| Variable | Description |
|----------|-------------|
| `PHONE_NUMBER` | WhatsApp number for bookings |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID (optional) |

## SEO

- Sitemap: https://www.hotelbhavaniudupi.in/sitemap.xml
- Robots.txt: https://www.hotelbhavaniudupi.in/robots.txt
- Google Search Console: Verified and indexed
- Structured Data: Hotel schema (JSON-LD)
