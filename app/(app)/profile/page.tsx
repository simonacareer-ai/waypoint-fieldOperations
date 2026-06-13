"use client";

import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Building2,
  Tablet,
  LogOut,
  Shield,
  Clock,
  HardDrive,
  Wifi,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-[800px]">
      <PageHeader title="Profile" description="Your account, workspace, and device info." />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">SD</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Simona D.</h2>
              <p className="text-sm text-muted-foreground">Field Technician</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Mail className="h-3 w-3" />
                simona@waypoint.io
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Workspace</p>
              <p className="text-sm font-medium text-foreground">Abu Dhabi Site</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Code</p>
              <p className="text-sm font-medium text-foreground">AD-WF</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Region</p>
              <p className="text-sm font-medium text-foreground">UAE</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Technician
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Tablet className="h-5 w-5 text-muted-foreground" />
            Device Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50">
              <Wifi className="h-5 w-5 text-success-700" />
              <div>
                <p className="text-sm font-medium text-success-700">Online</p>
                <p className="text-xs text-success-700/70">Connected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50">
              <HardDrive className="h-5 w-5 text-success-700" />
              <div>
                <p className="text-sm font-medium text-success-700">Storage OK</p>
                <p className="text-xs text-success-700/70">2.1 GB free</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-info-50">
              <Clock className="h-5 w-5 text-info-700" />
              <div>
                <p className="text-sm font-medium text-info-700">Last sync</p>
                <p className="text-xs text-info-700/70">5 min ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button
        variant="outline"
        className="w-full h-14 text-critical-500 border-critical-500/30 hover:bg-critical-50 hover:text-critical-700 font-semibold"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
