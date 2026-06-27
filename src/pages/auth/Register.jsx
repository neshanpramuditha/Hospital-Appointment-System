import { useState } from "react";

import FormField from "../../components/auth/FormField";
import Input from "../../components/auth/Input";
import PasswordInput from "../../components/auth/PasswordInput";
import PrimaryButton from "../../components/auth/PrimaryButton";
import SocialButton from "../../components/auth/SocialButton";
import Divider from "../../components/auth/Divider";
import LinkButton from "../../components/auth/LinkButton";
import StrengthMeter, {
  calcStrength,
} from "../../components/auth/StrengthMeter";

import { GoogleIcon } from "../../components/auth/icons";

export default function Register({ onSwitch }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const handleRegister = (e) => {
    e.preventDefault();

    console.log({
      firstName,
      lastName,
      email,
      password,
    });
  };

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
        Register to book appointments with doctors.
      </p>

      <form
        onSubmit={handleRegister}
        className="mt-8 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">

          <FormField label="First Name">
            <Input
              placeholder="John"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
            />
          </FormField>

          <FormField label="Last Name">
            <Input
              placeholder="Doe"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
            />
          </FormField>

        </div>

        <FormField label="Email Address">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </FormField>

        <FormField label="Password">
          <PasswordInput
            value={password}
            placeholder="Create a password"
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(
                calcStrength(e.target.value)
              );
            }}
          />

          <StrengthMeter strength={strength} />
        </FormField>

        <PrimaryButton type="submit">
          Create My Account
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