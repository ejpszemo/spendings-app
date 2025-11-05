import { useMemo } from "react";
import type { Spending, User } from "../types";
import { formatCurrency } from "../utils/formatter";
import { predefinedColors } from "../constants/colors";
import { useLanguage } from "../contexts/LanguageContext";
import { useCurrency } from "../contexts/CurrencyContext";

function SummaryTable({
  spendings,
  users,
}: {
  spendings: Spending[];
  users: User[];
}) {
  const { t } = useLanguage();
  const { currencyCode, currencyLocale } = useCurrency();
  const usersCount = users.length;
  const usersDataMemo = useMemo(() => {
    const countMap = spendings.reduce<Record<string, number>>(
      (acc, spending) => {
        acc[spending.userId] = (acc[spending.userId] || 0) + 1;
        return acc;
      },
      {}
    );
    const unitSumMap = spendings.reduce<Record<string, number>>(
      (acc, spending) => {
        acc[spending.userId] =
          (acc[spending.userId] || 0) + spending.exchangedAmount;
        return acc;
        // pass filter by currency here and change spending.amount with exchangedAmount
      },
      {}
    );
    const sumValue = spendings.reduce((acc, spending) => {
      return acc + spending.exchangedAmount;
    }, 0);
    const divisionValue = usersCount > 0 ? sumValue / usersCount : 0;

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      claims: (unitSumMap[user.id] || 0) - divisionValue,
      count: countMap[user.id] || 0,
      unitSum: unitSumMap[user.id] || 0,
      sum: sumValue || 0,
      division: divisionValue || 0,
    }));
  }, [users, spendings]);

  return (
    <>
      {spendings.length > 0 ? (
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>{t.summary.user}</th>
                <th>{t.summary.claims}</th>
                <th className="summary-table-hide-on-mobile">
                  {t.summary.count}
                </th>
                <th>{t.summary.unitSum}</th>
                <th>{t.summary.sum}</th>
                <th className="summary-table-hide-on-mobile">
                  {t.summary.division}
                </th>
              </tr>
            </thead>
            <tbody>
              {usersDataMemo.map((userMemo, index) => (
                <tr key={userMemo.id}>
                  <th
                    className="summary-table-username"
                    style={
                      {
                        "--pred-color":
                          predefinedColors[
                            users.findIndex((user) => user.id === userMemo.id)
                          ],
                      } as React.CSSProperties
                    }
                  >
                    {userMemo.name}
                  </th>
                  <td
                    className="summary-table-claims"
                    style={
                      {
                        "--claim-color":
                          userMemo.claims > 0
                            ? "var(--positive-color)"
                            : "var(--negative-color)",
                      } as React.CSSProperties
                    }
                  >
                    {formatCurrency(
                      userMemo.claims,
                      currencyCode,
                      currencyLocale
                    )}
                  </td>
                  <td className="summary-table-hide-on-mobile">
                    {userMemo.count}
                  </td>
                  <td>
                    {formatCurrency(
                      userMemo.unitSum,
                      currencyCode,
                      currencyLocale
                    )}
                  </td>
                  {index === 0 && (
                    <>
                      <td rowSpan={usersCount}>
                        {formatCurrency(
                          userMemo.sum,
                          currencyCode,
                          currencyLocale
                        )}
                      </td>
                      <td
                        className="summary-table-hide-on-mobile"
                        rowSpan={usersCount}
                      >
                        {formatCurrency(
                          userMemo.division,
                          currencyCode,
                          currencyLocale
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <> {usersCount > 0 && <p>{t.spending.nowAddSpending}</p>}</>
      )}
    </>
  );
}

export default SummaryTable;
