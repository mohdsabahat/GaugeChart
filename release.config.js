module.exports = {
    branches: ["master"],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/changelog",
        [
            "@semantic-release/git",
            {
                "assets": ["package.json", "package-lock.json", "CHANGELOG.md", "dist/**"],
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ],
        [
            "@semantic-release/github",
            {
                "assets": [
                    { "path": "dist/gaugeChart.min.js", "label": "gaugeChart-v${nextRelease.version}.js" },
                ],
            }
        ]
    ]
};
