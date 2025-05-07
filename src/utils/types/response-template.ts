export type ApiResponse<T = unknown> = {
    success: true
    data: T
} | {
    success: false,
    data: {
        statusCode: number,
        error: string,
        message: string
    }
}