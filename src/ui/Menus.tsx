import {
  ReactNode,
  createContext,
  useState,
  useContext,
  MouseEvent,
  useEffect,
  RefObject,
} from "react";
import { createPortal } from "react-dom";

import styled from "styled-components";
import { HiEllipsisVertical } from "react-icons/hi2";

import useOutsideClick from "../hooks/useOutsideClick";

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

type ListType = {
  $position: { x: number; y: number } | null;
};
const StyledList = styled.ul<ListType>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props?.$position?.x}px;
  top: ${(props) => props?.$position?.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusType {
  openId: number | string;
  position: null | { x: number; y: number };
  open: (id: number) => void;
  close: () => void;
  onPosition: (pos: { x: number; y: number }) => void;
}

const initialState: MenusType = {
  openId: "",
  position: null,
  close: () => {},
  open: () => {},
  onPosition: () => {},
};

const MenusContext = createContext(initialState);

export default function Menus({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<number | string>("");
  const [position, setPosition] = useState<null | { x: number; y: number }>(
    null
  );

  const open = (id: number) => setOpenId(id);
  const close = () => setOpenId("");
  const onPosition = (pos: { x: number; y: number }) => setPosition(pos);

  useEffect(
    function () {
      function handleScroll() {
        if (openId) {
          close();
          document.removeEventListener("wheel", handleScroll);
        }
      }
      if (openId) document.addEventListener("wheel", handleScroll);
      return () => document.removeEventListener("wheel", handleScroll);
    },
    [openId]
  );

  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, onPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: { id: number }) {
  const { open, close, openId, onPosition } = useContext(MenusContext);

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    const rect = (event.target as HTMLElement)
      .closest("button")!
      .getBoundingClientRect();

    onPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    });

    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}

interface ListPropsType {
  children: ReactNode;
  id: number;
}
function List({ children, id }: ListPropsType) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, false) as RefObject<HTMLUListElement>;
  if (openId !== id) return null;

  return createPortal(
    <StyledList $position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body
  );
}

interface ButtonType {
  children: ReactNode;
  icon: JSX.Element;
  onClick?: () => void;
}
function Button({ children, icon, onClick }: ButtonType) {
  const { close } = useContext(MenusContext);
  function handleClick() {
    onClick && onClick();
    close();
  }

  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
