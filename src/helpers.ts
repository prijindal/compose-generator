import Handlebars from "handlebars";

Handlebars.registerHelper("inc", function (number, options) {
  if (typeof number === "undefined" || number === null) return null;

  return number + (options.hash.inc || 1);
});
