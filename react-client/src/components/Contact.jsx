import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // ini -1 halaman sebelumnya dan bisa juga pake "/about" utk ke halaman lain
  };
  return (
    <div>
      <h1>This is contact page</h1>
      <button onClick={goBack}>Go back</button>
    </div>
  );
}

export default Contact;
