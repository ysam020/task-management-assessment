"use client";

import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { Box, Typography, Stack } from "@mui/material";
import { HowToRegOutlined } from "@mui/icons-material";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { registerSchema } from "@/lib/validations/auth.schema";

export default function RegisterPage() {
  const { register } = useAuth();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
          }}
        >
          <HowToRegOutlined sx={{ fontSize: 32, color: "#ffffff" }} />
        </Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" fontSize="0.9375rem">
          Get started with your task management
        </Typography>
      </Box>

      {/* Form */}
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={registerSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await register(values);
          } catch (error) {
            // Error is handled in context
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={2.5}>
              <Field name="name">
                {({ field }: any) => (
                  <Input
                    {...field}
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    disabled={isSubmitting}
                  />
                )}
              </Field>

              <Field name="email">
                {({ field }: any) => (
                  <Input
                    {...field}
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={isSubmitting}
                  />
                )}
              </Field>

              <Field name="password">
                {({ field }: any) => (
                  <Input
                    {...field}
                    type="password"
                    label="Password"
                    placeholder="Create a strong password"
                    showPasswordToggle
                    fullWidth
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={isSubmitting}
                  />
                )}
              </Field>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={isSubmitting}
              >
                Create Account
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          mt: 3,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "#667eea",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in instead
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
