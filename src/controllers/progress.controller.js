const { workouts, exerciseCatalog } = require('./workouts.controller');

const progressEntries = [];

const getProgressSummary = (userId, period = 'month') => {
  const userWorkouts = workouts.filter((workout) => workout.userId === userId);

  if (!userWorkouts.length) {
    return {
      userId,
      period,
      totalWorkouts: 0,
      completedWorkouts: 0,
      completionRate: 0,
      averageWeight: 0,
      topCategories: [],
      generatedAt: new Date().toISOString()
    };
  }

  const totalWorkouts = userWorkouts.length;
  const completedWorkouts = userWorkouts.filter((workout) => workout.status === 'completed').length;
  const completionRate = totalWorkouts === 0 ? 0 : (completedWorkouts / totalWorkouts) * 100;

  const allExercises = userWorkouts.flatMap((workout) => workout.exercises || []);
  const categoryCounts = {};

  allExercises.forEach((exercise) => {
    const exerciseInfo = exerciseCatalog.find((item) => item.id === exercise.exerciseId);
    const category = exerciseInfo ? exerciseInfo.category : 'general';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalWeight = allExercises.reduce((sum, exercise) => sum + Number(exercise.weight || 0), 0);
  const averageWeight = allExercises.length ? totalWeight / allExercises.length : 0;

  return {
    userId,
    period,
    totalWorkouts,
    completedWorkouts,
    completionRate: Number(completionRate.toFixed(1)),
    averageWeight: Number(averageWeight.toFixed(1)),
    topCategories,
    generatedAt: new Date().toISOString()
  };
};

const getProgress = (req, res) => {
  const { userId } = req.params;
  const { period = 'month' } = req.query;
  const summary = getProgressSummary(userId, period);

  return res.status(200).json({ data: summary });
};

const getProgressById = (req, res) => {
  const { userId, id } = req.params;
  const progress = progressEntries.find((item) => item.userId === userId && item.id === id);

  if (!progress) {
    return res.status(404).json({ error: 'Progreso no encontrado' });
  }

  return res.status(200).json({ data: progress });
};

const createProgress = (req, res) => {
  const { userId } = req.params;
  const { period = 'month', note, totalWorkouts, completedWorkouts, completionRate } = req.body;

  const newProgress = {
    id: `progress-${Date.now()}`,
    userId,
    period,
    note: note || '',
    totalWorkouts: totalWorkouts ?? 0,
    completedWorkouts: completedWorkouts ?? 0,
    completionRate: completionRate ?? 0,
    createdAt: new Date().toISOString()
  };

  progressEntries.push(newProgress);

  return res.status(201).json({ data: newProgress });
};

const updateProgress = (req, res) => {
  const { userId, id } = req.params;
  const index = progressEntries.findIndex((item) => item.userId === userId && item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Progreso no encontrado' });
  }

  const { period, note, totalWorkouts, completedWorkouts, completionRate } = req.body;

  if (!period) {
    return res.status(400).json({ error: 'El campo period es requerido' });
  }

  progressEntries[index] = {
    ...progressEntries[index],
    period,
    note: note ?? progressEntries[index].note,
    totalWorkouts: totalWorkouts ?? progressEntries[index].totalWorkouts,
    completedWorkouts: completedWorkouts ?? progressEntries[index].completedWorkouts,
    completionRate: completionRate ?? progressEntries[index].completionRate
  };

  return res.status(200).json({ data: progressEntries[index] });
};

const patchProgress = (req, res) => {
  const { userId, id } = req.params;
  const index = progressEntries.findIndex((item) => item.userId === userId && item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Progreso no encontrado' });
  }

  const { period, note, totalWorkouts, completedWorkouts, completionRate } = req.body;

  if (period !== undefined) progressEntries[index].period = period;
  if (note !== undefined) progressEntries[index].note = note;
  if (totalWorkouts !== undefined) progressEntries[index].totalWorkouts = totalWorkouts;
  if (completedWorkouts !== undefined) progressEntries[index].completedWorkouts = completedWorkouts;
  if (completionRate !== undefined) progressEntries[index].completionRate = completionRate;

  return res.status(200).json({ data: progressEntries[index] });
};

const deleteProgress = (req, res) => {
  const { userId, id } = req.params;
  const index = progressEntries.findIndex((item) => item.userId === userId && item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Progreso no encontrado' });
  }

  const deletedProgress = progressEntries.splice(index, 1)[0];

  return res.status(200).json({ deleted: deletedProgress.id });
};

module.exports = {
  getProgress,
  getProgressById,
  createProgress,
  updateProgress,
  patchProgress,
  deleteProgress,
  progressEntries
};
