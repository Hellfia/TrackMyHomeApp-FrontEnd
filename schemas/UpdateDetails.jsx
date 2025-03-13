import Joi from "joi";

const updateDetails = Joi.object({
  status: Joi.string()
    .valid("À venir", "En cours", "Terminé")
    .optional()
    .messages({
      "any.only":
        'Le statut doit être l\'un des suivants : "À venir", "En cours", "Terminé".',
    }),
  date: Joi.date().iso().optional().messages({
    "date.base": "La date de début doit être une date valide.",
  }),
  dateEnd: Joi.date().iso().optional().min(Joi.ref("date")).messages({
    "date.min":
      'La "Date de fin prévue" doit être au même jour ou après la "Date de début".',
  }),
  content: Joi.string().min(0).max(500).optional().messages({
    "string.max": "Le commentaire ne peut pas dépasser 500 caractères.",
  }),
});
export default updateDetails;
