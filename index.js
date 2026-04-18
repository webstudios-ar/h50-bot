require('dotenv').config();
const {
  Client, GatewayIntentBits, REST, Routes,
  SlashCommandBuilder, ActionRowBuilder, EmbedBuilder
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
const CANAL_SECUESTRO    = '1363375107078361098';
const CANAL_ESPERANDO    = '1355660648910032976';

// Registro de origen: { canalRobo: { userId: canalOrigen } }
const origenPersonal = {};

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
  tienda1:        { canal: '1362914142851436774', nombre: 'Tienda 1',             min: 1  },
  tienda2:        { canal: '1453978522875068426', nombre: 'Tienda 2',             min: 1  },
  tienda3:        { canal: '1362913398827913416', nombre: 'Tienda 3',             min: 1  },
  facebook:       { canal: '1362287835587154071', nombre: 'Facebook',             min: 4  },
  bancocentral:   { canal: '1362513426651283709', nombre: 'Banco Central',        min: 7  },
  humane:         { canal: '1365399784508227584', nombre: 'Humane',               min: 7  },
  fleecacosta:    { canal: '1374468389493280828', nombre: 'Fleeca Costa',         min: 3  },
  fleecalife:     { canal: '1365400107440275526', nombre: 'Fleeca Life',          min: 3  },
  fleecataller:   { canal: '1362513464672649437', nombre: 'Fleeca Taller',        min: 3  },
  fleecapaleto:   { canal: '1378143656761884754', nombre: 'Fleeca Paleto',        min: 3  },
  fleecaayunta:   { canal: '1362513448189169735', nombre: 'Fleeca Ayuntamiento',  min: 3  },
  fleecasandy:    { canal: '1398041090694582333', nombre: 'Fleeca Sandy Shores',  min: 3  },
  mazebank:       { canal: '1362513386314662173', nombre: 'Maze Bank',            min: 2  },
  mansion:        { canal: '1362916819014258718', nombre: 'Mansión',              min: 3  },
  museo:          { canal: '1365400052058820853', nombre: 'Museo',                min: 5  },
  joyeria:        { canal: '1362916726840365296', nombre: 'Joyería',              min: 2  },
  subteprincipal: { canal: '1452721020984103044', nombre: 'Subte Principal',      min: 3  },
  subtebahamas:   { canal: '1452721517782896640', nombre: 'Subte Bahamas',        min: 3  },
  subtegaraje:    { canal: '1452721435117093065', nombre: 'Subte Garaje',         min: 3  },
  subteaero:      { canal: '1452721685043220583', nombre: 'Subte Aeropuerto',     min: 3  },
  carniceria:     { canal: '1362513481206730893', nombre: 'Carnicería',           min: 7  },
  estadio:        { canal: '1362916764370866247', nombre: 'Estadio',              min: 3  },
  yate:           { canal: '1362915313594794104', nombre: 'Yate',                 min: 4  },
  fabrica:        { canal: '1365400767678119996', nombre: 'Fábrica',              min: 7  },
  rancho:         { canal: '1363190192516759812', nombre: 'Rancho Abandonado',    min: 4  },
  fundidora:      { canal: '1403610575518302328', nombre: 'Fundidora',            min: 4  },
  secuestro:      { canal: '1363375107078361098', nombre: 'Secuestro',            min: 3  },
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
async function asignarPersonal(interaction, roboKey, robo, cantidad, ubicacion) {
  const guild = interaction.guild;
  const canalDestino = await guild.channels.fetch(robo.canal);

  let individuales = [];
  let gruposPatrulla = [];

  await guild.members.fetch();

  for (const canalId of CANALES_INDIVIDUALES) {
    const enCanal = guild.voiceStates.cache
      .filter(vs => vs.channelId === canalId && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);
    enCanal.forEach(m => individuales.push(m));
  }

  for (const canalId of CANALES_PATRULLA) {
    const grupo = guild.voiceStates.cache
      .filter(vs => vs.channelId === canalId && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);
    if (grupo.length > 0) gruposPatrulla.push(grupo);
  }

  const totalDisponible = individuales.length + gruposPatrulla.reduce((acc, g) => acc + g.length, 0);

  if (totalDisponible === 0) {
    await interaction.editReply({ content: '❌ No hay personal disponible en los canales de espera.' });
    return;
  }

  let asignados = [];
  let restante = cantidad;

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

  // Guardar canal de origen antes de mover
  if (!origenPersonal[robo.canal]) origenPersonal[robo.canal] = {};
  for (const persona of asignados) {
    origenPersonal[robo.canal][persona.id] = persona.voice?.channelId;
  }

  const movidos = [], errores = [];
  for (const persona of asignados) {
    try {
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
      { name: '📊 Asignados',        value: movidos.length + ' / ' + cantidad + ' pedidos', inline: true },
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

  const commands = Object.entries(ROBOS).map(([key, robo]) => {
    const cmd = new SlashCommandBuilder()
      .setName(key)
      .setDescription('Asignar personal: ' + robo.nombre)
      .addIntegerOption(o => o
        .setName('cantidad')
        .setDescription('Cantidad de agentes a asignar')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(20)
      );

    // Solo tiendas tienen opcion de ubicacion
    if (TIENDAS.includes(key)) {
      cmd.addStringOption(o => o
        .setName('ubicacion')
        .setDescription('Nombre del lugar (ej: Licorería Vespucio)')
        .setRequired(true)
      );
    }

    return cmd.toJSON();
  });

  // /liberar y /cancelar con opcion de robo
  const robosChoices = Object.entries(ROBOS).map(([key, robo]) => ({ name: robo.nombre, value: key }));

  commands.push(
    new SlashCommandBuilder()
      .setName('liberar')
      .setDescription('Mueve a todos del canal del robo a Esperando Asignación')
      .addStringOption(o => o
        .setName('robo')
        .setDescription('El robo a liberar')
        .setRequired(true)
        .addChoices(...robosChoices.slice(0, 25))
      )
      .toJSON()
  );

  commands.push(
    new SlashCommandBuilder()
      .setName('secuestro_total')
      .setDescription('Manda TODO el personal disponible al canal de Secuestro (menos H-50)')
      .toJSON()
  );

  commands.push(
    new SlashCommandBuilder()
      .setName('patrullar')
      .setDescription('Divide el personal de Esperando Asignación en los canales de patrulla (mín. 2 por canal)')
      .toJSON()
  );

  commands.push(
    new SlashCommandBuilder()
      .setName('cancelar')
      .setDescription('Devuelve a cada persona al canal donde estaba antes')
      .addStringOption(o => o
        .setName('robo')
        .setDescription('El robo a cancelar')
        .setRequired(true)
        .addChoices(...robosChoices.slice(0, 25))
      )
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
  if (!interaction.isChatInputCommand()) return;

  // /secuestro_total
  if (interaction.commandName === 'secuestro_total') {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.voice?.channelId !== CANAL_H50) {
      await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal de voz **H-50**.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });

    // Recolectar TODOS los que están en voz menos los del H-50 y el canal de secuestro
    const todosEnVoz = interaction.guild.voiceStates.cache
      .filter(vs => vs.channelId !== CANAL_H50 && vs.channelId !== CANAL_SECUESTRO && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);

    if (todosEnVoz.length === 0) {
      await interaction.editReply({ content: '❌ No hay personal disponible para mover al Secuestro.' });
      return;
    }

    const movidos = [], errores = [];
    for (const persona of todosEnVoz) {
      try {
        await persona.voice.setChannel(CANAL_SECUESTRO);
        movidos.push(persona);
      } catch (e) { errores.push(persona.displayName); }
    }

    const embed = new EmbedBuilder()
      .setTitle('🚨 SECUESTRO — TODO EL PERSONAL')
      .setDescription('Se movió a **todo** el personal disponible al canal de Secuestro.')
      .addFields(
        { name: '👮 Personal movilizado', value: movidos.map(m => '<@' + m.id + '>').join('\n') || 'Ninguno', inline: false },
        { name: '📊 Total', value: movidos.length + ' agentes', inline: true }
      )
      .setColor(0xCC0000).setTimestamp()
      .setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });

    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  // /patrullar
  if (interaction.commandName === 'patrullar') {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.voice?.channelId !== CANAL_H50) {
      await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal de voz **H-50**.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });

    // Tomar solo los que están en Esperando Asignación
    const enEspera = interaction.guild.voiceStates.cache
      .filter(vs => vs.channelId === CANAL_ESPERANDO && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);

    if (enEspera.length < 2) {
      await interaction.editReply({ content: '❌ Se necesitan al menos **2** personas en Esperando Asignación para patrullar.' });
      return;
    }

    // Mezclar aleatoriamente
    const shuffled = enEspera.sort(() => Math.random() - 0.5);

    // Calcular cuántos canales usar (mínimo 2 por canal)
    const maxCanales = Math.floor(shuffled.length / 2);
    const canalesAUsar = CANALES_PATRULLA.slice(0, Math.min(maxCanales, CANALES_PATRULLA.length));
    const cantCanales = canalesAUsar.length;

    // Dividir equitativamente — los extras van a los primeros canales
    const base = Math.floor(shuffled.length / cantCanales);
    const extras = shuffled.length % cantCanales;

    const grupos = [];
    let idx = 0;
    for (let i = 0; i < cantCanales; i++) {
      const cantidad = base + (i < extras ? 1 : 0);
      grupos.push(shuffled.slice(idx, idx + cantidad));
      idx += cantidad;
    }

    const movidos = [], errores = [];
    for (let i = 0; i < grupos.length; i++) {
      for (const persona of grupos[i]) {
        try {
          await persona.voice.setChannel(canalesAUsar[i]);
          movidos.push({ persona, canal: canalesAUsar[i] });
        } catch (e) { errores.push(persona.displayName); }
      }
    }

    const descripcion = grupos.map((g, i) =>
      '**Canal ' + (i+1) + '** (' + g.length + ' agentes): ' + g.map(m => '<@' + m.id + '>').join(', ')
    ).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🚔 PATRULLA ASIGNADA')
      .setDescription(descripcion)
      .addFields(
        { name: '📊 Total asignados', value: movidos.length + ' agentes en ' + cantCanales + ' grupos', inline: true }
      )
      .setColor(0x2266CC).setTimestamp()
      .setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });

    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  // /liberar
  if (interaction.commandName === 'liberar') {
    const roboKey = interaction.options.getString('robo');
    const robo = ROBOS[roboKey];
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.voice?.channelId !== CANAL_H50) {
      await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal de voz **H-50**.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    const enCanal = interaction.guild.voiceStates.cache
      .filter(vs => vs.channelId === robo.canal && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);
    if (enCanal.length === 0) {
      await interaction.editReply({ content: '❌ No hay nadie en el canal de **' + robo.nombre + '**.' });
      return;
    }
    const movidos = [], errores = [];
    for (const persona of enCanal) {
      try {
        await persona.voice.setChannel(CANALES_INDIVIDUALES[0]); // Esperando Asignacion
        movidos.push(persona);
      } catch (e) { errores.push(persona.displayName); }
    }
    // Limpiar registro de origen
    delete origenPersonal[robo.canal];
    const embed = new EmbedBuilder()
      .setTitle('✅ LIBERADOS — ' + robo.nombre.toUpperCase())
      .setDescription('El siguiente personal fue devuelto a **Esperando Asignación**:')
      .addFields({ name: '👮 Personal liberado', value: movidos.map(m => '<@' + m.id + '>').join('\n') || 'Ninguno', inline: false })
      .setColor(0x00CC66).setTimestamp()
      .setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });
    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  // /cancelar
  if (interaction.commandName === 'cancelar') {
    const roboKey = interaction.options.getString('robo');
    const robo = ROBOS[roboKey];
    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member.voice?.channelId !== CANAL_H50) {
      await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal de voz **H-50**.', ephemeral: true });
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    const enCanal = interaction.guild.voiceStates.cache
      .filter(vs => vs.channelId === robo.canal && vs.member && !vs.member.user.bot)
      .map(vs => vs.member);
    if (enCanal.length === 0) {
      await interaction.editReply({ content: '❌ No hay nadie en el canal de **' + robo.nombre + '**.' });
      return;
    }
    const origenes = origenPersonal[robo.canal] || {};
    const movidos = [], errores = [];
    for (const persona of enCanal) {
      const canalOrigen = origenes[persona.id] || CANALES_INDIVIDUALES[0];
      try {
        await persona.voice.setChannel(canalOrigen);
        movidos.push({ persona, canalOrigen });
      } catch (e) { errores.push(persona.displayName); }
    }
    delete origenPersonal[robo.canal];
    const embed = new EmbedBuilder()
      .setTitle('↩️ CANCELADO — ' + robo.nombre.toUpperCase())
      .setDescription('El robo fue cancelado. Personal devuelto a su canal de origen:')
      .addFields({ name: '👮 Personal devuelto', value: movidos.map(({ persona, canalOrigen }) => '<@' + persona.id + '> → <#' + canalOrigen + '>').join('\n') || 'Ninguno', inline: false })
      .setColor(0xFFAA00).setTimestamp()
      .setFooter({ text: 'H50 Bot  •  Sistema de Asignación' });
    if (errores.length > 0) embed.addFields({ name: '⚠️ No se pudieron mover', value: errores.join(', '), inline: false });
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  const roboKey = interaction.commandName;
  const robo = ROBOS[roboKey];
  if (!robo) return;

  // Verificar canal H50
  const member = await interaction.guild.members.fetch(interaction.user.id);
  if (member.voice?.channelId !== CANAL_H50) {
    await interaction.reply({ content: '❌ Solo podés usar este comando desde el canal de voz **H-50**.', ephemeral: true });
    return;
  }

  const cantidad  = interaction.options.getInteger('cantidad');
  const ubicacion = TIENDAS.includes(roboKey)
    ? interaction.options.getString('ubicacion')
    : robo.nombre;

  await interaction.deferReply({ ephemeral: true });
  await asignarPersonal(interaction, roboKey, robo, cantidad, ubicacion);
});

client.login(process.env.TOKEN);
