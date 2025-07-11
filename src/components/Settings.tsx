import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Platform configuration and preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Coming soon - Platform configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This section will include system settings, user permissions, and platform configuration.</p>
        </CardContent>
      </Card>
    </div>
  );
}
