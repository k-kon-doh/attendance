/** フェッチ結果型 */
export type FetchResult<DataT = unknown> = {
  request: Request;
  response: Response;
  data: DataT;
};

/** APIフェッチャー */
export async function fetcher<DataT = unknown>(url: RequestInfo, options: RequestInit = {}): Promise<FetchResult<DataT>> {
  const request = new Request(url, options);
  const response = await fetch(request);

  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("response data is not json.");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || `${response.status}: ${response.statusText}`);
  }

  if (data == null) {
    throw new Error("response data is null.");
  }

  // TODO: data が DataT 型であることを検証

  return { request, response, data };
}
