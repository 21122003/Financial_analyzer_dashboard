// File: Loopr_Ai/project/frontend/src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';

console.log('[App.tsx] App component initialized');

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
