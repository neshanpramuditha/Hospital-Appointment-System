import { useState } from "react";
import toast from "react-hot-toast";

import FormField from "../../assets/auth/FormField";
import Input from "../../assets/auth/Input";
import PasswordInput from "../../assets/auth/PasswordInput";
import PrimaryButton from "../../assets/auth/PrimaryButton";
import Divider from "../../assets/auth/Divider";
import SocialButton from "../../assets/auth/SocialButton";
import LinkButton from "../../assets/auth/LinkButton";
import StrengthMeter, {
  calcStrength,
} from "../../assets/auth/StrengthMeter";

import { GoogleIcon } from "../../assets/auth/icons";

import { useAuth } from "../../context/AuthContext";

export default function Register({ onSwitch }) {
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [strength, setStrength] = useState(0);

  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      toast.error("Please enter your last name.");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName,
        lastName,
        email,
        password,
      });

      toast.success(
        "Registration successful! Please login."
      );

      onSwitch();

    } catch (err) {
      toast.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2
        className="text-3xl font-bold text-slate-800"
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        Create Account
      </h2>

      <p
        className="mt-2 text-slate-500"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        Register as a patient to book appointments.
      </p>

      <form
        onSubmit={handleRegister}
        className="space-y-5 mt-8"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First Name">
            <Input
              value={firstName}
              placeholder="John"
              onChange={(e) =>
                setFirstName(e.target.value)
              }
            />
          </FormField>

          <FormField label="Last Name">
            <Input
              value={lastName}
              placeholder="Doe"
              onChange={(e) =>
                setLastName(e.target.value)
              }
            />
          </FormField>
        </div>

        <FormField label="Email Address">
          <Input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </FormField>

        <FormField label="Password">
          <PasswordInput
            value={password}
            placeholder="Create your password"
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(
                calcStrength(e.target.value)
              );
            }}
          />

          <StrengthMeter
            strength={strength}
          />
        </FormField>

        <PrimaryButton
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create My Account"}
        </PrimaryButton>
      </form>

      <Divider />

      <SocialButton>
        <GoogleIcon />
        Continue with Google
      </SocialButton>

      <p
        className="text-center text-sm text-slate-500 mt-6"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        Already have an account?{" "}
        <LinkButton onClick={onSwitch}>
          Login
        </LinkButton>
      </p>
    </div>
  );
}