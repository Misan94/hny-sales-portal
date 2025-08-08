export interface ProductRecommendation {
  productId: string;
  productName: string;
  category: string;
  confidence: number;
  reason: string;
  supportingData: {
    transitionProbability?: number;
    categoryAffinity?: number;
    collaborativeScore?: number;
    recencyWeight?: number;
  };
}

export interface TransitionMatrix {
  fromProduct: string;
  toProduct: string;
  transitionCount: number;
  transitionProbability: number;
}

export interface CustomerRecommendation {
  customerId: string;
  customerName: string;
  lastPurchaseDate: string;
  recommendations: ProductRecommendation[];
  purchaseHistory: string[];
}

export interface RecommendationAnalytics {
  topTransitions: TransitionMatrix[];
  categoryAffinities: {
    fromCategory: string;
    toCategory: string;
    strength: number;
  }[];
  popularProducts: {
    productName: string;
    category: string;
    recommendationCount: number;
  }[];
}

export interface CustomerPrediction {
  customerId: string;
  customerName: string;
  confidence: number;
  lastPurchaseDate: string;
  reason: string;
}

export interface ProductPrediction {
  productName: string;
  category: string;
  totalPotentialBuyers: number;
  customerPredictions: CustomerPrediction[];
}

export interface PredictionAnalytics {
  productPredictions: ProductPrediction[];
}

export interface DemographicPrediction {
  demographic: string;
  value: string;
  productName: string;
  category: string;
  confidence: number;
  reason: string;
  sampleSize: number;
}

export interface DemographicAnalytics {
  agePredictions: DemographicPrediction[];
  genderPredictions: DemographicPrediction[];
  locationPredictions: DemographicPrediction[];
  householdSizePredictions: DemographicPrediction[];
}
