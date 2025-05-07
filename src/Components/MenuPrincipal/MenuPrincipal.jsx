import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import styles from './MenuPrincipal.module.scss';


const MenuPrincipal = () => {
  const navigate = useNavigate();

  return (
    <div className={styles["tablet-container text-center"]}>

      <div>
        <img className="icon-one" src="../src/assets/logo1.png" height="7%" width="7%" alt="Logo" />
      </div>
      <div className="container text-center">
        <div className="row g-3">
          <div className="col-6">
              <div className={styles["menu-item"]} onClick={() => navigate("/servicios")}> 
              <i className={`bi bi-lightning-charge-fill ${styles["menu-icon"]}`}></i>
              <p>Pago De Servicios</p>
            </div>
          </div>
          <div className="col-6">
          <div className={styles["menu-item"]} onClick={() => navigate("/mesa-de-entrada")}>
              <i className={`bi bi-bank ${styles["menu-icon"]}`}></i>
              <p>Mesa De Entradas</p>
            </div>
          </div>
          <div className="col-6">
              <div className={styles["menu-item"]} onClick={() => navigate("/cobranzas")}> 
              <i className={`bi bi-cash-coin ${styles["menu-icon"]}`}></i>
              <p>Cuentas Corrientes</p>
            </div>
          </div>
          <div className="col-6">
              <div className={styles["menu-item"]} onClick={() => navigate("/servicios-sociales")}> 
              <i className={`bi bi-people ${styles["menu-icon"]}`}></i>
              <p>Servicios Sociales</p>
            </div>
          </div>
          <div className="col-6 offset-3">
              <div className={styles["menu-item"]} onClick={() => navigate("/otros-facturacion")}> 
              <i className={`bi bi-receipt  ${styles["menu-icon"]}`}></i>
              <p> Otros </p>
            </div>
          </div>
        </div>
      </div>
      <p className={styles["footer-text"]}>© E&M Systems. Todos los derechos reservados</p>
    </div>
  );
};

export default MenuPrincipal;
