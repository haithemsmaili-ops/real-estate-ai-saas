import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { ChannelStatus } from "@/types/communication";
import { Mail, MessageCircle, Smartphone } from "lucide-react";

interface ChannelStatusCardProps {
  dict: Dictionary;
  channels: ChannelStatus[];
}

const channelIcons = {
  whatsapp: MessageCircle,
  email: Mail,
  sms: Smartphone,
};

const channelLabelKeys = {
  whatsapp: "whatsapp" as const,
  email: "email" as const,
  sms: "sms" as const,
};

export function ChannelStatusCard({ dict, channels }: ChannelStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{dict.dashboard.channelsStatus.title}</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.channel];
          const labelKey = channelLabelKeys[channel.channel];

          return (
            <div
              key={channel.channel}
              className="flex items-center justify-between rounded-xl border border-surface-100 bg-surface-50/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-surface-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    {dict.dashboard.channelsStatus[labelKey]}
                  </p>
                  <Badge variant={channel.connected ? "success" : "warning"}>
                    {channel.connected
                      ? dict.dashboard.channelsStatus.connected
                      : dict.dashboard.channelsStatus.disconnected}
                  </Badge>
                </div>
              </div>
              {!channel.connected && (
                <Button variant="outline" size="sm">
                  {dict.dashboard.channelsStatus.configure}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
