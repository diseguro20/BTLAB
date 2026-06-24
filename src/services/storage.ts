import type { Bot, KeylogEntry, NotificationEntry, SmsEntry, BotApp, ActionLog, FileEntry, Contact } from '../types';

// Initial Mock Data
const INITIAL_BOTS: Bot[] = [
  {
    id: "bot_01h8a",
    name: "Samsung Galaxy S23 Ultra",
    model: "SM-S918B",
    country: "Brasil",
    countryCode: "BR",
    ip: "189.6.120.45",
    status: "online",
    battery: 88,
    batteryCharging: false,
    network: "5g",
    screenState: "unlocked",
    activeApp: "com.bradesco",
    lastActive: new Date().toLocaleTimeString(),
    tag: "Bradesco",
    options: {
      activities: "1",
      keystrokes: "1",
      notifications: "1",
      visitedapps: "1",
      visitedlinks: "0",
      livenotify: "1",
      livescreen: "1",
      autoj: "1"
    }
  },
  {
    id: "bot_99x2b",
    name: "Motorola Edge 40",
    model: "XT2303-2",
    country: "Brasil",
    countryCode: "BR",
    ip: "177.34.82.115",
    status: "online",
    battery: 45,
    batteryCharging: true,
    network: "wifi",
    screenState: "unlocked",
    activeApp: "com.nu.production",
    lastActive: new Date().toLocaleTimeString(),
    tag: "Nubank",
    options: {
      activities: "1",
      keystrokes: "1",
      notifications: "1",
      visitedapps: "1",
      visitedlinks: "1",
      livenotify: "1",
      livescreen: "0",
      autoj: "0"
    }
  },
  {
    id: "bot_12f9k",
    name: "Xiaomi Redmi Note 12",
    model: "22111317G",
    country: "Brasil",
    countryCode: "BR",
    ip: "201.86.15.220",
    status: "offline",
    battery: 12,
    batteryCharging: false,
    network: "offline",
    screenState: "locked",
    activeApp: "com.android.launcher3",
    lastActive: "Ontem às 23:45",
    tag: "Banco do Brasil",
    options: {
      activities: "0",
      keystrokes: "1",
      notifications: "1",
      visitedapps: "0",
      visitedlinks: "0",
      livenotify: "1",
      livescreen: "0",
      autoj: "0"
    }
  },
  {
    id: "bot_kd77a",
    name: "Google Pixel 7 Pro",
    model: "GP4BC",
    country: "Estados Unidos",
    countryCode: "US",
    ip: "72.210.8.190",
    status: "online",
    battery: 95,
    batteryCharging: false,
    network: "4g",
    screenState: "locked",
    activeApp: "com.google.android.apps.messaging",
    lastActive: new Date().toLocaleTimeString(),
    tag: "Chase Mobile",
    options: {
      activities: "1",
      keystrokes: "1",
      notifications: "1",
      visitedapps: "1",
      visitedlinks: "1",
      livenotify: "1",
      livescreen: "1",
      autoj: "1"
    }
  }
];

const INITIAL_KEYLOGS: KeylogEntry[] = [
  {
    id: "log_1",
    botId: "bot_01h8a",
    timestamp: "10:14:22",
    appName: "com.bradesco",
    text: "Digitação de Agência: 3120, Conta: 014522-8"
  },
  {
    id: "log_2",
    botId: "bot_01h8a",
    timestamp: "10:14:55",
    appName: "com.bradesco",
    text: "Senha numérica de 6 dígitos: [ 4 ][ 8 ][ 1 ][ 9 ][ 0 ][ 3 ]"
  },
  {
    id: "log_3",
    botId: "bot_99x2b",
    timestamp: "09:30:11",
    appName: "com.nu.production",
    text: "CPF digitado: 455.918.230-01"
  },
  {
    id: "log_4",
    botId: "bot_99x2b",
    timestamp: "09:31:05",
    appName: "com.nu.production",
    text: "Senha de acesso: ******** (NuSenha123)"
  }
];

const INITIAL_NOTIFICATIONS: NotificationEntry[] = [
  {
    id: "not_1",
    botId: "bot_01h8a",
    timestamp: "10:15:30",
    appName: "com.google.android.apps.messaging",
    title: "SMS: Bradesco",
    content: "Codigo de seguranca Bradesco: 884712. Nao compartilhe."
  },
  {
    id: "not_2",
    botId: "bot_99x2b",
    timestamp: "09:32:00",
    appName: "com.nu.production",
    title: "Nubank",
    content: "Compra aprovada no valor de R$ 350,00 no estabelecimento Magalu."
  }
];

const INITIAL_SMS: SmsEntry[] = [
  {
    id: "sms_1",
    botId: "bot_01h8a",
    timestamp: "10:10:00",
    phone: "+5511999991234",
    message: "Oi, você viu a transferência que te enviei hoje de manhã?",
    type: "received"
  },
  {
    id: "sms_2",
    botId: "bot_01h8a",
    timestamp: "10:11:15",
    phone: "+5511999991234",
    message: "Vou olhar no aplicativo do banco agora mesmo, obrigado.",
    type: "sent"
  }
];

const INITIAL_CONTACTS: Contact[] = [
  { name: "Mãe", phone: "+55 11 98888-7777" },
  { name: "Trabalho - Carlos", phone: "+55 11 97777-6666" },
  { name: "Suporte", phone: "+55 11 91111-2222" },
  { name: "Banco Central", phone: "+55 61 3414-1414" }
];

const INITIAL_APPS: BotApp[] = [
  { packageName: "com.bradesco", appName: "Bradesco", isSystem: false, tracked: true, locked: false, enabled: true },
  { packageName: "com.nu.production", appName: "Nubank", isSystem: false, tracked: true, locked: false, enabled: true },
  { packageName: "com.itau", appName: "Itaú", isSystem: false, tracked: false, locked: false, enabled: true },
  { packageName: "com.whatsapp", appName: "WhatsApp", isSystem: false, tracked: true, locked: false, enabled: true },
  { packageName: "com.android.settings", appName: "Configurações", isSystem: true, tracked: false, locked: false, enabled: true },
  { packageName: "com.google.android.apps.messaging", appName: "Mensagens", isSystem: true, tracked: true, locked: false, enabled: true }
];

const INITIAL_FILES: FileEntry[] = [
  { name: "DCIM", path: "/storage/emulated/0/DCIM", size: 0, isDir: true, modified: "2026-06-20 14:10" },
  { name: "Download", path: "/storage/emulated/0/Download", size: 0, isDir: true, modified: "2026-06-23 09:12" },
  { name: "Documents", path: "/storage/emulated/0/Documents", size: 0, isDir: true, modified: "2026-06-15 11:30" },
  { name: "Android", path: "/storage/emulated/0/Android", size: 0, isDir: true, modified: "2026-06-01 08:00" },
  { name: "senhas_banco.txt", path: "/storage/emulated/0/Download/senhas_banco.txt", size: 142, isDir: false, modified: "2026-06-22 17:42" },
  { name: "screenshot_pix.png", path: "/storage/emulated/0/DCIM/screenshot_pix.png", size: 1245000, isDir: false, modified: "2026-06-23 12:00" }
];

const INITIAL_LOGS: ActionLog[] = [
  { id: "log_a1", timestamp: new Date().toLocaleTimeString(), type: "info", message: "Painel BTMob V4 Web iniciado com sucesso." },
  { id: "log_a2", timestamp: new Date().toLocaleTimeString(), type: "success", message: "Conectado ao servidor de controle simulado." }
];

// Helper to load/save state
const loadState = <T>(key: string, defaultValue: T): T => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultValue;
};

const saveState = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

export class StorageService {
  private static listeners: Set<() => void> = new Set();

  static subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  static getBots(): Bot[] {
    return loadState('btmob_bots', INITIAL_BOTS);
  }

  static getKeylogs(botId?: string): KeylogEntry[] {
    const logs = loadState<KeylogEntry[]>('btmob_keylogs', INITIAL_KEYLOGS);
    if (botId) {
      return logs.filter(l => l.botId === botId);
    }
    return logs;
  }

  static getNotifications(botId?: string): NotificationEntry[] {
    const nots = loadState<NotificationEntry[]>('btmob_notifications', INITIAL_NOTIFICATIONS);
    if (botId) {
      return nots.filter(n => n.botId === botId);
    }
    return nots;
  }

  static getSms(botId?: string): SmsEntry[] {
    const sms = loadState<SmsEntry[]>('btmob_sms', INITIAL_SMS);
    if (botId) {
      return sms.filter(s => s.botId === botId);
    }
    return sms;
  }

  static getContacts(): Contact[] {
    return loadState('btmob_contacts', INITIAL_CONTACTS);
  }

  static getApps(botId?: string): BotApp[] {
    // For simulation simplicity, we use same apps for all bots
    return loadState('btmob_apps_' + (botId || 'global'), INITIAL_APPS);
  }

  static getFiles(dirPath: string): FileEntry[] {
    const allFiles = loadState<FileEntry[]>('btmob_files', INITIAL_FILES);
    if (dirPath === "/storage/emulated/0") {
      return allFiles.filter(f => f.path === "/storage/emulated/0/DCIM" || 
                                  f.path === "/storage/emulated/0/Download" || 
                                  f.path === "/storage/emulated/0/Documents" || 
                                  f.path === "/storage/emulated/0/Android");
    }
    if (dirPath === "/storage/emulated/0/Download") {
      return allFiles.filter(f => f.path === "/storage/emulated/0/Download/senhas_banco.txt");
    }
    if (dirPath === "/storage/emulated/0/DCIM") {
      return allFiles.filter(f => f.path === "/storage/emulated/0/DCIM/screenshot_pix.png");
    }
    return [];
  }

  static getLogs(): ActionLog[] {
    return loadState('btmob_logs', INITIAL_LOGS);
  }

  // Setters/Actions
  static updateBot(bot: Bot) {
    const bots = this.getBots();
    const index = bots.findIndex(b => b.id === bot.id);
    if (index !== -1) {
      bots[index] = bot;
      saveState('btmob_bots', bots);
      this.notify();
    }
  }

  static addLog(type: 'info' | 'warning' | 'error' | 'success', message: string, botId?: string, botName?: string) {
    const logs = this.getLogs();
    const newLog: ActionLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
      botId,
      botName
    };
    saveState('btmob_logs', [newLog, ...logs].slice(0, 100)); // cap at 100
    this.notify();
  }

  static toggleAppLock(botId: string, packageName: string) {
    const apps = this.getApps(botId);
    const index = apps.findIndex(a => a.packageName === packageName);
    if (index !== -1) {
      apps[index].locked = !apps[index].locked;
      saveState('btmob_apps_' + botId, apps);
      this.addLog(
        apps[index].locked ? 'warning' : 'info', 
        `Aplicativo ${apps[index].appName} (${packageName}) ${apps[index].locked ? 'BLOQUEADO' : 'DESBLOQUEADO'}.`,
        botId
      );
      this.notify();
    }
  }

  static toggleAppTracking(botId: string, packageName: string) {
    const apps = this.getApps(botId);
    const index = apps.findIndex(a => a.packageName === packageName);
    if (index !== -1) {
      apps[index].tracked = !apps[index].tracked;
      saveState('btmob_apps_' + botId, apps);
      this.addLog(
        'info', 
        `Rastreamento do aplicativo ${apps[index].appName} ${apps[index].tracked ? 'ATIVADO' : 'DESATIVADO'}.`,
        botId
      );
      this.notify();
    }
  }

  static changeScreenState(botId: string, state: Bot['screenState']) {
    const bots = this.getBots();
    const bot = bots.find(b => b.id === botId);
    if (bot) {
      bot.screenState = state;
      this.updateBot(bot);
      this.addLog(
        state === 'unlocked' ? 'success' : 'warning',
        `Estado da tela do dispositivo alterado para: ${state.toUpperCase()}`,
        botId,
        bot.name
      );
    }
  }

  static sendSmsCommand(botId: string, phone: string, message: string) {
    const sms = loadState<SmsEntry[]>('btmob_sms', INITIAL_SMS);
    const newSms: SmsEntry = {
      id: Math.random().toString(36).substring(7),
      botId,
      timestamp: new Date().toLocaleTimeString().substring(0, 5),
      phone,
      message,
      type: 'sent'
    };
    saveState('btmob_sms', [...sms, newSms]);
    this.addLog('info', `Comando SMS enviado para ${phone}: "${message}"`, botId);
    this.notify();
  }

  static runShellCommand(botId: string, command: string): string {
    const cmd = command.trim().toLowerCase();
    this.addLog('info', `Executou comando shell: adb shell ${command}`, botId);

    if (cmd === 'help') {
      return "Comandos disponíveis:\n" +
             "  help                    - Mostra esta lista de ajuda.\n" +
             "  ls [dir]                - Lista arquivos do diretório.\n" +
             "  getprop ro.product.name - Retorna o modelo do aparelho.\n" +
             "  pm list packages        - Lista pacotes instalados.\n" +
             "  screencap               - Tira um screenshot (simulado).\n" +
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
      const bot = this.getBots().find(b => b.id === botId);
      return bot ? bot.model : "Desconhecido";
    }
    if (cmd === 'pm list packages') {
      const apps = this.getApps(botId);
      return apps.map(a => `package:${a.packageName}`).join('\n');
    }
    if (cmd === 'screencap') {
      return "/sdcard/Pictures/screencap_temp.png salvo com sucesso (tamanho: 824KB).";
    }
    if (cmd === 'reboot') {
      setTimeout(() => {
        const bots = this.getBots();
        const bot = bots.find(b => b.id === botId);
        if (bot) {
          bot.status = 'offline';
          this.updateBot(bot);
          this.addLog('error', `Dispositivo desconectado (reiniciando).`, botId, bot.name);
          setTimeout(() => {
            bot.status = 'online';
            this.updateBot(bot);
            this.addLog('success', `Dispositivo conectado após reinicialização.`, botId, bot.name);
          }, 6000);
        }
      }, 1000);
      return "Enviando sinal de reinicialização...";
    }
    if (cmd === 'dumpsys battery') {
      const bot = this.getBots().find(b => b.id === botId);
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
    return `adb shell: command not found: ${command}. Digite 'help' para comandos válidos.`;
  }

  // Simulation updates loop
  static startSimulator() {
    let tickCount = 0;
    const interval = setInterval(() => {
      const bots = this.getBots().filter(b => b.status === 'online');
      if (bots.length === 0) return;

      tickCount++;

      // 1. Simular digitação no Keylogger a cada 4 ticks
      if (tickCount % 4 === 0) {
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        // Somente se não estiver bloqueado
        if (randomBot.screenState === 'unlocked') {
          const bankName = randomBot.tag;
          const randomKeys = [
            `Acessou campo de senha em ${bankName}`,
            `Digitou senha Pix: ${Math.floor(100000 + Math.random() * 900000)}`,
            `Chave Pix digitada: CPF 098.243.${Math.floor(100 + Math.random() * 800)}-20`,
            `Senha de transação digitada: [ ${Math.floor(1 + Math.random()*9)} ][ ${Math.floor(1 + Math.random()*9)} ][ ${Math.floor(1 + Math.random()*9)} ][ ${Math.floor(1 + Math.random()*9)} ]`
          ];
          const text = randomKeys[Math.floor(Math.random() * randomKeys.length)];
          const keylogs = loadState<KeylogEntry[]>('btmob_keylogs', INITIAL_KEYLOGS);
          const newEntry: KeylogEntry = {
            id: Math.random().toString(36).substring(7),
            botId: randomBot.id,
            timestamp: new Date().toLocaleTimeString(),
            appName: randomBot.activeApp,
            text
          };
          saveState('btmob_keylogs', [newEntry, ...keylogs].slice(0, 100));
          this.addLog('info', `Novo log capturado: ${text.substring(0, 40)}...`, randomBot.id, randomBot.name);
        }
      }

      // 2. Simular notificação a cada 6 ticks
      if (tickCount % 6 === 0) {
        const randomBot = bots[Math.floor(Math.random() * bots.length)];
        const nots = loadState<NotificationEntry[]>('btmob_notifications', INITIAL_NOTIFICATIONS);
        const titles = ["Bradesco", "Banco Inter", "Mercado Pago", "SMS: Banco"];
        const contents = [
          `TOKEN de seguranca para transacao Pix: ${Math.floor(100000 + Math.random()*900000)}. Valido por 5min.`,
          `Transferência de R$ ${Math.floor(10 + Math.random()*900)},00 recebida com sucesso.`,
          `Sua conta foi acessada de um novo dispositivo Motorola Edge.`,
          `Código de ativação: ${Math.floor(1000 + Math.random()*9000)}`
        ];
        const index = Math.floor(Math.random() * titles.length);
        const newNot: NotificationEntry = {
          id: Math.random().toString(36).substring(7),
          botId: randomBot.id,
          timestamp: new Date().toLocaleTimeString().substring(0, 5),
          appName: "com.android.systemui",
          title: titles[index],
          content: contents[index]
        };
        saveState('btmob_notifications', [newNot, ...nots].slice(0, 50));
        this.addLog('warning', `Notificação interceptada: ${titles[index]} - ${contents[index].substring(0, 30)}...`, randomBot.id, randomBot.name);
      }

      // 3. Simular oscilação de bateria a cada 10 ticks
      if (tickCount % 10 === 0) {
        const botsList = this.getBots();
        botsList.forEach(b => {
          if (b.status === 'online') {
            if (b.batteryCharging) {
              b.battery = Math.min(100, b.battery + 1);
            } else {
              b.battery = Math.max(1, b.battery - 1);
            }
          }
        });
        saveState('btmob_bots', botsList);
      }

      this.notify();
    }, 5000); // simulation tick every 5 seconds

    return () => clearInterval(interval);
  }
}
