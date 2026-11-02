export interface ButtonOptions {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = options.text;
  
  // Estilos base inline o vía clases
  button.style.padding = '10px 16px';
  button.style.borderRadius = '6px';
  button.style.fontWeight = '500';
  
  if (options.variant === 'secondary') {
    button.style.backgroundColor = '#64748b';
    button.style.color = '#ffffff';
  } else {
    button.style.backgroundColor = '#2563eb';
    button.style.color = '#ffffff';
  }

  button.addEventListener('click', options.onClick);
  return button;
}