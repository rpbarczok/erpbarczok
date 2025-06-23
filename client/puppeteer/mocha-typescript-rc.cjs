module.exports = {
    "node-option": ["import=tsx"],
    "extension": ["ts", "tsx"],
    "require": [
        "global-jsdom/register",
        "ignore-styles"
    ],
    "spec": [
        "client/puppeteer/**/*.test.ts",
        "client/puppeteer/**/*.test.tsx"],
    "ignore": ["client/puppeteer/utils/**/*"]
}