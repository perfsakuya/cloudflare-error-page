# Cloudflare Error Page (React Version)

A pixel-perfect, static React implementation of the classic Cloudflare error page.

With the help of **Gemini 3**, this fork adds a React application to the original project, making it incredibly easy to deploy directly to **Cloudflare Pages** 😈

---

## 📸 Screenshots

### Desktop View
![Desktop View](./doc/desktop-preview.png)

### Mobile View
![Mobile View](./doc/mobile-preview.png)

---

## 🚀 Deploy to Cloudflare Pages

You can deploy this project to Cloudflare Pages in just a few clicks.

1.  **Fork this repository** to your GitHub account.
2.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Compute (Workers & Pages)** > **Pages**.
3.  Click **Connect to Git** and select your forked repository.
4.  Configure the build settings:
    *   **Framework preset**: `React(Vite)`
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
    *   **Root directory**: `react-app` (Important!)
5.  Click **Save and Deploy**.

That's it! Your custom error page is now live.

---

## ⚙️ Configuration (Zero Code)

You can customize the text, error codes, and status indicators without modifying the code. Just use **Environment Variables** in Cloudflare Pages.

1.  Go to your Pages project **Settings** > **Environment variables**.
2.  Add a new variable named `VITE_CONFIG_JSON`.
3.  Set the value to a JSON string with your custom settings.

### Example Configuration
```json
{
  "title": "System Maintenance",
  "error_code": 503,
  "what_happened": "<p>We are currently performing scheduled maintenance.</p>",
  "what_can_i_do": "<p>Please check back in 15 minutes.</p>",
  "browser_status": { "status": "ok", "status_text": "Your Browser" },
  "cloudflare_status": { "status": "ok", "status_text": "Cloudflare" },
  "host_status": { "status": "error", "status_text": "Maintenance" }
}
```

### Full Configuration Options
The app performs a deep merge, so you only need to provide the fields you want to override.

```javascript
{
  "title": "Internal server error",
  "error_code": 500,
  "time": null, // Defaults to current UTC time
  "ray_id": null, // Defaults to random hex
  "client_ip": "127.0.0.1",
  
  "more_information": {
    "hidden": false,
    "text": "cloudflare.com",
    "link": "https://www.cloudflare.com"
  },

  "browser_status": {
    "status": "ok", // "ok" or "error"
    "status_text": "Working",
    "location": "You",
    "name": "Browser"
  },
  "cloudflare_status": {
    "status": "error",
    "status_text": "Error",
    "location": "London",
    "name": "Cloudflare"
  },
  "host_status": {
    "status": "ok",
    "status_text": "Working",
    "location": "The Site",
    "name": "Host"
  },
  "error_source": "cloudflare", // "browser", "cloudflare", or "host"
  
  "what_happened": "<p>HTML content supported here.</p>",
  "what_can_i_do": "<p>HTML content supported here.</p>",
  
  "perf_sec_by": {
    "text": "Cloudflare",
    "link": "https://www.cloudflare.com"
  }
}
```

---

## 🛠 Local Development

To run the project locally:

```bash
cd react-app
npm install
npm run dev
```

This includes a **floating demo controller** (hover at the top of the screen) to quickly preview different error states (500, 503, 200).

---

## ❤️ Credits & Acknowledgements

*   **Original Project**: Thanks to the original author [donlon](https://github.com/donlon/cloudflare-error-page) for the Python/Jinja2 implementation and assets.
*   **Gemini 3**: For the intelligent coding assistance, React migration, and pixel-perfect UI refinements.
*   **Cloudflare**: For providing the **robust** infrastructure and design inspiration.

---

MIT License