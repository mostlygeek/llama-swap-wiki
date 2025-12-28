import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import postcssPlugin from "@tailwindcss/postcss";
import { readFile } from "fs/promises";

export default function(eleventyConfig) {
  // Add syntax highlighting plugin
  eleventyConfig.addPlugin(syntaxHighlight);

  // Process CSS with PostCSS and Tailwind v4
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function(inputContent, inputPath) {
      if (!inputPath.endsWith("src/css/styles.css")) {
        return;
      }

      return async () => {
        let result = await postcss([postcssPlugin()]).process(inputContent, {
          from: inputPath,
        });
        return result.css;
      };
    },
  });

  // Copy React app build output to site
  eleventyConfig.addPassthroughCopy("src/configuration");

  // Watch CSS files for changes
  eleventyConfig.addWatchTarget("src/css/**/*.css");

  // Set dev server port
  eleventyConfig.setServerOptions({
    port: 8989,
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html", "css"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
