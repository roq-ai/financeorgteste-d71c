import * as yup from 'yup';

export const paymentsValidationSchema = yup.object().shape({
  amount: yup.number().integer().required(),
  date: yup.date().required(),
  user_id: yup.string().nullable(),
});
