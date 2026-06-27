interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-[#171717] dark:text-[#f5f5f5]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[#737373] dark:text-[#a3a3a3]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
