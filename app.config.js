import 'dotenv/config';

module.exports = {
  expo: {
    name: "문자",
    slug: "Munja",
    scheme: "myapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
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
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON, 
      package: "com.hrkim0101.Munja"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-font",
      "expo-web-browser",
      "expo-router",
      "expo-secure-store",
      "expo-notifications" 
    ],
    extra: {
      eas: {
        projectId: "96b88fb0-bdc2-40d1-8cf3-f55b8becce32"
      }
    }
  }
};