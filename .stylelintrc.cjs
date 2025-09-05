/** @type {import('stylelint').Config} */
module.exports = {
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-sass-guidelines",
    ],
    plugins: [
        "stylelint-order",
    ],
    rules: {
        "at-rule-no-unknown": null,
        "scss/at-rule-no-unknown": true,
        "order/order": [
            [
                "custom-properties",
                "dollar-variables",
                {
                    type: "at-rule",
                    name: "include",
                },
                "declarations",
                {
                    type: "at-rule",
                    name: "media",
                },
                "rules",
            ],
        ],
    },
    ignoreFiles: [
        "**/*.js",
        "**/*.ts",
        "**/*.tsx",
    ],
};


