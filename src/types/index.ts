export interface Bot {
  id: string;
  name: string;
  model: string;
  country: string;
  countryCode: string;
  ip: string;
  status: 'online' | 'offline';
  battery: number;
  batteryCharging: boolean;
  network: 'wifi' | '5g' | '4g' | '3g' | '2g' | 'offline';
  screenState: 'locked' | 'unlocked' | 'black' | 'update' | 'battery_dead';
  activeApp: string;
  lastActive: string;
  tag: string; // e.g. "Bradesco", "Test1"
  options: {
    activities: string;
    keystrokes: string;
    notifications: string;
    visitedapps: string;
    visitedlinks: string;
    livenotify: string;
    livescreen: string;
    autoj: string;
  };
}

export interface FileEntry {
  name: string;
  path: string;
  size: number;
  isDir: boolean;
  modified: string;
}

export interface KeylogEntry {
  id: string;
  botId: string;
  timestamp: string;
  appName: string;
  text: string;
}

export interface NotificationEntry {
  id: string;
  botId: string;
  timestamp: string;
  appName: string;
  title: string;
  content: string;
}

export interface SmsEntry {
  id: string;
  botId: string;
  timestamp: string;
  phone: string;
  message: string;
  type: 'received' | 'sent';
}

export interface Contact {
  name: string;
  phone: string;
}

export interface BotApp {
  packageName: string;
  appName: string;
  isSystem: boolean;
  tracked: boolean;
  locked: boolean;
  enabled: boolean;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  botId?: string;
  botName?: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}
