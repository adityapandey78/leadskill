'use client';

import { useState } from 'react';
import { BuyersImportForm } from './BuyersImportForm';

export function BuyersImportSection() {
  const [result, setResult] = useState<any>(null);
  return (
    <div className="mb-4">
      <BuyersImportForm onImport={setResult} />
      {result && (
        <div className="mt-2">
          <div className="text-sm text-green-400 mb-1">Imported: {result.imported} / {result.total}</div>
          {result.errors?.length > 0 && (
            <table className="text-xs bg-neutral-900 border border-neutral-800 rounded w-full">
              <thead><tr><th className="px-2 py-1">Row</th><th className="px-2 py-1">Errors</th></tr></thead>
              <tbody>
                {result.errors.map((e: any, i: number) => (
                  <tr key={i} className="border-t border-neutral-800">
                    <td className="px-2 py-1">{e.row}</td>
                    <td className="px-2 py-1 text-red-400">{e.errors?.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}