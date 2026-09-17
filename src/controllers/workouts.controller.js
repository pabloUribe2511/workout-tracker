const exerciseCatalog = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Press de Banca',
    description: 'Ejercicio compuesto para pectoral, deltoides anterior y tríceps.',
    category: 'pecho'
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    name: 'Extensiones de Tríceps',
    description: 'Ejercicio de aislamiento para tríceps.',
    category: 'brazo'
  },
  {
    id: '90954a4a-f5d9-4c23-9c26-8bb54e38f9d1',
    name: 'Sentadilla',
    description: 'Ejercicio compuesto para piernas y glúteos.',
    category: 'piernas'
  }
];

let workouts = [
  {
    id: 'd4f2e8a1-3b7c-4e5d-9f0a-1c2b3d4e5f60',
    userId: 'b42f53fa-7b30-4b91-8d36-dc1c6ef27611',
    name: 'Tren Superior - Día 1',
    description: 'Rutina enfocada en pecho y tríceps',
    scheduledAt: '2026-09-20T07:00:00Z',
    status: 'pending',
    exercises: [
      {
        exerciseId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        sets: 4,
        reps: 12,
        weight: 60
      },
      {
        exerciseId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
        sets: 3,
        reps: 15,
        weight: 20
      }
    ],
    comments: 'Aumentar peso en press de banca la próxima semana.',
    createdAt: '2026-09-17T08:00:00Z'
  }
];

const serializeExercise = (exercise) => {
  const exerciseInfo = exerciseCatalog.find((item) => item.id === exercise.exerciseId);

  return {
    ...exercise,
    name: exerciseInfo ? exerciseInfo.name : 'Ejercicio sin nombre'
  };
};

const serializeWorkout = (workout) => ({
  ...workout,
  exercises: workout.exercises.map(serializeExercise)
});

const getUserWorkouts = (req, res) => {
  const { userId } = req.params;
  const { status, from, to, page = 1, limit = 10, sort = 'scheduledAt:asc' } = req.query;

  let result = workouts.filter((workout) => workout.userId === userId);

  if (status) {
    result = result.filter((workout) => workout.status === status);
  }

  if (from) {
    result = result.filter((workout) => new Date(workout.scheduledAt) >= new Date(from));
  }

  if (to) {
    result = result.filter((workout) => new Date(workout.scheduledAt) <= new Date(to));
  }

  const [field, direction] = sort.split(':');
  result.sort((a, b) => {
    const firstValue = new Date(a[field]).getTime();
    const secondValue = new Date(b[field]).getTime();

    if (direction === 'desc') {
      return secondValue - firstValue;
    }

    return firstValue - secondValue;
  });

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const total = result.length;
  const totalPages = Math.max(Math.ceil(total / limitNumber) || 1, 1);
  const start = (pageNumber - 1) * limitNumber;
  const paginated = result.slice(start, start + limitNumber);

  return res.status(200).json({
    data: paginated.map(serializeWorkout),
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages
    }
  });
};

const getWorkoutById = (req, res) => {
  const { userId, id } = req.params;
  const workout = workouts.find((item) => item.userId === userId && item.id === id);

  if (!workout) {
    return res.status(404).json({ error: 'Entrenamiento no encontrado' });
  }

  return res.status(200).json({ data: serializeWorkout(workout) });
};

const createWorkout = (req, res) => {
  const { userId } = req.params;
  const { name, description, scheduledAt, exercises, comments } = req.body;

  if (!name || !scheduledAt || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({
      error: 'Los campos name, scheduledAt y exercises son requeridos'
    });
  }

  const validExercises = exercises.every(
    (exercise) =>
      exercise.exerciseId &&
      Number.isInteger(exercise.sets) &&
      Number.isInteger(exercise.reps) &&
      typeof exercise.weight === 'number'
  );

  if (!validExercises) {
    return res.status(400).json({
      error: 'Cada ejercicio debe incluir exerciseId, sets, reps y weight válidos'
    });
  }

  const newWorkout = {
    id: `w-${Date.now()}`,
    userId,
    name,
    description: description || '',
    scheduledAt,
    status: 'pending',
    exercises,
    comments: comments || '',
    createdAt: new Date().toISOString()
  };

  workouts.push(newWorkout);

  return res.status(201).json({ data: serializeWorkout(newWorkout) });
};

const updateWorkout = (req, res) => {
  const { userId, id } = req.params;
  const { name, description, scheduledAt, exercises, comments, status } = req.body;
  const index = workouts.findIndex((workout) => workout.userId === userId && workout.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Entrenamiento no encontrado' });
  }

  if (!name || !scheduledAt || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({
      error: 'Los campos name, scheduledAt y exercises son requeridos'
    });
  }

  workouts[index] = {
    ...workouts[index],
    name,
    description: description || workouts[index].description,
    scheduledAt,
    status: status || workouts[index].status,
    exercises,
    comments: comments || workouts[index].comments
  };

  return res.status(200).json({ data: serializeWorkout(workouts[index]) });
};

const deleteWorkout = (req, res) => {
  const { userId, id } = req.params;
  const index = workouts.findIndex((workout) => workout.userId === userId && workout.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Entrenamiento no encontrado' });
  }

  const deletedWorkout = workouts.splice(index, 1);

  return res.status(200).json({ deleted: deletedWorkout[0].id });
};

module.exports = {
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout
};
