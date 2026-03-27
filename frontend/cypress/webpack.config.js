module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: [/node_modules/, /\.spec\.ts$/, /\.cy\.ts$/],
                use: {
                    loader: '@jsdevtools/coverage-istanbul-loader',
                    options: { esModules: true },
                },
                enforce: 'post',
            },
        ],
    },
};