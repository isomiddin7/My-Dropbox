import './App.css';
import Dropbox from './components/Dropbox';
import { Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './components/context/AuthContext';
import Signin from './components/Signin';
import Signup from './components/Signup';
import {  db } from './firebase'
import Folder from './components/Folder';

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/dropbox" element={<Dropbox db={db} />} />
          <Route path="/folder/:id" element={<Folder db={db}/>} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
