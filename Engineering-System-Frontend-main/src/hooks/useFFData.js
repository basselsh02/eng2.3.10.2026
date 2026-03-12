// src/hooks/useFFData.js
import { useState, useEffect, useRef } from 'react';

/**
 * Generic hook for fetching read-only data from FinalFinally.
 *
 * Usage:
 *   const { data, loading, error, total } = useFFData(getFFContracts, { search: 'abc' }, [search]);
 *
 * @param {Function} fetchFn  - one of the getFF* functions from ffApi.js
 * @param {Object}   params   - query params object passed directly to fetchFn
 * @param {Array}    deps     - dependency array; re-fetches when any dep changes
 *
 * @returns {{ data: Array, loading: boolean, error: string|null, total: number }}
 */
export const useFFData = (fetchFn, params = {}, deps = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);

    fetchFn(params)
      .then((res) => {
        if (!mountedRef.current) return;

        // Handle the two response shapes FF uses:
        // Shape A (projects, companies, contracts, extracts):
        //   { success, data: [...], totalResults: N, totalPages: N }
        // Shape B (procurements):
        //   { success, data: [...], pagination: { total, pages, page, limit } }
        const items = Array.isArray(res.data) ? res.data : [];
        const count =
          res.totalResults ??
          res.total ??
          res.pagination?.total ??
          items.length;

        setData(items);
        setTotal(count);
      })
      .catch((err) => {
        if (!mountedRef.current) return;
        setError(err.message || 'خطأ في تحميل البيانات من النظام القديم');
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, total };
};
