import React, { useState, useMemo } from "react";

// Partner badge color mapping (only 3 allowed colors)
const partnerColors = {
  CWS: "bg-[#8185E7] text-white",
  Probation: "bg-[#FF5B5B] text-white",
  "County Mental": "bg-[#40B5E3] text-white",
  "Health Plan": "bg-[#8185E7] text-white",
  "Mental Health Plan (MHP)": "bg-[#FF5B5B] text-white",
  "County SUD": "bg-[#40B5E3] text-white",
  "Child Welfare": "bg-[#8185E7] text-white",
  "County Mental Health Plan": "bg-[#FF5B5B] text-white",
  "Other": "bg-[#40B5E3] text-white",
  // fallback color will be used if not found
};

const formatAge = r => {
  if (!r || (r.min == null && r.max == null)) return 'All';
  return `${r.min ?? ''}-${r.max ?? ''}`;
};

const ResourceListing = ({ services = [], filters }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  React.useEffect(() => {
    if (selectedIdx >= services.length) {
      setSelectedIdx(0);
    }
  }, [services, selectedIdx]);

  const applyFilters = useMemo(() => {
    const search = filters.search.toLowerCase();
    return service => {
      if (filters.age !== 'All' && formatAge(service.age_range) !== filters.age) return false;
      if (filters.county !== 'All') {
        const list = Array.isArray(service.county_restrictions)
          ? service.county_restrictions
          : service.county_restrictions
            ? String(service.county_restrictions).split(/,|\n/)
            : [];
        if (!list.map(c => c.trim()).includes(filters.county)) return false;
      }
      if (filters.insurance !== 'All' && !(service.insurance_types || []).includes(filters.insurance)) return false;
      if (filters.cw !== 'All' && service.system !== filters.cw) return false;
      if (filters.eligibility !== 'All' && service.eligibility !== filters.eligibility) return false;
      if (filters.category !== 'All' && service.category !== filters.category) return false;
      if (filters.partners.length) {
        const parts = typeof service.partners_involved === 'string'
          ? service.partners_involved.split(/\n|,/)
          : service.partners_involved || [];
        const vals = parts.map(t => t.trim()).filter(v => v);
        if (!filters.partners.every(p => vals.includes(p))) return false;
      }
      if (search) {
        const title = (service.name || service.title || '').toLowerCase();
        const desc = (service.description || '').toLowerCase();
        if (!(title.includes(search) || desc.includes(search))) return false;
      }
      return true;
    };
  }, [filters]);

  const filteredServices = useMemo(() => services.filter(applyFilters), [services, applyFilters]);

  return (
    <div
      className="flex flex-col flex-1 bg-white rounded-xl border border-[#bfc6ea] p-0 hide-scrollbar"
      style={{
        height: "75vh",
        minHeight: "500px",
        maxHeight: "80vh",
        overflowY: "auto"
      }}
    >
      {/* Sticky header with title and print button */}
      <div className="sticky top-0 z-20 bg-white flex items-center justify-between p-4">
        <span
          className="font-semibold"
          style={{
            color: "#015AB8",
            fontFamily: "'Open Sans', sans-serif"
          }}
        >
          Resource Listing
        </span>
        <button
          className="flex items-center rounded-lg px-4 py-2 text-sm font-normal uppercase transition"
          style={{ background: "#CB3525", color: "#fff" }}
        >
          PRINT RESULTS
          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
            <path d="M11.6667 3.89799V1.14799H4.33335V3.89799H3.41668V0.231323H12.5833V3.89799H11.6667ZM13.1471 7.10632C13.4068 7.10632 13.6247 7.01832 13.8007 6.84232C13.9767 6.66632 14.0644 6.44877 14.0638 6.18966C14.0632 5.93055 13.9755 5.71268 13.8007 5.53607C13.6259 5.35946 13.408 5.27146 13.1471 5.27207C12.8862 5.27268 12.6686 5.36068 12.4944 5.53607C12.3203 5.71146 12.2323 5.92932 12.2304 6.18966C12.2286 6.44999 12.3166 6.66755 12.4944 6.84232C12.6723 7.0171 12.8892 7.1051 13.1471 7.10632ZM11.6667 13.4167V9.25682H4.33335V13.4167H11.6667ZM12.5833 14.3333H3.41668V10.6667H0.278931V3.89799H15.7211V10.6667H12.5833V14.3333ZM14.8044 9.74999V4.81466H1.1956V9.74999H3.41668V8.34016H12.5833V9.74999H14.8044Z" fill="#fff"/>
          </svg>
        </button>
      </div>
      <table className="w-full text-sm border-separate table-fixed " style={{ borderSpacing: "0 4px" }}>
        <colgroup>
          <col style={{ width: "16%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead
          className="sticky top-[64px] z-10"
          style={{
            background: "#0561c9",
            width: "1136px",
            height: "66px",
            minHeight: "66px",
            maxHeight: "66px",
          }}
        >
          <tr className="bg-[#0561c9]">
            <th
              className="text-white font-semibold py-2 px-2 text-left"
              style={{
                height: "66px",
                minHeight: "66px",
                maxHeight: "66px",
              }}
            >
              Service Type
            </th>
            <th className="text-white font-semibold py-2 px-2 text-left"
              style={{
                height: "66px",
                minHeight: "66px",
                maxHeight: "66px",
              }}
            >
              Description Of Service
            </th>
            <th className="text-white font-semibold py-2 px-2 text-left"
              style={{
                height: "66px",
                minHeight: "66px",
                maxHeight: "66px",
              }}
            >
              Eligibility
            </th>
            <th className="text-white font-semibold py-2 px-2 text-left"
              style={{
                height: "66px",
                minHeight: "66px",
                maxHeight: "66px",
              }}
            >
              Partners Involved
            </th>
            <th className="text-white font-semibold py-2 px-2 text-left"
              style={{
                height: "66px",
                minHeight: "66px",
                maxHeight: "66px",
              }}
            >
              Associated Direction
            </th>
            <th className="text-white font-semibold py-2 px-2 text-left"
              style={{
                height: "66px",
                minHeight: "66px",
                maxHeight: "66px",
              }}
            >
              {/* Empty header for actions */}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                No resources found.
              </td>
            </tr>
          ) : (
            filteredServices.map((res, idx) => {
              const isSelected = idx === selectedIdx;
              return (
                <tr
                  key={res.id || idx}
                  className={[
                    "cursor-pointer",
                    "align-top",
                    "transition-colors",
                    "rounded-xl",
                    "overflow-hidden",
                    "resource-row",
                    isSelected
                      ? "bg-[#fff8ee] border-l-4 border-[#ffb84d]"
                      : "bg-[#f6f8fc]",
                  ].join(" ")}
                  style={{
                    borderBottom: "8px solid #fff",
                  }}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <td className={`py-3 px-2 align-top font-semibold ${isSelected ? "text-[#d14b3a]" : "text-[#1B4AA4]"}`}>
                    {res.type || res.title}
                  </td>
                  <td className="py-3 px-2 align-top text-[#222]" style={{ position: "relative", overflow: "visible" }}>
                    <div style={{ wordBreak: "break-word", maxWidth: "100%" }}>
                      {isSelected
                        ? (
                          <>
                            
                            {/* Expanded details only in Description column */}
                            <div
                              className=" rounded  transition-all duration-300 text-sm text-[#222]"
                              style={{
                                width: "100%",
                                maxWidth: "100%",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                overflow: "hidden",
                              }}
                            >
                               {res.description}
                            
                              
                            </div>
                          </>
                        )
                        : res.shortDescription
                          ?? (typeof res.description === "string"
                            ? res.description.length > 120
                              ? res.description.slice(0, 120) + "..."
                              : res.description
                            : "")}
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top text-[#222]">
                    {isSelected
                      ? res.eligibility
                      : res.shortEligibility
                        ?? (typeof res.eligibility === "string"
                          ? res.eligibility.length > 80
                            ? res.eligibility.slice(0, 80) + "..."
                            : res.eligibility
                          : "")}
                  </td>
                  <td className="py-3 px-2 align-top">
                    <div className="flex flex-wrap gap-2">
                      {(res.partners || []).map((p, i) => (
                        <span
                          key={p + i}
                          className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${partnerColors[p] || "bg-[#8185E7] text-white"}`}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top text-black">
                    {Array.isArray(res.direction)
                      ? res.direction.map((d, i) => <div key={i}>{d}</div>)
                      : res.direction}
                  </td>
                  {/* Action buttons column */}
                  <td className="py-3 px-2 align-top">
                    <div
                      className="flex flex-col gap-2"
                      style={{
                        alignItems: "flex-end",
                        maxWidth: "100%",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                    >
                      {/* Add/Remove Button */}
                      {isSelected ? (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-[#faa9a0] rounded-lg"
                          title="Remove"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedIdx(null);
                          }}
                          style={{ boxShadow: "none", border: "none" }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 32 32">
                            <rect x="4" y="4" width="24" height="24" rx="8" fill="#faa9a0"/>
                            {/* Removed inner white border, made center line thinner and longer */}
                            <rect x="10" y="15" width="12" height="2" rx="1" fill="white"/>
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-[#eaf8fe] rounded-lg"
                          title="Add"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedIdx(idx);
                          }}
                          style={{ boxShadow: "none", border: "none" }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#0561c9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke="currentColor" strokeWidth="2" d="M12 5v14m7-7H5"/>
                          </svg>
                        </button>
                      )}
                      {/* Print Button */}
                      <button
                        type="button"
                        className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                          isSelected ? "bg-[#fff8ee]" : "bg-[#f6f8fc]"
                        }`}
                        title="Print"
                        onClick={e => { e.stopPropagation(); /* handle print */ }}
                        style={{ boxShadow: "none", border: "none", padding: 0 }}
                      >
                        <svg
                          width="16"
                          height="15"
                          viewBox="0 0 16 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: "block", margin: "auto" }}
                        >
                          <path d="M11.6667 3.89799V1.14799H4.33335V3.89799H3.41668V0.231323H12.5833V3.89799H11.6667ZM13.1471 7.10632C13.4068 7.10632 13.6247 7.01832 13.8007 6.84232C13.9767 6.66632 14.0644 6.44877 14.0638 6.18966C14.0632 5.93055 13.9755 5.71268 13.8007 5.53607C13.6259 5.35946 13.408 5.27146 13.1471 5.27207C12.8862 5.27268 12.6686 5.36068 12.4944 5.53607C12.3203 5.71146 12.2323 5.92932 12.2304 6.18966C12.2286 6.44999 12.3166 6.66755 12.4944 6.84232C12.6723 7.0171 12.8892 7.1051 13.1471 7.10632ZM11.6667 13.4167V9.25682H4.33335V13.4167H11.6667ZM12.5833 14.3333H3.41668V10.6667H0.278931V3.89799H15.7211V10.6667H12.5833V14.3333ZM14.8044 9.74999V4.81466H1.1956V9.74999H3.41668V8.34016H12.5833V9.74999H14.8044Z" fill="#4766C3"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <style>
{`
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`}
</style>
    </div>
  );
};

export default ResourceListing;