import { useState, useEffect } from 'react';

export function useStepsData({ filterDailyAverage = true, person = null, totals = false, tab = 'dashboard' } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Backend API endpoint for Google Sheets data
    let url = `http://localhost:5120/api/sheets/data?tab=${tab}`;
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(json => {
        // Backend now returns array of objects, not a 2D array
        if (!Array.isArray(json)) {
          setData([]);
          return;
        }
        let result = json;
        if (!totals && filterDailyAverage) {
          const filtered = [];
          for (const entry of json) {
            const month = (entry.month || '').toString().trim().toLowerCase();
            if (month === 'daily average') break;
            if (month === 'annual') continue;
            filtered.push(entry);
          }
          result = filtered;
        }
        if (person && !totals) {
          result = result.filter(entry => entry[person.toLowerCase()] !== undefined);
        }
        setData(result);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [filterDailyAverage, person, totals, tab]);

  return { data, loading, error };
}
