import React, { useMemo } from 'react';

const Sidebar = ({ services, filters, setFilters }) => {
  const categories = useMemo(() => {
    const set = new Set();
    services.forEach(s => { if (s.category) set.add(s.category); });
    return Array.from(set);
  }, [services]);

  const eligibilityOptions = useMemo(() => {
    const set = new Set();
    services.forEach(s => { if (s.eligibility) set.add(s.eligibility); });
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

  const setFilter = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

  const togglePartner = tag => {
    setFilters(prev => {
      const exists = prev.partners.includes(tag);
      const partners = exists ? prev.partners.filter(p => p !== tag) : [...prev.partners, tag];
      return { ...prev, partners };
    });
  };

  return (
    <div className="p-4 bg-[#B1BBEF] rounded-xl space-y-4 w-64">
      <div>
        <h3 className="font-semibold mb-1">Category</h3>
        <ul className="space-y-1">
          <li>
            <button
              className={`w-full text-left ${filters.category === 'All' ? 'font-bold' : ''}`}
              onClick={() => setFilter('category', 'All')}
            >
              All
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat}>
              <button
                className={`w-full text-left ${filters.category === cat ? 'font-bold' : ''}`}
                onClick={() => setFilter('category', cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Eligibility</h3>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.eligibility}
          onChange={e => setFilter('eligibility', e.target.value)}
        >
          <option value="All">All</option>
          {eligibilityOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Partners</h3>
        <div className="space-y-1">
          {partnerOptions.map(tag => (
            <label key={tag} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.partners.includes(tag)}
                onChange={() => togglePartner(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
