import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { FurnitureItem, StepData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DimensionsForm from './DimensionsForm';
import ComponentsSelection from './ComponentsSelection';
import MaterialsSelection from './MaterialsSelection';
import HardwareSelection from './HardwareSelection';

interface FurnitureWorkflowProps {
  onAddFurniture: (furniture: FurnitureItem) => void;
}

const steps = [
  { id: 1, title: 'Dimensions', description: 'Enter furniture dimensions' },
  { id: 2, title: 'Components', description: 'Select components' },
  { id: 3, title: 'Materials', description: 'Choose materials' },
  { id: 4, title: 'Hardware', description: 'Select hardware' },
];

const FurnitureWorkflow: React.FC<FurnitureWorkflowProps> = ({ onAddFurniture }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [furnitureType, setFurnitureType] = useState<FurnitureItem['type']>('wardrobe');
  const [stepData, setStepData] = useState<StepData>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const handleStepComplete = (data: Partial<StepData>) => {
    setStepData(prev => ({ ...prev, ...data }));
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddToQuotation = async () => {
    if (!stepData.dimensions || !stepData.materials) return;

    setIsCalculating(true);
    
    // Simulate calculation - in real app, this would call the backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    const furnitureItem: FurnitureItem = {
      type: furnitureType,
      dimensions: stepData.dimensions,
      components: stepData.components || {},
      materials: stepData.materials,
      hardware: stepData.hardware || {},
      costs: {
        materialCost: 15000,
        hardwareCost: 5000,
        laborCost: 8000,
        total: 28000,
      },
    };

    onAddFurniture(furnitureItem);
    
    // Reset workflow
    setCurrentStep(1);
    setStepData({});
    setIsCalculating(false);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return !!stepData.dimensions;
      case 2: return !!stepData.components;
      case 3: return !!stepData.materials;
      case 4: return !!stepData.hardware;
      default: return false;
    }
  };

  const canProceed = () => {
    return isStepComplete(currentStep);
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${currentStep === step.id 
                  ? 'step-active' 
                  : isStepComplete(step.id)
                  ? 'step-completed'
                  : 'step-inactive'
                }
              `}>
                {isStepComplete(step.id) ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 transition-colors ${
                isStepComplete(step.id) ? 'bg-success' : 'bg-border'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="card-professional">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <DimensionsForm
              furnitureType={furnitureType}
              onFurnitureTypeChange={setFurnitureType}
              onComplete={(data) => handleStepComplete({ dimensions: data })}
              initialData={stepData.dimensions}
            />
          )}

          {currentStep === 2 && (
            <ComponentsSelection
              furnitureType={furnitureType}
              onComplete={(data) => handleStepComplete({ components: data })}
              initialData={stepData.components}
            />
          )}

          {currentStep === 3 && (
            <MaterialsSelection
              furnitureType={furnitureType}
              onComplete={(data) => handleStepComplete({ materials: data })}
              initialData={stepData.materials}
            />
          )}

          {currentStep === 4 && (
            <HardwareSelection
              furnitureType={furnitureType}
              onComplete={(data) => handleStepComplete({ hardware: data })}
              initialData={stepData.hardware}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleAddToQuotation}
            disabled={!canProceed() || isCalculating}
            className="btn-primary"
          >
            {isCalculating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Calculating...
              </>
            ) : (
              <>
                Add to Quotation
                <Check className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!canProceed()}
            className="btn-primary"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FurnitureWorkflow;