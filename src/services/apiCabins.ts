import supabase from "./supabase";
import { PostgrestResponse } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;

export type FormDataType = {
  name: string;
  maxCapacity: string;
  regularPrice: string;
  discount: string;
  description: string;
  image: FileList | string;
};

interface CabinType {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

export async function createEditCabin(newCabin: FormDataType, id?: number) {
  // console.log(newCabin.image instanceof FileList);
  const imageName =
    newCabin.image instanceof FileList
      ? `${Math.random()}-${newCabin.image[0].name}`.replaceAll("/", "")
      : newCabin.image;

  const imagePath =
    newCabin.image instanceof FileList
      ? `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
      : newCabin.image;

  // console.log(imagePath);
  const convertedData = { ...newCabin, image: imagePath };

  let data;
  let error;
  if (!id) {
    const {
      data: createData,
      error: createError,
    }: PostgrestResponse<CabinType> = await supabase
      .from("cabins")
      .insert([convertedData])
      .select();
    data = createData;
    error = createError;
  }
  if (id) {
    const { data: editData, error: editError }: PostgrestResponse<CabinType> =
      await supabase.from("cabins").update(convertedData).eq("id", id).select();
    data = editData;
    error = editError;
  }

  // console.log(data);
  if (error) {
    console.log(error);
    throw new Error("Cabin could not be created.");
  }

  //2-> upload image.
  if (newCabin.image instanceof FileList) {
    const { error: uploadError } = await supabase.storage
      .from("cabin-images")
      .upload(imageName, newCabin.image[0]);

    //3 -> delete currently created cabin if there was a error while uploading image.
    if (uploadError) {
      await supabase.from("cabins").delete().eq("id", data?.[0].id);
      console.log(uploadError);
      throw new Error("Cabin image could not be uploaded.");
    }
  }

  return data;
}

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins could not loaded.");
  } else {
    return data;
  }
}

export async function deleteCabin(id: number) {
  const { error, data } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be deleted.");
  } else {
    return data;
  }
}
