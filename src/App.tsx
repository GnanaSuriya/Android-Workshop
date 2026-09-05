import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingScreen from './screens/LandingScreen';
import RegistrationFormScreen from './screens/RegistrationFormScreen';
import SuccessScreen from './screens/SuccessScreen';
import DigitalPassScreen from './screens/DigitalPassScreen';
import CoordinatorScreen from './screens/CoordinatorScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/register" element={<RegistrationFormScreen />} />
        <Route path="/success/:id" element={<SuccessScreen />} />
        <Route path="/pass/:id" element={<DigitalPassScreen />} />
        <Route path="/coordinator" element={<CoordinatorScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
