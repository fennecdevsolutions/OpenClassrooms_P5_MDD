const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: ['babel-plugin-istanbul'],
                    },
                },
                enforce: 'post',
                include: path.join(__dirname, '..', 'src'),
                exclude: [
                    /node_modules/,
                    /\.spec\.ts$/,
                    /\.cy\.ts$/,
                    /(ngfactory|ngstyle)\.js/,
                ],
            },
        ],
    },
};