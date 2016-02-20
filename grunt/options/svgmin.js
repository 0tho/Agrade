// The following *-min tasks produce minified files in the dist folder
module.exports = {
    dist: {
        files: [
            {
                expand: true,
                cwd: "<%= pkg.source %>/images",
                src: "{,*/}*.svg",
                dest: "<%= pkg.dist %>/images"
            }
        ]
    }
};
