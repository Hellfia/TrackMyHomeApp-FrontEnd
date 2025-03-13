import Joi from "joi";

const creatAccount = Joi.object({
  constructorName: Joi.string().min(1).max(50).required().messages({
    "string.empty": "Le nom de l'entreprise est obligatoire.",
    "string.min": "Le nom de l'entreprise doit contenir au moins 1 caractères.",
    "string.max": "Le nom de l'entreprise ne doit pas dépasser 50 caractères.",
  }),
  constructorSiret: Joi.string()
    .length(14)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.empty": "Le numéro SIRET est obligatoire.",
      "string.length": "Le numéro SIRET doit comporter 14 chiffres.",
      "string.pattern.base":
        "Le numéro SIRET doit être composé uniquement de chiffres.",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Allowing/disallowing specific TLDs (optional)
    .required()
    .messages({
      "string.empty": "L'email est obligatoire.",
      "string.email": "Veuillez entrer un email valide.",
    }),

  password: Joi.string().min(3).required().messages({
    "string.empty": "Le mot de passe est obligatoire.",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
    "string.empty": "Le numéro de téléphone est obligatoire.",
    "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
    "string.pattern.base":
      "Le numéro de téléphone doit être composé uniquement de chiffres.",
  }),
  city: Joi.string().min(3).required().messages({
    "string.empty": "La ville est obligatoire.",
    "string.min": "Le ville doit contenir au moins 3 caractères.",
  }),
  address: Joi.string().required().messages({
    "string.empty": "L'adresse est obligatoire.",
  }),
  zipCode: Joi.string().length(5).pattern(/^\d+$/).required().messages({
    "string.empty": "Le code postal est obligatoire.",
    "string.length": "Le code postal doit comporter 5 chiffres.",
    "string.pattern.base":
      "Le code postal doit être composé uniquement de chiffres.",
  }),
});
export default creatAccount;
