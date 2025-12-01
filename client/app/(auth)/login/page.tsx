"use client";

import { Formik, Form, Field } from "formik";
import Link from "next/link";
import { Box, Typography, Stack, alpha } from "@mui/material";
import { LoginOutlined } from "@mui/icons-material";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/lib/validations/auth.schema";

export default function LoginPage() {
  const { login } = useAuth();

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
          <LoginOutlined sx={{ fontSize: 32, color: "#ffffff" }} />
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
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" fontSize="0.9375rem">
          Sign in to continue to your tasks
        </Typography>
      </Box>

      {/* Form */}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login(values);
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
                    placeholder="Enter your password"
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
                Sign In
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
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#667eea",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create one now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
