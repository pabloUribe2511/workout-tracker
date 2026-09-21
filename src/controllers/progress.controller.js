const { workouts, exerciseCatalog } = require('./workouts.controller');

const getProgress = (req, res) => {
  const { userId } = req.params;
  const { period = 'month' } = req.query;

  const userWorkouts = workouts.filter((workout) => workout.userId === userId);

  if (!userWorkouts.length) {
    return res.status(200).json({
      data: {
        userId,
        period,
        totalWorkouts: 0,
        completedWorkouts: 0,
        completionRate: 0,
        averageWeight: 0,
        topCategories: [],
        generatedAt: new Date().toISOString()
      }
    });
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

  return res.status(200).json({
    data: {
      userId,
      period,
      totalWorkouts,
      completedWorkouts,
      completionRate: Number(completionRate.toFixed(1)),
      averageWeight: Number(averageWeight.toFixed(1)),
      topCategories,
      generatedAt: new Date().toISOString()
    }
  });
};

module.exports = {
  getProgress
};
