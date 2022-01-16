import { API, Category } from "ynab";
import chalkTable from "chalk-table";
import { groupBy, parseCurrencyFields, truncate } from "./utils";
import { YNABError } from "./types/types";
import { opts } from "commander";

export async function getBudgetData(
  commandName: string,
  opts: Record<string, string>
): Promise<{ data?: Record<string, any>; error?: string }> {
  const token = opts.token || process.env.YNAB_TOKEN;

  if (!token) {
    return {
      error:
        "Please set a YNAB personal access token via the YNAB_TOKEN env variable or --token flag.",
    };
  }

  const client = ynabApiWrapper(token);

  try {
    if (commandName == "transactions") {
      const data = await client.getTransactions(opts);
      return { data: data };
    }

    if (commandName == "accounts") {
      const data = await client.getAccounts(opts);
      return { data: data };
    }

    if (commandName == "budget") {
      const data = await client.getCategoriesByMonth(opts.budgetId, opts.month);
      return { data: data };
    }
  } catch (e) {
    const err = e as YNABError;
    if (err.detail) {
      return { error: err.detail };
    }

    return { error: "Error fetching data from YNAB." };
  }

  return { error: "unrecognized command." };
}

export async function renderTable(
  data: Record<string, any>,
  columns: Record<string, any>[]
) {
  const options = {
    leftPad: 2,
    columns,
  };

  const tables = Object.values(data).map((d) => {
    return chalkTable(options, d);
  });

  tables.forEach((t) => console.log(t));
}

const ynabApiWrapper = function (token: string) {
  const _client = new API(token);

  async function _getCurrencyFormat(budgetId: string) {
    const res = await _client.budgets.getBudgetById(budgetId);
    return res.data.budget.currency_format;
  }

  async function getCategoriesByMonth(
    budgetId: string,
    month: string
  ): Promise<Record<string, Category>> {
    const res = await _client.months.getBudgetMonth(budgetId, month);
    const format = await _getCurrencyFormat(budgetId);

    let categories = parseCurrencyFields(
      res.data.month.categories,
      ["budgeted", "activity", "balance"],
      format
    );

    // ignore internal master category; find by category name.
    const ignored = categories.find(
      (c) => c.name == "Inflow: Ready to Assign"
    )?.category_group_id;
    const filtered = categories.filter(c => c.category_group_id != ignored);
    const categoriesByGroup = groupBy(filtered, "category_group_id");
    return categoriesByGroup;
  }

  async function getAccounts(opts: Record<string, string>) {
    const res = await _client.accounts.getAccounts(opts.budgetId);
    const format = await _getCurrencyFormat(opts.budgetId);
    let accounts = parseCurrencyFields(res.data.accounts, ["balance"], format);

    if (!opts.closed) {
      accounts = accounts.filter((a) => a.closed == false);
    }

    if (!opts.offBudget) {
      accounts = accounts.filter((a) => a.on_budget == true);
    }

    return accounts;
  }

  async function getTransactions(opts: Record<string, string>) {
    const res = await _client.transactions.getTransactions(
      opts.budgetId,
      opts.date
    );
    const format = await _getCurrencyFormat(opts.budgetId);

    let transactions = parseCurrencyFields(
      res.data.transactions,
      ["amount"],
      format
    );

    if (opts.account) {
      transactions = transactions.filter((t) => t.account_name == opts.account);
    }

    if (opts.category) {
      transactions = transactions.filter(
        (t) => t.category_name == opts.category
      );
    }

    transactions = transactions.map((t) => {
      return {
        ...t,
        payee_name: truncate(t.payee_name, 25),
        category_name: truncate(t.category_name, 25),
      };
    });

    transactions.reverse();
    return transactions;
  }

  return Object.freeze({
    getCategoriesByMonth,
    getAccounts,
    getTransactions,
  });
};
