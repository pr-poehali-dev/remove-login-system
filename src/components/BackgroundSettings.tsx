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
    description: "Глубокий тёмный фон",
  },
  {
    name: "Синий океан",
    value: "linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)",
    description: "Холодный и чистый",
  },
  {
    name: "Закат",
    value: "linear-gradient(135deg, #FA8BFF 0%, #2BD2FF 90%, #2BFF88 100%)",
    description: "Мягкий закат",
  },
  {
    name: "Лес",
    value: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)",
    description: "Природный стиль",
  },
  {
    name: "Огненный",
    value: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
    description: "Тёплый и динамичный",
  },
  {
    name: "Ночное небо",
    value: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
    description: "Глубокое небо",
  },
];

// ✅ Фон теперь задаётся через CSS-переменную, чтобы не мешал Tailwind
const setBackground = (background: string) => {
  const root = document.documentElement;
  root.style.setProperty("--app-background", background);

  if (background.includes("url(")) {
    root.style.setProperty("--app-background-size", "cover");
    root.style.setProperty("--app-background-position", "center");
    root.style.setProperty("--app-background-attachment", "fixed");
  } else {
    root.style.setProperty("--app-background-size", "auto");
    root.style.setProperty("--app-background-position", "center");
    root.style.setProperty("--app-background-attachment", "fixed");
  }
  console.log("✅ Фон применён:", background);
};

// Сброс фона
const resetBackground = () => {
  const root = document.documentElement;
  root.style.removeProperty("--app-background");
  root.style.removeProperty("--app-background-size");
  root.style.removeProperty("--app-background-position");
  root.style.removeProperty("--app-background-attachment");
  console.log("Фон сброшен");
};

export default function BackgroundSettings({
  open,
  onOpenChange,
}: BackgroundSettingsProps) {
  const [customGradient, setCustomGradient] = useState(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ✅ Автоматическое применение при загрузке сайта
  useEffect(() => {
    const savedBackground = localStorage.getItem("app_background");
    const savedImage = localStorage.getItem("app_background_image");
    if (savedBackground) setBackground(savedBackground);
    else if (savedImage) setBackground(`url(${savedImage}) center/cover fixed`);
  }, []);

  const applyPreset = (bg: string) => {
    localStorage.setItem("app_background", bg);
    localStorage.removeItem("app_background_image");
    setBackground(bg);
  };

  const applyCustom = () => {
    if (customGradient.trim()) {
      localStorage.setItem("app_background", customGradient);
      localStorage.removeItem("app_background_image");
      setBackground(customGradient);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      localStorage.setItem("app_background_image", url);
      localStorage.removeItem("app_background");
      setBackground(`url(${url}) center/cover fixed`);
    };
    reader.readAsDataURL(file);
  };

  const resetAll = () => {
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
            Выберите готовый фон, создайте свой или загрузите изображение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Пресеты */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Готовые фоны</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_BACKGROUNDS.map((bg, i) => (
                <Card
                  key={i}
                  className="cursor-pointer border-2 hover:border-blue-500 transition"
                  onClick={() => applyPreset(bg.value)}
                >
                  <CardContent className="p-3">
                    <div
                      className="w-full h-20 rounded-md mb-2"
                      style={{ background: bg.value }}
                    />
                    <div>
                      <p className="font-medium">{bg.name}</p>
                      <p className="text-sm text-gray-600">{bg.description}</p>
                    </div>
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
                placeholder="linear-gradient(135deg, #color1, #color2)"
              />
              <Button onClick={applyCustom}>Применить</Button>
            </div>
            <div
              className="w-full h-20 rounded-md border mt-3"
              style={{ background: customGradient }}
            />
          </div>

          {/* Загрузка изображения */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Загрузить изображение
            </h3>
            <Input type="file" accept="image/*" onChange={handleFile} />
            {selectedFile && (
              <p className="text-sm text-green-600 mt-1">
                Выбран файл: {selectedFile.name}
              </p>
            )}
            <Button
              variant="outline"
              onClick={resetAll}
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
