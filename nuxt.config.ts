// nuxt.config.ts

export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],
  icon: {
    provider: "server",
    mode: "svg",
    customCollections: [
      {
        prefix: "icons",
        dir: "./assets/icons",
      },
    ],
  },
});
