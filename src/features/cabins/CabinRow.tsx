import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";

import { formatCurrency } from "../../utils/helpers";

import useCreateCabin from "./useCreateCabin";
import useDeleteCabin from "./useDeleteCabin";

import ConfirmDelete from "../../ui/ConfirmDelete";
import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

export interface CabinType {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

export default function CabinRow({ cabin }: { cabin: CabinType }) {
  const { isPending, mutate } = useDeleteCabin();
  const { createMutate } = useCreateCabin();

  function handleDuplicate() {
    createMutate({
      name: "Copy of " + cabin.name,
      image: cabin.image,
      description: cabin.description,
      discount: cabin.discount.toString(),
      maxCapacity: cabin.maxCapacity.toString(),
      regularPrice: cabin.regularPrice.toString(),
    });
  }

  return (
    <>
      <Table.Row>
        <Img src={cabin.image} alt={cabin.description} />
        <Cabin>{cabin.name}</Cabin>
        <div>Fits up {cabin.maxCapacity}</div>
        <Price>{formatCurrency(cabin.regularPrice)}</Price>
        {cabin.discount > 0 ? (
          <Discount>{formatCurrency(cabin.discount)}</Discount>
        ) : (
          <p>&mdash;</p>
        )}
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={cabin.id} />

              <Menus.List id={cabin.id}>
                <Menus.Button
                  icon={<HiSquare2Stack />}
                  onClick={handleDuplicate}
                >
                  Duplicate
                </Menus.Button>

                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Menu>

            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabin"
                disabled={isPending}
                onConfirm={() => mutate(cabin.id)}
              />
            </Modal.Window>
          </Modal>
        </div>
      </Table.Row>
    </>
  );
}
