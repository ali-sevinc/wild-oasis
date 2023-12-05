import { ReactNode, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import useUser from "../features/authentication/useUser";

import Spinner from "./Spinner";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const { isLoading, isAuthenticated } = useUser();

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) {
        navigate("/login");
        return;
      }
    },
    [navigate, isAuthenticated, isLoading]
  );

  if (isLoading)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );

  if (isAuthenticated) return children;
}
