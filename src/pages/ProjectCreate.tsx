import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreateProjectModal from '@/components/projects/CreateProjectModal';

const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/projects');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Project</h1>
          <p className="text-muted-foreground">
            Start a new interior design project
          </p>
        </div>
      </div>

      <CreateProjectModal
        isOpen={true}
        onClose={() => navigate('/projects')}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProjectCreate;