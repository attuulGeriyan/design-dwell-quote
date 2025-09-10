import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus } from 'lucide-react';
import { FurnitureItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface ComponentsSelectionProps {
  furnitureType: FurnitureItem['type'];
  onComplete: (components: Record<string, number>) => void;
  initialData?: Record<string, number>;
}

const componentsByType = {
  wardrobe: [
    { key: 'doors', label: 'Doors', type: 'counter', max: 6, default: 2 },
    { key: 'shelves', label: 'Shelves', type: 'counter', max: 20, default: 4 },
    { key: 'drawers', label: 'Drawers', type: 'counter', max: 10, default: 2 },
    { key: 'hangingRod', label: 'Hanging Rod', type: 'toggle', default: true },
    { key: 'mirrorDoor', label: 'Mirror Door', type: 'toggle', default: false },
    { key: 'softClose', label: 'Soft Close Hinges', type: 'toggle', default: false },
  ],
  kitchen: [
    { key: 'baseCabinets', label: 'Base Cabinets', type: 'counter', max: 10, default: 3 },
    { key: 'wallCabinets', label: 'Wall Cabinets', type: 'counter', max: 8, default: 2 },
    { key: 'drawers', label: 'Drawers', type: 'counter', max: 12, default: 4 },
    { key: 'shelves', label: 'Shelves', type: 'counter', max: 15, default: 6 },
    { key: 'counterTop', label: 'Counter Top', type: 'toggle', default: true },
    { key: 'backsplash', label: 'Backsplash', type: 'toggle', default: false },
  ],
  tv_unit: [
    { key: 'openShelves', label: 'Open Shelves', type: 'counter', max: 8, default: 2 },
    { key: 'closedCabinets', label: 'Closed Cabinets', type: 'counter', max: 6, default: 2 },
    { key: 'drawers', label: 'Drawers', type: 'counter', max: 6, default: 1 },
    { key: 'cableManagement', label: 'Cable Management', type: 'toggle', default: true },
    { key: 'ledStrip', label: 'LED Strip Lighting', type: 'toggle', default: false },
  ],
  study_table: [
    { key: 'drawers', label: 'Drawers', type: 'counter', max: 6, default: 2 },
    { key: 'shelves', label: 'Shelves', type: 'counter', max: 8, default: 2 },
    { key: 'keyboard tray', label: 'Keyboard Tray', type: 'toggle', default: false },
    { key: 'cableManagement', label: 'Cable Management', type: 'toggle', default: true },
  ],
  shoe_rack: [
    { key: 'openShelves', label: 'Open Shelves', type: 'counter', max: 12, default: 4 },
    { key: 'closedCompartments', label: 'Closed Compartments', type: 'counter', max: 8, default: 2 },
    { key: 'sittingBench', label: 'Sitting Bench', type: 'toggle', default: false },
    { key: 'mirrorDoor', label: 'Mirror Door', type: 'toggle', default: false },
  ],
  other: [
    { key: 'shelves', label: 'Shelves', type: 'counter', max: 15, default: 3 },
    { key: 'drawers', label: 'Drawers', type: 'counter', max: 8, default: 1 },
    { key: 'doors', label: 'Doors', type: 'counter', max: 6, default: 2 },
  ],
};

const ComponentsSelection: React.FC<ComponentsSelectionProps> = ({
  furnitureType,
  onComplete,
  initialData = {},
}) => {
  const [components, setComponents] = useState<Record<string, number>>({});

  const availableComponents = componentsByType[furnitureType] || componentsByType.other;

  useEffect(() => {
    // Initialize components with default values or initial data
    const initialComponents: Record<string, number> = {};
    availableComponents.forEach((component) => {
      if (component.key in initialData) {
        initialComponents[component.key] = initialData[component.key];
      } else {
        initialComponents[component.key] = component.type === 'toggle' 
          ? (component.default as boolean ? 1 : 0)
          : (component.default as number || 0);
      }
    });
    setComponents(initialComponents);
  }, [furnitureType, initialData]);

  const updateComponent = (key: string, value: number) => {
    setComponents(prev => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const handleSubmit = () => {
    onComplete(components);
  };

  const hasSelections = Object.values(components).some(value => value > 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Select Components
        </h3>
        <p className="text-muted-foreground">
          Choose the components for your {furnitureType.replace('_', ' ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableComponents.map((component) => (
          <Card key={component.key} className="border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">{component.label}</Label>
                {component.type === 'toggle' ? (
                  <Switch
                    checked={components[component.key] > 0}
                    onCheckedChange={(checked) => 
                      updateComponent(component.key, checked ? 1 : 0)
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => updateComponent(component.key, components[component.key] - 1)}
                      disabled={components[component.key] <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      max={component.max}
                      value={components[component.key] || 0}
                      onChange={(e) => updateComponent(component.key, parseInt(e.target.value) || 0)}
                      className="w-16 h-6 text-center text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => updateComponent(component.key, components[component.key] + 1)}
                      disabled={components[component.key] >= component.max!}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              {component.type === 'counter' && (
                <p className="text-xs text-muted-foreground">
                  Max: {component.max}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {hasSelections && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-2">Selected Components</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(components)
                .filter(([, value]) => value > 0)
                .map(([key, value]) => {
                  const component = availableComponents.find(c => c.key === key);
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{component?.label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!hasSelections}
          className="btn-primary"
        >
          Continue to Materials
        </Button>
      </div>
    </div>
  );
};

export default ComponentsSelection;