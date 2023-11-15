import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://zamoca42.github.io",

  author: {
    name: "추연규",
    url: "https://github.com/zamoca42",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/favicon-green2/android-chrome-512x512.png",

  favicon: "favicon.ico",

  repo: "zamoca42/blog",

  docsDir: "src",

  hotReload: true,

  // navbar
  navbar,

  // sidebar
  sidebar,

  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Search", "Outlook"],
  },


  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
    },
  },

  metaLocales: {
    editLink: "Edit this page on GitHub",
  },

  plugins: {
    blog: {
      // excerptLength: 0
    },
    // You should generate and use your own comment service
    comment: {
      provider: "Waline",
      serverURL: "https://waline-comment-zamoca42s-projects.vercel.app/"
    },

    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: false,
      codetabs: true,
      demo: true,
      echarts: false,
      figure: true,
      flowchart: false,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: false,
      mark: true,
      mermaid: false,
      mathjax: false,
      // playground: {
      //   presets: ["ts", "vue"],
      // },
      // presentation: ["highlight", "math", "search", "notes", "zoom"],
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: false,
    },

    // uncomment these if you want a pwa
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
},
  { custom: true });
