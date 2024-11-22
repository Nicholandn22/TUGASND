import { Link } from "react-router-dom";
function Header() {
  return (
    <div className="header">
      <div>PWL Website ND</div>
      <ul className="menu-item">
        <li>
          <Link to="about">About</Link>
        </li>
        <li>
          <Link to="contact">Contact</Link>
        </li>
        <li>
          <Link to="project">Project</Link>
        </li>
        <li>
          <Link to="experience">Experience</Link>
        </li>
      </ul>
    </div>
  );
}
export default Header;
