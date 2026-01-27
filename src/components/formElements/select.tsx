import { capitalizeFirstChar } from '@/lib/textHelpers';
import { useState } from 'react';

type Value<T> = T;
type Option<T> = {
  value: Value<T>;
  text: string;
};

type Orientation = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type OpenPosition = 'top' | 'right' | 'bottom' | 'left';
type SelectProps<T> = {
  options: Option<T>[];
  current: Option<T>['value'];
  onChange: (value: T) => void;
  label?: string;
  orientation?: Orientation;
  openPosition?: OpenPosition;
  minWidth?: number;
};

export function Select<T>({ options, current, onChange, label, orientation = 'row', openPosition = 'bottom', minWidth = 15 }: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const onSelect = (value: Value<T>) => {
    onChange(value);
    setIsOpen(false);
  };

  const onCLick = () => {
    setIsOpen((prev) => !prev);
  };

  const currentText = options.find(({ value }) => value === current)?.text;
  const chevronClass = isOpen ? 'opened' : '';

  return (
    <div className="select__wrapper" style={{ flexDirection: orientation }}>
      <button onClick={onCLick} className="select__button" style={{ minWidth: `${minWidth}rem` }}>
        {label && (
          <label htmlFor={`select__${label}`} className="select__label">
            {capitalizeFirstChar(label)} :
          </label>
        )}
        <div className="select">
          <span>{currentText} </span>
          <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg" className={chevronClass}>
            <path d="M5.29297 1L3 3.29297L0.707031 1L1 0.707031L3 2.70703L5 0.707031L5.29297 1Z" style={{ stroke: 'currentColor' }} />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="select__overlay" onClick={() => setIsOpen(false)} />
          <ul className={`select__list ${openPosition}`}>
            {options.map((option) => {
              const isDisabled = option.value === current;

              return (
                <li onClick={() => !isDisabled && onSelect(option.value)} className={`select__option ${isDisabled ? 'disabled' : ''}`} key={option.text}>
                  {capitalizeFirstChar(option.text)}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
