import React, { useMemo } from 'react';

const formatAge = r => {
  if (!r || (r.min == null && r.max == null)) return 'All';
  return `${r.min ?? ''}-${r.max ?? ''}`;
};

const ResourceListing = ({ services, filters }) => {
  const applyFilters = useMemo(() => {
    const search = filters.search.toLowerCase();
    return service => {
      if (filters.age !== 'All' && formatAge(service.age_range) !== filters.age) return false;
      if (filters.county !== 'All' && !(service.county_restrictions || []).includes(filters.county)) return false;
      if (filters.insurance !== 'All' && !(service.insurance_types || []).includes(filters.insurance)) return false;
      if (filters.cw !== 'All' && service.system !== filters.cw) return false;
      if (filters.eligibility !== 'All' && service.eligibility !== filters.eligibility) return false;
      if (filters.category !== 'All' && service.category !== filters.category) return false;
      if (filters.partners.length) {
        const parts = typeof service.partners_involved === 'string'
          ? service.partners_involved.split(/\n|,/) : service.partners_involved || [];
        if (!filters.partners.every(p => parts.map(t => t.trim()).includes(p))) return false;
      }
      if (search && !(service.name.toLowerCase().includes(search) || (service.description || '').toLowerCase().includes(search))) return false;
      return true;
    };
  }, [filters]);

  const filteredServices = useMemo(() => services.filter(applyFilters), [services, applyFilters]);

  return (
    <div className="p-4 space-y-4">
      {filteredServices.map(s => (
        <div key={s.name} className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-lg">{s.name}</h3>
          <p className="text-sm">{s.description}</p>
          <div className="text-xs mt-2 italic">{s.category}</div>
        </div>
      ))}
    </div>
  );
};

export default ResourceListing;
