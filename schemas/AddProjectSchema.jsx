import Joi from "joi";

const addProject = Joi.object({
  firstname: Joi.string().min(1).required().messages({
    "string.empty": "Le prénom est obligatoire.",
    "string.min": "Le prénom doit comporter au moins 1 caractères.",
  }),
  lastname: Joi.string().min(1).required().messages({
    "string.empty": "Le nom est obligatoire.",
    "string.min": "Le nom doit comporter au moins 1 caractères.",
  }),
  phoneNumber: Joi.string().length(10).pattern(/^\d+$/).required().messages({
    "string.empty": "Le numéro de téléphone est obligatoire.",
    "string.length": "Le numéro de téléphone doit comporter 10 chiffres.",
    "string.pattern.base":
      "Le numéro de téléphone doit être composé uniquement de chiffres.",
  }),
  constructionAdress: Joi.string().min(1).required().messages({
    "string.empty": "L'adresse du chantier est obligatoire.",
    "string.min": "L'adresse du chantier doit comporter au moins 1 caractères.",
  }),
  constructionZipCode: Joi.string()
    .length(5)
    .pattern(/^\d+$/)
    .required()
    .messages({
      "string.empty": "Le code postal est obligatoire.",
      "string.length": "Le code postal doit comporter 5 chiffres.",
      "string.pattern.base":
        "Le code postal doit être composé uniquement de chiffres.",
    }),
  constructionCity: Joi.string().min(3).required().messages({
    "string.empty": "La ville du chantier est obligatoire.",
    "string.min": "La ville du chantier doit comporter au moins 3 caractères.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Allowing/disallowing specific TLDs (optional)
    .required()
    .messages({
      "string.empty": "L'email est obligatoire.",
      "string.email": "Veuillez entrer un email valide.",
    }),
  password: Joi.string().min(0).required().messages({
    "string.empty": "Le mot de passe est obligatoire.",
    "string.min": "Le mot de passe doit comporter au moins 6 caractères.",
  }),
});

export default addProject;
