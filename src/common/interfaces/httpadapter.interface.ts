
export interface HttpAdapter {
    get<T>(url: string): Promise<T>
    post<T>(url: string): Promise<T>
    put<T>(url: string): Promise<T>
    patch<T>(url: string): Promise<T>
    delete<T>(url: string): Promise<T>
}