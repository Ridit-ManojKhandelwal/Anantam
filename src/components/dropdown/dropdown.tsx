import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as AngleLeftIcon } from "../../assets/svg/d-chevron.svg";

interface DropdownMenuProps {
  menuItems: string[];
  onItemClick: (item: string) => void;
  defaultValue: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  menuItems,
  onItemClick,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(defaultValue); // Initial selected item from props
  const dropdownRef = useRef<HTMLDivElement>(null); // Create a ref for the dropdown container

  // Function to toggle the dropdown open/close state
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleItemClick = (item: string) => {
    setSelectedItem(item); // Update the selected item for this dropdown
    onItemClick(item); // Pass the selected item to parent component
    setIsOpen(false); // Close dropdown after item selection
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close dropdown if click is outside
      }
    };

    // Add event listener for outside click
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        {selectedItem || defaultValue} {/* Display selected item */}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
          <AngleLeftIcon />
        </span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
