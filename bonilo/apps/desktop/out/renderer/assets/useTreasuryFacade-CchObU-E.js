import { j as useCashSessionStore, k as useSafeStore, l as useSinkingFundsStore, m as useExpensesStore } from "./index-BbOgUw3k.js";
const useTreasuryFacade = () => {
  const cashSession = useCashSessionStore();
  const safe = useSafeStore();
  const provisions = useSinkingFundsStore();
  const expenses = useExpensesStore();
  const depositToSafe = (amount, reason, performedBy) => {
    const shouldRecordMovement = cashSession.currentSession?.status === "open";
    safe.depositToSafe(
      amount,
      reason,
      performedBy,
      shouldRecordMovement ? cashSession.addMovement : void 0
    );
  };
  const contributeToFund = (fundId, amount, reason, performedBy) => {
    const shouldRecordMovement = cashSession.currentSession?.status === "open";
    provisions.contributeToFund(
      fundId,
      amount,
      reason,
      performedBy,
      shouldRecordMovement ? cashSession.addMovement : void 0
    );
  };
  const markExpenseAsPaid = (expenseId, paidFrom, performedBy = "System") => {
    expenses.markExpenseAsPaid(expenseId, paidFrom, performedBy, {
      onMovement: cashSession.currentSession?.status === "open" ? cashSession.addMovement : void 0,
      onWithdrawFromSafe: safe.withdrawFromSafe,
      onWithdrawFromFund: provisions.withdrawFromFund,
      getFundByCategory: (category) => provisions.sinkingFunds.find((f) => f.category === category)
    });
  };
  const addExpense = (expense, isPaid = false, paidFrom) => {
    const newExpense = expenses.addExpense(expense, isPaid, paidFrom);
    if (isPaid && paidFrom) {
      markExpenseAsPaid(newExpense.id, paidFrom);
    }
  };
  const getTotalSafeAndProvisions = () => {
    return safe.safeBalance + provisions.getTotalProvisions();
  };
  return {
    // Cash Session State & Actions
    currentSession: cashSession.currentSession,
    sessions: cashSession.sessions,
    movements: cashSession.movements,
    openSession: cashSession.openSession,
    closeSession: cashSession.closeSession,
    addMovement: cashSession.addMovement,
    getSessionMovements: cashSession.getSessionMovements,
    getTodaySales: cashSession.getTodaySales,
    getCurrentBalance: cashSession.getCurrentBalance,
    // Safe State & Actions
    safeBalance: safe.safeBalance,
    safeTransactions: safe.safeTransactions,
    depositToSafe,
    withdrawFromSafe: safe.withdrawFromSafe,
    // Sinking Funds State & Actions
    sinkingFunds: provisions.sinkingFunds,
    contributeToFund,
    withdrawFromFund: provisions.withdrawFromFund,
    updateFundTarget: provisions.updateFundTarget,
    addSinkingFund: provisions.addSinkingFund,
    getDailyProvisionTarget: provisions.getDailyProvisionTarget,
    getProvisionProgress: provisions.getProvisionProgress,
    // Expenses State & Actions
    expenses: expenses.expenses,
    expenseCategories: expenses.expenseCategories,
    addExpense,
    markExpenseAsPaid,
    deleteExpense: expenses.deleteExpense,
    getTodayExpenses: expenses.getTodayExpenses,
    // Combined Getters
    getTotalSafeAndProvisions
  };
};
export {
  useTreasuryFacade as u
};
