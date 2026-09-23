const exerciseCatalog = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Press de Banca',
    description: 'Ejercicio compuesto para el desarrollo del pectoral mayor, deltoides anterior y tríceps.',
    category: 'pecho'
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'Extensiones de Tríceps',
    description: 'Ejercicio de aislamiento para el desarrollo de los tríceps.',
    category: 'brazo'
  },
  {
    id: '90954a4a-f5d9-4c23-9c26-8bb54e38f9d1',
    name: 'Sentadilla',
    description: 'Ejercicio compuesto para cuádriceps, glúteos y femorales.',
    category: 'piernas'
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    name: 'Dominadas',
    description: 'Ejercicio para espalda y bíceps con agarre en barra.',
    category: 'espalda'
  },
  {
    id: '5d6b1d68-4cce-4c9c-a4d0-7adfbe5b5fff',
    name: 'Trotes',
    description: 'Ejercicio cardiovascular para resistencia y quemado calórico.',
    category: 'cardio'
  }
];

const getExercises = (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;

  let result = [...exerciseCatalog];

  if (category) {
    result = result.filter((exercise) => exercise.category === category);
  }

  if (search) {
    const searchText = search.toLowerCase();
    result = result.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchText) ||
      exercise.description.toLowerCase().includes(searchText)
    );
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const total = result.length;
  const totalPages = Math.max(Math.ceil(total / limitNumber) || 1, 1);
  const start = (pageNumber - 1) * limitNumber;
  const paginated = result.slice(start, start + limitNumber);

  return res.status(200).json({
    data: paginated,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages
    }
  });
};

const getExerciseById = (req, res) => {
  const { id } = req.params;
  const exercise = exerciseCatalog.find((item) => item.id === id);

  if (!exercise) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  return res.status(200).json({ data: exercise });
};

const createExercise = (req, res) => {
  const { name, description, category } = req.body;

  if (!name || !description || !category) {
    return res.status(400).json({
      error: 'Los campos name, description y category son requeridos'
    });
  }

  const newExercise = {
    id: `ex-${Date.now()}`,
    name,
    description,
    category
  };

  exerciseCatalog.push(newExercise);

  return res.status(201).json({ data: newExercise });
};

const updateExercise = (req, res) => {
  const { id } = req.params;
  const { name, description, category } = req.body;
  const index = exerciseCatalog.findIndex((exercise) => exercise.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  if (!name || !description || !category) {
    return res.status(400).json({
      error: 'Los campos name, description y category son requeridos'
    });
  }

  exerciseCatalog[index] = {
    ...exerciseCatalog[index],
    name,
    description,
    category
  };

  return res.status(200).json({ data: exerciseCatalog[index] });
};

const patchExercise = (req, res) => {
  const { id } = req.params;
  const index = exerciseCatalog.findIndex((exercise) => exercise.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  const { name, description, category } = req.body;
  if (name !== undefined) exerciseCatalog[index].name = name;
  if (description !== undefined) exerciseCatalog[index].description = description;
  if (category !== undefined) exerciseCatalog[index].category = category;

  return res.status(200).json({ data: exerciseCatalog[index] });
};

const deleteExercise = (req, res) => {
  const { id } = req.params;
  const index = exerciseCatalog.findIndex((exercise) => exercise.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Ejercicio no encontrado' });
  }

  const deletedExercise = exerciseCatalog.splice(index, 1)[0];

  return res.status(200).json({ deleted: deletedExercise.id });
};

module.exports = {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  patchExercise,
  deleteExercise
};
