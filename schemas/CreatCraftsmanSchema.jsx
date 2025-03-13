import Joi from "joi";

const creatCraftsman = Joi.object({
  craftsmanName: Joi.string().min(1).required().messages({
    "string.empty": "Le nom de l'entreprise est obligatoire.",
    "string.min":
      "Le nom de l'entreprise doit comporter au moins 1 caractères.",
  }),
  craftsmanAddress: Joi.string().min(1).required().messages({
    "string.empty": "L'adresse est obligatoire.",
    "string.min": "L'adresse doit comporter au moins 1 caractères.",
  }),
  craftsmanZip: Joi.string().length(5).pattern(/^\d+$/).required().messages({
    "string.empty": "Le code postal est obligatoire.",
    "string.length": "Le code postal doit comporter 5 chiffres.",
    "string.pattern.base":
      "Le code postal doit être composé uniquement de chiffres.",
  }),
  craftsmanCity: Joi.string().min(1).required().messages({
    "string.empty": "La ville est obligatoire.",
    "string.min": "La ville doit comporter au moins 1 caractères.",
  }),
  phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
    "string.empty": "Le numéro de téléphone est obligatoire.",
    "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
    "string.pattern.base":
      "Le numéro de téléphone doit être composé uniquement de chiffres.",
  }),
  logo: Joi.optional(), // Le logo peut être une option
});
export default creatCraftsman;
