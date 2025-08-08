import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Search, Users, Target, Clock, TrendingUp, Filter, Calendar } from 'lucide-react';
import { CustomerPrediction } from '@/types/recommendation';

interface CustomerPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  category: string;
  customerPredictions: CustomerPrediction[];
}

type ConfidenceFilter = 'all' | 'high' | 'medium' | 'low';
type SortOption = 'confidence' | 'name' | 'lastPurchase';

export function CustomerPredictionModal({ 
  isOpen, 
  onClose, 
  productName, 
  category, 
  customerPredictions 
}: CustomerPredictionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('confidence');

  const filteredAndSortedPredictions = customerPredictions
    .filter(prediction => {
      const matchesSearch = prediction.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesConfidence = 
        confidenceFilter === 'all' ||
        (confidenceFilter === 'high' && prediction.confidence >= 70) ||
        (confidenceFilter === 'medium' && prediction.confidence >= 50 && prediction.confidence < 70) ||
        (confidenceFilter === 'low' && prediction.confidence < 50);
      return matchesSearch && matchesConfidence;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'name':
          return a.customerName.localeCompare(b.customerName);
        case 'lastPurchase':
          return new Date(b.lastPurchaseDate).getTime() - new Date(a.lastPurchaseDate).getTime();
        default:
          return 0;
      }
    });

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 70) return "default";
    if (confidence >= 50) return "secondary";
    return "outline";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "bg-green-500";
    if (confidence >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const averageConfidence = customerPredictions.length > 0 
    ? Math.round(customerPredictions.reduce((sum, p) => sum + p.confidence, 0) / customerPredictions.length)
    : 0;

  const highConfidenceCount = customerPredictions.filter(p => p.confidence >= 70).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col">
        {/* Enhanced Header */}
        <div className="flex-none bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b">
          <DialogHeader className="space-y-4">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{productName}</div>
                <div className="text-sm text-muted-foreground font-normal">Potential Customer Analysis</div>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              AI-powered insights showing customers most likely to purchase {productName}
            </DialogDescription>
            
            {/* Stats Summary */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
              </div>
              
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/80 rounded-lg p-3 min-w-[80px]">
                  <div className="text-lg font-bold text-blue-600">{customerPredictions.length}</div>
                  <div className="text-xs text-muted-foreground">Total Prospects</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3 min-w-[80px]">
                  <div className="text-lg font-bold text-green-600">{highConfidenceCount}</div>
                  <div className="text-xs text-muted-foreground">High Confidence</div>
                </div>
                <div className="bg-white/80 rounded-lg p-3 min-w-[80px]">
                  <div className="text-lg font-bold text-purple-600">{averageConfidence}%</div>
                  <div className="text-xs text-muted-foreground">Avg. Confidence</div>
                </div>
              </div>
            </div>

            {/* Confidence Distribution Bar */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Confidence Distribution</div>
              <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(highConfidenceCount / customerPredictions.length) * 100}%` }}
                />
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(customerPredictions.filter(p => p.confidence >= 50 && p.confidence < 70).length / customerPredictions.length) * 100}%` }}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(customerPredictions.filter(p => p.confidence < 50).length / customerPredictions.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>High (70%+)</span>
                <span>Medium (50-69%)</span>
                <span>Low (&lt;50%)</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Filters and Search */}
        <div className="flex-none p-6 space-y-4 border-b bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Confidence:
            </span>
            {(['all', 'high', 'medium', 'low'] as ConfidenceFilter[]).map((filter) => (
              <Button
                key={filter}
                variant={confidenceFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setConfidenceFilter(filter)}
                className="text-xs"
              >
                {filter === 'all' ? 'All' : 
                 filter === 'high' ? 'High (70%+)' :
                 filter === 'medium' ? 'Medium (50-69%)' : 'Low (<50%)'}
              </Button>
            ))}

            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="confidence">Confidence</option>
                <option value="name">Name</option>
                <option value="lastPurchase">Last Purchase</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer List - Fixed height scrollable area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div 
            className="h-full overflow-y-auto"
            style={{ maxHeight: 'calc(85vh - 300px)' }}
          >
            <div className="p-6 space-y-4">
              {filteredAndSortedPredictions.map((prediction, index) => (
                <div 
                  key={index} 
                  className="group bg-white border rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Customer Avatar */}
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {getInitials(prediction.customerName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Customer Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{prediction.customerName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Last purchase: {formatDate(prediction.lastPurchaseDate)}
                          </div>
                        </div>
                        
                        {/* Confidence Score */}
                        <div className="text-right space-y-2">
                          <Badge variant={getConfidenceBadgeVariant(prediction.confidence)} className="text-sm">
                            {prediction.confidence}% confidence
                          </Badge>
                          <div className="w-24">
                            <Progress 
                              value={prediction.confidence} 
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Prediction Reasoning */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800">{prediction.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredAndSortedPredictions.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                  <p className="text-gray-600 max-w-sm mx-auto">
                    {searchTerm 
                      ? `No customers match your search "${searchTerm}" with the selected filters.`
                      : 'No customers match the selected confidence filters.'
                    }
                  </p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm('')}
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {filteredAndSortedPredictions.length > 0 && (
          <div className="flex-none border-t bg-gray-50/50 px-6 py-3">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedPredictions.length} of {customerPredictions.length} potential customers
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
