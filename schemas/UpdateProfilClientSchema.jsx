import Joi from "joi";

const updateProfileClientSchema = {
  firstname: Joi.string().min(2).max(30).optional().messages({
    "string.empty": "Le prénom est obligatoire.",
    "string.min": "Le prénom doit contenir au moins 2 caractères.",
    "string.max": "Le prénom ne doit pas dépasser 30 caractères.",
  }),
  lastname: Joi.string().min(2).max(30).optional().messages({
    "string.empty": "Le nom est obligatoire.",
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "string.max": "Le nom ne doit pas dépasser 30 caractères.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      "string.empty": "L'email est obligatoire.",
      "string.email": "Veuillez entrer un email valide.",
    }),
  password: Joi.string().min(0).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 8 caractères.",
  }),
};

export default updateProfileClientSchema;
