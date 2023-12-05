import useCheckout from "./useChekout";

import Button from "../../ui/Button";

function CheckoutButton({ bookingId }: { bookingId: number }) {
  const { checkout, isLoadingCheckout } = useCheckout();

  return (
    <Button
      onClick={() => checkout(bookingId)}
      disabled={isLoadingCheckout}
      $variation="primary"
      sizes="small"
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
