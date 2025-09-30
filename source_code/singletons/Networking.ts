    /*
    * Networking Singleton 
    *
    * All Networking & Internet Logic in one Class
    * Should Handle All Multiplayer Logic 
    * alongside simulation and utils singleton classes
    *
    * to do:
    * (1) Implement Web rtc + web sockets for itchio multiplayer
    
    */


export class Networking {


}

// stores the http error to this new class
class HTTPError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function apiGet<T>(url: string): Promise<T> {
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });

  if (!resp.ok) {
    throw new HTTPError(resp.statusText, resp.status);
  }

  const data = await resp.json();
  return data as T;
}