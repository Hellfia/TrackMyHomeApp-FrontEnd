import Joi from "joi";

const updateCraftsman = Joi.object({
  craftsmanCompagny: Joi.string().min(1).optional().messages({
    "string.empty": "Le nom de l'artisan est obligatoire.",
    "string.min": "Le nom de l'artisan doit comporter au moins 1 caractères.",
  }),
  craftsmanAddress: Joi.string().min(1).optional().messages({
    "string.empty": "L'adresse de l'artisan est obligatoire.",
    "string.min": "L'adresse doit comporter au moins 1 caractères.",
  }),
  craftsmanZip: Joi.string().length(5).pattern(/^\d+$/).optional().messages({
    "string.empty": "Le code postal est obligatoire.",
    "string.length": "Le code postal doit comporter 5 chiffres.",
    "string.pattern.base":
      "Le code postal doit être composé uniquement de chiffres.",
  }),
  craftsmanCity: Joi.string().min(1).optional().messages({
    "string.empty": "La ville est obligatoire.",
    "string.min": "La ville doit comporter au moins 1 caractères.",
  }),
  phoneNumber: Joi.string().optional().length(10).pattern(/^\d+$/).messages({
    "string.empty": "Le numéro de téléphone est obligatoire.",
    "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
    "string.pattern.base":
      "Le numéro de téléphone doit être composé uniquement de chiffres.",
  }),
});
export default updateCraftsman;
