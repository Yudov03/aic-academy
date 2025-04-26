import { WordPressEntity } from '~/models/wp-entity.model';

// Base response interface
export interface BaseResponse<T> {
  data: T[];
  meta?: {
    total: number;
    pages: number;
    current_page: number;
  }; 
}

// Environment configuration
const WP_V2_BASE_URL = process.env.WP_V2_BASE_URL!;
const TUTOR_V1_BASE_URL = process.env.TUTOR_V1_BASE_URL!;
const API_KEY = process.env.API_KEY!;
const API_SECRET = process.env.API_SECRET!;

// Abstract WordPress service
abstract class WPService<T extends WordPressEntity> {
  protected constructor(
    private readonly endpoint: string,
  ) {}

  protected abstract readonly baseUrl: string;

  // Get auth headers for Tutor API
  protected abstract getAuthHeaders(): Record<string, string> | null;

  // Handle API responses
  protected async handleResponse<R>(response: Response): Promise<R> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }
    return response.json() as Promise<R>;
  }

  // Build URL with query parameters
  protected buildURL(
    params: Record<string, string | number | undefined> = {}
  ): string {
    const url = new URL(`${this.baseUrl}/${this.endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
    return url.toString();
  }

  // Common GET request
  protected async get<R>(
    params: Record<string, string | number | undefined> = {},
    headers: Record<string, string> = {}
  ): Promise<R> {
    const url = this.buildURL(params);
    const response = await fetch(url, {
      headers: {
        ...(this.getAuthHeaders() || {}),
        ...headers,
      },
    });
    return this.handleResponse<R>(response);
  }

  // Common POST request
  protected async post<R>(data: Partial<T>): Promise<R> {
    const url = this.buildURL();
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeaders() || {},
      body: JSON.stringify(data),
    });
    return this.handleResponse<R>(response);
  }

  // Common PATCH request
  protected async patch<R>(id: number, data: Partial<T>): Promise<R> {
    const url = this.buildURL({ id });
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getAuthHeaders() || {},
      body: JSON.stringify(data),
    });
    return this.handleResponse<R>(response);
  }

  // Common DELETE request
  protected async delete(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    const url = this.buildURL({ id });
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getAuthHeaders() || {},
    });
    return this.handleResponse<{ success: boolean; message: string }>(response);
  }
}

export abstract class WPV2Service<
  T extends WordPressEntity
> extends WPService<T> {
  protected readonly baseUrl = WP_V2_BASE_URL;

  protected getAuthHeaders(): Record<string, string> | null {
    return {
      'Authorization': `Bearer ${API_KEY}`
    };
  }
}


export abstract class WPTutorService<
  T extends WordPressEntity
> extends WPService<T> {
  protected readonly baseUrl = TUTOR_V1_BASE_URL;

  protected getAuthHeaders(): Record<string, string> | null {
    return {
      'Authorization': `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64')}`
    };
  }
}
