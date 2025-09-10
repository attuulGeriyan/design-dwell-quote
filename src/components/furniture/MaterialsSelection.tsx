import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { FurnitureItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MaterialsSelectionProps {
  furnitureType: FurnitureItem['type'];
  onComplete: (materials: FurnitureItem['materials']) => void;
  initialData?: FurnitureItem['materials'];
}

const materials = {
  primary: [
    { value: 'mdf', label: 'MDF', description: 'Medium Density Fibreboard', price: 120 },
    { value: 'plywood', label: 'Plywood', description: 'Marine Grade Plywood', price: 180 },
    { value: 'particle_board', label: 'Particle Board', description: 'Engineered Wood', price: 80 },
    { value: 'solid_wood', label: 'Solid Wood', description: 'Teak/Oak Wood', price: 350 },
  ],
  lamination: [
    { value: 'none', label: 'No Lamination', price: 0 },
    { value: 'pvc', label: 'PVC Lamination', price: 45 },
    { value: 'hpl', label: 'HPL Lamination', price: 65 },
    { value: 'acrylic', label: 'Acrylic Finish', price: 85 },
    { value: 'veneer', label: 'Wood Veneer', price: 120 },
  ],
};

const MaterialsSelection: React.FC<MaterialsSelectionProps> = ({
  furnitureType,
  onComplete,
  initialData,
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<FurnitureItem['materials']>({
    primary: initialData?.primary || '',
    innerLamination: initialData?.innerLamination || '',
    outerLamination: initialData?.outerLamination || '',
  });

  const updateMaterial = (field: keyof FurnitureItem['materials'], value: string) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (selectedMaterials.primary) {
      onComplete(selectedMaterials);
    }
  };

  const calculateEstimatedCost = () => {
    let cost = 0;
    
    const primaryMaterial = materials.primary.find(m => m.value === selectedMaterials.primary);
    if (primaryMaterial) {
      cost += primaryMaterial.price;
    }

    const innerLamination = materials.lamination.find(m => m.value === selectedMaterials.innerLamination);
    if (innerLamination) {
      cost += innerLamination.price;
    }

    const outerLamination = materials.lamination.find(m => m.value === selectedMaterials.outerLamination);
    if (outerLamination) {
      cost += outerLamination.price;
    }

    return cost;
  };

  const isValid = !!selectedMaterials.primary;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Palette className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Select Materials
        </h3>
        <p className="text-muted-foreground">
          Choose the materials and finishes for your {furnitureType.replace('_', ' ')}
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary Material */}
        <Card className="border border-border/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Primary Material</Label>
                <Badge variant="secondary">Required</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {materials.primary.map((material) => (
                  <div
                    key={material.value}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedMaterials.primary === material.value
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:border-border/80'
                      }
                    `}
                    onClick={() => updateMaterial('primary', material.value)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground">{material.label}</h4>
                      {selectedMaterials.primary === material.value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {material.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      ₹{material.price}/sq ft
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inner Lamination */}
        <Card className="border border-border/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Inner Lamination</Label>
              
              <Select
                value={selectedMaterials.innerLamination}
                onValueChange={(value) => updateMaterial('innerLamination', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inner lamination" />
                </SelectTrigger>
                <SelectContent>
                  {materials.lamination.map((lamination) => (
                    <SelectItem key={lamination.value} value={lamination.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{lamination.label}</span>
                        <span className="ml-4 text-primary">
                          {lamination.price > 0 ? `+₹${lamination.price}` : 'Free'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Outer Lamination */}
        <Card className="border border-border/50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Outer Lamination</Label>
              
              <Select
                value={selectedMaterials.outerLamination}
                onValueChange={(value) => updateMaterial('outerLamination', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outer lamination" />
                </SelectTrigger>
                <SelectContent>
                  {materials.lamination.map((lamination) => (
                    <SelectItem key={lamination.value} value={lamination.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{lamination.label}</span>
                        <span className="ml-4 text-primary">
                          {lamination.price > 0 ? `+₹${lamination.price}` : 'Free'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Preview */}
      {isValid && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-3">Material Cost Preview</h4>
            <div className="space-y-2 text-sm">
              {selectedMaterials.primary && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {materials.primary.find(m => m.value === selectedMaterials.primary)?.label}:
                  </span>
                  <span className="font-medium">
                    ₹{materials.primary.find(m => m.value === selectedMaterials.primary)?.price}/sq ft
                  </span>
                </div>
              )}
              
              {selectedMaterials.innerLamination && selectedMaterials.innerLamination !== 'none' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inner Lamination:</span>
                  <span className="font-medium">
                    +₹{materials.lamination.find(m => m.value === selectedMaterials.innerLamination)?.price}
                  </span>
                </div>
              )}
              
              {selectedMaterials.outerLamination && selectedMaterials.outerLamination !== 'none' && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Outer Lamination:</span>
                  <span className="font-medium">
                    +₹{materials.lamination.find(m => m.value === selectedMaterials.outerLamination)?.price}
                  </span>
                </div>
              )}

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium text-primary">
                  <span>Estimated Material Cost:</span>
                  <span>₹{calculateEstimatedCost()}/sq ft</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!isValid}
          className="btn-primary"
        >
          Continue to Hardware
        </Button>
      </div>
    </div>
  );
};

export default MaterialsSelection;