import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

interface ButtonProps {
  sizes?: "small" | "medium" | "large";
  $variation?: "primary" | "secondary" | "danger";
}

const Button = styled.button<ButtonProps>`
  font-size: 1.4rem;
  border: none;
  cursor: pointer;
  padding: 1.2rem 1.6rem;
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);

  ${(props) => props.sizes && sizes[props.sizes]}

  ${(props) => props.$variation && variations[props.$variation]}
`;

Button.defaultProps = {
  sizes: "medium",
  $variation: "primary",
};
export default Button;
