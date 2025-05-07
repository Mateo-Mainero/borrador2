import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function TurnosPanel() {
    const [turno, setTurno] = useState(25);
    const [estado, setEstado] = useState("Llamando");
    const [disabled, setDisabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/");
            return;
        }
        
        try {
            const decodedToken = jwtDecode(token);
            console.log("Token decodificado:", decodedToken);
            
            // Excluir el acceso de administradores (id_rol = 1)
            if (decodedToken.idrol === 1) {
                alert("Acceso denegado. Solo usuarios autorizados pueden acceder.");
                navigate("/");
            }
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            navigate("/");
        }
    }, [navigate]);

    const handleButtonClick = (newEstado) => {
        setEstado(newEstado);
        setDisabled(true);
        setTimeout(() => setDisabled(false), 3000);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-bold">Área: Cobranzas</h2>
                <p className="text-lg">Turno N: <span>{turno}</span></p>
                <p className="text-lg">Estado: <span>{estado}</span></p>
                <button 
                    className="m-2 p-2 bg-blue-500 text-white rounded disabled:bg-gray-400" 
                    onClick={() => handleButtonClick("Llamando")} 
                    disabled={disabled}
                >
                    Llamar
                </button>
                <button 
                    className="m-2 p-2 bg-green-500 text-white rounded disabled:bg-gray-400" 
                    onClick={() => handleButtonClick("Atendiendo")} 
                    disabled={disabled}
                >
                    Atender
                </button>
                <button 
                    className="m-2 p-2 bg-red-500 text-white rounded disabled:bg-gray-400" 
                    onClick={() => handleButtonClick("Finalizado")} 
                    disabled={disabled}
                >
                    Finalizar Turno
                </button>
            </div>
        </div>
    );
}

export default TurnosPanel;

