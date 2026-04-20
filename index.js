require('dotenv').config();
const {
  Client, GatewayIntentBits, REST, Routes,
  SlashCommandBuilder, ModalBuilder, TextInputBuilder,
  TextInputStyle, ActionRowBuilder, EmbedBuilder,
  ButtonBuilder, ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const GUILD_ID             = '1000882508373688331';
const CANAL_H50            = '1362506087818854540';
const CANAL_EXAMEN         = '1347421594137530459';
const CANAL_INSTRUCTORES   = '1347421603935424525';
const CANAL_RESULTADOS     = '1347421583781920849';
const CANAL_LOGS           = '1495016854807121980';
const CANAL_ASCENSOS       = '1370572245281407046';
const CANAL_ESPERANDO      = '1355660648910032976';
const CANAL_SECUESTRO      = '1363375107078361098';
const ROL_INSTRUCTORES     = '1347421483164766329';
const ROL_HEAD_PFA         = '1347421445869011046';
const ROL_ENCARGADO_INSTR  = '1460777709147000944';
const ROL_INSTRUCTOR_EXTRA = '1364625812032192512';
const ROL_HIGH             = '1347421453020037182';

// IDs de CATEGORIAS de tickets (no canales individuales)
const CATEGORIAS_TICKETS = {
  '1347421540773269526': '📨 Apelación',
  '1347421544095416351': '🚨 Reportes',
  '1347421542790856727': '💰 Reintegros',
  '1347421545890320447': '🔧 Soporte Técnico',
};

// Registro semanal de tickets: { userId: { apelacion: 0, reportes: 0, reintegros: 0, soporte: 0, total: 0 } }
let semanaTicketsInicio = new Date(0);
let registroTickets = {};
const TICKETS_FILE = 'semana_tickets.json';
const TICKETS_ACTIVOS_FILE = 'tickets_activos.json';
let ticketsActivos = {}; // { canalId: { categoriaId, messageId } }

const TIENDAS = ['tienda1', 'tienda2', 'tienda3'];

const CANALES_INDIVIDUALES = [
  '1355660648910032976',
  '1486145617502928958',
  '1488654175901323264',
];

const CANALES_PATRULLA = [
  '1427788971873669201',
  '1464507594348560576',
  '1435481620680282153',
  '1435484373595066458',
  '1464507521493373028',
];

const ROBOS = {
  tienda1:        { canal: '1362914142851436774', nombre: 'Tienda 1',             min: 1,  max: 3  },
  tienda2:        { canal: '1453978522875068426', nombre: 'Tienda 2',             min: 1,  max: 3  },
  tienda3:        { canal: '1362913398827913416', nombre: 'Tienda 3',             min: 1,  max: 3  },
  facebook:       { canal: '1362287835587154071', nombre: 'Facebook',             min: 4,  max: 6  },
  bancocentral:   { canal: '1362513426651283709', nombre: 'Banco Central',        min: 7,  max: 15 },
  humane:         { canal: '1365399784508227584', nombre: 'Humane',               min: 7,  max: 15 },
  fleecacosta:    { canal: '1374468389493280828', nombre: 'Fleeca Costa',         min: 3,  max: 6  },
  fleecalife:     { canal: '1365400107440275526', nombre: 'Fleeca Life',          min: 3,  max: 6  },
  fleecataller:   { canal: '1362513464672649437', nombre: 'Fleeca Taller',        min: 3,  max: 6  },
  fleecapaleto:   { canal: '1378143656761884754', nombre: 'Fleeca Paleto',        min: 3,  max: 6  },
  fleecaayunta:   { canal: '1362513448189169735', nombre: 'Fleeca Ayuntamiento',  min: 3,  max: 6  },
  fleecasandy:    { canal: '1398041090694582333', nombre: 'Fleeca Sandy Shores',  min: 3,  max: 6  },
  mazebank:       { canal: '1362513386314662173', nombre: 'Maze Bank',            min: 2,  max: 6  },
  mansion:        { canal: '1362916819014258718', nombre: 'Mansión',              min: 3,  max: 6  },
  museo:          { canal: '1365400052058820853', nombre: 'Museo',                min: 5,  max: 8  },
  joyeria:        { canal: '1362916726840365296', nombre: 'Joyería',              min: 2,  max: 5  },
  subteprincipal: { canal: '1452721020984103044', nombre: 'Subte Principal',      min: 3,  max: 6  },
  subtebahamas:   { canal: '1452721517782896640', nombre: 'Subte Bahamas',        min: 3,  max: 6  },
  subtegaraje:    { canal: '1452721435117093065', nombre: 'Subte Garaje',         min: 3,  max: 6  },
  subteaero:      { canal: '1452721685043220583', nombre: 'Subte Aeropuerto',     min: 3,  max: 6  },
  carniceria:     { canal: '1362513481206730893', nombre: 'Carnicería',           min: 7,  max: 12 },
  estadio:        { canal: '1362916764370866247', nombre: 'Estadio',              min: 3,  max: 7  },
  yate:           { canal: '1362915313594794104', nombre: 'Yate',                 min: 4,  max: 6  },
  fabrica:        { canal: '1365400767678119996', nombre: 'Fábrica',              min: 7,  max: 12 },
  rancho:         { canal: '1363190192516759812', nombre: 'Rancho Abandonado',    min: 4,  max: 6  },
  fundidora:      { canal: '1403610575518302328', nombre: 'Fundidora',            min: 4,  max: 6  },
};

const INFO_ROBOS = {
  tienda1:        { armamento: 'Pistolas',                                         humos: 0, latas: 0,  molotovs: 0, rehenes: 1 },
  tienda2:        { armamento: 'Pistolas',                                         humos: 0, latas: 0,  molotovs: 0, rehenes: 1 },
  tienda3:        { armamento: 'Pistolas',                                         humos: 0, latas: 0,  molotovs: 0, rehenes: 1 },
  facebook:       { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3,  molotovs: 1, rehenes: 2 },
  bancocentral:   { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 3, latas: 6,  molotovs: 2, rehenes: 3 },
  humane:         { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 4, latas: 6,  molotovs: 3, rehenes: 3 },
  fleecacosta:    { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3,  molotovs: 1, rehenes: 1 },
  fleecalife:     { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3,  molotovs: 1, rehenes: 1 },
  fleecataller:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3,  molotovs: 1, rehenes: 1 },
  fleecapaleto:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3,  molotovs: 1, rehenes: 1 },
  fleecaayunta:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3,  molotovs: 1, rehenes: 1 },
  fleecasandy:    { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3,  molotovs: 1, rehenes: 1 },
  mazebank:       { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3,  molotovs: 1, rehenes: 1 },
  mansion:        { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 2,  molotovs: 1, rehenes: 1 },
  museo:          { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 4, latas: 3,  molotovs: 2, rehenes: 2 },
  joyeria:        { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 2,  molotovs: 1, rehenes: 0 },
  subteprincipal: { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4,  molotovs: 1, rehenes: 1 },
  subtebahamas:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4,  molotovs: 1, rehenes: 1 },
  subtegaraje:    { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4,  molotovs: 1, rehenes: 1 },
  subteaero:      { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4,  molotovs: 1, rehenes: 1 },
  carniceria:     { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 4, latas: 8,  molotovs: 3, rehenes: 3 },
  estadio:        { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3,  molotovs: 1, rehenes: 2 },
  yate:           { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 2, latas: 3,  molotovs: 3, rehenes: 1 },
  fabrica:        { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 8, latas: 6,  molotovs: 6, rehenes: 2 },
  rancho:         { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 3, latas: 4,  molotovs: 2, rehenes: 2 },
  fundidora:      { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 3, latas: 4,  molotovs: 2, rehenes: 2 },
};

// ==================== ORIGEN PARA /cancelar ====================
const origenPersonal = {};

// ==================== REGISTRO SEMANAL DE EXAMENES ====================
let semanaInicio = new Date(0); // fecha muy antigua por defecto
let registroSemanal = {};
const SEMANA_FILE = 'semana_instructores.json';

async function guardarTicketsActivos() {
  try {
    const resSha = await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${TICKETS_ACTIVOS_FILE}`, {
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' }
    });
    const sha = resSha.status !== 404 ? (await resSha.json()).sha : null;
    const body = { message: 'update tickets activos', content: Buffer.from(JSON.stringify(ticketsActivos, null, 2)).toString('base64') };
    if (sha) body.sha = sha;
    await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${TICKETS_ACTIVOS_FILE}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) { console.error('Error guardando tickets activos:', err.message); }
}

async function cargarTicketsActivos() {
  try {
    const res = await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${TICKETS_ACTIVOS_FILE}`, {
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' }
    });
    if (res.status === 404) return;
    const data = await res.json();
    const loaded = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    Object.assign(ticketsActivos, loaded);
    console.log('Tickets activos cargados:', Object.keys(ticketsActivos).length);
  } catch (err) { console.error('Error cargando tickets activos:', err.message); }
}

async function guardarTickets() {
  try {
    const resSha = await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${TICKETS_FILE}`, {
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' }
    });
    const sha = resSha.status !== 404 ? (await resSha.json()).sha : null;
    const body = { message: 'update tickets', content: Buffer.from(JSON.stringify({ semanaTicketsInicio: semanaTicketsInicio.toISOString(), registroTickets }, null, 2)).toString('base64') };
    if (sha) body.sha = sha;
    await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${TICKETS_FILE}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) { console.error('Error guardando tickets:', err.message); }
}

async function cargarTickets() {
  try {
    const res = await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${TICKETS_FILE}`, {
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' }
    });
    if (res.status === 404) { semanaTicketsInicio = new Date(); return; }
    const data = await res.json();
    const loaded = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    semanaTicketsInicio = new Date(loaded.semanaTicketsInicio);
    Object.assign(registroTickets, loaded.registroTickets || {});
    console.log('Tickets cargados desde:', semanaTicketsInicio.toLocaleDateString('es-AR'));
  } catch (err) { console.error('Error cargando tickets:', err.message); semanaTicketsInicio = new Date(); }
}

async function guardarSemana() {
  try {
    const resSha = await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${SEMANA_FILE}`, {
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' }
    });
    const sha = resSha.status !== 404 ? (await resSha.json()).sha : null;
    const body = { message: 'update semana', content: Buffer.from(JSON.stringify({ semanaInicio: semanaInicio.toISOString(), registroSemanal }, null, 2)).toString('base64') };
    if (sha) body.sha = sha;
    await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${SEMANA_FILE}`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) { console.error('Error guardando semana:', err.message); }
}

async function cargarSemana() {
  try {
    const res = await fetch(`https://api.github.com/repos/webstudios-ar/h50-bot/contents/${SEMANA_FILE}`, {
      headers: { 'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN, 'Accept': 'application/vnd.github+json' }
    });
    if (res.status === 404) { semanaInicio = new Date(); return; }
    const data = await res.json();
    const loaded = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    semanaInicio = new Date(loaded.semanaInicio);
    Object.assign(registroSemanal, loaded.registroSemanal || {});
    console.log('Semana cargada desde:', semanaInicio.toLocaleDateString('es-AR'));
  } catch (err) { console.error('Error cargando semana:', err.message); semanaInicio = new Date(); }
}

// ==================== LOGS ====================
async function enviarLog(guild, embed) {
  try {
    const canal = await guild.channels.fetch(CANAL_LOGS);
    await canal.send({ embeds: [embed] });
  } catch (e) { console.error('Error enviando log:', e.message); }
}

// ==================== ASIGNACION ====================
async function asignarPersonal(interaction, roboKey, robo, cantidad, ubicacion) {
  const guild = interaction.guild;
  const canalDestino = await guild.channels.fetch(robo.canal);
  let individuales = [], gruposPatrulla = [];

  await guild.members.fetch();

  for (const canalId of CANALES_INDIVIDUALES) {
    guild.voiceStates.cache.filter(vs => vs.channelId === canalId && vs.member && !vs.member.user.bot).forEach(vs => individuales.push(vs.member));
  }
  for (const canalId of CANALES_PATRULLA) {
    const grupo = guild.voiceStates.cache.filter(vs => vs.channelId === canalId && vs.member && !vs.member.user.bot).map(vs => vs.member);
    if (grupo.length > 0) gruposPatrulla.push(grupo);
  }

  const totalDisponible = individuales.length + gruposPatrulla.reduce((a, g) => a + g.length, 0);
  if (totalDisponible === 0) { await interaction.editReply({ content: '❌ No hay personal disponible.' }); return; }

  // Verificar que no se pase del maximo permitido
  if (robo.max && cantidad > robo.max) {
    await interaction.editReply({ content: '❌ El máximo de policías para **' + robo.nombre + '** es **' + robo.max + '**. No podés asignar ' + cantidad + '.' });
    return;
  }

  // Contar cuantos ya hay en el canal del robo
  const yaEnCanal = interaction.guild.voiceStates.cache.filter(vs => vs.channelId === robo.canal && vs.member && !vs.member.user.bot).size;
  if (robo.max && (yaEnCanal + cantidad) > robo.max) {
    const puedoMandar = robo.max - yaEnCanal;
    if (puedoMandar <= 0) {
      await interaction.editReply({ content: '❌ El canal de **' + robo.nombre + '** ya tiene el máximo de ' + robo.max + ' policías.' });
      return;
    }
    await interaction.editReply({ content: '⚠️ Solo puedo asignar **' + puedoMandar + '** más — el canal ya tiene ' + yaEnCanal + ' y el máximo es ' + robo.max + '. Confirmá con /' + robo.nombre.toLowerCase().replace(/ /g, '') + ' ' + puedoMandar + '.' });
    return;
  }

  let asignados = [], restante = cantidad;

  // Primero tomar individuales
  for (const p of individuales) { if (restante <= 0) break; asignados.push(p); restante--; }

  // Luego tomar de grupos de patrulla
  if (restante > 0) {
    for (const grupo of gruposPatrulla) {
      if (restante <= 0) break;
      if (grupo.length <= restante) {
        // El grupo entra completo
        asignados.push(...grupo);
        restante -= grupo.length;
      } else if (TIENDAS.includes(roboKey)) {
        // Solo para tiendas: romper el grupo y tomar los necesarios aleatoriamente
        const mezclado = [...grupo].sort(() => Math.random() - 0.5);
        asignados.push(...mezclado.slice(0, restante));
        restante = 0;
      } else {
        // Para otros robos: mandar el grupo completo aunque supere lo pedido
        asignados.push(...grupo);
        restante = 0;
      }
    }
  }

  if (!origenPersonal[robo.canal]) origenPersonal[robo.canal] = {};
  for (const p of asignados) origenPersonal[robo.canal][p.id] = p.voice?.channelId;

  const movidos = [], errores = [];
  for (const p of asignados) {
    try { await p.voice.setChannel(robo.canal); movidos.push(p); }
    catch (e) { errores.push(p.displayName); }
  }

  try {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    await rest.put(`/channels/${robo.canal}/voice-status`, { body: { status: ubicacion } });
  } catch (e) { console.error('Error setStatus:', e.message); }

  const info = INFO_ROBOS[roboKey];
  const embed = new EmbedBuilder()
    .setTitle('🚨 ASIGNACIÓN — ' + robo.nombre.toUpperCase())
    .setDescription('📍 **' + ubicacion + '**')
    .addFields(
      { name: '👮 Agentes asignados', value: movidos.map(m => '<@' + m.id + '>').join('\n') || 'Ninguno', inline: false },
      { name: '📊 Asignados',         value: movidos.length + ' / ' + cantidad + ' pedidos', inline: true },
      { name: '🎯 Canal',             value: '<#' + robo.canal + '>', inline: true },
      { name: '\u200B',               value: '\u200B', inline: false },
      { name: '🔫 Armamento',         value: info.armamento, inline: false },
      { name: '💨 Humos',             value: String(info.humos),    inline: true },
      { name: '🥫 Latas',             value: String(info.latas),    inline: true },
      { name: '🔥 Molotovs',          value: String(info.molotovs), inline: true },
      { name: '🧑 Rehenes',           value: info.rehenes > 0 ? info.rehenes + ' máx.' : 'No permitidos', inline: true },
      { name: '👮 Ejecutado por',      value: '<@' + interaction.user.id + '>', inline: true },
    )
    .setColor(0xCC2222).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });

  if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
  await enviarLog(guild, embed);
  await interaction.editReply({ content: '✅ Asignación realizada. Ver <#' + CANAL_LOGS + '> para el detalle.' });
}

// ==================== MONITOREO EXAMEN ====================
let intervaloExamen = null;
let contadorAvisos = 0;
const esperandoExamen = {};

async function enviarAvisoGrupal(guild) {
  try {
    const enEspera = guild.voiceStates.cache
      .filter(vs => vs.channelId === CANAL_EXAMEN && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);
    if (enEspera.length === 0) {
      if (intervaloExamen) { clearInterval(intervaloExamen); intervaloExamen = null; contadorAvisos = 0; }
      return;
    }
    contadorAvisos++;
    const canal = await guild.channels.fetch(CANAL_INSTRUCTORES);
    const menciones = enEspera.map(m => '<@' + m.id + '>').join(', ');
    const cantidad = enEspera.length;
    const tiempoTexto = contadorAvisos === 1 ? 'menos de 1 minuto' : (contadorAvisos - 1) + ' minuto' + ((contadorAvisos - 1) !== 1 ? 's' : '');
    let titulo, descripcion, color;
    if (contadorAvisos === 1) {
      titulo = '📋 ' + (cantidad === 1 ? 'HAY UN POSTULANTE' : 'HAY ' + cantidad + ' POSTULANTES') + ' ESPERANDO EXAMEN';
      descripcion = menciones + (cantidad === 1 ? ' está' : ' están') + ' esperando en <#' + CANAL_EXAMEN + '> para rendir su examen.';
      color = 0xFFD700;
    } else {
      titulo = '⚠️ AVISO #' + contadorAvisos + ' — ' + (cantidad === 1 ? 'POSTULANTE' : cantidad + ' POSTULANTES') + ' SIN ATENCIÓN';
      descripcion = menciones + (cantidad === 1 ? ' lleva' : ' llevan') + ' **' + tiempoTexto + '** esperando en <#' + CANAL_EXAMEN + '>.';
      color = 0xCC2222;
    }
    const embed = new EmbedBuilder().setTitle(titulo).setDescription(descripcion).setColor(color).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Exámenes' });
    await canal.send({ content: '<@&' + ROL_INSTRUCTORES + '>', embeds: [embed] });
  } catch (e) { console.error('Error aviso examen:', e.message); }
}

client.on('voiceStateUpdate', async (oldState, newState) => {
  const userId = newState.member?.id;
  if (!userId || newState.member?.user.bot) return;
  if (newState.channelId === CANAL_EXAMEN && oldState.channelId !== CANAL_EXAMEN) {
    esperandoExamen[userId] = { entro: Date.now() };
    if (!intervaloExamen) {
      contadorAvisos = 0;
      await enviarAvisoGrupal(newState.guild);
      intervaloExamen = setInterval(() => enviarAvisoGrupal(newState.guild), 60000);
    }
  }
  if (oldState.channelId === CANAL_EXAMEN && newState.channelId !== CANAL_EXAMEN) {
    delete esperandoExamen[userId];
    const quedan = newState.guild.voiceStates.cache.filter(vs => vs.channelId === CANAL_EXAMEN && vs.member && !vs.member.user.bot).size;
    if (quedan === 0 && intervaloExamen) { clearInterval(intervaloExamen); intervaloExamen = null; contadorAvisos = 0; }
  }
});

// ==================== SISTEMA DE TICKETS ====================
client.on('messageCreate', async (message) => {
  // Detectar tickets en los canales correspondientes
  const categoriaTicket = CATEGORIAS_TICKETS[message.channel.parentId];
  if (categoriaTicket && message.author.id !== client.user.id) {
    // Lock en memoria + persistencia para evitar doble mensaje
    if (ticketsActivos[message.channelId]) return;
    // Marcar inmediatamente en memoria antes del await para evitar race condition
    ticketsActivos[message.channelId] = { categoriaId: message.channel.parentId, messageId: null };
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('TICKET_' + message.channel.parentId + '_' + message.id)
          .setLabel('✅ Asumir ticket')
          .setStyle(ButtonStyle.Primary)
      );

      const msgEnviado = await message.channel.send({ content: '**' + categoriaTicket + '** — ¿Quién asume este ticket?', components: [row] });
      ticketsActivos[message.channelId].messageId = msgEnviado.id;
      await guardarTicketsActivos();
    } catch (e) {
      // Si fallo, limpiar para que pueda intentar de nuevo
      delete ticketsActivos[message.channelId];
      console.error('Error ticket:', e.message);
    }
  }

  // ==================== CONTADOR EXAMENES ====================
  if (message.channelId !== CANAL_RESULTADOS || message.author.bot) return;
  // Detectar nota X/10 — 7 o mas = aprobado, 6 o menos = desaprobado
  const notaMatch = message.content.match(/(\d+)\/10/);
  if (!notaMatch) return;
  const nota = parseInt(notaMatch[1]);
  const uid = message.author.id;
  if (!registroSemanal[uid]) registroSemanal[uid] = { aprobados: 0, desaprobados: 0 };
  if (nota >= 7) registroSemanal[uid].aprobados++;
  else registroSemanal[uid].desaprobados++;
  await guardarSemana();
});

// ==================== READY ====================
client.once('ready', async () => {
  console.log('H50 Bot conectado: ' + client.user.tag);
  await cargarSemana();
  await cargarTickets();
  await cargarTicketsActivos();

  const robosChoices = Object.entries(ROBOS).map(([key, robo]) => ({ name: robo.nombre, value: key }));
  robosChoices.push({ name: 'Secuestro', value: 'secuestro_canal' });

  const commands = Object.entries(ROBOS).map(([key, robo]) => {
    const cmd = new SlashCommandBuilder().setName(key).setDescription('Asignar personal: ' + robo.nombre)
      .addIntegerOption(o => o.setName('cantidad').setDescription('Cantidad de agentes').setRequired(true).setMinValue(1).setMaxValue(20));
    if (TIENDAS.includes(key)) cmd.addStringOption(o => o.setName('ubicacion').setDescription('Nombre del lugar').setRequired(true));
    return cmd.toJSON();
  });

  commands.push(new SlashCommandBuilder().setName('secuestro').setDescription('🚨 ALERTA ROJA — Todo el personal al Secuestro').toJSON());
  commands.push(new SlashCommandBuilder().setName('patrullar').setDescription('Divide el personal de Esperando en canales de patrulla (mín. 2 por canal)').toJSON());
  commands.push(new SlashCommandBuilder().setName('liberar').setDescription('Mueve a todos del canal del robo a Esperando Asignación')
    .addStringOption(o => o.setName('robo').setDescription('El robo a liberar').setRequired(true).addChoices(...robosChoices.slice(0, 25))).toJSON());
  commands.push(new SlashCommandBuilder().setName('cancelar').setDescription('Devuelve a cada persona al canal donde estaba antes')
    .addStringOption(o => o.setName('robo').setDescription('El robo a cancelar').setRequired(true).addChoices(...robosChoices.slice(0, 25))).toJSON());
  commands.push(new SlashCommandBuilder().setName('instructores').setDescription('[HEAD] Ver estadísticas de exámenes de la semana').toJSON());
  commands.push(new SlashCommandBuilder().setName('mis-tickets').setDescription('Ver tus estadísticas de tickets de la semana').toJSON());
  commands.push(new SlashCommandBuilder().setName('estadisticas-tickets').setDescription('[HEAD] Ver estadísticas de tickets de todos').toJSON());
  commands.push(new SlashCommandBuilder().setName('cerrar-tickets').setDescription('[HEAD] Cierra la semana de tickets y resetea el contador').toJSON());
  commands.push(new SlashCommandBuilder().setName('cerrar-instructores').setDescription('[HEAD] Cierra la semana y resetea el contador').toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try { await rest.put(Routes.applicationCommands(client.user.id), { body: commands }); console.log('Comandos: ' + commands.length); }
  catch (err) { console.error(err); }
});

// ==================== INTERACTIONS ====================
client.on('interactionCreate', async (interaction) => {
  // Boton asumir ticket
  if (interaction.isButton() && interaction.customId.startsWith('TICKET_')) {
    const puedeAsumir = interaction.member.roles.cache.has(ROL_HIGH) || interaction.member.roles.cache.has(ROL_HEAD_PFA);
    if (!puedeAsumir) {
      await interaction.reply({ content: '❌ Solo los rangos autorizados pueden asumir tickets.', ephemeral: true });
      return;
    }

    const partes = interaction.customId.split('_');
    const categoriaId = partes[1];
    const categoria = CATEGORIAS_TICKETS[categoriaId] || 'Ticket';
    const uid = interaction.user.id;

    if (!registroTickets[uid]) registroTickets[uid] = { total: 0 };
    if (!registroTickets[uid][categoriaId]) registroTickets[uid][categoriaId] = 0;
    registroTickets[uid][categoriaId]++;
    registroTickets[uid].total++;
    await guardarTickets();

    // Sacar del set de avisados para que si se abre otro ticket en el mismo canal se avise de nuevo
    // (no lo sacamos — el canal de ticket es uno por ticket, una vez asumido no necesita mas aviso)

    // Sacar de tickets activos
    const canalIdAsumido = interaction.channelId;
    if (ticketsActivos[canalIdAsumido]) {
      delete ticketsActivos[canalIdAsumido];
      await guardarTicketsActivos();
    }

    // Deshabilitar el boton
    const rowDone = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('TICKET_DONE')
        .setLabel('✅ Asumido por ' + (interaction.member.displayName || interaction.user.username))
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    );
    await interaction.update({ components: [rowDone] });
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const puedeInstructor = () => interaction.member.roles.cache.has(ROL_HEAD_PFA) || interaction.member.roles.cache.has(ROL_ENCARGADO_INSTR) || interaction.member.roles.cache.has(ROL_INSTRUCTOR_EXTRA);
  const enH50 = async () => { const m = await interaction.guild.members.fetch(interaction.user.id); return m.voice?.channelId === CANAL_H50; };

  // /mis-tickets
  if (interaction.commandName === 'mis-tickets') {
    const uid = interaction.user.id;
    const datos = registroTickets[uid];
    const inicio = semanaTicketsInicio.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const hoy = new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    let detalle = 'Sin tickets asumidos esta semana.';
    if (datos && datos.total > 0) {
      detalle = Object.entries(CATEGORIAS_TICKETS).map(([cId, nombre]) => nombre + ': **' + (datos[cId] || 0) + '**').join('\n');
      detalle += '\n\n📊 **Total: ' + datos.total + '**';
    }
    const embed = new EmbedBuilder().setTitle('🎫 MIS TICKETS — ' + (interaction.member.displayName || interaction.user.username).toUpperCase())
      .setDescription(detalle).addFields({ name: '📅 Período', value: inicio + ' → ' + hoy, inline: true })
      .setColor(0x5865F2).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Tickets' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // /estadisticas-tickets
  if (interaction.commandName === 'estadisticas-tickets') {
    const puedeUsar = interaction.member.roles.cache.has(ROL_HIGH) || interaction.member.roles.cache.has(ROL_HEAD_PFA);
    if (!puedeUsar) { await interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true }); return; }
    const inicio = semanaTicketsInicio.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const hoy = new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const filas = Object.keys(registroTickets).length > 0
      ? Object.entries(registroTickets).map(([uid, d]) => '<@' + uid + '> — 📊 **' + (d.total || 0) + ' total**').join('\n')
      : 'Sin tickets registrados esta semana.';
    const embed = new EmbedBuilder().setTitle('🎫 ESTADÍSTICAS DE TICKETS').setDescription(filas)
      .addFields({ name: '📅 Período', value: inicio + ' → ' + hoy, inline: true })
      .setColor(0x5865F2).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Tickets' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // /cerrar-tickets
  if (interaction.commandName === 'cerrar-tickets') {
    const puedeUsar = interaction.member.roles.cache.has(ROL_HIGH) || interaction.member.roles.cache.has(ROL_HEAD_PFA);
    if (!puedeUsar) { await interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true }); return; }
    const inicio = semanaTicketsInicio.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const hoy = new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const filas = Object.keys(registroTickets).length > 0
      ? Object.entries(registroTickets).map(([uid, d]) => '<@' + uid + '> — 📊 **' + (d.total || 0) + ' total**').join('\n')
      : 'Sin tickets registrados esta semana.';
    const embed = new EmbedBuilder().setTitle('🔒 SEMANA CERRADA — TICKETS').setDescription(filas)
      .addFields({ name: '📅 Período', value: inicio + ' → ' + hoy, inline: true }, { name: '👮 Cerrado por', value: '<@' + interaction.user.id + '>', inline: true })
      .setColor(0xCC2222).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Tickets' });
    semanaTicketsInicio = new Date(); registroTickets = {};
    await guardarTickets();
    // Publicar en canal ascensos
    try {
      const canalAscensos = await interaction.guild.channels.fetch(CANAL_ASCENSOS);
      await canalAscensos.send({ embeds: [embed] });
    } catch (e) { console.error('Error enviando a ascensos:', e.message); }
    await interaction.reply({ content: '✅ Semana cerrada. Resumen publicado en <#' + CANAL_ASCENSOS + '>.', ephemeral: true });
    return;
  }

  // /instructores
  if (interaction.commandName === 'instructores') {
    if (!puedeInstructor()) { await interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true }); return; }
    await interaction.deferReply({ ephemeral: true });
    const hoy = new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const inicio = semanaInicio.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const filas = Object.keys(registroSemanal).length > 0
      ? Object.entries(registroSemanal).map(([uid, d]) => '<@' + uid + '> — ✅ ' + d.aprobados + ' aprobados  |  ❌ ' + d.desaprobados + ' desaprobados  |  📊 ' + (d.aprobados + d.desaprobados) + ' total').join('\n')
      : 'Sin exámenes registrados esta semana.';
    const embed = new EmbedBuilder().setTitle('📋 ESTADÍSTICAS DE INSTRUCTORES').setDescription(filas)
      .addFields({ name: '📅 Período', value: inicio + ' → ' + hoy, inline: true })
      .setColor(0xFFD700).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Instructores' });
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  // /cerrar-instructores
  if (interaction.commandName === 'cerrar-instructores') {
    if (!puedeInstructor()) { await interaction.reply({ content: '❌ No tenés permisos.', ephemeral: true }); return; }
    await interaction.deferReply({ ephemeral: true });
    const hoy = new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const inicio = semanaInicio.toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
    const filas = Object.keys(registroSemanal).length > 0
      ? Object.entries(registroSemanal).map(([uid, d]) => '<@' + uid + '> — ✅ ' + d.aprobados + '  |  ❌ ' + d.desaprobados + '  |  📊 ' + (d.aprobados + d.desaprobados) + ' total').join('\n')
      : 'Sin exámenes registrados esta semana.';
    const embed = new EmbedBuilder().setTitle('🔒 SEMANA CERRADA — RESUMEN FINAL').setDescription(filas)
      .addFields({ name: '📅 Período', value: inicio + ' → ' + hoy, inline: true }, { name: '👮 Cerrado por', value: '<@' + interaction.user.id + '>', inline: true })
      .setColor(0xCC2222).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Instructores' });
    semanaInicio = new Date(); registroSemanal = {};
    await guardarSemana();
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  // /secuestro
  if (interaction.commandName === 'secuestro') {
    if (!await enH50()) { await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal **H-50**.', ephemeral: true }); return; }
    await interaction.deferReply({ ephemeral: true });
    const todos = interaction.guild.voiceStates.cache
      .filter(vs => vs.channelId !== CANAL_H50 && vs.channelId !== CANAL_SECUESTRO && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);
    if (todos.length === 0) { await interaction.editReply({ content: '❌ No hay personal disponible.' }); return; }
    const movidos = [], errores = [];
    for (const p of todos) { try { await p.voice.setChannel(CANAL_SECUESTRO); movidos.push(p); } catch (e) { errores.push(p.displayName); } }
    const embed = new EmbedBuilder().setTitle('🚨 SECUESTRO — TODO EL PERSONAL')
      .setDescription('Se movió a todo el personal al canal de Secuestro.')
      .addFields({ name: '👮 Personal movilizado', value: movidos.map(m => '<@' + m.id + '>').join('\n') || 'Ninguno', inline: false }, { name: '📊 Total', value: movidos.length + ' agentes', inline: true }, { name: '👮 Ejecutado por', value: '<@' + interaction.user.id + '>', inline: true })
      .setColor(0xCC0000).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });
    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await enviarLog(interaction.guild, embed);
    await interaction.editReply({ content: '🚨 Secuestro activado. Ver <#' + CANAL_LOGS + '>.' });
    return;
  }

  // /patrullar
  if (interaction.commandName === 'patrullar') {
    if (!await enH50()) { await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal **H-50**.', ephemeral: true }); return; }
    await interaction.deferReply({ ephemeral: true });
    const enEspera = interaction.guild.voiceStates.cache
      .filter(vs => vs.channelId === CANAL_ESPERANDO && vs.member && !vs.member.user.bot).map(vs => vs.member);
    if (enEspera.length < 2) { await interaction.editReply({ content: '❌ Se necesitan al menos **2** personas en Esperando Asignación.' }); return; }
    const shuffled = enEspera.sort(() => Math.random() - 0.5);
    const maxCanales = Math.min(Math.floor(shuffled.length / 2), CANALES_PATRULLA.length);
    const canalesAUsar = CANALES_PATRULLA.slice(0, maxCanales);
    const base = Math.floor(shuffled.length / maxCanales), extras = shuffled.length % maxCanales;
    const grupos = []; let idx = 0;
    for (let i = 0; i < maxCanales; i++) { const n = base + (i < extras ? 1 : 0); grupos.push(shuffled.slice(idx, idx + n)); idx += n; }
    const movidos = [], errores = [];
    for (let i = 0; i < grupos.length; i++) for (const p of grupos[i]) { try { await p.voice.setChannel(canalesAUsar[i]); movidos.push(p); } catch (e) { errores.push(p.displayName); } }
    const descripcion = grupos.map((g, i) => '**Patrulla ' + (i+1) + '** (' + g.length + '): ' + g.map(m => '<@' + m.id + '>').join(', ')).join('\n');
    const embed = new EmbedBuilder().setTitle('🚔 PATRULLA ASIGNADA').setDescription(descripcion)
      .addFields({ name: '📊 Total', value: movidos.length + ' agentes en ' + maxCanales + ' grupos', inline: true }, { name: '👮 Ejecutado por', value: '<@' + interaction.user.id + '>', inline: true })
      .setColor(0x2266CC).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });
    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await enviarLog(interaction.guild, embed);
    await interaction.editReply({ content: '✅ Patrulla asignada. Ver <#' + CANAL_LOGS + '>.' });
    return;
  }

  // /liberar
  if (interaction.commandName === 'liberar') {
    if (!await enH50()) { await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal **H-50**.', ephemeral: true }); return; }
    await interaction.deferReply({ ephemeral: true });
    const roboKey = interaction.options.getString('robo');
    const canalALiberar = roboKey === 'secuestro_canal' ? CANAL_SECUESTRO : ROBOS[roboKey]?.canal;
    const nombreALiberar = roboKey === 'secuestro_canal' ? 'Secuestro' : ROBOS[roboKey]?.nombre;
    const enCanal = interaction.guild.voiceStates.cache.filter(vs => vs.channelId === canalALiberar && vs.member && !vs.member.user.bot).map(vs => vs.member);
    if (enCanal.length === 0) { await interaction.editReply({ content: '❌ No hay nadie en el canal de **' + nombreALiberar + '**.' }); return; }
    const movidos = [], errores = [];
    for (const p of enCanal) { try { await p.voice.setChannel(CANALES_INDIVIDUALES[0]); movidos.push(p); } catch (e) { errores.push(p.displayName); } }
    delete origenPersonal[canalALiberar];
    // Borrar el estado del canal
    try { const ch = await interaction.guild.channels.fetch(canalALiberar); await ch.setStatus(''); } catch (e) {}
    const embed = new EmbedBuilder().setTitle('✅ LIBERADOS — ' + nombreALiberar.toUpperCase())
      .setDescription('Personal devuelto a **Esperando Asignación**.')
      .addFields({ name: '👮 Personal liberado', value: movidos.map(m => '<@' + m.id + '>').join('\n') || 'Ninguno', inline: false }, { name: '👮 Ejecutado por', value: '<@' + interaction.user.id + '>', inline: true })
      .setColor(0x00CC66).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });
    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await enviarLog(interaction.guild, embed);
    await interaction.editReply({ content: '✅ Personal liberado. Ver <#' + CANAL_LOGS + '>.' });
    return;
  }

  // /cancelar
  if (interaction.commandName === 'cancelar') {
    if (!await enH50()) { await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal **H-50**.', ephemeral: true }); return; }
    await interaction.deferReply({ ephemeral: true });
    const roboKey = interaction.options.getString('robo');
    const canalALiberar = roboKey === 'secuestro_canal' ? CANAL_SECUESTRO : ROBOS[roboKey]?.canal;
    const nombreALiberar = roboKey === 'secuestro_canal' ? 'Secuestro' : ROBOS[roboKey]?.nombre;
    const enCanal = interaction.guild.voiceStates.cache.filter(vs => vs.channelId === canalALiberar && vs.member && !vs.member.user.bot).map(vs => vs.member);
    if (enCanal.length === 0) { await interaction.editReply({ content: '❌ No hay nadie en el canal de **' + nombreALiberar + '**.' }); return; }
    const origenes = origenPersonal[canalALiberar] || {};
    const movidos = [], errores = [];
    for (const p of enCanal) {
      const orig = origenes[p.id] || CANALES_INDIVIDUALES[0];
      try { await p.voice.setChannel(orig); movidos.push({ p, orig }); } catch (e) { errores.push(p.displayName); }
    }
    delete origenPersonal[canalALiberar];
    // Borrar el estado del canal
    try { const ch = await interaction.guild.channels.fetch(canalALiberar); await ch.setStatus(''); } catch (e) {}
    const embed = new EmbedBuilder().setTitle('↩️ CANCELADO — ' + nombreALiberar.toUpperCase())
      .setDescription('Robo cancelado. Personal devuelto a su canal de origen.')
      .addFields({ name: '👮 Personal devuelto', value: movidos.map(({ p, orig }) => '<@' + p.id + '> → <#' + orig + '>').join('\n') || 'Ninguno', inline: false }, { name: '👮 Ejecutado por', value: '<@' + interaction.user.id + '>', inline: true })
      .setColor(0xFFAA00).setTimestamp().setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });
    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await enviarLog(interaction.guild, embed);
    await interaction.editReply({ content: '↩️ Personal devuelto. Ver <#' + CANAL_LOGS + '>.' });
    return;
  }

  // Robos normales
  const roboKey = interaction.commandName;
  const robo = ROBOS[roboKey];
  if (!robo) return;
  if (!await enH50()) { await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal **H-50**.', ephemeral: true }); return; }
  const cantidad = interaction.options.getInteger('cantidad');
  const ubicacion = TIENDAS.includes(roboKey) ? interaction.options.getString('ubicacion') : robo.nombre;
  await interaction.deferReply({ ephemeral: true });
  await asignarPersonal(interaction, roboKey, robo, cantidad, ubicacion);
});

client.login(process.env.TOKEN);
