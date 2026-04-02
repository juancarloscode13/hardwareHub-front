import type React from 'react';

interface PlaceholderPageProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}

export default function PlaceholderPage({
  icon: Icon,
  title,
  description = 'En construcción — próximamente aquí estará todo.',
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[1rem] min-h-[calc(100vh-68px)]">
      <div className="inline-flex items-center justify-center w-[56px] h-[56px] rounded-[14px] border border-hw-icon-border bg-hw-icon-bg transition-colors duration-300">
        <Icon className="w-[28px] h-[28px] text-hw-accent" />
      </div>
      <h1 className="font-heading text-[1.5rem] font-bold tracking-[-0.02em] text-hw-title transition-colors duration-300">
        {title}
      </h1>
      <p className="text-[0.9375rem] text-hw-subtitle transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}

