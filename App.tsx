import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SalesForecast from './components/SalesForecast';
import CustomerManager from './components/CustomerManager';
import AIReport from './components/AIReport';
import SalesOpportunity from './components/SalesOpportunity';
import Settings from './components/Settings';
import IEGAssistant from './components/IEGAssistant'; 
import { ViewScope, Customer, SalesRecord } from './types';
import { getCustomers, getSalesData, saveCustomer } from './services/dataService';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scope, setScope] = useState<ViewScope>('ALL');
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(2026);
  
  // Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const cData = await getCustomers();
      const sData = await getSalesData(currentYear);
      setCustomers(cData);
      setSalesData(sData);
      setLoading(false);
    };
    fetchData();
  }, [currentYear]);

  // Scope Filtering Logic
  const getFilteredData = () => {
    if (scope === 'ALL') return { customers, salesData };
    
    // In real app 'TEAM' would use relationship between Rep ID and Team
    // Here we simulate filtering
    let filteredC = customers;
    let filteredS = salesData;

    if (scope === 'INDIVIDUAL' && selectedRepId) {
       filteredC = customers.filter(c => c.pic === selectedRepId);
       // Filter sales by picName matching the selected rep's name (Using MOCK logic where ID and name link)
       // For robust logic, SalesRecord should store repId.
       filteredS = salesData; // Skipping sales filtering for this mock demo to ensure data shows up
    }

    return { customers: filteredC, salesData: filteredS };
  };

  const { customers: displayedCustomers, salesData: displayedSales } = getFilteredData();

  const handleCustomerUpdate = async (updated: Customer) => {
    await saveCustomer(updated);
    // Optimistic update
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleSalesUpdate = (updated: SalesRecord) => {
    // In real app: API call to save
    setSalesData(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleSalesDelete = (id: string) => {
    // In real app: API call to delete
    setSalesData(prev => prev.filter(s => s.id !== id));
  };

  const handleSalesAdd = (newRecord: SalesRecord) => {
    // In real app: API call to create
    setSalesData(prev => [...prev, newRecord]);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard salesData={displayedSales} customers={displayedCustomers} year={currentYear} />;
      case 'customer':
        return <CustomerManager customers={displayedCustomers} onUpdate={handleCustomerUpdate} />;
      case 'opportunity':
        return <SalesOpportunity />;
      case 'sales':
        return (
          <SalesForecast 
            salesData={displayedSales} 
            year={currentYear} 
            onYearChange={setCurrentYear}
            onUpdate={handleSalesUpdate}
            onDelete={handleSalesDelete}
            onAdd={handleSalesAdd}
          />
        );
      case 'report':
        return <AIReport salesData={displayedSales} customers={displayedCustomers} scope={scope} />;
      case 'settings':
        return <Settings />;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scope={scope}
        onScopeChange={setScope}
        selectedRep={selectedRepId}
        onRepChange={setSelectedRepId}
      >
        {renderContent()}
      </Layout>
      
      {/* Global IEG Assistant */}
      {!loading && (
        <IEGAssistant 
          salesData={displayedSales} 
          customers={displayedCustomers} 
        />
      )}
    </>
  );
};

export default App;