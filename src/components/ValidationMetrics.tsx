import React from 'react';
import { useGPT4oSimStore } from '../lib/store/gpt4oSimStore';

export function ValidationMetrics() {
  const { service } = useGPT4oSimStore();
  const metrics = service?.getValidationMetrics();

  if (!metrics) return null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Validation Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Validations</h3>
            <div className="mt-1">
              <span className="text-3xl font-bold">{metrics.totalValidations}</span>
              <span className="ml-2 text-sm text-gray-500">total</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Success Rate</h3>
            <div className="mt-1">
              <span className="text-3xl font-bold">
                {((metrics.successfulValidations / metrics.totalValidations) * 100).toFixed(1)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">success rate</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Average Time</h3>
            <div className="mt-1">
              <span className="text-3xl font-bold">{metrics.averageValidationTime.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500">ms</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Last Validation</h3>
            <div className="mt-1">
              <span className="text-3xl font-bold">
                {metrics.lastValidationTimestamp
                  ? new Date(metrics.lastValidationTimestamp).toLocaleTimeString()
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {metrics.errorsByType.size > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Common Errors</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2">
              {Array.from(metrics.errorsByType.entries()).map(([error, count]) => (
                <li key={error} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{error}</span>
                  <span className="text-sm font-medium bg-gray-200 px-2 py-1 rounded">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}