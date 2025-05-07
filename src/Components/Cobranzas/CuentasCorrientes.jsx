import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import styles from "./CuentasCorrientes.module.scss";

const CuentasCorrientes = () => {
  const navigate = useNavigate();

  return (
    <div className={styles["tablet-container"]}>
      <button className={styles["menu-button"]} onClick={() => navigate("/menu")}>
        <i className="bi bi-arrow-left-circle"></i> Volver atrás
      </button>

      <div className={styles["logo-container"]}>
        <img src="../src/assets/logo3.jpg"   alt="Logo" />
      </div>

      <div className={styles["text-one"]}>
        <h1>Cuentas Corrientes</h1>
      </div>

      <div className="container text-center">
        <div className="row g-3 justify-content-center">
          <div className="col-4">
            <div
              className={styles["menu-item"]}
              onClick={() => navigate("/visualizador-ticket/cobranzas")}
            >
              <i className={`bi bi-person-workspace ${styles["menu-icon"]}`}></i>
              <p>Acceder al turno</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["image-public"]}>
        <img src="../src/assets/logo2.png" alt="" />
      </div>

      <p className={styles["footer-text"]}>
        © E&M Systems. Todos los derechos reservados
      </p>
    </div>
  );
};

export default CuentasCorrientes;