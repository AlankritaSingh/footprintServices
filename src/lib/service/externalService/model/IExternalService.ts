/**
 * Interface for external service
 * @template T - The type of data returned by the external service
 * @property {function(): Promise<T>} fetchData - Function to fetch data from the external service
 * @description This interface defines the structure for external services that fetch data.
 */
export interface IExternalService<T> {
  fetchData: () => Promise<T>;
}
