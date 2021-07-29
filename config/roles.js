const listadoRoles = ['Administrador', 'Usuario', 'Invitado'];
const roles = { 
  "Administrador": {
    "users": ["index", "new", "show", "edit", "delete"],
    "principales": ["index", "new", "show", "edit", "delete"]
  },
  "Usuario": {
    "users": ["index"]
  },
  "Invitado": {
  }
};

module.exports = {listadoRoles, roles};
