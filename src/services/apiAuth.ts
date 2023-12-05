import supabase from "./supabase";
const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;

export type Login = { email: string; password: string };
export async function login({ email, password }: Login) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw new Error(error.message);

  return { data, error };
}

export async function getUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

interface SignUpType {
  fullName: string;
  email: string;
  password: string;
}
export async function signup({ fullName, email, password }: SignUpType) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

interface UpdateType {
  password?: string;
  fullName?: string;
  avatar?: File | null;
}
export async function updateUser({ password, fullName, avatar }: UpdateType) {
  //update password or fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  const { data, error: updateError } = await supabase.auth.updateUser(
    updateData!
  );
  if (updateError) throw new Error(updateError.message);
  if (!avatar) return data;

  //upload avatar
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);
  //set avatar

  const { data: avatarData, error: avatarError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (avatarError) throw new Error(avatarError.message);

  return avatarData;
}
