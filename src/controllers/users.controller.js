let users = [
  {
    id: 'b42f53fa-7b30-4b91-8d36-dc1c6ef27611',
    name: 'Carlos Navia',
    email: 'carlos@example.com',
    role: 'user',
    createdAt: '2025-09-12T12:00:00Z'
  }
];

const getUsers = (req, res) => {
  const { role, search } = req.query;
  let result = users;

  if (role) {
    result = result.filter((user) => user.role === role);
  }

  if (search) {
    result = result.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return res.status(200).json(result);
};

const getUserById = (req, res) => {
  const { id } = req.params;
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  return res.status(200).json(user);
};

const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name y email son requeridos' });
  }

  const newUser = {
    id: `${Date.now()}`,
    name,
    email,
    role: role || 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  return res.status(201).json(newUser);
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Name y email son requeridos' });
  }

  users[index] = {
    ...users[index],
    name,
    email,
    role: role || users[index].role
  };

  return res.status(200).json(users[index]);
};

const patchUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const { name, email, role } = req.body;
  if (name !== undefined) users[index].name = name;
  if (email !== undefined) users[index].email = email;
  if (role !== undefined) users[index].role = role;

  return res.status(200).json(users[index]);
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const deletedUser = users.splice(index, 1);

  return res.status(200).json({ deleted: deletedUser[0].id });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser
};
