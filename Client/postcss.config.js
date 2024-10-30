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
        'custom-media-queries': true,        // Enable @custom-media
        'custom-selectors': true,            // Enable @custom-selector
        'nesting-rules': true,               // Enable nested rules
        'has-pseudo-class': true,            // Enable :has() selector
        'media-query-ranges': true,          // Enable modern media query syntax
        'container-queries': true,           // Enable @container
        'custom-properties': true,           // Enable CSS variables
        'logical-properties-and-values': true, // Enable logical properties
        'color-function': true,              // Enable modern color functions
        'color-mix': true                    // Enable color-mix()
      },
      browsers: [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead'
      ],
      preserve: false  // Set to true if you want to keep modern syntax in the output
    }),
    autoprefixer,
    process.env.NODE_ENV === 'production' && cssnano({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        }
      }]
    })
  ].filter(Boolean)
}