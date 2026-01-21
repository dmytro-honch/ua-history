import type { Dispatch, SetStateAction } from 'react';

type HeaderToggleProps = {
  isOpen: boolean;
  toogle: Dispatch<SetStateAction<boolean>>;
};
export const HeaderToggle = ({ isOpen, toogle }: HeaderToggleProps) => {
  const onClick = () => {
    toogle((prev) => !prev);
  };

  return (
    <button className={`header-toggle`} onClick={onClick}>
      <svg
        className={isOpen ? 'active' : ''}
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ stroke: 'currentColor', fill: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 6 10 L 26 10 C 42 -11, 16 16, 6 26" className="top" />
        <path d="M 6 16 L 26 16" className="middle" />
        <path d="M 6 22 L 26 22 C 42 43, 16 16, 6 6" className="bottom" />
      </svg>
    </button>
  );
};
