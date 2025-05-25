import autoprefixer from "autoprefixer"
import cssnano from "cssnano"
import postcssPresetEnv from "postcss-preset-env"
import postcssImport from "postcss-import"
import postcssAssets from "postcss-assets"


export default {
    plugins: [
      postcssImport,
      cssnano({
        preset:"default",
      }),
      postcssAssets({
        loadPaths: [""]
      }),
      autoprefixer,
      postcssPresetEnv({stage: 1})
    ]
}