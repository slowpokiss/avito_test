export async function statsLoader() {
  const stats_url = "http://localhost:3001/api/v1/stats";

  try {
    const [
      summaryRes,
      activityRes,
      decisionsRes,
      categoriesRes,
      moderatorRes,
    ] = await Promise.all([
      fetch(`${stats_url}/summary`),
      fetch(`${stats_url}/chart/activity`),
      fetch(`${stats_url}/chart/decisions`),
      fetch(`${stats_url}/chart/categories`),
      fetch("http://localhost:3001/api/v1/moderators/me"),
    ]);

    const checks = [
      { res: summaryRes, key: "summary" },
      { res: activityRes, key: "activity" },
      { res: decisionsRes, key: "decisions" },
      { res: categoriesRes, key: "categories" },
      { res: moderatorRes, key: "moderator" },
    ];

    for (const { res, key } of checks) {
      if (res.ok) continue;

      switch (key) {
        case "summary":
          throw new Error("Не удалось загрузить summary");
        case "activity":
          throw new Error("Не удалось загрузить активность");
        case "decisions":
          throw new Error("Не удалось загрузить решения");
        case "categories":
          throw new Error("Не удалось загрузить категории");
        case "moderator":
          throw new Error("Не удалось загрузить данные модератора");
        default:
          throw new Error("Не удалось загрузить данные");
      }
    }

    return {
      summary: await summaryRes.json(),
      activity: await activityRes.json(),
      decisions: await decisionsRes.json(),
      categories: await categoriesRes.json(),
      moderator: await moderatorRes.json(),
    };
  } catch (err: unknown) {
    throw new Error(err);
  }
}
