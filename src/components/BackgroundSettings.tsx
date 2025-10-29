import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

interface BackgroundSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRESET_BACKGROUNDS = [
  {
    name: "Темный градиент",
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
  {
    name: "Огненный",
    value: "linear-gradient(135deg, #FF512F 0%, #F09819 100%)",
  },
  { name: "Лес", value: "linear-gradient(135deg, #134E5E 0%, #71B280 100%)" },
  {
    name: "Ночное небо",
    value: "linear-gradient(135deg, #000428 0%, #004e92 100%)",
  },
];

// Функция для применения фона к правильному элементу
const applyBackgroundToCorrectElement = (background: string) => {
  // Попробуем разные возможные контейнеры для фона
  const possibleContainers = [
    "body",
    "main",
    ".app",
    "#root",
    "#__next",
    ".layout",
    ".main-container",
  ];

  let applied = false;

  possibleContainers.forEach((selector) => {
    try {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).style.background = background;
        applied = true;
        console.log(`Фон применен к элементу: ${selector}`);
      }
    } catch (error) {
      console.warn(`Не удалось применить фон к ${selector}:`, error);
    }
  });

  // Если не нашли подходящий контейнер, применяем к body
  if (!applied) {
    document.body.style.background = background;
    console.log("Фон применен к body");
  }
};

// Функция для сброса фона
const resetBackgroundFromElements = () => {
  const possibleContainers = [
    "body",
    "main",
    ".app",
    "#root",
    "#__next",
    ".layout",
    ".main-container",
  ];

  possibleContainers.forEach((selector) => {
    try {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).style.background = "";
      }
    } catch (error) {
      console.warn(`Не удалось сбросить фон с ${selector}:`, error);
    }
  });
};

export default function BackgroundSettings({
  open,
  onOpenChange,
}: BackgroundSettingsProps) {
  const [customBackground, setCustomBackground] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("custom_background");
    if (saved) {
      setCustomBackground(saved);
      applyBackgroundToCorrectElement(saved);
    }

    const savedImage = localStorage.getItem("background_image");
    if (savedImage) {
      setUploadedImage(savedImage);
      applyBackgroundToCorrectElement(`url(${savedImage}) center/cover fixed`);
    }
  }, [open]);

  const applyPreset = (value: string) => {
    localStorage.setItem("custom_background", value);
    localStorage.removeItem("background_image");
    applyBackgroundToCorrectElement(value);
    setCustomBackground(value);
    setUploadedImage(null);
  };

  const applyCustom = () => {
    if (customBackground.trim()) {
      localStorage.setItem("custom_background", customBackground);
      localStorage.removeItem("background_image");
      applyBackgroundToCorrectElement(customBackground);
      setUploadedImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          localStorage.setItem("background_image", result);
          localStorage.removeItem("custom_background");
          applyBackgroundToCorrectElement(`url(${result}) center/cover fixed`);
          setUploadedImage(result);
          setCustomBackground("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetBackground = () => {
    localStorage.removeItem("custom_background");
    localStorage.removeItem("background_image");
    resetBackgroundFromElements();
    setCustomBackground("");
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
            Выберите готовый фон, создайте свой градиент или загрузите
            изображение
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Готовые фоны */}
          <div>
            <Label className="text-base font-semibold">Готовые фоны</Label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {PRESET_BACKGROUNDS.map((bg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 relative overflow-hidden"
                  onClick={() => applyPreset(bg.value)}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: bg.value }}
                  />
                  <span className="relative z-10 text-white font-medium drop-shadow-md">
                    {bg.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Пользовательский градиент */}
          <div>
            <Label
              htmlFor="custom-gradient"
              className="text-base font-semibold"
            >
              Свой градиент
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="custom-gradient"
                placeholder="linear-gradient(135deg, #color1 0%, #color2 100%)"
                value={customBackground}
                onChange={(e) => setCustomBackground(e.target.value)}
                className="flex-1"
              />
              <Button onClick={applyCustom}>Применить</Button>
            </div>
          </div>

          {/* Загрузка изображения */}
          <div>
            <Label className="text-base font-semibold">
              Загрузить изображение
            </Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-2"
              />
            </div>
          </div>

          {/* Сброс */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={resetBackground}>
              Сбросить фон
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
