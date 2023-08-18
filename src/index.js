import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios'
import { GoogleOAuthProvider } from '@react-oauth/google';

axios.defaults.baseURL = 'https://plopso-resume-jina.onrender.com';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>  
);
