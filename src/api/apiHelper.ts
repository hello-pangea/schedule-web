export function getApiEndpoint(path: string) {
  return process.env.NEXT_PUBLIC_API_DOMAIN + path;
}

export function post(url: string, body: any): Promise<any> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}
