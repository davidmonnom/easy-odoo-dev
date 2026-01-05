import { runShellCommand } from "../utils";

export const loadDatabases = async (): Promise<string[]> => {
  try {
    const result = await runShellCommand(
      "psql -At -c 'SELECT datname FROM pg_database;'"
    );
    const databases = result
      .split("\n")
      .map((db) => db.trim())
      .filter((db) => db.length > 0);
    return databases;
  } catch (e) {
    return [];
  }
};
