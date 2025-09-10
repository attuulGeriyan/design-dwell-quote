import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Download, Trash2 } from 'lucide-react';
import { projectsApi } from '@/services/api';
import { Project, FurnitureItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FurnitureWorkflow from '@/components/furniture/FurnitureWorkflow';
import QuotationSummary from '@/components/furniture/QuotationSummary';
import toast from 'react-hot-toast';

const QuotationBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [activeTab, setActiveTab] = useState('furniture');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    try {
      const response = await projectsApi.getProject(projectId);
      if (response.success && response.data) {
        setProject(response.data);
      }
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFurniture = (furniture: FurnitureItem) => {
    setFurnitureItems(prev => [...prev, { ...furniture, id: Date.now().toString() }]);
    toast.success('Furniture item added to quotation');
  };

  const handleRemoveFurniture = (index: number) => {
    setFurnitureItems(prev => prev.filter((_, i) => i !== index));
    toast.success('Furniture item removed');
  };

  const handleSaveQuotation = async () => {
    if (!project || furnitureItems.length === 0) {
      toast.error('Please add at least one furniture item');
      return;
    }

    try {
      const response = await projectsApi.addFurniture(project.id, furnitureItems);
      if (response.success) {
        toast.success('Quotation saved successfully!');
        setActiveTab('summary');
      }
    } catch (error) {
      toast.error('Failed to save quotation');
    }
  };

  const handleGeneratePDF = async () => {
    if (!project) return;
    
    try {
      const pdfBlob = await projectsApi.generatePDF(project.id);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${project.title.replace(/\s+/g, '_')}_Quotation.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const calculateTotal = () => {
    return furnitureItems.reduce((sum, item) => sum + item.costs.total, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateTotal();
    return subtotal * 0.18; // 18% GST
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground mb-2">Project not found</h2>
        <Button onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quotation Builder</h1>
            <p className="text-muted-foreground">
              {project.title} - {project.client.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveQuotation}
            disabled={furnitureItems.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button 
            onClick={handleGeneratePDF}
            className="btn-primary"
            disabled={furnitureItems.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="text-2xl font-bold text-foreground">{furnitureItems.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{calculateTotal().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Tax (18%)</p>
              <p className="text-2xl font-bold text-foreground">
                ₹{calculateTax().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">
                ₹{calculateGrandTotal().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="furniture">Add Furniture</TabsTrigger>
          <TabsTrigger value="summary">Quotation Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="furniture" className="space-y-6">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>Add Furniture Item</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FurnitureWorkflow onAddFurniture={handleAddFurniture} />
            </CardContent>
          </Card>

          {/* Added Items Preview */}
          {furnitureItems.length > 0 && (
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>Added Items ({furnitureItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {furnitureItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div>
                        <h4 className="font-medium text-foreground capitalize">
                          {item.type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.dimensions.x}" × {item.dimensions.y}" × {item.dimensions.z}"
                        </p>
                        <p className="text-sm font-medium text-primary">
                          ₹{item.costs.total.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFurniture(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="summary">
          <QuotationSummary
            project={project}
            furnitureItems={furnitureItems}
            onGeneratePDF={handleGeneratePDF}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuotationBuilder;