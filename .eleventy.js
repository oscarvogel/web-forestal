module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter("htmlDateString", (dateObj) => {
      const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
      return date.toISOString().slice(0, 10);
    });

    // Passthrough copies
    eleventyConfig.addPassthroughCopy("src/.htaccess");
    eleventyConfig.addPassthroughCopy("src/images");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/**/*.php");
    
    // Layout alias
    eleventyConfig.addLayoutAlias("base", "layouts/base.njk");

  
    return {
      dir: {
        input: "src",
        output: "_site",
        includes: "_includes",
        data: "_data" // Asegúrate de que esto esté correcto
      },
      templateFormats: ["njk", "html", "md"],
      htmlTemplateEngine: "njk"
    };
  };
