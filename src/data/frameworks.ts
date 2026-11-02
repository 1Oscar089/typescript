export interface FrameworkOption {
    id: string;
    name: string;
    description: string;
    cdn?: string;
  }
  
  export const webFrameworks: FrameworkOption[] = [
    {
      id: 'native',
      name: 'CSS Nativo (Vanilla)',
      description: 'Sin dependencias externas. Usa CSS estándar.'
    },
    {
      id: 'bootstrap',
      name: 'Bootstrap 5',
      description: 'Framework CSS clásico basado en utilidades y componentes.',
      cdn: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      description: 'Framework utility-first.',
      cdn: 'https://cdn.tailwindcss.com'
    }
  ];