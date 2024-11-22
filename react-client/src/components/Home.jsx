import { Link } from "react-router-dom";
import "../App.css";
function Home() {
  return (
    <div className="header">
      <div>PWL Website ND</div>
      <ul className="menu-item">
        <li>
          <Link to="TransferRek">TransferRek</Link>
        </li>
        <li>
          <Link to="TransferVA">TransferVA</Link>
        </li>
        <li>
          <Link to="MutasiRek">MutasiRek</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
