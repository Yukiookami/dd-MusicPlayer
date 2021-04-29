module.exports = {
  pluginOptions: {
      electronBuilder: {
          builderOptions: {
              "appId": "com.example.app",
              "productName": "ddPlayer", 
              "copyright": "Copyright © 2020",
              "mac": { 
                  "icon": "./icon.icns"
              }
          }
      }

  },
  publicPath: './'
}