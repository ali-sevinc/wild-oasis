import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateGuestForm from "./CreateGuestForm";

export default function AddBooking() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="guest-form">
          <Button>Add new booking</Button>
        </Modal.Open>
        <Modal.Window name="guest-form">
          <CreateGuestForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
