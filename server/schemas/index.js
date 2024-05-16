const z = require('zod');

const FormSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Must be 1 or more characters long.' })
    .max(20, { message: 'Must be 20 or fewer characters long.' }),
});

module.exports = {
  FormSchema,
};
