import { useState, FormEvent } from "react";

import useUpdateUser from "./useUpdateUser";
import useUser from "./useUser";

import FileInput from "../../ui/FileInput";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Form from "../../ui/Form";

function UpdateUserDataForm() {
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  const { isUpdatingUser, userMutate } = useUpdateUser();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!fullName) return;
    userMutate(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          disabled={isUpdatingUser}
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          disabled={isUpdatingUser}
          id="avatar"
          accept="image/*"
          onChange={(e) =>
            setAvatar(e?.target?.files?.[0] ? e.target.files[0] : null)
          }
        />
      </FormRow>
      <FormRow>
        <Button
          onClick={() => {
            setAvatar(null);
            setFullName(currentFullName);
          }}
          disabled={isUpdatingUser}
          type="reset"
          $variation="secondary"
        >
          Cancel
        </Button>
        <Button disabled={isUpdatingUser}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
