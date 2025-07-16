module.exports = {
  expo: {
    name: "Munja",
    slug: "Munja",
    scheme: "myapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo.png",
        backgroundColor: "#ffffff"
      },
      package: "com.hrkim0101.Munja",
      // 자바스크립트 코드 사용을 위해 파일이름 app.json -> app.config.js 로 변경
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font",
      "expo-web-browser",
      "expo-router",
      "expo-secure-store",
      "expo-dev-client"
    ],
    extra: {
      eas: {
        "projectId": "96b88fb0-bdc2-40d1-8cf3-f55b8becce32"
      }
    }
  }
};