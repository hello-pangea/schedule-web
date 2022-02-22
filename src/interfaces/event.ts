import Person from "./person";

export default interface Event {
  /** Uuid */
  id: string;

  /** Human readable name of the event */
  name: string;

  /** Unix timestamp */
  createdDate: number;

  /** Unix timestamp in seconds.
   *
   * Day is the start day, time is the min time
   */
  minTime: number;
  /** Unix timestamp in seconds.
   *
   * Day is the end day, time is the max time
   */
  maxTime: number;

  /** Unix timestamp in seconds.
   *
   * Array of unix timestamps (in seconds) of days
   */
  days: number[];

  people?: Person[];
}
