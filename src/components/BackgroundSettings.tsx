import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface BackgroundSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  {
    name: "Тёмный градиент",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Синий океан",
    value: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
  },
  {
    name: "Закат",
    value: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)",
  },
  { name: "Лес", value: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)" },
  {
    name: "Огненный",
    value: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
  },
  {
    name: "Ночное небо",
    value: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
  },
];

// === Применение фона ко всей странице ===
function applyBackground(background: string) {
  const html = document.documentElement;
  const body = document.body;

  [html, body].forEach((el) => {
    if (!el) return;

    if (background.includes("url(")) {
      el.style.background = background;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center center";
      el.style.backgroundAttachment = "fixed";
      el.style.backgroundRepeat = "no-repeat";
    } else {
      el.style.background = background;
    }
  });
}

// === Сброс фона ===
function resetBackground() {
  const html = document.documentElement;
  const body = document.body;
  [html, body].forEach((el) => el.removeAttribute("style"));
}

export default function BackgroundSettings({
  open,
  onOpenChange,
}: BackgroundSettingsProps) {
  const [customGradient, setCustomGradient] = useState(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // При открытии диалога — подгружаем сохранённый фон
  useEffect(() => {
    if (open) {
      const savedBackground = localStorage.getItem("app_background");
      const savedImage = localStorage.getItem("app_background_image");

      if (savedBackground) {
        applyBackground(savedBackground);
      } else if (savedImage) {
        applyBackground(`url(${savedImage}) center/cover fixed`);
      }
    }
  }, [open]);

  const applyPresetBackground = (background: string) => {
    localStorage.setItem("app_background", background);
    localStorage.removeItem("app_background_image");
    applyBackground(background);
  };

  const applyCustomGradient = () => {
    localStorage.setItem("app_background", customGradient);
    localStorage.removeItem("app_background_image");
    applyBackground(customGradient);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        localStorage.setItem("app_background_image", imageUrl);
        localStorage.removeItem("app_background");
        applyBackground(`url(${imageUrl}) center/cover fixed`);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAllBackgrounds = () => {
    localStorage.removeItem("app_background");
    localStorage.removeItem("app_background_image");
    resetBackground();
    setSelectedFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Настройки фона
          </DialogTitle>
          <DialogDescription>
            Выберите готовый фон, создайте свой градиент или загрузите
            изображение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Пресеты */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Готовые фоны</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_BACKGROUNDS.map((bg, index) => (
                <Card
                  key={index}
                  className="cursor-pointer border-2 hover:border-blue-500 transition"
                  onClick={() => applyPresetBackground(bg.value)}
                >
                  <CardContent className="p-3">
                    <div
                      className="w-full h-20 rounded-md mb-2"
                      style={{ background: bg.value }}
                    />
                    <p className="font-medium">{bg.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Кастомный градиент */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Свой градиент</h3>
            <div className="flex gap-2">
              <Input
                value={customGradient}
                onChange={(e) => setCustomGradient(e.target.value)}
                placeholder="linear-gradient(135deg, #color1 0%, #color2 100%)"
              />
              <Button onClick={applyCustomGradient}>Применить</Button>
            </div>
            <div
              className="w-full h-20 rounded-md border mt-2"
              style={{ background: customGradient }}
            />
          </div>

          {/* Картинка */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Загрузить изображение
            </h3>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />
            {selectedFile && (
              <p className="text-sm text-green-600 mt-2">
                Выбран файл: {selectedFile.name}
              </p>
            )}
            <Button
              variant="outline"
              onClick={resetAllBackgrounds}
              className="w-full mt-3"
            >
              Сбросить фон
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
