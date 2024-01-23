'use client'; // For Error Boundary
// import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';

import './App.css';
import WeatherApp from './Components/WeatherApp';
import ErrorFallBack from './Components/FallBack';

const logError = (error, { componentStack }) => {
  // Do something with the error, e.g. log to an external API Or to Console
  console.error('Error', error);
  console.error('Component Stack', componentStack);
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallBack} onError={logError}>
      <WeatherApp />
      {/* TODO Add Toast Container */}
      {/* <ToastContainer /> */}
    </ErrorBoundary>
  );
}

export default App;
