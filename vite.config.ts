import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	root: "./src",
	base: "",
	build: {
		outDir: "../dist",
		emptyOutDir: true,
	},

	plugins: [
		VitePWA({
			registerType: "autoUpdate",

			includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
			manifest: {
				name: "استخاره",
				short_name: "استخاره",
				description: "استخاره شهید آوینی",
				theme_color: "#ffffff",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
});
