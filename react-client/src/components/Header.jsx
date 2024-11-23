import { Link } from "react-router-dom";
import { Button } from "@chakra-ui/react"; // Import Chakra UI Button
import "../App.css";

function Header() {
  return (
    <div className="header">
      <div className="judul">Pilih Menu ND</div>
      <div className="tombol">
        <label>
          <Button colorScheme="red" variant="solid">
            <Link
              to="/"
              style={{ color: "white", textDecoration: "none" }}
            >
              Home
            </Link>
          </Button>
        </label>
        <label>
          <Button colorScheme="teal" variant="solid">
            <Link
              to="TransferRek"
              style={{ color: "white", textDecoration: "none" }}
            >
              TransferRek
            </Link>
          </Button>
        </label>
        <label>
          <Button colorScheme="blue" variant="solid">
            <Link
              to="TransferVA"
              style={{ color: "white", textDecoration: "none" }}
            >
              TransferVA
            </Link>
          </Button>
        </label>
        <label>
          <Button colorScheme="purple" variant="solid">
            <Link
              to="MutasiRek"
              style={{ color: "white", textDecoration: "none" }}
            >
              MutasiRek
            </Link>
          </Button>
        </label>
      </div>
    </div>
  );
}

export default Header;
