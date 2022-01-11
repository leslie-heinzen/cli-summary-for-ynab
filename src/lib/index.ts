import { API, Category } from "ynab";
import chalkTable from "chalk-table";

export async function getBudgetData(
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

  const data = await client.getCategoriesByMonth(opts.budgetId, opts.month);
  return { data: data };
}

export async function renderTable(data: Record<string, any>, columns: Record<string, any>[]) {
  const options = {
    leftPad: 2,
    columns
  };

  const tables = Object.values(data).map((d) => {
    return chalkTable(options, d);
  });

  tables.forEach((t) => console.log(t));
}

const ynabApiWrapper = function (token: string) {
  const _client = new API(token);

  async function getCategoriesByMonth(
    budgetId: string,
    month: string
  ): Promise<Record<string, Category>> {
    const res = await _client.months.getBudgetMonth(budgetId, month);

    const categoriesByGroup = groupBy(
      res.data.month.categories,
      "category_group_id"
    );

    return categoriesByGroup;
  }

  return Object.freeze({
    getCategoriesByMonth,
  });
};

var groupBy = function <T extends Record<string, any>>(data: T[], key: string) {
  const res = data.reduce((storage, item) => {
    var group = item[key];
    storage[group] = storage[group] || [];
    storage[group].push(item);
    return storage;
  }, {} as Record<string, T>);

  return res;
};
