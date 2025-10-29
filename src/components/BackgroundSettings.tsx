import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface BackgroundSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  { name: 'Темный градиент', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Синий океан', value: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)' },
  { name: 'Закат', value: 'linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)' },
  { name: 'Огненный', value: 'linear-gradient(135deg, #FF512F 0%, #F09819 100%)' },
  { name: 'Лес', value: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)' },
  { name: 'Ночное небо', value: 'linear-gradient(135deg, #000428 0%, #004e92 100%)' },
];

export default function BackgroundSettings({ open, onOpenChange }: BackgroundSettingsProps) {
  const [customBackground, setCustomBackground] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('custom_background');
    if (saved) {
      setCustomBackground(saved);
    }
    const savedImage = localStorage.getItem('background_image');
    if (savedImage) {
      setUploadedImage(savedImage);
    }
  }, [open]);

  const applyPreset = (value: string) => {
    localStorage.setItem('custom_background', value);
    localStorage.removeItem('background_image');
    document.body.style.background = value;
    setCustomBackground(value);
    setUploadedImage(null);
  };

  const applyCustom = () => {
    if (customBackground) {
      localStorage.setItem('custom_background', customBackground);
      localStorage.removeItem('background_image');
      document.body.style.background = customBackground;
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        localStorage.setItem('background_image', result);
        localStorage.removeItem('custom_background');
        document.body.style.background = `url(${result}) center/cover fixed`;
        setUploadedImage(result);
        setCustomBackground('');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    localStorage.removeItem('custom_background');
    localStorage.removeItem('background_image');
    document.body.style.background = '';
    setCustomBackground('');
    setUploadedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Palette" size={24} />
            Настройки фона
          </DialogTitle>
          <DialogDescription>
            Выберите готовый фон, создайте свой градиент или загрузите изображение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">Готовые темы</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_BACKGROUNDS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.value)}
                  className="h-20 rounded-lg border-2 border-border hover:border-primary transition-colors relative overflow-hidden group"
                  style={{ background: preset.value }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Свой градиент (CSS)</h3>
            <div className="flex gap-2">
              <Input
                placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
              />
              <Button onClick={applyCustom}>
                <Icon name="Check" size={16} />
                Применить
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Примеры: linear-gradient(...), radial-gradient(...), #FF5733
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Загрузить изображение</h3>
            <div className="flex gap-2 items-center">
              <Label
                htmlFor="bg-upload"
                className="flex-1 flex items-center justify-center gap-2 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                {uploadedImage ? (
                  <div className="relative w-full h-full">
                    <img src={uploadedImage} alt="Background" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm">Изображение загружено</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Icon name="Upload" size={20} />
                    <span className="text-sm">Выбрать файл</span>
                  </>
                )}
              </Label>
              <Input
                id="bg-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={resetBackground} className="flex-1">
              <Icon name="RotateCcw" size={16} />
              Сбросить
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              <Icon name="Check" size={16} />
              Готово
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
