import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

import FormField from "../../assets/auth/FormField";
import Input from "../../assets/auth/Input";
import PasswordInput from "../../assets/auth/PasswordInput";
import PrimaryButton from "../../assets/auth/PrimaryButton";
import Divider from "../../assets/auth/Divider";
import SocialButton from "../../assets/auth/SocialButton";
import LinkButton from "../../assets/auth/LinkButton";
import { GoogleIcon } from "../../assets/auth/icons";

import { useAuth } from "../../context/AuthContext";
import { DASHBOARD_ROUTES } from "../../utils/roles";

export default function Login({ onSwitch }) {
  const navigate = useNavigate();

  const {
    login,
    googleLogin,
    resetPassword,
    role,
    isAuthenticated,
    loading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [mode, setMode] = useState("login");
  const [goToPatientHome, setGoToPatientHome] = useState(false);

  // Redirect after successful login
  useEffect(() => {
    if (!loading && isAuthenticated && role) {
      if (goToPatientHome) {
        navigate("/patient/home", {
          replace: true,
        });
        return;
      }

      toast.success("Welcome back!");

      navigate(DASHBOARD_ROUTES[role], {
        replace: true,
      });
    }
  }, [loading, isAuthenticated, role, navigate, goToPatientHome]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (mode === "forgot-password") {
      try {
        setSubmitting(true);

        await resetPassword(email);
        toast.success("Password reset instructions have been sent to your email. Please check your inbox and spam folder.");
        setOtpStep(false);
        setOtpCode("");
        setMode("login");
      } catch (err) {
        toast.error(err.message || "Password reset failed.");
      } finally {
        setSubmitting(false);
      }

      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setSubmitting(true);
      setGoToPatientHome(false);

      await login(email, password);

      // Redirect handled automatically by useEffect
    } catch (err) {
      toast.error(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setMode((currentMode) => (currentMode === "login" ? "forgot-password" : "login"));
    setOtpStep(false);
    setOtpCode("");
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      if (!credentialResponse?.credential) {
        throw new Error("Google sign-in did not return a credential.");
      }

      setGoToPatientHome(true);
      await googleLogin(credentialResponse.credential);
      toast.success("Google sign-in successful.");
      navigate("/patient/home", { replace: true });
    } catch (err) {
      toast.error(err.message || "Google login failed.");
    }
  }

  function handleGoogleError() {
    toast.error("Google login was cancelled or failed.");
  }

  return (
    <div>
      <h2
        className="text-3xl font-bold text-slate-800"
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {mode === "forgot-password" ? "Reset Password" : "Welcome Back"}
      </h2>

      <p
        className="mt-2 text-slate-500"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        {mode === "forgot-password"
          ? "Enter your email and verify the OTP before resetting your password."
          : "Login to your Hospital Appointment System account."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 mt-8"
      >
        <FormField label="Email Address">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        {mode !== "forgot-password" && (
          <FormField label="Password">
            <PasswordInput
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
        )}

        {otpStep && (
          <FormField label="OTP Code">
            <Input
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
          </FormField>
        )}

        <div className="flex justify-end">
          <LinkButton onClick={toggleMode}>
            {mode === "forgot-password" ? "Back to Login" : "Forgot Password?"}
          </LinkButton>
        </div>

        <PrimaryButton
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Please wait..."
            : mode === "forgot-password"
              ? "Send Reset Link"
              : "Sign In"}
        </PrimaryButton>
      </form>

      <Divider />

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          text="signin"
          locale="en"
          render={(renderProps) => (
            <SocialButton onClick={renderProps.onClick} disabled={renderProps.disabled}>
              <GoogleIcon />
              Login With Google
            </SocialButton>
          )}
        />
      </div>

      <p
        className="text-center text-sm text-slate-500 mt-6"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        Don't have an account?{" "}
        <LinkButton onClick={onSwitch}>
          Register
        </LinkButton>
      </p>
    </div>
  );
}