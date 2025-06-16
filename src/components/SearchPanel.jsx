import React, { useMemo, useRef, useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const initialFilters = {
  age: 'All',
  county: 'All',
  insurance: 'All',
  cw: 'All',
  eligibility: 'All',
  category: 'All',
  partners: [],
  search: ''
};

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

const formatAge = r => {
  if (!r || (r.min == null && r.max == null)) return '';
  return `${r.min ?? ''}-${r.max ?? ''}`;
};

const SearchPanel = ({ services, filters, setFilters }) => {
  const searchInputRef = useRef();
  const [isActive, setIsActive] = useState(false);

  const ageOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      const str = formatAge(s.age_range);
      if (str) set.add(str);
    });
    return ['All', ...Array.from(set)];
  }, [services]);

  const countyOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      const list = Array.isArray(s.county_restrictions)
        ? s.county_restrictions
        : s.county_restrictions
          ? String(s.county_restrictions).split(/,|\n/)
          : [];
      list.forEach(c => { const val = c.trim(); if (val) set.add(val); });
    });
    return ['All', ...Array.from(set)];
  }, [services]);

  const insuranceOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      (s.insurance_types || []).forEach(i => set.add(i));
    });
    return ['All', ...Array.from(set)];
  }, [services]);

  const cwOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => { if (s.system) set.add(s.system); });
    return ['All', ...Array.from(set)];
  }, [services]);

  const partnerOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      const raw = typeof s.partners_involved === 'string'
        ? s.partners_involved.split(/\n|,/)
        : s.partners_involved || [];
      raw.forEach(p => {
        const val = p.trim();
        if (!val) return;
        if (val.length > 30) return;
        if (/[:.]/.test(val)) return;
        if (val.split(/\s+/).length > 4) return;
        set.add(val);
      });
    });
    return Array.from(set);
  }, [services]);

  // Listen for any keydown event and focus the search input
  useEffect(() => {
    const handleKeyDown = e => {
      if (
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA' ||
        document.activeElement.isContentEditable
      ) {
        return;
      }
      if (e.key.length === 1) {
        setIsActive(true);
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const togglePartner = tag => {
    setFilters(prev => {
      const exists = prev.partners.includes(tag);
      const partners = exists
        ? prev.partners.filter(p => p !== tag)
        : [...prev.partners, tag];
      return { ...prev, partners };
    });
  };

  const clearAll = () => setFilters(initialFilters);

  const clearSearch = () => setFilters(prev => ({ ...prev, search: '' }));

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
          <CustomDropdown options={ageOptions} value={filters.age} onChange={val => handleChange('age', val)} />
          <CustomDropdown options={countyOptions} value={filters.county} onChange={val => handleChange('county', val)} />
          <CustomDropdown options={insuranceOptions} value={filters.insurance} onChange={val => handleChange('insurance', val)} />
          <CustomDropdown options={cwOptions} value={filters.cw} onChange={val => handleChange('cw', val)} />
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
            value={filters.search}
            onChange={e => handleChange('search', e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter'){}}}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
          {filters.search && (
            <button onClick={clearSearch}>
              <IoMdClose className="text-gray-400 text-lg" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap overflow-x-auto gap-2 mt-1 pb-2">
          {partnerOptions.map(tag => (
            <button
              key={tag}
              style={buttonTextStyle}
              onClick={() => togglePartner(tag)}
              className={`px-3 py-2 rounded-full border-2 font-medium whitespace-nowrap transition-colors duration-150 ${
                filters.partners.includes(tag)
                  ? 'bg-[#D14B3A] text-white border-[#D14B3A]'
                  : 'bg-white text-[#222] border-[#E8ECFF] hover:bg-white hover:border-gray-300'
              }`}
            >
              {tag}
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