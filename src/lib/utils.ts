import { Command } from "commander";
import { CurrencyFormat } from "ynab";

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

export const getSystemLocale = function () {
  const env = process.env;
  const language = env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES;
  return language;
};

export const parseCurrencyFields = function <T extends object>(
  data: T[],
  keys: (keyof T)[],
  format?: CurrencyFormat | null
) {
  if (!format) {
    return data;
  }

  var formatter = new Intl.NumberFormat(getSystemLocale(), {
    style: "currency",
    currency: format.iso_code,
  });

  const conv = data.map((d) => {
    for (const k of keys) {
      const b = parseInt(d[k] as any) / 1000;
      const currencyStr = formatter.format(b);
      d[k] = currencyStr as any;
    }

    return d;
  });

  return conv;
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
