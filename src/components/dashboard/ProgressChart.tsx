interface ProgressChartProps {
  timeRange: string;
}

const ProgressChart = ({ timeRange }: ProgressChartProps) => {
  // This is a placeholder for an actual chart component
  // In a real implementation, you would use a library like Chart.js, Recharts, or D3.js
  
  // Generate some sample data based on the timeRange
  const getData = () => {
    switch (timeRange) {
      case 'week':
        return [
          { day: 'Mon', hours: 1.5, problems: 12 },
          { day: 'Tue', hours: 2.0, problems: 18 },
          { day: 'Wed', hours: 1.2, problems: 10 },
          { day: 'Thu', hours: 2.5, problems: 22 },
          { day: 'Fri', hours: 1.8, problems: 15 },
          { day: 'Sat', hours: 3.0, problems: 25 },
          { day: 'Sun', hours: 2.2, problems: 20 },
        ];
      case 'month':
        return Array.from({ length: 4 }, (_, i) => ({
          week: `Week ${i + 1}`,
          hours: 8 + Math.random() * 10,
          problems: 50 + Math.floor(Math.random() * 50),
        }));
      case 'year':
        return [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ].map(month => ({
          month,
          hours: 20 + Math.random() * 40,
          problems: 100 + Math.floor(Math.random() * 150),
        }));
      default:
        return [];
    }
  };
  
  const data = getData();
  const maxValue = Math.max(...data.map(d => 'hours' in d ? d.hours : 0)) * 1.2;
  
  // Generate bar heights as percentages of the container height
  const getBarHeight = (value: number) => {
    return (value / maxValue) * 100;
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-end">
        <div className="w-full h-full flex items-end">
          {data.map((d, i) => {
            const label = 'day' in d ? d.day : 'week' in d ? d.week : d.month;
            const value = 'hours' in d ? d.hours : 0;
            const height = getBarHeight(value);
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full px-1">
                  <div 
                    className="w-full bg-primary-500 dark:bg-primary-600 rounded-t transition-all duration-500 ease-out relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {value.toFixed(1)} hours
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
        <div>Hours Studied</div>
        <div>Total: {data.reduce((sum, d) => sum + ('hours' in d ? d.hours : 0), 0).toFixed(1)} hrs</div>
      </div>
    </div>
  );
};

export default ProgressChart;