import Event from "interfaces/event";
import TimeInterval from "interfaces/timeInterval";
import { getApiEndpoint, post } from "./apiHelper";

export function getEvent(id: string): Promise<Event> {
  return fetch(getApiEndpoint(`/events/${id}`), { method: "GET" }).then(
    (response) => response.json()
  );
}

export function createEvent(data: {
  name: string;
  minTime: number;
  maxTime: number;
  days: number[];
}): Promise<Event> {
  return post(getApiEndpoint(`/events/`), data);
}

export function updateFreeTime(data: {
  eventId: string;
  name: string;
  freeTime: TimeInterval[];
}) {
  return post(getApiEndpoint(`/events/${data.eventId}/freeTime`), {
    name: data.name,
    freeTime: data.freeTime,
  });
}
