import { Transaction } from '../models/Transaction';
import { DashboardStats } from '../types/Transaction';

export class DashboardService {
  // 🔹 Main dashboard summary
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // 🔹 Get transactions for current month
    const currentMonthTransactions = await Transaction.find({
      user_id: userId,
      date: { $gte: currentMonth },
      status: 'completed'
    });

    // 🔹 Get transactions for previous month
    const previousMonthTransactions = await Transaction.find({
      user_id: userId,
      date: { $gte: previousMonth, $lte: previousMonthEnd },
      status: 'completed'
    });

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0));

    const totalBalance = totalIncome - totalExpenses;

    const prevMonthIncome = previousMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyGrowth = prevMonthIncome > 0
      ? ((totalIncome - prevMonthIncome) / prevMonthIncome) * 100
      : 0;

    const transactionCount = await Transaction.countDocuments({
      user_id: userId,
      status: 'completed'
    });

    // 🔹 Category breakdown
    const categoryAggregation = await Transaction.aggregate([
      {
        $match: {
          user_id: userId,
          date: { $gte: currentMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: { $abs: '$amount' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { amount: -1 } },
      { $limit: 10 }
    ]);

    const totalCategoryAmount = categoryAggregation.reduce((sum, cat) => sum + cat.amount, 0);

    const categoryBreakdown = categoryAggregation.map(cat => ({
      category: cat._id,
      amount: cat.amount,
      percentage: totalCategoryAmount > 0 ? (cat.amount / totalCategoryAmount) * 100 : 0
    }));

    const recentTransactionsRaw = await Transaction.find({
      user_id: userId,
      status: 'completed'
    })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    // Ensure _id is a string for each transaction
    const recentTransactions = recentTransactionsRaw.map((t: any) => ({
      ...t,
      _id: t._id?.toString?.() ?? t._id
    }));

    return {
      totalBalance,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      transactionCount,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      categoryBreakdown,
      recentTransactions
    };
  }

  // 🔹 Chart data for income vs. expenses by month
  static async getMonthlyChartData(userId: string, months: number = 6): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - months);

    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          user_id: userId,
          date: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          amount: { $sum: { $abs: '$amount' } }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month'
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$amount', 0]
            }
          },
          expenses: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$amount', 0]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return monthlyData.map(item => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', {
        month: 'short'
      }),
      income: item.income,
      expenses: item.expenses
    }));
  }
}
