import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

// Example options
const ageOptions = ["Age", "0-5", "6-12", "13-17", "18+"];
const countyOptions = ["County", "Alameda", "Los Angeles", "Sacramento", "San Diego"];
const insuranceOptions = [
  "Insurance",                             
  "Private",
  "MediCal Managed Care",
  "MediCal FFS",
  "Other"
];
const cwOptions = ["CW", "Option 1", "Option 2", "Option 3"];

const filterChips = [
  "All", "MHP", "CWS", "Probation", "Regional Center", "Education",
  "Child Welfare", "Behavioral Health", "Hyperlink", "Health Plan", "ASAM"
];

const buttonTextStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '100%',
  letterSpacing: '0%',
  textTransform: 'capitalize'
};

// Custom dropdown using div/ul
const CustomDropdown = ({ options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Determine border color
  const borderColor = open ? "#005CB9" : "#bfc6ea";

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        className={`
          min-w-full rounded-xl bg-white
          flex justify-between items-center
          px-3 py-2 text-[14px] sm:text-[14px] md:text-[15px]
          focus:outline-none whitespace-nowrap min-h-[44px]
          transition-colors duration-150
        `}
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 500,
          lineHeight: '100%',
          letterSpacing: '0%',
          textTransform: 'capitalize',
          border: `2px solid ${borderColor}`,
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="truncate">{value}</span>
        <span className="ml-2 flex-shrink-0">
          <svg width="14" height="10" viewBox="0 0 24 16" fill="none">
            <polygon points="12,14 4,6 20,6" fill="#3B4A9F"/>
          </svg>
        </span>
      </button>
      {open && (
        <ul
          className={`
            absolute left-0 mt-1 w-full bg-white border border-[#bfc6ea] rounded-xl shadow z-50
            text-[13px] sm:text-[14px] md:text-[15px]
            max-h-56 overflow-y-auto
          `}
        >
          {options.map((opt) => (
            <li
              key={opt}
              className={`
                px-3 py-2 cursor-pointer hover:bg-blue-100 transition
                ${opt === value ? "bg-blue-50 font-semibold" : ""}
              `}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SearchPanel = ({ onSearch }) => {
  // State for selected filter and search input
  const [selectedFilter, setSelectedFilter] = useState(0); // Default to "All"
  const [searchInput, setSearchInput] = useState('');
  const [age, setAge] = useState(ageOptions[0]);
  const [county, setCounty] = useState(countyOptions[0]);
  const [insurance, setInsurance] = useState(insuranceOptions[0]);
  const [cw, setCw] = useState(cwOptions[0]);
  const [isActive, setIsActive] = useState(false);
  const searchInputRef = useRef();

  // Listen for any keydown event and focus the search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea already
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.isContentEditable
      ) {
        return;
      }
      // Only activate for visible characters (not ctrl, shift, etc.)
      if (e.key.length === 1) {
        setIsActive(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Send filters to parent whenever any filter/search changes
  useEffect(() => {
    if (onSearch) {
      onSearch({
        search: searchInput,
        age,
        county,
        insurance,
        cw,
        selectedFilter: filterChips[selectedFilter]
      });
    }
    // eslint-disable-next-line
  }, [searchInput, age, county, insurance, cw, selectedFilter]);

  // Handle filter selection
  const handleFilterSelect = (index) => {
    setSelectedFilter(index);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchInput('');
  };
  
  // Clear all filters and search
  const clearAll = () => {
    setSelectedFilter(0);
    setSearchInput('');
    setAge(ageOptions[0]);
    setCounty(countyOptions[0]);
    setInsurance(insuranceOptions[0]);
    setCw(cwOptions[0]);
  };

  // Handle Enter key in search bar (optional, but not needed for auto-update)
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      // No-op, since filtering is now live
    }
  };

  return (
    <div className="w-screen flex flex-col items-center bg-[#f6f8ff] py-6 border border-blue-200 rounded-b-lg px-4">
      {/* Description */}
      <div
        className="w-full md:w-[75%] mx-auto text-xs text-gray-700 mb-4 px-4  md:text-center sm:text-justify "
        style={{ fontSize: "14px" }}
      >
        CBSI activates CFPIC's vision to support AB 2083 Children, Youth & Families System of Care (CYFSOC) leadership by helping them advance their partnerships across all child and family serving systems, at every level. The goals of CBSI are to enhance the care continuum for children and youth, and particularly those with complex care needs and who are involved in multiple systems.
      </div>

      {/* Filters */}
      <div className="md:w-[75%] bg-[#f6f8ff] rounded-xl p-4 shadow flex flex-col gap-3 sm:w-full">
        {/* Dropdowns */}
        <div className="flex gap-4 w-full flex-col sm:flex-row">
          <CustomDropdown options={ageOptions} value={age} onChange={setAge} />
          <CustomDropdown options={countyOptions} value={county} onChange={setCounty} />
          <CustomDropdown options={insuranceOptions} value={insurance} onChange={setInsurance} />
          <CustomDropdown options={cwOptions} value={cw} onChange={setCw} />
        </div>
        {/* Search Bar */}
        <div className={`flex items-center rounded-lg px-4 py-4 bg-white transition-all duration-150
          ${isActive ? "border-[#005CB9]" : "border-[#B7B9EA]"}
        `}
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
        }}>
          <FaSearch className="text-gray-400 mr-2" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search"
            className={`flex-1 bg-white outline-none border-none shadow-none focus:ring-0 text-gray-700 transition-all duration-150`}
            style={{ boxShadow: "none" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
          {searchInput && (
            <button onClick={clearSearch}>
              <IoMdClose className="text-gray-400 text-lg" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap overflow-x-auto gap-2 mt-1 pb-2">
          {filterChips.map((chip, idx) => (
            <button
              key={chip}
              style={buttonTextStyle}
              onClick={() => handleFilterSelect(idx)}
              className={`px-3 py-2 rounded-full border-2 font-medium whitespace-nowrap transition-colors duration-150
                ${idx === selectedFilter
                  ? 'bg-[#D14B3A] text-white border-[#D14B3A]'
                  : 'bg-white text-[#222] border-[#E8ECFF] hover:bg-white hover:border-gray-300'
                }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All Button moved outside */}
      <div className="w-[100%] sm:w-[75%] flex justify-end mt-2 ">
        <button
          onClick={clearAll}
          style={buttonTextStyle}
          className="bg-[#3eb6e0] text-white px-4 py-2 rounded-xl text-sm"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default SearchPanel;