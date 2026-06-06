import { WindowManager } from "../desktop/windowManager";

export function executeCommand(cmd) {
  const [action, arg] = cmd.split(" ");

  switch (action) {
    case "open":
      return WindowManager.create({ title: arg });

    case "kill":
      WindowManager.windows = WindowManager.windows.filter(w => w.id !== arg);
      return true;

    default:
      return "unknown command";
  }
}
