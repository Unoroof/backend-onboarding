/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "NobeJS",
  tagline: "Rapid NodeJS API Developement",
  url: "https://nobejs.vercel.app/",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "betlaectic", // Usually your GitHub org/user name.
  projectName: "nobejs", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "NobeJS",
      logo: {
        alt: "NobeJS",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "doc",
          docId: "intro",
          position: "left",
          label: "Tutorial",
        },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/betalectic/nobejs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/betalectic",
            },
          ],
        },
        {
          title: "More",
          items: [
            // {
            //   label: "Blog",
            //   to: "/blog",
            // },
            {
              label: "GitHub",
              href: "https://github.com/betalectic/nobejs",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Betalectic Pvt Ltd. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/edit/master/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
