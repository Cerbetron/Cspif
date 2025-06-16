import React, { useMemo } from 'react';

const Dropdown = ({ label, value, options, onChange }) => (
  <select
    className="border rounded px-2 py-1 w-full"
    value={value}
    onChange={e => onChange(e.target.value)}
  >
    <option value="All">All {label}</option>
    {options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const SearchPanel = ({ services, filters, setFilters }) => {
  // compute dropdown options from services
  const ageOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      const r = s.age_range;
      if (!r || (r.min == null && r.max == null)) return;
      const str = `${r.min ?? ''}-${r.max ?? ''}`;
      set.add(str);
    });
    return Array.from(set);
  }, [services]);

  const countyOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      (s.county_restrictions || []).forEach(c => set.add(c));
    });
    return Array.from(set);
  }, [services]);

  const insuranceOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      (s.insurance_types || []).forEach(i => set.add(i));
    });
    return Array.from(set);
  }, [services]);

  const systemOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      if (s.system) set.add(s.system);
    });
    return Array.from(set);
  }, [services]);

  const partnerOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => {
      const val = typeof s.partners_involved === 'string' ? s.partners_involved.split(/\n|,/) : s.partners_involved;
      (val || []).forEach(p => { if (p) set.add(p.trim()); });
    });
    return Array.from(set);
  }, [services]);

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

  const clearAll = () => {
    setFilters({
      age: 'All',
      county: 'All',
      insurance: 'All',
      cw: 'All',
      eligibility: 'All',
      category: 'All',
      partners: [],
      search: ''
    });
  };

  return (
    <div className="p-4 bg-[#f6f8ff] space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Dropdown label="Age" value={filters.age} options={ageOptions} onChange={val => handleChange('age', val)} />
        <Dropdown label="County" value={filters.county} options={countyOptions} onChange={val => handleChange('county', val)} />
        <Dropdown label="Insurance" value={filters.insurance} options={insuranceOptions} onChange={val => handleChange('insurance', val)} />
        <Dropdown label="CW" value={filters.cw} options={systemOptions} onChange={val => handleChange('cw', val)} />
      </div>
      <input
        type="text"
        placeholder="Search"
        className="border rounded px-2 py-1 w-full"
        value={filters.search}
        onChange={e => handleChange('search', e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {partnerOptions.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full border ${filters.partners.includes(tag) ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => togglePartner(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="text-right">
        <button className="text-sm underline" onClick={clearAll}>Clear All</button>
      </div>
    </div>
  );
};

export default SearchPanel;
