
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ShoppingCart, Package } from 'lucide-react';
import { DashboardMetrics } from '@/hooks/useDashboardData';

interface RecentActivityProps {
  metrics: DashboardMetrics;
}

export function RecentActivity({ metrics }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return Users;
      case 'transaction':
        return ShoppingCart;
      case 'product':
        return Package;
      default:
        return Package;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'customer':
        return 'text-blue-500';
      case 'transaction':
        return 'text-green-500';
      case 'product':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Latest updates across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {metrics.recentActivity.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const iconColor = getIconColor(activity.type);
            
            return (
              <div key={index} className="flex items-start space-x-3 p-2 sm:p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className={`p-1.5 sm:p-2 rounded-full bg-background ${iconColor} flex-shrink-0`}>
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium line-clamp-2">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.timestamp)}</p>
                </div>
                <Badge variant="outline" className="capitalize text-xs flex-shrink-0">
                  {activity.type}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
