import React from 'react';
import { Navigate } from 'react-router-dom';

const WaiterDashboard: React.FC = () => {
  return <Navigate to="/staff/dashboard" replace />;
};

export default WaiterDashboard;