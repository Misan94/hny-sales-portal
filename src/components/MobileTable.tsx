
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MobileTableProps {
  data: any[];
  fields: Array<{
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
  }>;
  keyField: string;
}

export function MobileTable({ data, fields, keyField }: MobileTableProps) {
  return (
    <div className="space-y-3 sm:hidden">
      {data.map((item) => (
        <Card key={item[keyField]} className="p-4">
          <CardContent className="p-0 space-y-2">
            {fields.map((field) => (
              <div key={field.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {field.label}:
                </span>
                <span className="text-sm font-medium">
                  {field.render ? field.render(item[field.key], item) : item[field.key] || "N/A"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
