import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SaveLoadManagerProps {
  onUpdate?: () => void;
}

export function SaveLoadManager({ onUpdate }: SaveLoadManagerProps) {
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmLoad, setShowConfirmLoad] = useState(false);
  const [pendingFile, setPendingFile] = useState<string | null>(null);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDownloadSave = () => {
    try {
      // Collect all game data
      const saveData = {
        version: '1.0',
        timestamp: Date.now(),
        data: {
          collection: localStorage.getItem('insect_collection'),
          profile: localStorage.getItem('user_profile'),
          battleHistory: localStorage.getItem('battle_history'),
          boostsData: localStorage.getItem('boosts_data')
        }
      };

      // Convert to JSON
      const jsonString = JSON.stringify(saveData, null, 2);
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `insecatch_save_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showMessage('Save file downloaded successfully!', 'success');
    } catch (error) {
      showMessage('Failed to download save file!', 'error');
      console.error('Download error:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const saveData = JSON.parse(content);

        // Validate save file structure
        if (!saveData.version || !saveData.data) {
          showMessage('Invalid save file format!', 'error');
          return;
        }

        // Store pending file and show confirmation
        setPendingFile(content);
        setShowConfirmLoad(true);
      } catch (error) {
        showMessage('Failed to read save file!', 'error');
        console.error('File read error:', error);
      }
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = '';
  };

  const handleConfirmLoad = () => {
    if (!pendingFile) return;

    try {
      const saveData = JSON.parse(pendingFile);

      // Restore all data
      if (saveData.data.collection) {
        localStorage.setItem('insect_collection', saveData.data.collection);
      }
      if (saveData.data.profile) {
        localStorage.setItem('user_profile', saveData.data.profile);
      }
      if (saveData.data.battleHistory) {
        localStorage.setItem('battle_history', saveData.data.battleHistory);
      }
      if (saveData.data.boostsData) {
        localStorage.setItem('boosts_data', saveData.data.boostsData);
      }

      showMessage('Save file loaded successfully! Refreshing...', 'success');
      setShowConfirmLoad(false);
      setPendingFile(null);
      
      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      showMessage('Failed to load save file!', 'error');
      console.error('Load error:', error);
      setShowConfirmLoad(false);
      setPendingFile(null);
    }
  };

  const handleCancelLoad = () => {
    setShowConfirmLoad(false);
    setPendingFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">💾 Save & Load</h4>
        <p className="text-xs text-blue-800 mb-4">
          Export your progress to a file or load a previous save. Your progress will be saved locally on this device.
        </p>

        <div className="space-y-3">
          {/* Download Save */}
          <Button
            onClick={handleDownloadSave}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Save File
          </Button>

          {/* Upload Save */}
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
              id="save-file-input"
            />
            <label htmlFor="save-file-input">
              <Button
                type="button"
                onClick={() => document.getElementById('save-file-input')?.click()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Load Save File
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl p-4 text-center font-semibold flex items-center justify-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmLoad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-orange-500" />
                <h3 className="text-xl font-bold text-gray-800">Confirm Load Save</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Loading this save file will <strong>replace all your current progress</strong>. 
                This action cannot be undone. Are you sure?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleCancelLoad}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmLoad}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500"
                >
                  Load Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>Important:</strong> Save files are device-specific. Download your save before clearing browser data or switching devices.
        </p>
      </div>
    </div>
  );
}
