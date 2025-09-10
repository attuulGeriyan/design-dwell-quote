import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Loader2 } from 'lucide-react';
import { projectsApi } from '@/services/api';
import { ProjectFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProjectFormData>();

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const response = await projectsApi.createProject(data);
      if (response.success) {
        toast.success('Project created successfully!');
        reset();
        setStep(1);
        onClose();
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleClose = () => {
    reset();
    setStep(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Create New Project
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'step-active' : 'step-inactive'
              }`}>
                1
              </div>
              <span className="text-sm text-muted-foreground">Client Details</span>
            </div>
            <div className="flex-1 h-px bg-border mx-4"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'step-active' : 'step-inactive'
              }`}>
                2
              </div>
              <span className="text-sm text-muted-foreground">Project Info</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client's full name"
                  {...register('client.name', { required: 'Client name is required' })}
                  className={errors.client?.name ? 'border-destructive' : ''}
                />
                {errors.client?.name && (
                  <p className="text-sm text-destructive">{errors.client.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email Address</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="client@example.com"
                  {...register('client.email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={errors.client?.email ? 'border-destructive' : ''}
                />
                {errors.client?.email && (
                  <p className="text-sm text-destructive">{errors.client.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Phone Number</Label>
                <Input
                  id="clientPhone"
                  placeholder="+91 98765 43210"
                  {...register('client.phone', { required: 'Phone number is required' })}
                  className={errors.client?.phone ? 'border-destructive' : ''}
                />
                {errors.client?.phone && (
                  <p className="text-sm text-destructive">{errors.client.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Address</Label>
                <Textarea
                  id="clientAddress"
                  placeholder="Enter complete address"
                  rows={3}
                  {...register('client.address', { required: 'Address is required' })}
                  className={errors.client?.address ? 'border-destructive' : ''}
                />
                {errors.client?.address && (
                  <p className="text-sm text-destructive">{errors.client.address.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)} className="btn-primary">
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Project Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Living Room Interior Design"
                  {...register('title', { required: 'Project title is required' })}
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the project requirements and scope"
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className={errors.description ? 'border-destructive' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Previous
                </Button>
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;