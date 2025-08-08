
export interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  description: string;
  color: string;
}

export interface RFMData {
  customerId: string;
  recency: number;
  frequency: number;
  monetary: number;
  packSizePreference: string;
  segment: string;
  avgPackSize: number;
}

export interface SegmentInsight {
  segment: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}
