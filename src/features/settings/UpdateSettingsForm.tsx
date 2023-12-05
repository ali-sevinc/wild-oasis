import useSettings from "./useSettings";
import useUpdateSetting from "./useUpdateSetting";

import FormRow from "../../ui/FormRow";
import Spinner from "../../ui/Spinner";
import Input from "../../ui/Input";
import Form from "../../ui/Form";

type NameType =
  | "minBookingLength"
  | "maxBookingLength"
  | "maxGuestsPerBooking"
  | "breakfastPrice";

function UpdateSettingsForm() {
  const { data, isLoading } = useSettings();

  const { isPending, mutate } = useUpdateSetting();

  function handleUpdate(value: number, name: NameType) {
    // console.log(value, name);
    if (!value) return;
    mutate({ [name]: value });
  }

  if (isLoading) return <Spinner />;

  return (
    <Form>
      <FormRow id="min-nights" label="Minimum nights/booking">
        <Input
          disabled={isPending}
          defaultValue={data?.minBookingLength}
          type="number"
          id="min-nights"
          onBlur={(e) => handleUpdate(+e.target.value, "minBookingLength")}
        />
      </FormRow>
      <FormRow id="max-nights" label="Maximum nights/booking">
        <Input
          disabled={isPending}
          defaultValue={data?.maxBookingLength}
          type="number"
          id="max-nights"
          onBlur={(e) => handleUpdate(+e.target.value, "maxBookingLength")}
        />
      </FormRow>
      <FormRow id="max-guests" label="Maximum guests/booking">
        <Input
          disabled={isPending}
          defaultValue={data?.maxGuestsPerBooking}
          type="number"
          id="max-guests"
          onBlur={(e) => handleUpdate(+e.target.value, "maxGuestsPerBooking")}
        />
      </FormRow>
      <FormRow id="breakfast-price" label="Breakfast price">
        <Input
          disabled={isPending}
          defaultValue={data?.breakfastPrice}
          type="number"
          id="breakfast-price"
          onBlur={(e) => handleUpdate(+e.target.value, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
