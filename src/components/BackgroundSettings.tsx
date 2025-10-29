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

// ✅ Применение фона ко всей странице
const applyBackground = (background: string) => {
  console.log("Применение фона:", background);

  // Гарантируем, что body и html занимают весь экран
  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";
  document.body.style.margin = "0";

  // Убираем стандартные tailwind-классы, мешающие фону
  document.body.classList.remove("bg-background", "bg-white", "bg-gray-100");
  const root = document.getElementById("root");
  if (root) root.classList.remove("bg-background", "bg-white", "bg-gray-100");

  // Применяем фон
  if (background.includes("url(")) {
    document.body.style.background = background;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    document.body.style.background = background;
    document.body.style.backgroundAttachment = "fixed";
  }

  console.log("✅ Фон применён успешно");
};

// ✅ Сброс фона
const resetBackground = () => {
  document.body.style.background = "";
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = "";
  document.body.style.backgroundAttachment = "";

  document.body.classList.add("bg-background");
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
    if (savedBackground) {
      applyBackground(savedBackground);
    } else if (savedImage) {
      applyBackground(`url(${savedImage}) center/cover fixed`);
    }
  }, []);

  // ✅ При открытии окна обновляем предпросмотр
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

  const applyPresetBackground = (background: string, name: string) => {
    console.log("Выбран пресет:", name);
    localStorage.setItem("app_background", background);
    localStorage.removeItem("app_background_image");
    applyBackground(background);
  };

  const applyCustomGradient = () => {
    if (customGradient.trim()) {
      localStorage.setItem("app_background", customGradient);
      localStorage.removeItem("app_background_image");
      applyBackground(customGradient);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (imageUrl) {
          localStorage.setItem("app_background_image", imageUrl);
          localStorage.removeItem("app_background");
          applyBackground(`url(${imageUrl}) center/cover fixed`);
        }
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
          {/* Готовые фоны */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Готовые фоны</h3>
            <div className="grid grid-cols-2 gap-3">
              {PRESET_BACKGROUNDS.map((bg, index) => (
                <Card
                  key={index}
                  className="cursor-pointer border-2 hover:border-blue-500 transition-colors"
                  onClick={() => applyPresetBackground(bg.value, bg.name)}
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

          {/* Свой градиент */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Свой градиент</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={customGradient}
                  onChange={(e) => setCustomGradient(e.target.value)}
                  placeholder="linear-gradient(135deg, #color1 0%, #color2 100%)"
                  className="flex-1"
                />
                <Button onClick={applyCustomGradient}>Применить</Button>
              </div>
              <div
                className="w-full h-20 rounded-md border"
                style={{ background: customGradient }}
              />
            </div>
          </div>

          {/* Загрузка изображения */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Загрузить изображение
            </h3>
            <div className="space-y-3">
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
              {selectedFile && (
                <p className="text-sm text-green-600">
                  Выбран файл: {selectedFile.name}
                </p>
              )}
              <Button
                variant="outline"
                onClick={resetAllBackgrounds}
                className="w-full"
              >
                Сбросить фон
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
