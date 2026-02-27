import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div style={{padding:"15px", background:"black", color:"white"}}>
      <Link to="/" style={{marginRight:"15px", color:"white"}}>Home</Link>
      <Link to="/dashboard" style={{marginRight:"15px", color:"white"}}>Dashboard</Link>
      <Link to="/add" style={{color:"white"}}>Add</Link>
    </div>
  );
}