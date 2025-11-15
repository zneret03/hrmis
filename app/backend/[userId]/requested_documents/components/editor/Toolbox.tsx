import React from 'react';
import { FileText } from 'lucide-react';
import { ToolboxItem } from './ToolboxItem';
import { TemplateDB } from '@/lib/types/template';

interface Toolbox {
  templates: TemplateDB[];
  callback: (file: string, name: string) => void;
}

export function Toolbox({ templates, callback }: Toolbox) {
  return (
    <main className="w-[200px] flex-shrink-0 space-y-6 border-r border-gray-200 bg-gray-50 p-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Toolbox</h3>
        <ToolboxItem type="text" width={150} height={30} />
        <ToolboxItem type="checkbox" width={25} height={25} />
        <ToolboxItem type="textarea" width={200} height={80} />
        <ToolboxItem type="signature" width={150} height={50} />
        <ToolboxItem type="image" width={150} height={50} />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">Templates</h3>
        {templates.map((item) => (
          <div key={item.name} onClick={() => callback(item.file, item.name)}>
            <div className="flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-500/20">
              <FileText className="h-5 w-5" />
              <span className="line-clamp-1 w-30 font-semibold text-ellipsis">
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
