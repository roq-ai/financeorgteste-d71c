import * as yup from 'yup';

export const savingsValidationSchema = yup.object().shape({
  goal_amount: yup.number().integer().required(),
  current_amount: yup.number().integer().required(),
  user_id: yup.string().nullable(),
});
