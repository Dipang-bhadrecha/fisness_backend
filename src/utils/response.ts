export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    message: message ?? 'OK',
    data,
    timestamp: new Date().toISOString(),
  }
}

export function errorResponse(message: string, code?: string, details?: unknown) {
  return {
    success: false,
    message,
    code,
    details,
    timestamp: new Date().toISOString(),
  }
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
    timestamp: new Date().toISOString(),
  }
}