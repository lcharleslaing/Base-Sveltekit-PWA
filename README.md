# SvelteKit + TailwindCSS + DaisyUI Project Setup

This guide outlines the steps to set up a new SvelteKit project integrated with TailwindCSS and DaisyUI. It also covers how to prepare the project for hosting on Vercel and configure it as a Progressive Web App (PWA).

## Step 1: Create a New SvelteKit Project

Start by creating a new SvelteKit project:

```bash
npm create svelte@latest my-sveltekit-app
cd my-sveltekit-app
```

Follow the prompts and select the default setup options provided.

## Step 2: Set Up TailwindCSS and DaisyUI

Install TailwindCSS, its peer dependencies, and DaisyUI:

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
npm install daisyui
```

Configure TailwindCSS to use DaisyUI by editing `tailwind.config.cjs`:

```javascript
module.exports = {
	// Other configurations...
	plugins: [require('daisyui')]
};
```

Add Tailwind's directives to your CSS by creating or editing `src/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 3: Configure PNPM (Optional)

If you prefer PNPM over NPM, run:

```bash
pnpm install
```

Make sure to use `pnpm` for any future commands instead of `npm`.

## Step 4: Prepare for Vercel Hosting

Initialize a Git repository and commit your project:

```bash
git init
git add .
git commit -m "Initial commit"
```

Sign up or log in to [Vercel](https://vercel.com), click "New Project", select your repository, and follow the setup instructions.

## Step 5: Making Your App a PWA

### Step 1: Install Workbox

Workbox is a set of libraries that help manage service workers. Install Workbox CLI globally (if you haven't already) and generate the service worker configuration:

```bash
npm install -g workbox-cli
workbox wizard --injectManifest
```

During the wizard setup:

- Select your project's build directory (build by default for SvelteKit).
- Specify the path to your service worker file, which will be in your src directory (e.g., src/service-worker.js).
- Choose the file types you want to cache (e.g., HTML, JS, CSS, and image files).

After completing the wizard, Workbox generates a `workbox-config.js` file in your project root. This file contains the configuration needed to generate your service worker.

### Step 2: Generate the Service Worker

Generate your service worker based on the configuration:

```bash
workbox generateSW workbox-config.js
```

Or, if you chose the "InjectManifest" mode:

```bash
workbox injectManifest workbox-config.js
```

This will create a service worker file in your project. Make sure the path matches the one you specified during the wizard setup.

### Step 3: Register the Service Worker

In your SvelteKit project, you need to register this service worker. You can do this by adding the following code to your `src/routes/+layout.svelte` file:

```html
<script>
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/service-worker.js');
		});
	}
</script>
```

### Step 4: Add a Web App Manifest

Create a manifest file named `manifest.json` in your static folder with the following content:

```json
{
	"name": "My PWA App",
	"short_name": "PWA App",
	"start_url": "/",
	"display": "standalone",
	"background_color": "#ffffff",
	"description": "A progressive web application built with SvelteKit.",
	"icons": [
		{
			"src": "/icons/icon-192x192.png",
			"sizes": "192x192",
			"type": "image/png"
		},
		{
			"src": "/icons/icon-512x512.png",
			"sizes": "512x512",
			"type": "image/png"
		}
	]
}
```

### Step 5: Link the Manifest

In your `src/app.html` file, add a link to the manifest within the `<head>` tag:

```html
<link rel="manifest" href="/manifest.json" />
```

### Step 6: Add Icons

Don't forget to add the icons referenced in the manifest to the `static/icons` folder. You can generate icons that match your app's branding using a tool like [Favicon.io](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/).

## Finalizing

After completing these steps, your SvelteKit application is now configured as a PWA. It can be installed on users' devices and is capable of caching resources for offline use. Test your PWA functionality by running your app in a local or production environment, and using browser dev tools to inspect the service worker and manifest.

For further customization and understanding of Workbox and PWAs, consult the [Workbox documentation](https://developers.google.com/web/tools/workbox) and the [Web App Manifest guide](https://developer.mozilla.org/en-US/docs/Web/Manifest).
