import React from 'react';
import { FileText, Download, Eye, Calculator } from 'lucide-react';
import { Project, FurnitureItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface QuotationSummaryProps {
  project: Project;
  furnitureItems: FurnitureItem[];
  onGeneratePDF: () => void;
}

const QuotationSummary: React.FC<QuotationSummaryProps> = ({
  project,
  furnitureItems,
  onGeneratePDF,
}) => {
  const calculateSubtotal = () => {
    return furnitureItems.reduce((sum, item) => sum + item.costs.total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.18; // 18% GST
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-professional">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">Quotation Summary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {project.title} - {project.client.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button onClick={onGeneratePDF} className="btn-primary">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Client & Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-base">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{project.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{project.client.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{project.client.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{project.client.address}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Project Title</p>
              <p className="font-medium">{project.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{project.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quotation Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Until</p>
              <p className="font-medium">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Furniture Items Table */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-base">Furniture Items</CardTitle>
        </CardHeader>
        <CardContent>
          {furnitureItems.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No items added yet
              </h3>
              <p className="text-muted-foreground">
                Add furniture items to generate quotation
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead className="text-right">Material Cost</TableHead>
                    <TableHead className="text-right">Hardware Cost</TableHead>
                    <TableHead className="text-right">Labor Cost</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {furnitureItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium capitalize">
                            {item.type.replace('_', ' ')}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.components)
                              .filter(([, qty]) => qty > 0)
                              .map(([component, qty]) => (
                                <Badge key={component} variant="secondary" className="text-xs">
                                  {qty} {component.replace('_', ' ')}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {item.dimensions.x}' × {item.dimensions.y}' × {item.dimensions.z}'
                        </p>
                        <p className="text-xs text-muted-foreground">W × H × D</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="capitalize">{item.materials.primary.replace('_', ' ')}</p>
                          {item.materials.outerLamination && (
                            <p className="text-xs text-muted-foreground capitalize">
                              {item.materials.outerLamination.replace('_', ' ')} finish
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.costs.materialCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.costs.hardwareCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₹{item.costs.laborCost.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{item.costs.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Totals */}
      {furnitureItems.length > 0 && (
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">GST (18%):</span>
                <span className="font-medium">₹{calculateTax().toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span className="text-primary">₹{calculateGrandTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms & Conditions */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="text-base">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>1. This quotation is valid for 30 days from the date of issue.</p>
            <p>2. 50% advance payment required to start the work.</p>
            <p>3. Balance payment on completion and before delivery.</p>
            <p>4. Installation charges are included in the quotation.</p>
            <p>5. Transportation charges may apply for locations beyond city limits.</p>
            <p>6. Any changes in design or materials may affect the final cost.</p>
            <p>7. Warranty: 1 year on manufacturing defects.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotationSummary;