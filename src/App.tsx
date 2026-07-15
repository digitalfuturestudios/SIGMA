import ERPDashboardLayout from './components/ERPDashboardLayout'
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ERPDashboardLayout />
    </ErrorBoundary>
  )
}

export default App;
