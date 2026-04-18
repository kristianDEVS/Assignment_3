import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ title = 'Trini Tunes' }) {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">{title}</Link>
    </nav>
  );
}