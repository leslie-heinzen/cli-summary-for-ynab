import { Command } from "commander";

export const groupBy = function <T extends Record<string, any>>(
  data: T[],
  key: string
) {
  const res = data.reduce((storage, item) => {
    var group = item[key];
    storage[group] = storage[group] || [];
    storage[group].push(item);
    return storage;
  }, {} as Record<string, T>);

  return res;
};

export const truncate = function (
  input: string | null | undefined,
  len: number
) {
  if (!input || input.length <= len) {
    return input;
  }

  return input.substr(0, len) + "...";
};

export function cleanArgs(cmd: Command): Record<string, string> {
  function camelize(str: string) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
  }

  const args: { [key: string]: string } = {};
  cmd.options.forEach((o: any) => {
    const key = camelize(o.long.replace(/^--/, ""));
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });

  return args;
}