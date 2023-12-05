import { HiArrowRightOnRectangle } from "react-icons/hi2";

import useLogout from "./useLogout";

import SpinnerMini from "../../ui/SpinnerMini";
import ButtonIcon from "../../ui/ButtonIcon";

export default function Logout() {
  const { isLogout, mutateLogout } = useLogout();

  return (
    <ButtonIcon onClick={() => mutateLogout()} disabled={isLogout}>
      {isLogout ? <SpinnerMini /> : <HiArrowRightOnRectangle />}
    </ButtonIcon>
  );
}
