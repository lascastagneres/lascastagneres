module.exports = function (eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/assets/styles");
    eleventyConfig.addPassthroughCopy("src/assets/img");

    eleventyConfig.addFilter("multiline", (content) => {
        if (!content) return "";
        return content.replace(/\n/g, "<br>");
    });


    eleventyConfig.addFilter("formatActivity", function (activity, totalWidth = 40) {
        if (!activity || !activity.label || !activity.price) return "";

        const labelStr = String(activity.label);
        const timeStr = String(activity.time);

        // Approximate widths: Use a factor to account for non-monospace fonts
        const labelWidth = labelStr.length * 1.1; // Adjust factor as needed
        const priceWidth = timeStr.length * 1.1;
        const availableWidth = totalWidth - (labelWidth + priceWidth);

        const dotsCount = availableWidth > 0 ? Math.floor(availableWidth / 1.1) : 1;
        const dots = "•".repeat(dotsCount); // Using "•" for better alignment

        return `${labelStr} ${dots} ${timeStr}`;
    });



    const languages = require("./src/_data/languages.json");
    eleventyConfig.addGlobalData("languages", languages);

    //On génére les pages structurelles
    const pages = require("./src/_data/pages.json");
    let pages_lang = []
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const page_lang = [...languages].map((l) => {
            return ({ ...page, language: l.code, permalink: l.code + "/" + page.path })
        })
        pages_lang.push(...page_lang)
    }

    //On génére le cas spécial index.html
    // pages_lang.push({ ...pages_lang.find((pl) => pl.path === '/index.html'), language: 'fr', permalink: 'index.html' })

    //On enrichit avec les données i18n
    const i18n = require("./src/_data/i18n.json");
    for (let page_lang of pages_lang) {
        page_lang['i18n'] = i18n[page_lang.language]
    }

    //On enrichit avec les activités
    const activities = require("./src/_data/activities.json");
    for (let page_lang of pages_lang) {
        page_lang['activities'] = activities[page_lang.language]
    }

    console.log(pages_lang)

    eleventyConfig.addGlobalData("pages_lang", pages_lang);

    return {
        dir: {
            input: "src",
            output: "docs",
            includes: "_includes",
            layouts: "_layouts",
        },
        pathPrefix: "/lascastagneres/"
    };
};
