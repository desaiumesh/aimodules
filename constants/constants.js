import { StyleSheet } from 'react-native'

export const darkColors = {
  "colors": {
    "primary": "rgb(85, 219, 198)",
    "onPrimary": "rgb(0, 55, 48)",
    "primaryContainer": "rgb(0, 80, 71)",
    "onPrimaryContainer": "rgb(118, 248, 226)",
    "secondary": "rgb(177, 204, 197)",
    "onSecondary": "rgb(28, 53, 48)",
    "secondaryContainer": "rgb(51, 75, 70)",
    "onSecondaryContainer": "rgb(205, 232, 225)",
    "tertiary": "rgb(172, 202, 229)",
    "onTertiary": "rgb(19, 51, 72)",
    "tertiaryContainer": "rgb(44, 74, 96)",
    "onTertiaryContainer": "rgb(202, 230, 255)",
    "error": "rgb(255, 180, 171)",
    "onError": "rgb(105, 0, 5)",
    "errorContainer": "rgb(147, 0, 10)",
    "onErrorContainer": "rgb(255, 180, 171)",
    "background": "rgb(25, 28, 27)",
    "onBackground": "rgb(224, 227, 225)",
    "surface": "rgb(25, 28, 27)",
    "onSurface": "rgb(224, 227, 225)",
    "surfaceVariant": "rgb(63, 73, 70)",
    "onSurfaceVariant": "rgb(190, 201, 197)",
    "outline": "rgb(137, 147, 144)",
    "outlineVariant": "rgb(63, 73, 70)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(224, 227, 225)",
    "inverseOnSurface": "rgb(45, 49, 48)",
    "inversePrimary": "rgb(0, 107, 94)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(28, 38, 36)",
      "level2": "rgb(30, 43, 41)",
      "level3": "rgb(32, 49, 46)",
      "level4": "rgb(32, 51, 48)",
      "level5": "rgb(33, 55, 51)"
    },
    "surfaceDisabled": "rgba(224, 227, 225, 0.12)",
    "onSurfaceDisabled": "rgba(224, 227, 225, 0.38)",
    "backdrop": "rgba(41, 50, 48, 0.4)"
  }
};

export const lightColors = {
  "colors": {
    "primary": "rgb(0, 107, 94)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(118, 248, 226)",
    "onPrimaryContainer": "rgb(0, 32, 27)",
    "secondary": "rgb(74, 99, 94)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(205, 232, 225)",
    "onSecondaryContainer": "rgb(6, 32, 27)",
    "tertiary": "rgb(68, 97, 121)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(202, 230, 255)",
    "onTertiaryContainer": "rgb(0, 30, 48)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(250, 253, 251)",
    "onBackground": "rgb(25, 28, 27)",
    "surface": "rgb(250, 253, 251)",
    "onSurface": "rgb(25, 28, 27)",
    "surfaceVariant": "rgb(218, 229, 225)",
    "onSurfaceVariant": "rgb(63, 73, 70)",
    "outline": "rgb(111, 121, 118)",
    "outlineVariant": "rgb(190, 201, 197)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(45, 49, 48)",
    "inverseOnSurface": "rgb(239, 241, 239)",
    "inversePrimary": "rgb(85, 219, 198)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(238, 246, 243)",
      "level2": "rgb(230, 241, 238)",
      "level3": "rgb(223, 237, 234)",
      "level4": "rgb(220, 236, 232)",
      "level5": "rgb(215, 233, 229)"
    },
    "surfaceDisabled": "rgba(25, 28, 27, 0.12)",
    "onSurfaceDisabled": "rgba(25, 28, 27, 0.38)",
    "backdrop": "rgba(41, 50, 48, 0.4)"
  }
};

export var languages = [
  { key: '1', value: '', LanguageName: "English", LanguageGenderName: "English (United States) Female", LanguageCode: "en", LocaleBCP47: "en-US", Voice: "en-US-JennyNeural" },
  { key: '2', value: '', LanguageName: "English", LanguageGenderName: "English (United States) Male", LanguageCode: "en", LocaleBCP47: "en-US", Voice: "en-US-GuyNeural" },
  { key: '3', value: '', LanguageName: "Marathi", LanguageGenderName: "Marathi (India) Female", LanguageCode: "mr", LocaleBCP47: "mr-IN", Voice: "mr-IN-AarohiNeural" },
  { key: '4', value: '', LanguageName: "Marathi", LanguageGenderName: "Marathi (India) Male", LanguageCode: "mr", LocaleBCP47: "mr-IN", Voice: "mr-IN-ManoharNeural" },
  { key: '5', value: '', LanguageName: "Kannada", LanguageGenderName: "Kannada (India) Female", LanguageCode: "kn", LocaleBCP47: "kn-IN", Voice: "kn-IN-SapnaNeural" },
  { key: '6', value: '', LanguageName: "Kannada", LanguageGenderName: "Kannada (India) Male", LanguageCode: "kn", LocaleBCP47: "kn-IN", Voice: "kn-IN-GaganNeural" },
  { key: '7', value: '', LanguageName: "Gujarati", LanguageGenderName: "Gujarati (India) Female", LanguageCode: "gu", LocaleBCP47: "gu-IN", Voice: "gu-IN-DhwaniNeural" },
  { key: '8', value: '', LanguageName: "Gujarati", LanguageGenderName: "Gujarati (India) Male", LanguageCode: "gu", LocaleBCP47: "gu-IN", Voice: "gu-IN-NiranjanNeural" },
  { key: '9', value: '', LanguageName: "Telugu", LanguageGenderName: "Telugu (India) Female", LanguageCode: "te", LocaleBCP47: "te-IN", Voice: "te-IN-ShrutiNeural" },
  { key: '10', value: '', LanguageName: "Telugu", LanguageGenderName: "Telugu (India) Male", LanguageCode: "te", LocaleBCP47: "te-IN", Voice: "te-IN-MohanNeural" },
  { key: '11', value: '', LanguageName: "Hindi", LanguageGenderName: "Hindi (India) Female", LanguageCode: "hi", LocaleBCP47: "hi-IN", Voice: "hi-IN-SwaraNeural " },
  { key: '12', value: '', LanguageName: "Hindi", LanguageGenderName: "Hindi (India) Male", LanguageCode: "hi", LocaleBCP47: "hi-IN", Voice: "hi-IN-MadhurNeural" },

  { key: '13', value: '', LanguageName: "Urdu", LanguageGenderName: "Urdu (India) Female", LanguageCode: "ur", LocaleBCP47: "ur-IN", Voice: "ur-IN-GulNeural" },
  { key: '14', value: '', LanguageName: "Urdu", LanguageGenderName: "Urdu (India) Male", LanguageCode: "ur", LocaleBCP47: "ur-IN", Voice: "ur-IN-SalmanNeural" },
  { key: '15', value: '', LanguageName: "Spanish", LanguageGenderName: "Spanish (Argentina) Female", LanguageCode: "es", LocaleBCP47: "es-AR", Voice: "es-AR-ElenaNeural" },
  { key: '16', value: '', LanguageName: "Spanish", LanguageGenderName: "Spanish (Argentina) Male", LanguageCode: "es", LocaleBCP47: "es-AR", Voice: "es-AR-TomasNeural" },
  { key: '17', value: '', LanguageName: "French", LanguageGenderName: "French Female", LanguageCode: "fr", LocaleBCP47: "fr-FR", Voice: "fr-FR-DeniseNeural" },
  { key: '18', value: '', LanguageName: "French", LanguageGenderName: "French Male", LanguageCode: "fr", LocaleBCP47: "fr-FR", Voice: "fr-FR-HenriNeural" },

];

export const aiStyles = StyleSheet.create({
  imageBackgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  imageBackgroundImageStyle: {
    opacity: 0.2,
  },
});

