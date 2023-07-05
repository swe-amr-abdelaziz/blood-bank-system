import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';
import Layout from './Layout/Layout';
import Home from './Pages/Home/Home';
import RegisterDonor from './Pages/Employee/RegisterDonor/RegisterDonor';
import DonationsList from './Pages/Employee/ManageDonations/DonationsList/DonationsList';

function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Admin Routes */}

          {/* Hospital Routes */}

          {/* Employee Routes */}
          <Route path="register/donor" element={<RegisterDonor />} />
          <Route path="donations" element={<DonationsList />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
