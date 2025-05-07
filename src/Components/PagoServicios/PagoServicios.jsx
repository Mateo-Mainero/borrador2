import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PagoServicios.scss";
import logo3 from "../../assets/logo3.jpg";
import logo2 from "../../assets/logo2.png";

const PagoServicios = () => {
  const navigate = useNavigate();

  return (
    <div className="tablet-container">
      <button className="menu-button" onClick={() => navigate("/menu")}>
        <i className="bi bi-arrow-left-circle"></i>Volver atrás
      </button>

      <div className="logo-container">
        <img src={logo3} alt="Logo" />
      </div>

      <div className="text-one">
        <h1>Pago De Servicios</h1>
      </div>

      <div className="container text-center">
        <div className="row g-3 justify-content-center">
          <div className="col-4">
            <div className="menu-item" onClick={() => navigate("/visualizador-ticket/servicios")}>
              <i className="bi bi-droplet menu-icon"></i>
              <p>Pagar Los Servicios</p>
            </div>
          </div>
        </div>
      </div>

      <div className="image-public">
        <img src={logo2} alt="Publicidad" />
      </div>

      <p className="footer-text">© E&M Systems. Todos los derechos reservados</p>
    </div>
  );
};

export default PagoServicios;

