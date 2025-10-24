import React from 'react';
import { ToolboxItem } from './ToolboxItem';

export function Toolbox() {
  return (
    <div className="w-[200px] flex-shrink-0 border-r border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-2 text-lg font-semibold">Toolbox</h3>
      <ToolboxItem type="text" width={150} height={30} />
      {/* <ToolboxItem type="signature" width={150} height={50} /> */}
      <ToolboxItem type="checkbox" width={25} height={25} />
      <ToolboxItem type="textarea" width={200} height={80} />
    </div>
  );
}
