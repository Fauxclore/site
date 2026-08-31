const { DateTime } = require("luxon");
const footnotes = require("eleventy-plugin-footnotes");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(new Date(dateObj), { zone: "utc" }).toFormat(
      "dd LLL yyyy",
    );
  });
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/music");
  eleventyConfig.addPassthroughCopy("src/papers");
  eleventyConfig.addPassthroughCopy({ "src/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/style_n.css": "style_n.css" });
  eleventyConfig.addPassthroughCopy({ "src/style_h.css": "style_h.css" });
  eleventyConfig.addPassthroughCopy({ "src/style_m.css": "style_m.css" });
  eleventyConfig.addPlugin(footnotes, {
    title: "Notas",
    titleId: "footnotes-label",
    backLinkLabel: (footnote, index) => "Voltar à nota" + (index + 1),
    baseClass: "Footnotes",
    classes: {},
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/feed.xml",
    collection: {
      name: "blog", // iterate over `collections.posts`
      limit: 10, // 0 means no limit
    },
    metadata: {
      language: "pt",
      title: "Fauxclore",
      subtitle: "Feed de artigos publicados no website.",
      base: "https://fauxclore.com/",
      author: {
        name: "Jorge Graça",
        email: "thefauxclore@gmail.com",
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "site",
    },
  };
};
