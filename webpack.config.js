// webpack.config.js
module.exports = {
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              'style-loader',  // Вставляет стили в DOM
              'css-loader',    // Преобразует CSS в CommonJS
              'sass-loader'    // Компилирует SCSS в CSS
            ]
          }
        ]
      }
    };
    