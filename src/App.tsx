import React from 'react';
import { SaaSProvider, useSaaS } from './context/SaaSContext';
import { GlobalNavbar } from './components/common/GlobalNavbar';
import { SaaSLandingPage } from './components/landing/SaaSLandingPage';
import { SuperAdminPortal } from './components/superadmin/SuperAdminPortal';
import { RestaurantAdminPortal } from './components/restaurant/RestaurantAdminPortal';
import { CustomerMobileView } from './components/customer/CustomerMobileView';
import { CheckCircle2 } from 'lucide-react';
import './styles/main.css';

const MainAppContent: React.FC = () => {
  const { currentRole, toastMessage } = useSaaS();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalNavbar />

      <main style={{ flex: 1 }}>
        {currentRole === 'landing' && <SaaSLandingPage />}
        {currentRole === 'superadmin' && <SuperAdminPortal />}
        {currentRole === 'restaurant' && <RestaurantAdminPortal />}
        {currentRole === 'customer' && <CustomerMobileView />}
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="toast-bar">
          <CheckCircle2 className="w-5 h-5 text-success" style={{ color: '#22c55e' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <SaaSProvider>
      <MainAppContent />
    </SaaSProvider>
  );
}

export default App;
