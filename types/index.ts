export interface FoodItem {
  id: string;
  name: string;
  expiryDate: string; // ISO string format: "YYYY-MM-DD"
  addedAt: string;
}

export interface UploadSuccessResponse {
  success: true;
  label: string;
  item: FoodItem;
}

export interface UploadErrorResponse {
  success: false;
  message?: string;
}

export type UploadResponse = UploadSuccessResponse | UploadErrorResponse;
