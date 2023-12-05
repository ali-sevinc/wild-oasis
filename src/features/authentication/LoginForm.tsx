import { useState, FormEvent } from "react";

import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import useLogin from "./useLogin";
import Form from "../../ui/Form";

function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isLogin, mutateLogin } = useLogin();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) return;
    mutateLogin(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical id="email" label="Email address">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLogin}
        />
      </FormRowVertical>
      <FormRowVertical id="password" label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLogin}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button disabled={isLogin} sizes="large">
          {isLogin ? <SpinnerMini /> : "Login"}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
