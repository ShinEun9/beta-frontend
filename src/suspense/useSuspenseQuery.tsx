const queryCache = new Map();

type QueryFunction<T> = () => Promise<T>;

interface UseSuspenseQueryOptions<T> {
  queryKey: unknown[];
  queryFn: QueryFunction<T>;
  retry?: number;
  retryDelay?: number;
}

interface QueryResult<T> {
  data: T | null;
  error: Error | null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(options: UseSuspenseQueryOptions<T>): Promise<T> {
  const { queryFn, retry = 3, retryDelay } = options;
  let lastError = null;

  for (let attempt = 0; attempt < retry + 1; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      if (attempt < retry) {
        if (retryDelay) {
          await sleep(retryDelay);
        } else {
          await sleep(Math.min(1000 * 2 ** attempt, 30000));
        }
      }
    }
  }

  throw lastError;
}

function useSuspenseQuery<T>(options: UseSuspenseQueryOptions<T>): QueryResult<T> {
  const { queryKey } = options;
  const stringifiedKey = JSON.stringify(queryKey);

  let promise = queryCache.get(stringifiedKey);
  if (!promise) {
    promise = fetchWithRetry(options).then(
      (data) => {
        queryCache.set(stringifiedKey, { data });
        return data;
      },
      (error) => {
        queryCache.set(stringifiedKey, { error });
        throw error;
      },
    );

    queryCache.set(stringifiedKey, promise); // queryCache에 저장되는 것이 Promise 자체 =  이 Promise는 데이터가 로드되고 처리될 때까지 대기 상태에 있음.
  }

  if (promise instanceof Promise) {
    throw promise;
  } else if (promise.data) {
    return { data: promise.data, error: null };
  } else {
    return { data: null, error: promise.error };
  }
}

export default useSuspenseQuery;
