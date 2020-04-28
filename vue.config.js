const path = require("path");

module.exports = {
  pluginOptions: {
    autoRouting: {
      chunkNamePrefix: "page-",
    },
  },

  transpileDependencies: ["vuetify"],

  publicPath: "",
  outputDir: path.resolve(__dirname, "app/views"),
};
