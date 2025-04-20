import { useState, useEffect } from 'react';

export function useStepsData({ filterDailyAverage = true, person = null, totals = false } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = totals ? 'http://localhost:5120/steps/totals' : 'http://localhost:5120/steps';
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(json => {
        let result = json;
        if (!totals && filterDailyAverage) {
          const filtered = [];
          for (const entry of json) {
            if ((entry.month || '').trim().toLowerCase() === 'daily average') break;
            filtered.push(entry);
          }
          result = filtered;
        }
        if (person && !totals) {
          result = result.filter(entry => entry.steps[person] !== undefined);
        }
        setData(result);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [filterDailyAverage, person, totals]);

  return { data, loading, error };
}
