const { DateTime } = require("luxon");
const footnotes = require("eleventy-plugin-footnotes");

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
  return {
    dir: {
      input: "src",
      output: "site",
    },
  };
};
