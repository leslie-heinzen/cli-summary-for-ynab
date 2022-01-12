#!/usr/bin/env node

import { Command, program } from "commander";
import { getBudgetData, renderTable } from "../lib/index";
import chalk from "chalk";
import { cleanArgs } from "../lib/utils";

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
    const res = await getBudgetData(cmd._name, options);

    if (res.error) {
      throw new Error(res.error);
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

program
  .command("accounts")
  .description("review your budget accounts.")
  .option(
    "-t, --token <ynab-token>",
    "token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set.",
    ""
  )
  .option("-b, --budget-id <budget-id>", "the budget id.", "last-used")
  .option("-c, --closed", "include closed accounts.")
  .option("-o, --off-budget", "include off-budget accounts.")
  .action(async (cmd: Command) => {
    const options = cleanArgs(cmd);
    const res = await getBudgetData(cmd._name, options);

    if (res.error) {
      throw new Error(res.error);
    }

    if (res.data) {
      await renderTable({ data: res.data }, [
        { field: "name", name: chalk.cyan("Name") },
        { field: "type", name: chalk.magenta("Type") },
        { field: "balance", name: chalk.blue("Balance") },
        { field: "direct_import_linked", name: chalk.yellow("Linked") },
      ]);
    }
  });

program
  .command("transactions")
  .description("review your transactions.")
  .option(
    "-t, --token <ynab-token>",
    "token used to authenticate w/YNAB if a YNAB_TOKEN env variable is not set.",
    ""
  )
  .option("-b, --budget-id <budget-id>", "the budget id.", "last-used")
  .option(
    "-d, --date <start-date>",
    "the start date for the returned transactions (YYYY-MM-DD)."
  )
  .option("-a, --account <account-name>", "get results for a single account.")
  .option(
    "-c, --category <category>",
    "filter the results by a single category."
  )
  .action(async (cmd: Command) => {
    const options = cleanArgs(cmd);
    console.log(cmd._name);
    const res = await getBudgetData(cmd._name, options);

    if (res.error) {
      throw new Error(res.error);
    }

    if (res.data) {
      await renderTable({ data: res.data }, [
        { field: "date", name: chalk.cyan("Date") },
        { field: "payee_name", name: chalk.magenta("Payee") },
        { field: "category_name", name: chalk.blue("Category") },
        { field: "amount", name: chalk.yellow("In/Out") },
        { field: "cleared", name: chalk.green("Cleared") },
      ]);
    }
  });

program.parseAsync(process.argv).catch(console.error);
