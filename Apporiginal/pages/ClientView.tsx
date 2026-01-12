import React from 'react';
import { Navigate } from 'react-router-dom';

const ClientView: React.FC = () => {
  return <Navigate to="/event/GEN" replace />;
};

export default ClientView;