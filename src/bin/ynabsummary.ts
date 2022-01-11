import { Command, program } from "commander";
import { getBudgetData, renderTable } from "../lib/index";
import chalk from "chalk";

program
  .version(`cli-summary-for-ynab ${process.env.npm_package_version}`)
  .usage("<command> [options]");

program
  .command("budget")
  .description("review your budget at a glance.")
  .option(
    "-t, --token <ynab-token>",
    "token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set.",
    ""
  )
  .option("-b, --budget-id <budget-id>", "the budget id.", "last-used")
  .option(
    "-m, --month <month>",
    "get results for a specific months (YYYY-MM-DD)",
    "current"
  )
  .option(
    "-c, --category <category>",
    "filter the results by a single category group."
  )
  .action(async (cmd: Command) => {
    const options = cleanArgs(cmd);
    const res = await getBudgetData(options);

    if (res.error) {
      throw new Error();
    }

    if (res.data) {
      await renderTable(res.data, [
        { field: "name", name: chalk.cyan("Category") },
        { field: "budgeted", name: chalk.magenta("Assigned") },
        { field: "activity", name: chalk.green("Activity") },
        { field: "balance", name: chalk.yellow("Available") },
      ]);
    }
  });

program.parseAsync(process.argv);

function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

function cleanArgs(cmd: Command): Record<string, string> {
  const args: { [key: string]: string } = {};
  cmd.options.forEach((o: any) => {
    const key = camelize(o.long.replace(/^--/, ""));
    if (typeof cmd[key] !== "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });

  return args;
}
