export const fallbackLng = "en";
export const languages = [fallbackLng, "ru"];
export const languagesMap = new Map<string, string>([
  ["en", "English"],
  ["ru", "Русский"],
]);
export const defaultNS = "home";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
