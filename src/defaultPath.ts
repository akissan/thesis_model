const appName = "cli_notes";
const defaultFileName = "notes.json";

const userAppData =
  process.env.APPDATA ??
  (process.platform == "darwin"
    ? process.env.HOME + "/Library/Preferences"
    : process.env.HOME + "/.local/share");

export const appFolder = `${userAppData}/${appName}`;
export const appData = `${userAppData}/${appName}/${defaultFileName}`;
