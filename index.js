require('dotenv').config();
const {
  Client, GatewayIntentBits, REST, Routes,
  SlashCommandBuilder, ModalBuilder, TextInputBuilder,
  TextInputStyle, ActionRowBuilder, EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ]
});

const GUILD_ID  = '1000882508373688331';
const CANAL_H50 = '1362506087818854540';
const TIENDAS   = ['tienda1', 'tienda2', 'tienda3'];

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
  tienda1:        { canal: '1362914142851436774', nombre: 'Tienda 1',             min: 1 },
  tienda2:        { canal: '1453978522875068426', nombre: 'Tienda 2',             min: 1 },
  tienda3:        { canal: '1362913398827913416', nombre: 'Tienda 3',             min: 1 },
  facebook:       { canal: '1362287835587154071', nombre: 'Facebook',             min: 4 },
  bancocentral:   { canal: '1362513426651283709', nombre: 'Banco Central',        min: 7 },
  humane:         { canal: '1365399784508227584', nombre: 'Humane',               min: 7 },
  fleecacosta:    { canal: '1374468389493280828', nombre: 'Fleeca Costa',         min: 3 },
  fleecalife:     { canal: '1365400107440275526', nombre: 'Fleeca Life',          min: 3 },
  fleecataller:   { canal: '1362513464672649437', nombre: 'Fleeca Taller',        min: 3 },
  fleecapaleto:   { canal: '1378143656761884754', nombre: 'Fleeca Paleto',        min: 3 },
  fleecaayunta:   { canal: '1362513448189169735', nombre: 'Fleeca Ayuntamiento',  min: 3 },
  fleecasandy:    { canal: '1398041090694582333', nombre: 'Fleeca Sandy Shores',  min: 3 },
  mazebank:       { canal: '1362513386314662173', nombre: 'Maze Bank',            min: 2 },
  mansion:        { canal: '1362916819014258718', nombre: 'Mansión',              min: 3 },
  museo:          { canal: '1365400052058820853', nombre: 'Museo',                min: 5 },
  joyeria:        { canal: '1362916726840365296', nombre: 'Joyería',              min: 2 },
  subteprincipal: { canal: '1452721020984103044', nombre: 'Subte Principal',      min: 3 },
  subtebahamas:   { canal: '1452721517782896640', nombre: 'Subte Bahamas',        min: 3 },
  subtegaraje:    { canal: '1452721435117093065', nombre: 'Subte Garaje',         min: 3 },
  subteaero:      { canal: '1452721685043220583', nombre: 'Subte Aeropuerto',     min: 3 },
  carniceria:     { canal: '1362513481206730893', nombre: 'Carnicería',           min: 7 },
  estadio:        { canal: '1362916764370866247', nombre: 'Estadio',              min: 3 },
  yate:           { canal: '1362915313594794104', nombre: 'Yate',                 min: 4 },
  fabrica:        { canal: '1365400767678119996', nombre: 'Fábrica',              min: 7 },
  rancho:         { canal: '1363190192516759812', nombre: 'Rancho Abandonado',    min: 4 },
  fundidora:      { canal: '1403610575518302328', nombre: 'Fundidora',            min: 4 },
  secuestro:      { canal: '1363375107078361098', nombre: 'Secuestro',            min: 3 },
};

const INFO_ROBOS = {
  tienda1:        { armamento: 'Pistolas',                                         humos: 0, latas: 0, molotovs: 0, rehenes: 1 },
  tienda2:        { armamento: 'Pistolas',                                         humos: 0, latas: 0, molotovs: 0, rehenes: 1 },
  tienda3:        { armamento: 'Pistolas',                                         humos: 0, latas: 0, molotovs: 0, rehenes: 1 },
  facebook:       { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3, molotovs: 1, rehenes: 2 },
  bancocentral:   { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 3, latas: 6, molotovs: 2, rehenes: 3 },
  humane:         { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 4, latas: 6, molotovs: 3, rehenes: 3 },
  fleecacosta:    { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3, molotovs: 1, rehenes: 1 },
  fleecalife:     { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3, molotovs: 1, rehenes: 1 },
  fleecataller:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3, molotovs: 1, rehenes: 1 },
  fleecapaleto:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3, molotovs: 1, rehenes: 1 },
  fleecaayunta:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3, molotovs: 1, rehenes: 1 },
  fleecasandy:    { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 3, molotovs: 1, rehenes: 1 },
  mazebank:       { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3, molotovs: 1, rehenes: 1 },
  mansion:        { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 1, latas: 2, molotovs: 1, rehenes: 1 },
  museo:          { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 4, latas: 3, molotovs: 2, rehenes: 2 },
  joyeria:        { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 2, molotovs: 1, rehenes: 0 },
  subteprincipal: { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4, molotovs: 1, rehenes: 1 },
  subtebahamas:   { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4, molotovs: 1, rehenes: 1 },
  subtegaraje:    { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4, molotovs: 1, rehenes: 1 },
  subteaero:      { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 4, molotovs: 1, rehenes: 1 },
  carniceria:     { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 4, latas: 8, molotovs: 3, rehenes: 3 },
  estadio:        { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3, molotovs: 1, rehenes: 2 },
  yate:           { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 2, latas: 3, molotovs: 3, rehenes: 1 },
  fabrica:        { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 8, latas: 6, molotovs: 6, rehenes: 2 },
  rancho:         { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 3, latas: 4, molotovs: 2, rehenes: 2 },
  fundidora:      { armamento: 'Pistolas, Escopetas, Subfusiles, Fusiles',         humos: 3, latas: 4, molotovs: 2, rehenes: 2 },
  secuestro:      { armamento: 'Pistolas, Escopetas, Subfusiles',                  humos: 2, latas: 3, molotovs: 1, rehenes: 0 },
};

// ==================== FUNCION DE ASIGNACION ====================
async function asignarPersonal(interaction, roboKey, robo, ubicacion) {
  const guild = interaction.guild;
  const canalDestino = await guild.channels.fetch(robo.canal);
  const minRequerido = robo.min;

  let individuales = [];
  let gruposPatrulla = [];

  for (const canalId of CANALES_INDIVIDUALES) {
    try {
      const canal = await guild.channels.fetch(canalId);
      if (canal && canal.members) {
        canal.members.forEach(m => {
          if (m.voice?.channelId) individuales.push(m);
        });
      }
    } catch (e) {}
  }

  for (const canalId of CANALES_PATRULLA) {
    try {
      const canal = await guild.channels.fetch(canalId);
      if (canal && canal.members && canal.members.size > 0) {
        const grupo = [...canal.members.values()].filter(m => m.voice?.channelId);
        if (grupo.length > 0) gruposPatrulla.push(grupo);
      }
    } catch (e) {}
  }

  let asignados = [];
  let restante = minRequerido;

  for (const persona of individuales) {
    if (restante <= 0) break;
    asignados.push(persona);
    restante--;
  }

  if (restante > 0) {
    for (const grupo of gruposPatrulla) {
      if (restante <= 0) break;
      asignados.push(...grupo);
      restante = Math.max(0, restante - grupo.length);
    }
  }

  const totalDisponible = individuales.length + gruposPatrulla.reduce((acc, g) => acc + g.length, 0);

  if (asignados.length === 0) {
    await interaction.editReply({ content: '❌ **Personal insuficiente.** Se necesitan **' + minRequerido + '** agentes para **' + robo.nombre + '** pero solo hay **' + totalDisponible + '** disponibles.' });
    return;
  }

  const movidos = [], errores = [];
  for (const persona of asignados) {
    try {
      // Solo se puede mover si esta en un canal de voz
      if (!persona.voice?.channelId) {
        errores.push(persona.displayName + ' (sin voz)');
        continue;
      }
      await persona.voice.setChannel(robo.canal);
      movidos.push(persona);
    } catch (e) { errores.push(persona.displayName); }
  }

  try { await canalDestino.setStatus(ubicacion); } catch (e) {}

  const info = INFO_ROBOS[roboKey];
  const rehenes = info.rehenes > 0 ? info.rehenes + ' máx.' : 'No permitidos';

  const embed = new EmbedBuilder()
    .setTitle('🚨 ASIGNACIÓN — ' + robo.nombre.toUpperCase())
    .setDescription('📍 **' + ubicacion + '**')
    .addFields(
      { name: '👮 Agentes asignados', value: movidos.map(m => '<@' + m.id + '>').join('\n') || 'Ninguno', inline: false },
      { name: '📊 Asignados',        value: movidos.length + ' / ' + minRequerido + ' mín.', inline: true },
      { name: '🎯 Canal',            value: '<#' + robo.canal + '>', inline: true },
      { name: '\u200B',              value: '\u200B', inline: false },
      { name: '🔫 Armamento',        value: info.armamento, inline: false },
      { name: '💨 Humos',            value: String(info.humos),    inline: true },
      { name: '🥫 Latas',            value: String(info.latas),    inline: true },
      { name: '🔥 Molotovs',         value: String(info.molotovs), inline: true },
      { name: '🧑 Rehenes',          value: rehenes,               inline: true },
    )
    .setColor(0xCC2222).setTimestamp()
    .setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });

  if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });

  await interaction.editReply({ embeds: [embed] });
}

// ==================== READY ====================
client.once('ready', async () => {
  console.log('H50 Bot conectado: ' + client.user.tag);

  const commands = Object.entries(ROBOS).map(([key, robo]) =>
    new SlashCommandBuilder()
      .setName(key)
      .setDescription('Asignar personal: ' + robo.nombre)
      .toJSON()
  );

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('Comandos registrados: ' + commands.length);
  } catch (err) { console.error('Error registrando comandos:', err); }
});

// ==================== INTERACTIONS ====================
client.on('interactionCreate', async (interaction) => {

  // Modal tienda submit
  if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_tienda_')) {
    const roboKey = interaction.customId.replace('modal_tienda_', '');
    const robo = ROBOS[roboKey];
    const ubicacion = interaction.fields.getTextInputValue('ubicacion_tienda');
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.voice?.channelId !== CANAL_H50) {
      await interaction.reply({ content: '❌ Ya no estás en el canal H-50.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    await asignarPersonal(interaction, roboKey, robo, ubicacion);
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const roboKey = interaction.commandName;
  const robo = ROBOS[roboKey];
  if (!robo) return;

  // Verificar canal H50
  const member = await interaction.guild.members.fetch(interaction.user.id);
  if (member.voice?.channelId !== CANAL_H50) {
    await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal de voz **H-50**.', ephemeral: true });
    return;
  }

  // Tiendas: abrir modal
  if (TIENDAS.includes(roboKey)) {
    const modal = new ModalBuilder()
      .setCustomId('modal_tienda_' + roboKey)
      .setTitle('Asignar — ' + robo.nombre);
    modal.addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId('ubicacion_tienda')
          .setLabel('Nombre del robo específico')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Ej: Licorería Vespucio, 24/7 del Puerto...')
          .setRequired(true)
          .setMaxLength(80)
      )
    );
    await interaction.showModal(modal);
    return;
  }

  // Resto de robos: asignar directo
  await interaction.deferReply({ ephemeral: true });
  await asignarPersonal(interaction, roboKey, robo, robo.nombre);
});

client.login(process.env.TOKEN);
