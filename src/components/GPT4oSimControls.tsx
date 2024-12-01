import React from 'react';
import { useGPT4oSimStore } from '../lib/store/gpt4oSimStore';

export function GPT4oSimControls() {
  const { modifyTrait, isModifying, error, validationResults, snapshot } = useGPT4oSimStore();
  const [traitName, setTraitName] = React.useState('');
  const [traitValue, setTraitValue] = React.useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await modifyTrait(traitName, traitValue);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Character Trait Modification</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trait Name
            </label>
            <input
              type="text"
              value={traitName}
              onChange={(e) => setTraitName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              disabled={isModifying}
              placeholder="e.g., KindnessTrait"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trait Value (-1 to 1)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="-1"
                max="1"
                step="0.1"
                value={traitValue}
                onChange={(e) => setTraitValue(parseFloat(e.target.value))}
                className="flex-1"
                disabled={isModifying}
              />
              <span className="text-sm text-gray-500 w-12 text-right">
                {traitValue.toFixed(1)}
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isModifying}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isModifying ? 'Modifying...' : 'Modify Trait'}
          </button>
        </form>
      </div>

      {validationResults.length > 0 && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Validation Results</h3>
          <div className="space-y-2">
            {validationResults.map((result, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.success ? '✓ Validation passed' : '✗ Validation failed'}
                </div>
                {result.errors.length > 0 && (
                  <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                    {result.errors.map((error, j) => (
                      <li key={j}>{error}</li>
                    ))}
                  </ul>
                )}
                {result.warnings.length > 0 && (
                  <ul className="mt-1 text-sm text-yellow-600 list-disc list-inside">
                    {result.warnings.map((warning, j) => (
                      <li key={j}>{warning}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {snapshot && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Current State</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Modified Traits</h4>
              <div className="mt-1 text-sm">
                {snapshot.metadata.modifiedTraits.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {snapshot.metadata.modifiedTraits.map(trait => (
                      <li key={trait}>{trait}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No traits modified</p>
                )}
              </div>
            </div>

            {snapshot.metadata.validationErrors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700">Validation Errors</h4>
                <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
                  {snapshot.metadata.validationErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}