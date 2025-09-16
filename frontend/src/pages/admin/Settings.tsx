import { useState } from "react";
import { Save, Key, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function Settings() {
  const [darajaSettings, setDarajaSettings] = useState({
    consumerKey: "",
    consumerSecret: "",
    passkey: "",
    shortcode: "",
    environment: "sandbox" as "sandbox" | "production"
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    paymentNotifications: true,
    monthlyReports: true
  });

  const handleSaveDaraja = () => {
    console.log("Saving Daraja settings:", darajaSettings);
    // This would save to backend/database
  };

  const handleSaveNotifications = () => {
    console.log("Saving notification settings:", notifications);
    // This would save to backend/database
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings and integrations
        </p>
      </div>

      {/* Daraja API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            MPESA Daraja API Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consumer-key">Consumer Key</Label>
              <Input
                id="consumer-key"
                type="password"
                placeholder="Enter consumer key"
                value={darajaSettings.consumerKey}
                onChange={(e) => setDarajaSettings({
                  ...darajaSettings,
                  consumerKey: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumer-secret">Consumer Secret</Label>
              <Input
                id="consumer-secret"
                type="password"
                placeholder="Enter consumer secret"
                value={darajaSettings.consumerSecret}
                onChange={(e) => setDarajaSettings({
                  ...darajaSettings,
                  consumerSecret: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passkey">Passkey</Label>
              <Input
                id="passkey"
                type="password"
                placeholder="Enter passkey"
                value={darajaSettings.passkey}
                onChange={(e) => setDarajaSettings({
                  ...darajaSettings,
                  passkey: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortcode">Business Shortcode</Label>
              <Input
                id="shortcode"
                placeholder="Enter shortcode"
                value={darajaSettings.shortcode}
                onChange={(e) => setDarajaSettings({
                  ...darajaSettings,
                  shortcode: e.target.value
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Environment</Label>
            <div className="flex gap-4">
              <Button
                variant={darajaSettings.environment === "sandbox" ? "default" : "outline"}
                size="sm"
                onClick={() => setDarajaSettings({
                  ...darajaSettings,
                  environment: "sandbox"
                })}
              >
                Sandbox
              </Button>
              <Button
                variant={darajaSettings.environment === "production" ? "default" : "outline"}
                size="sm"
                onClick={() => setDarajaSettings({
                  ...darajaSettings,
                  environment: "production"
                })}
              >
                Production
              </Button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-800">Security Notice</span>
            </div>
            <p className="text-sm text-amber-700">
              API credentials are encrypted and stored securely. Use production credentials only when ready for live payments.
            </p>
          </div>

          <Button onClick={handleSaveDaraja}>
            <Save className="h-4 w-4 mr-2" />
            Save Daraja Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events
                </p>
              </div>
              <Switch
                id="email-alerts"
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => setNotifications({
                  ...notifications,
                  emailAlerts: checked
                })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-alerts">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications for urgent matters
                </p>
              </div>
              <Switch
                id="sms-alerts"
                checked={notifications.smsAlerts}
                onCheckedChange={(checked) => setNotifications({
                  ...notifications,
                  smsAlerts: checked
                })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-notifications">Payment Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when payments are received
                </p>
              </div>
              <Switch
                id="payment-notifications"
                checked={notifications.paymentNotifications}
                onCheckedChange={(checked) => setNotifications({
                  ...notifications,
                  paymentNotifications: checked
                })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monthly-reports">Monthly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive monthly revenue and collection reports
                </p>
              </div>
              <Switch
                id="monthly-reports"
                checked={notifications.monthlyReports}
                onCheckedChange={(checked) => setNotifications({
                  ...notifications,
                  monthlyReports: checked
                })}
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications}>
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Version:</span>
              <span className="ml-2 font-medium">1.0.0</span>
            </div>
            <div>
              <span className="text-muted-foreground">Environment:</span>
              <span className="ml-2 font-medium">Development</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2 font-medium">2025-09-15</span>
            </div>
            <div>
              <span className="text-muted-foreground">Database:</span>
              <span className="ml-2 font-medium">Connected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}