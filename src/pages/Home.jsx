import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchPanel from '../components/SearchPanel';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ResourceListing from '../components/ResourceListing';
import SidebarButton from '../components/SidebarButton';

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

const Home = () => {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/selected_resources.json')
      .then(r => r.json())
      .then(data => setServices(data))
      .catch(() => setServices([]));
  }, []);

  return (
    <div className="bg-[#f6f8ff] flex flex-col min-h-screen w-full relative overflow-x-hidden">
      <div className="w-full">
        <Header />
      </div>
      <div className="min-w-full sm:px-2">
        <SearchPanel services={services} filters={filters} setFilters={setFilters} />
      </div>
      <div className="relative w-full flex-1 flex gap-4 p-2">
        <div className="hidden lg:block">
          <Sidebar services={services} filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex-1">
          <ResourceListing services={services} filters={filters} />
        </div>
        <div className="lg:hidden">
          <SidebarButton onClick={() => setSidebarOpen(true)} />
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 flex" onClick={() => setSidebarOpen(false)}>
            <div className="bg-white p-4" onClick={e => e.stopPropagation()}>
              <Sidebar services={services} filters={filters} setFilters={setFilters} />
            </div>
          </div>
        )}
      </div>
      <div className="flex min-w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
