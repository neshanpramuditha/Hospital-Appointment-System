import { useState } from "react";

import FormField from "../../components/auth/FormField";
import Input from "../../components/auth/Input";
import PasswordInput from "../../components/auth/PasswordInput";
import PrimaryButton from "../../components/auth/PrimaryButton";
import SocialButton from "../../components/auth/SocialButton";
import Divider from "../../components/auth/Divider";
import LinkButton from "../../components/auth/LinkButton";

import { GoogleIcon } from "../../components/auth/icons";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO
    console.log({
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
        Welcome Back
      </h2>

      <p
        className="mt-2 text-slate-500"
        style={{
          fontFamily: "Inter, sans-serif",
        }}
      >
        Sign in to continue to your account.
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-8 space-y-5"
      >

        <FormField label="Email Address">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>

        <FormField label="Password">
          <PasswordInput
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
          />
        </FormField>

        <div className="flex justify-end">
          <LinkButton>
            Forgot Password?
          </LinkButton>
        </div>

        <PrimaryButton type="submit">
          Login
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
        Don't have an account?{" "}

        <LinkButton onClick={onSwitch}>
          Register
        </LinkButton>

      </p>

    </div>
  );
}