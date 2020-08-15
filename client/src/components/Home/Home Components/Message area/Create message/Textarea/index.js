import React, { useState, useRef } from 'react';

/**
 * MAIN COMPONENT
 * - responsible for displaying a textarea which is fully controlled
 */
const ControlledTextarea = ({
  value,
  setValue,
  submit,
  onFocus,
  placeholder,
  onKeyUp
}) => {
  // using state to store scroll height value
  // to know if user has reached second line of textarea
  const [scrollHeight, setScrollHeight] = useState(38);
  // using state to set overflow if more than 5 rows are already used
  const [overflow, setOverflow] = useState('hidden');
  // using state to set rows
  let [rows, setRows] = useState(1);
  // using reference to get the scroll height
  const textRef = useRef(null);

  const manageTextarea = e => {
    // if user has reached end of line
    if (scrollHeight < textRef.current.scrollHeight) {
      // set the scroll height
      setScrollHeight(textRef.current.scrollHeight);
      // if rows are equal to 5 and overflow is also hidden
      if (rows === 5 && overflow === 'hidden') {
        // set the overflow to auto
        setOverflow('auto');
      } else if (rows < 5) {
        // increment and set rows if they are less than 5
        setRows(++rows);
      }
    }
    // set rows back to one if textarea is empty
    if (e.target.value === '') resetTextarea();
  };

  const resetTextarea = () => {
    setOverflow('hidden');
    setRows(1);
    setScrollHeight(38);
  };

  return (
    <textarea
      className="msg__input"
      style={{ overflow }}
      ref={textRef}
      value={value}
      onPaste={e => {
        let rowVal = Math.floor(
          [...value.split(' '), ...e.clipboardData.getData('Text').split(' ')]
            .length / 10
        );
        setValue(value + e.clipboardData.getData('Text'));
        setRows(rowVal || 1);
        if (rows === 5 && overflow === 'hidden') setOverflow('auto');
      }}
      onChange={e => {
        // set value when user types something
        setValue(e.target.value);
        manageTextarea(e);
      }}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          if (e.shiftKey === true) {
            manageTextarea(e);
          } else {
            // if it's enter key and shift is not helled down
            // then submit the form
            e.preventDefault();
            submit(e);
            resetTextarea();
          }
        }
      }}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      rows={rows}
      placeholder={placeholder}></textarea>
  );
};

export default ControlledTextarea;
