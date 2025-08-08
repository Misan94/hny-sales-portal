
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SectionPreviewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
  children?: React.ReactNode;
}

export function SectionPreview({ title, description, icon: Icon, route, metrics, children }: SectionPreviewProps) {
  const navigate = useNavigate();

  return (
    <Card className="glass-card hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => navigate(route)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg truncate">{title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm line-clamp-2">{description}</CardDescription>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {metrics && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-base sm:text-lg font-semibold truncate">{metric.value}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{metric.label}</div>
              </div>
            ))}
          </div>
        )}
        {children}
        <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-sm">
          View Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
