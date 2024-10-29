// postcss.config.js
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcssImport,
    postcssNested,
    postcssPresetEnv({
      stage: 1,
      features: {
        'nesting-rules': true
      }
    }),
    autoprefixer,
    process.env.NODE_ENV === 'production' && cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }]
    })
  ].filter(Boolean)
}