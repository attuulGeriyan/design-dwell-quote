import React, { useState, useEffect } from 'react';
import { Settings, Plus, Minus } from 'lucide-react';
import { FurnitureItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HardwareSelectionProps {
  furnitureType: FurnitureItem['type'];
  onComplete: (hardware: Record<string, number>) => void;
  initialData?: Record<string, number>;
}

const hardwareByType = {
  wardrobe: [
    { key: 'hinges', label: 'Hinges', price: 150, unit: 'pair', max: 12 },
    { key: 'handles', label: 'Door Handles', price: 200, unit: 'piece', max: 8 },
    { key: 'drawer_slides', label: 'Drawer Slides', price: 300, unit: 'pair', max: 10 },
    { key: 'soft_close_hinges', label: 'Soft Close Hinges', price: 450, unit: 'pair', max: 8 },
    { key: 'mirror_fittings', label: 'Mirror Fittings', price: 250, unit: 'set', max: 4 },
    { key: 'hanging_rod', label: 'Hanging Rod', price: 180, unit: 'piece', max: 3 },
    { key: 'shelf_pins', label: 'Shelf Pins', price: 50, unit: 'set', max: 10 },
  ],
  kitchen: [
    { key: 'hinges', label: 'Cabinet Hinges', price: 180, unit: 'pair', max: 16 },
    { key: 'handles', label: 'Cabinet Handles', price: 220, unit: 'piece', max: 12 },
    { key: 'drawer_slides', label: 'Drawer Slides', price: 350, unit: 'pair', max: 15 },
    { key: 'basket_slides', label: 'Basket Slides', price: 800, unit: 'pair', max: 6 },
    { key: 'soft_close_hinges', label: 'Soft Close Hinges', price: 500, unit: 'pair', max: 12 },
    { key: 'cabinet_locks', label: 'Cabinet Locks', price: 300, unit: 'piece', max: 8 },
    { key: 'shelf_brackets', label: 'Shelf Brackets', price: 120, unit: 'pair', max: 12 },
  ],
  tv_unit: [
    { key: 'hinges', label: 'Cabinet Hinges', price: 150, unit: 'pair', max: 8 },
    { key: 'handles', label: 'Cabinet Handles', price: 200, unit: 'piece', max: 6 },
    { key: 'drawer_slides', label: 'Drawer Slides', price: 300, unit: 'pair', max: 6 },
    { key: 'cable_grommets', label: 'Cable Grommets', price: 100, unit: 'piece', max: 8 },
    { key: 'glass_hinges', label: 'Glass Door Hinges', price: 400, unit: 'pair', max: 4 },
    { key: 'led_strips', label: 'LED Strip Lights', price: 600, unit: 'meter', max: 5 },
  ],
  study_table: [
    { key: 'drawer_slides', label: 'Drawer Slides', price: 250, unit: 'pair', max: 6 },
    { key: 'handles', label: 'Drawer Handles', price: 180, unit: 'piece', max: 6 },
    { key: 'keyboard_tray_slide', label: 'Keyboard Tray Slide', price: 800, unit: 'piece', max: 1 },
    { key: 'cable_grommets', label: 'Cable Grommets', price: 100, unit: 'piece', max: 4 },
    { key: 'table_legs', label: 'Table Legs', price: 400, unit: 'piece', max: 6 },
  ],
  shoe_rack: [
    { key: 'hinges', label: 'Door Hinges', price: 120, unit: 'pair', max: 6 },
    { key: 'handles', label: 'Door Handles', price: 150, unit: 'piece', max: 4 },
    { key: 'shelf_pins', label: 'Adjustable Shelf Pins', price: 40, unit: 'set', max: 8 },
    { key: 'mesh_baskets', label: 'Wire Mesh Baskets', price: 300, unit: 'piece', max: 6 },
    { key: 'mirror_fittings', label: 'Mirror Fittings', price: 200, unit: 'set', max: 2 },
  ],
  other: [
    { key: 'hinges', label: 'Hinges', price: 150, unit: 'pair', max: 8 },
    { key: 'handles', label: 'Handles', price: 180, unit: 'piece', max: 8 },
    { key: 'drawer_slides', label: 'Drawer Slides', price: 300, unit: 'pair', max: 6 },
    { key: 'shelf_pins', label: 'Shelf Pins', price: 50, unit: 'set', max: 6 },
  ],
};

const HardwareSelection: React.FC<HardwareSelectionProps> = ({
  furnitureType,
  onComplete,
  initialData = {},
}) => {
  const [hardware, setHardware] = useState<Record<string, number>>({});

  const availableHardware = hardwareByType[furnitureType] || hardwareByType.other;

  useEffect(() => {
    // Initialize hardware with initial data or zeros
    const initialHardware: Record<string, number> = {};
    availableHardware.forEach((item) => {
      initialHardware[item.key] = initialData[item.key] || 0;
    });
    setHardware(initialHardware);
  }, [furnitureType, initialData]);

  const updateHardware = (key: string, value: number) => {
    const item = availableHardware.find(h => h.key === key);
    const maxValue = item?.max || 99;
    setHardware(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(value, maxValue)),
    }));
  };

  const handleSubmit = () => {
    onComplete(hardware);
  };

  const calculateTotalCost = () => {
    return Object.entries(hardware).reduce((total, [key, quantity]) => {
      const item = availableHardware.find(h => h.key === key);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const hasSelections = Object.values(hardware).some(value => value > 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Select Hardware
        </h3>
        <p className="text-muted-foreground">
          Choose the hardware components for your {furnitureType.replace('_', ' ')}
        </p>
      </div>

      <div className="space-y-4">
        {availableHardware.map((item) => (
          <Card key={item.key} className="border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Label className="font-medium">{item.label}</Label>
                    <Badge variant="outline" className="text-xs">
                      ₹{item.price}/{item.unit}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Max: {item.max} {item.unit}s
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateHardware(item.key, hardware[item.key] - 1)}
                    disabled={hardware[item.key] <= 0}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="0"
                    max={item.max}
                    value={hardware[item.key] || 0}
                    onChange={(e) => updateHardware(item.key, parseInt(e.target.value) || 0)}
                    className="w-20 h-8 text-center text-sm"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => updateHardware(item.key, hardware[item.key] + 1)}
                    disabled={hardware[item.key] >= item.max}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {hardware[item.key] > 0 && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-sm text-right">
                    <span className="text-muted-foreground">Cost: </span>
                    <span className="font-medium text-primary">
                      ₹{(item.price * hardware[item.key]).toLocaleString()}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Summary */}
      {hasSelections && (
        <Card className="border border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-3">Hardware Summary</h4>
            <div className="space-y-2 text-sm">
              {Object.entries(hardware)
                .filter(([, quantity]) => quantity > 0)
                .map(([key, quantity]) => {
                  const item = availableHardware.find(h => h.key === key);
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {item?.label} ({quantity} {item?.unit}s):
                      </span>
                      <span className="font-medium">
                        ₹{item ? (item.price * quantity).toLocaleString() : 0}
                      </span>
                    </div>
                  );
                })}
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-medium text-primary">
                  <span>Total Hardware Cost:</span>
                  <span>₹{calculateTotalCost().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          className="btn-primary"
        >
          Complete Selection
        </Button>
      </div>
    </div>
  );
};

export default HardwareSelection;