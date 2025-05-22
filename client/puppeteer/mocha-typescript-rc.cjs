module.exports = {
    "node-option": ["import=tsx"],
    "extension": ["ts", "tsx"],
    "require": [
        "global-jsdom/register",
        "ignore-styles"
    ],
    "spec": [
        "./**/*.test.ts",
        "./**/*.test.tsx"],
    "ignore": ["./utils/**/*"]
}