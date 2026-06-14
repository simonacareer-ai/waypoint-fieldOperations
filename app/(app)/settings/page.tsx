"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sun, Moon, Cloud, Bell, Accessibility } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = mounted ? theme : "light";
  const [autoSync, setAutoSync] = useState(true);
  const [syncOnWifi, setSyncOnWifi] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [syncNotif, setSyncNotif] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage theme, sync preferences, and notifications."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-muted-foreground" />
            )}
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all text-center min-h-[80px] ${
                resolvedTheme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <Sun className="h-6 w-6 mx-auto mb-2 text-foreground" />
              <p className="font-medium text-sm text-foreground">Light</p>
              <p className="text-xs text-muted-foreground">Default</p>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all text-center min-h-[80px] ${
                resolvedTheme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <Moon className="h-6 w-6 mx-auto mb-2 text-foreground" />
              <p className="font-medium text-sm text-foreground">Dark</p>
              <p className="text-xs text-muted-foreground">Low-light field conditions</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Cloud className="h-5 w-5 text-muted-foreground" />
            Sync Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
            <div>
              <Label className="text-sm font-medium">Auto-sync</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically sync when connection is available
              </p>
            </div>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <Label className="text-sm font-medium">Wi-Fi only</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Only sync on Wi-Fi connections
              </p>
            </div>
            <Switch checked={syncOnWifi} onCheckedChange={setSyncOnWifi} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between py-4 border-b border-border/50">
            <div>
              <Label className="text-sm font-medium">Push notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Receive push notifications on this device
              </p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border/50">
            <div>
              <Label className="text-sm font-medium">Critical alerts</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Always notify for critical asset status
              </p>
            </div>
            <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <Label className="text-sm font-medium">Sync notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Notify on sync success or failure
              </p>
            </div>
            <Switch checked={syncNotif} onCheckedChange={setSyncNotif} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Accessibility className="h-5 w-5 text-muted-foreground" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div>
              <Label className="text-sm font-medium">Reduced motion</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Minimize animations throughout the app
              </p>
            </div>
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
