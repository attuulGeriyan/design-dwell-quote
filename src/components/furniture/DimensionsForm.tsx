import React, { useState, useEffect } from 'react';
import { Ruler, Info } from 'lucide-react';
import { FurnitureItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface DimensionsFormProps {
  furnitureType: FurnitureItem['type'];
  onFurnitureTypeChange: (type: FurnitureItem['type']) => void;
  onComplete: (dimensions: FurnitureItem['dimensions']) => void;
  initialData?: FurnitureItem['dimensions'];
}

const furnitureTypes = [
  { value: 'wardrobe', label: 'Wardrobe' },
  { value: 'kitchen', label: 'Kitchen Cabinet' },
  { value: 'tv_unit', label: 'TV Unit' },
  { value: 'study_table', label: 'Study Table' },
  { value: 'shoe_rack', label: 'Shoe Rack' },
  { value: 'other', label: 'Other' },
];

const DimensionsForm: React.FC<DimensionsFormProps> = ({
  furnitureType,
  onFurnitureTypeChange,
  onComplete,
  initialData,
}) => {
  const [dimensions, setDimensions] = useState({
    x: initialData?.x || 0,
    y: initialData?.y || 0,
    z: initialData?.z || 0,
    skirtingHeight: initialData?.skirtingHeight || 4,
    doorThickness: initialData?.doorThickness || 0.75,
    backThickness: initialData?.backThickness || 0.5,
  });

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDimensions(prev => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSubmit = () => {
    if (dimensions.x > 0 && dimensions.y > 0 && dimensions.z > 0) {
      onComplete(dimensions);
    }
  };

  const isValid = dimensions.x > 0 && dimensions.y > 0 && dimensions.z > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Ruler className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Furniture Dimensions
        </h3>
        <p className="text-muted-foreground">
          Enter the dimensions and specifications for your furniture item
        </p>
      </div>

      {/* Furniture Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="furnitureType">Furniture Type</Label>
        <Select value={furnitureType} onValueChange={onFurnitureTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select furniture type" />
          </SelectTrigger>
          <SelectContent>
            {furnitureTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Dimensions */}
      <Card className="border border-border/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Ruler className="mr-2 h-4 w-4" />
            Main Dimensions (in feet)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (X)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={dimensions.x || ''}
                onChange={(e) => handleInputChange('x', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (Y)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={dimensions.y || ''}
                onChange={(e) => handleInputChange('y', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth">Depth (Z)</Label>
              <Input
                id="depth"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={dimensions.z || ''}
                onChange={(e) => handleInputChange('z', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Specifications */}
      <Card className="border border-border/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Info className="mr-2 h-4 w-4" />
            Additional Specifications (in inches)
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skirting">Skirting Height</Label>
              <Input
                id="skirting"
                type="number"
                step="0.1"
                min="0"
                value={dimensions.skirtingHeight || ''}
                onChange={(e) => handleInputChange('skirtingHeight', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doorThickness">Door Thickness</Label>
              <Input
                id="doorThickness"
                type="number"
                step="0.1"
                min="0"
                value={dimensions.doorThickness || ''}
                onChange={(e) => handleInputChange('doorThickness', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backThickness">Back Thickness</Label>
              <Input
                id="backThickness"
                type="number"
                step="0.1"
                min="0"
                value={dimensions.backThickness || ''}
                onChange={(e) => handleInputChange('backThickness', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {isValid && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-2">Dimension Summary</h4>
            <p className="text-sm text-muted-foreground">
              <span className="capitalize">{furnitureType.replace('_', ' ')}</span> - 
              {dimensions.x}' × {dimensions.y}' × {dimensions.z}' 
              (W × H × D)
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!isValid}
          className="btn-primary"
        >
          Continue to Components
        </Button>
      </div>
    </div>
  );
};

export default DimensionsForm;