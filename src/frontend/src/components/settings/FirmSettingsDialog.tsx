import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useFirmSettings } from "../../hooks/useFirmSettings";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function FirmSettingsDialog({ open, onClose }: Props) {
  const { settings, updateSettings } = useFirmSettings();
  const [firmName, setFirmName] = useState(settings.firmName);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    settings.logoDataUrl,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateSettings({
      firmName: firmName.trim() || "CSWA Group of Companies",
      logoDataUrl: logoPreview,
    });
    onClose();
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Firm Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Firm Name */}
          <div className="space-y-1.5">
            <Label htmlFor="firm-name">Firm Name</Label>
            <Input
              id="firm-name"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              placeholder="Enter firm name"
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <Label>Firm Logo</Label>
            <div className="flex items-start gap-4">
              <div className="h-16 w-40 rounded-lg border border-border bg-muted/30 flex items-center justify-center overflow-hidden shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <img
                    src="/assets/uploads/WhatsApp-Image-2026-01-25-at-8.23.55-AM-3-1.jpeg"
                    alt="Default logo"
                    className="h-full w-full object-contain p-1 opacity-60"
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Logo
                </Button>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveLogo}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, or SVG recommended.
                  <br />
                  Max display height: 36px.
                </p>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
