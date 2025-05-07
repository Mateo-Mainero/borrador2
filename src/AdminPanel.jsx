import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPanel.scss';
import io from 'socket.io-client';

const socket = io("http://localhost:3000");

const ROLES = {
  1: "Administrador",
  2: "Caja 1",
  3: "Caja 2",
  4: "Mesa De Entrada 1",
  5: "Mesa De Entrada 2",
  6: "Mesa De Entrada 3",
  7: "Cobranzas 1",
  8: "Cobranzas 2",
  9: "Servicios Sociales",
  10: "Otros"
};

function AdminPanel() {
  const navigate = useNavigate();
  const [adminProfile, setAdminProfile] = useState({ username: "", email: "" });
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalData, setModalData] = useState({ usuario: "", password: "", id_rol: 2, id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [userStatuses, setUserStatuses] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.idrol !== 1) return navigate("/login");
      setIsAuthenticated(true);
      fetchData();
    } catch (err) {
      console.error("Token inválido", err);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    socket.on("usuarios_estado", (estadoUsuarios) => {
      setUserStatuses(estadoUsuarios);
    });

    return () => {
      socket.off("usuarios_estado");
    };
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [usersRes, profileRes] = await Promise.all([
        axios.get("http://localhost:3000/usuarios/GetAll", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:3000/auth/prueba", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data);
      setAdminProfile(profileRes.data);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setModalData({ usuario: "", password: "", id_rol: 2 });
    new bootstrap.Modal(document.getElementById('userModal')).show();
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setModalData({ ...user });
    new bootstrap.Modal(document.getElementById('userModal')).show();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el usuario.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/usuarios/Delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        });
        fetchData();
        Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando:", error);
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      if (isEditing) {
        await axios.patch(`http://localhost:3000/usuarios/update/${modalData.id}`, modalData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post("http://localhost:3000/usuarios/Create", modalData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchData();
      bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
      Swal.fire("Éxito", `Usuario ${isEditing ? "actualizado" : "creado"} correctamente`, "success");
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire("Error", "No se pudo completar la acción", "error");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mt-4 admin-panel">
      <div className="mb-4">
        <h2>Panel de Administración</h2>
        <p><strong>Usuario:</strong> {adminProfile.username}</p>
        <p><strong>Email:</strong> {adminProfile.email}</p>
        <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      <div className="mb-4">
        <h3>Usuarios</h3>
        <button className="btn btn-primary mb-2" onClick={openCreateModal}>Crear Usuario</button>

        {users.length === 0 ? (
          <p className="text-danger">No hay usuarios cargados.</p>
        ) : (
          <p className="text-success">Usuarios cargados: {users.length}</p>
        )}

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.usuario}</td>
                <td>{ROLES[u.id_rol]}</td>
                <td>
                  <span className={`badge ${userStatuses[u.id] ? "bg-success" : "bg-secondary"}`}>
                    {userStatuses[u.id] ? "Conectado" : "Desconectado"}
                  </span>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(u)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL Bootstrap */}
      <div className="modal fade" id="userModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? "Editar Usuario" : "Crear Usuario"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label>Usuario</label>
                <input className="form-control" value={modalData.usuario} onChange={e => setModalData({ ...modalData, usuario: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label>Contraseña</label>
                <input type="password" className="form-control" value={modalData.password} onChange={e => setModalData({ ...modalData, password: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label>Rol</label>
                <select className="form-select" value={modalData.id_rol} onChange={e => setModalData({ ...modalData, id_rol: parseInt(e.target.value) })}>
                  {Object.entries(ROLES).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">{isEditing ? "Actualizar" : "Crear"}</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;









