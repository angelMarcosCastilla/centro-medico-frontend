export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function removeHtmlTags(inputString) {
  return inputString.replace(/<\/?[^>]+(>|$)/g, "");
}