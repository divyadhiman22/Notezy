const { z } = require("zod");

const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .trim()
    .min(3, { message: "Email must be at least 3 characters" })
    .max(50, { message: "Email must not exceed 50 characters" })
    .regex(/[a-z]/, "Email must contain one small letter")
    .regex(/[@]/, "Email must contain @")
    .regex(/[.]/, "Email must contain a domain extension"),
    
  password: z.string({ required_error: "Password is required" })
    .trim()
    .min(5, { message: "Password must be at least 5 characters" })
    .max(50, { message: "Password must not exceed 50 characters" })
    .regex(/[A-Z]/, "Password must contain one capital letter")
    .regex(/[a-z]/, "Password must contain one small letter")
    .regex(/\W/, "Password must contain one special character"),
});

const signupSchema = loginSchema.extend({
  username: z.string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" }),
  phone: z.string({ required_error: "Phone number is required" })
    .trim()
    .min(10, { message: "Phone number should be of 10 digits" })
    .max(10, { message: "Phone should not be more than 10 digits" }),
});

module.exports = { signupSchema, loginSchema };
