module.exports = {
    "node-option": ["import=tsx"],
    "extension": ["ts", "tsx"],
    "require": [
        "global-jsdom/register",
        "ignore-styles"
    ],
    "spec": [
        "./tests/**/*.ts",
        "./tests/**/*.tsx"],
    "ignore": ["./tests/utils/**/*"]
}