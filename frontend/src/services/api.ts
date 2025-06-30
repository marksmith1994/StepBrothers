import { API_CONFIG } from '@/constants';
import type { 
  StepDataResponse, 
  GamificationData, 
  ParticipantData, 
  TotalsData
} from '@/types';

/**
 * Custom error class for API errors
 */
export class APIException extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'APIException';
    this.status = status;
    this.code = code;
  }
}

/**
 * API response wrapper
 */
interface APIResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * Request configuration
 */
interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Default request configuration
 */
const DEFAULT_CONFIG: RequestConfig = {
  timeout: 10000, // 10 seconds
  retries: 2,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Retry function with exponential backoff
 */
const retry = async <T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2);
  }
};

/**
 * Make an HTTP request with timeout and retry logic
 */
async function request<T>(
  url: string,
  config: RequestConfig = {}
): Promise<APIResponse<T>> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { timeout, retries, ...fetchConfig } = finalConfig;

  const makeRequest = async (): Promise<APIResponse<T>> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If we can't parse the error response, use the default message
        }

        throw new APIException(errorMessage, response.status);
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof APIException) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIException('Request timeout', 408);
        }
        throw new APIException(error.message, 0);
      }
      
      throw new APIException('Unknown error occurred', 0);
    }
  };

  return retry(makeRequest, retries || 0);
}

/**
 * API service class
 */
export class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Get step data for a specific tab
   */
  async getStepData(tab: string = 'dashboard', year?: number): Promise<StepDataResponse> {
    const params = new URLSearchParams({ tab });
    if (year) params.append('year', year.toString());
    
    const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.SHEETS_DATA}?${params}`;
    const response = await request<StepDataResponse>(url);
    return response.data;
  }

  /**
   * Get gamification data
   */
  async getGamificationData(): Promise<GamificationData> {
    const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.SHEETS_GAMIFICATION}`;
    const response = await request<GamificationData>(url);
    return response.data;
  }

  /**
   * Get participant data
   */
  async getParticipantData(name: string, fromDate?: Date): Promise<ParticipantData> {
    const params = new URLSearchParams();
    if (fromDate) {
      params.append('fromDate', fromDate.toISOString().split('T')[0]);
    }
    
    const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.SHEETS_PARTICIPANT}/${encodeURIComponent(name)}?${params}`;
    const response = await request<ParticipantData>(url);
    return response.data;
  }

  /**
   * Get totals data
   */
  async getTotals(): Promise<TotalsData> {
    const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.SHEETS_TOTALS}`;
    const response = await request<TotalsData>(url);
    return response.data;
  }

  /**
   * Get available sheet tabs
   */
  async getSheetTabs(): Promise<string[]> {
    const url = `${this.baseURL}${API_CONFIG.ENDPOINTS.SHEETS_TABS}`;
    const response = await request<string[]>(url);
    return response.data;
  }

  /**
   * Test endpoint for debugging
   */
  async testFilter(name: string, fromDate: Date): Promise<any> {
    const params = new URLSearchParams();
    params.append('fromDate', fromDate.toISOString().split('T')[0]);
    
    const url = `${this.baseURL}/api/sheets/test-filter/${encodeURIComponent(name)}?${params}`;
    const response = await request<any>(url);
    return response.data;
  }
}

/**
 * Default API service instance
 */
export const apiService = new APIService();

/**
 * Export individual methods for convenience
 */
export const {
  getStepData,
  getGamificationData,
  getParticipantData,
  getTotals,
  getSheetTabs,
  testFilter,
} = apiService; 