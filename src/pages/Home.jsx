import React, { useState } from 'react'
import Header from '../components/Header'
import SearchPanel from '../components/SearchPanel'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import ResourceListing from '../components/ResourceListing'
import SidebarButton from '../components/SidebarButton'

// Import all service arrays
const [services, setServices] = useState([]);
useEffect(() => {
  fetch('../data/selected_resources.json')
    .then(res => res.json())
    .then(data => setServices(data));
}, []);

// Combine all arrays into one master array
const combinedServices = [
  ...behavioralHealthPlacements,
  ...probationPlacements,
  ...probationServices,
  ...childWelfareServices,
  ...allServices
];

const [filters, setFilters] = useState({
  age: "All",
  county: "All",
  insurance: "All",
  cw: "All",
  eligibility: "All",
  category: "All",
  partners: [],
  search: ""
});



const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(null);

  // Filtering logic
  const filteredServices = React.useMemo(() => {
    if (!filters) return combinedServices;
    return combinedServices.filter(service => {
      // Search filter (case-insensitive, matches title or description)
      const search = filters.search?.trim().toLowerCase() || '';
      const matchesSearch =
        !search ||
        service.title.toLowerCase().includes(search) ||
        service.description.toLowerCase().includes(search);

      // Dropdown filters (skip if default selected)
      const matchesAge = !filters.age || filters.age === "Age" || service.age === filters.age;
      const matchesCounty = !filters.county || filters.county === "County" || service.county === filters.county;
      const matchesInsurance = !filters.insurance || filters.insurance === "Insurance" || service.insurance === filters.insurance;
      const matchesCw = !filters.cw || filters.cw === "CW" || service.cw === filters.cw;

      // You can add more filter logic for selectedFilter if needed

      return matchesSearch && matchesAge && matchesCounty && matchesInsurance && matchesCw;
    });
  }, [filters]);

  return (
    <div className="bg-[#f6f8ff] flex flex-col min-h-screen w-full relative overflow-x-hidden">
      {/* Header */}
      <div className="w-full">
        <Header />
      </div>

      {/* Search Panel */}
      <div className="min-w-full sm:px-2">
        <SearchPanel onSearch={setFilters} />
      </div>

      {/* Main content area with blur overlay when sidebarOpen */}
      <div className="relative w-full flex-1">
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: "rgba(120,130,150,0.35)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />
        )}
        <div className={
            sidebarOpen
              ? "flex w-full max-w-none gap-4 pl-2 pr-0 pb-6 mt-2 relative"
              : "flex w-full  mx-auto gap-4 px-2 pb-6 mt-2 relative"
          }
        >
          {/* Desktop Sidebar (1025px and up) */}
          <div className={`hidden lg:block min-w-[220px]${sidebarOpen ? " lg:hidden" : ""}`}>
            <Sidebar />
          </div>
          {/* Tablet Sidebar Button (between 640px and 1024px) */}
          <div className="hidden sm:flex lg:hidden items-start">
            {!sidebarOpen && (
              <SidebarButton onClick={() => setSidebarOpen(true)} />
            )}
          </div>
          {/* Resource List and Drawer Sidebar */}
          <div className={`flex-1 flex flex-col relative${sidebarOpen ? " w-full" : ""}`}>
            {/* Tablet Sidebar Drawer */}
            {sidebarOpen && (
              <div
                className="absolute top-0 left-0 z-50 sm:block lg:hidden hidden
                  rounded-tr-2xl rounded-2xl shadow-2xl flex flex-col"
                style={{
                  width: "max-content",
                  minWidth: "220px",
                  maxWidth: "320px",
                  height: "max-content",
                  background: "linear-gradient(to bottom, #2563eb 0%, #2563eb 60%, #3576f6 100%)",
                  boxShadow: "4px 0 24px 0 rgba(0,0,0,0.10)",
                  transition: "transform 0.3s",
                  transform: sidebarOpen ? "translateX(0)" : "translateX(-110%)",
                  borderRight: "2px solid #fff"
                }}
              >
                <div className="overflow-y-auto p-0 relative flex flex-col w-full max-h-min">
                  <Sidebar />
                  {/* Close button inside sidebar */}
                  <button
                    className="absolute top-4 right-4 text-[#2563eb] bg-white rounded-full p-2 shadow"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <line x1="5" y1="5" x2="15" y2="15" stroke="#2563eb" strokeWidth="2"/>
                      <line x1="15" y1="5" x2="5" y2="15" stroke="#2563eb" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {/* Resource Listing */}
            <div className="relative flex-1 flex flex-col w-full">
              <div className={sidebarOpen ? "transition-all duration-300 relative z-10" : ""}>
                <ResourceListing services={filteredServices} />
                <div className="flex justify-end mt-12">
                  <button
                    className="bg-[#CB3525] text-white rounded-md px-4 py-2 flex items-center gap-2 font-semibold shadow-sm hover:bg-[#b53e2f] transition"
                    style={{
                      boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                      border: "none",
                      fontSize: "14px",
                      lineHeight: "20px",
                      minWidth: "auto",
                      minHeight: "auto",
                    }}
                  >
                    Load More
                    <span
                      className="ml-2 flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.10)",
                        borderRadius: "4px",
                        border: "1px solid #fff",
                        width: "20px",
                        height: "20px",
                        display: "inline-flex",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18">
                        <polygon points="6,7 9,12 12,7" fill="#fff" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div classname="flex min-w-full">
<Footer />
      </div>
      
    </div>
  )
}

export default Home