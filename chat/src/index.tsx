import ReactDOM from 'react-dom';
import './index.css';
import Login from './views/Login/Login';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Panel from './views/Panel/Panel';

ReactDOM.render(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/panel" element={<Panel />} />
      </Routes>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
