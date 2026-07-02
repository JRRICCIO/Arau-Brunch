module.exports = function (eleventyConfig) {
  // Ancla/slug de una sección: usa su id si lo tiene, si no lo genera del nombre.
  eleventyConfig.addFilter("anchor", function (section) {
    if (section && section.id) return section.id;
    const label = (section && section.label) || "seccion";
    return label
      .toString()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "seccion";
  });

  // Asegura ruta de asset absoluta (con "/" inicial) para que funcione
  // desde subdirectorios de idioma (/en/, /fr/, /ca/). Idempotente.
  eleventyConfig.addFilter("asset", function (p) {
    if (!p) return p;
    if (/^(https?:)?\/\//.test(p) || p.startsWith("/") || p.startsWith("data:")) return p;
    return "/" + p;
  });

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy(".htaccess");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
