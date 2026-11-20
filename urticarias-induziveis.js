/* Urticárias crônicas induzíveis: síntese operacional, fontes por método.
   O conteúdo também é lido pela auditoria clínica diária. */
(function () {
  'use strict';
  const UCI = {
    reviewedAt: '2026-11-18',
    references: {
      ucare: { label: 'UCARE4U. Gatilhos, subtipos e testes de provocação', url: 'https://ucare-4u.com/about-urticaria/triggers-and-types/', section: 'Chronic inducible urticaria e seções de cada subtipo' },
      algorithm: { label: 'MAURER, M. et al. Algoritmo para diagnóstico e tratamento das UCInd. Allergy, v. 79, p. 2573–2576, 2024', url: 'https://doi.org/10.1111/all.16250', section: 'p. 2573–2574, Figura 1 e Tabela 1' },
      consensus: { label: 'MAGERL, M. et al. Consenso EAACI/GA²LEN/EDF/UNEV sobre UCInd. Allergy, v. 71, p. 780–802, 2016', url: 'https://doi.org/10.1111/all.12884', section: 'Provocation testing; protocolos e fichas de limiar por subtipo' },
      international: { label: 'ZUBERBIER, T. et al. Diretriz internacional de urticária. Allergy, 2026', url: 'https://doi.org/10.1111/all.70210', section: 'Classificação; investigação diagnóstica das urticárias induzíveis' },
      asbai: { label: 'DIAS, G. A. C. et al. Atualização do Guia Prático da ASBAI. Arq Asma Alerg Imunol, v. 8, n. 2, p. 91–115, 2024', url: 'https://aaai-asbai.org.br/article/doi/10.5935/2526-5393.20230082', section: 'Tabela 2; urticária crônica induzida' },
      aaaai: { label: 'BERNSTEIN, J. A. et al. AAAAI/ACAAI: diagnóstico e manejo das urticárias. J Allergy Clin Immunol, v. 133, p. 1270–1277, 2014', url: 'https://doi.org/10.1016/j.jaci.2014.02.036', section: 'Physical urticaria/angioedema; diagnóstico diferencial' },
      prick: { label: 'AAAAI. Procedimentos de consultório: testes cutâneos', url: 'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Practice%20Management/Running%20a%20Practice/Chapter-8-Common-office-procedures.pdf', section: 'Skin testing: controles, leitura e interpretação' },
      fric: { label: 'SCHOEPKE, N. et al. Validação do FricTest 4.0. Clin Exp Dermatol, v. 40, p. 399–403, 2015', url: 'https://doi.org/10.1111/ced.12547', section: 'Método e limiar de provocação do dermografismo sintomático' },
      cold: { label: 'BIZJAK, M. Urticária ao frio: das urticas à anafilaxia. Allergy Asthma Immunol Res, v. 17, p. 547–562, 2025', url: 'https://doi.org/10.4168/aair.2025.17.5.547', section: 'Standard CST; interpretação dos limiares e risco de anafilaxia' },
      stairs: { label: 'AZIZI, G. G. et al. Teste de provocação em escada — Azizi-Valle. Eur Ann Allergy Clin Immunol, 2026; publicação on-line antecipada em 2024', url: 'https://pubmed.ncbi.nlm.nih.gov/39745416/', section: 'Método: incremento de frequência cardíaca e interrupção do teste' },
      ergometry: { label: 'ALTRICHTER, S. et al. Desenvolvimento da ergometria controlada por pulso para urticária colinérgica. J Dermatol Sci, 2014', url: 'https://www.jdsjournal.com/article/S0923-1811(14)00101-7/abstract', section: 'Protocolo incremental de 30 minutos' },
      contact: { label: 'BIZJAK, M. et al. Urticária de contato e condições relacionadas. Contact Dermatitis, v. 93, p. 87–107, 2025', url: 'https://doi.org/10.1111/cod.14794', section: 'Tabela 4; testes não invasivos e invasivos; interpretação e segurança' },
      contact2022: { label: 'Síndrome de urticária de contato: revisão abrangente. Curr Dermatol Rep, v. 11, p. 194–201, 2022', url: 'https://doi.org/10.1007/s13671-022-00379-0', section: 'Sequência diagnóstica; scratch e scratch-chamber' },
      aquagenic: { label: 'Urticária aquagênica diagnosticada por teste de provocação com água. Ann Dermatol, v. 29, p. 341–345, 2017', url: 'https://doi.org/10.5021/ad.2017.29.3.341', section: 'Teste de compressa por 20 minutos e diagnóstico diferencial' }
    },
    preparation: [
      ['Defina a pergunta', 'Quadro recorrente por mais de 6 semanas, reproduzido por um gatilho definido. Registre exposição, latência, duração, prurido/dor, fotografias e manifestações sistêmicas. UCInd e urticária crônica espontânea podem coexistir; investigue todos os gatilhos relatados.'],
      ['Medicamentos e finalidade do teste', 'Para diagnóstico sem tratamento, anti-H1 geralmente precisam de suspensão por pelo menos 3 dias; algumas moléculas exigem 5–7 dias. Registre nome, dose e última tomada. O algoritmo de 2024 cita 7 dias para corticosteroide sistêmico: não interromper uso prolongado abruptamente; programar o exame após retirada clinicamente segura. Omalizumabe, outros biológicos e imunossupressores podem reduzir a resposta. Não há um intervalo universal de 6 meses obrigatório para todos os testes; documente o tratamento. Testes durante terapia podem medir resposta e limiar sob tratamento, sem excluir o diagnóstico se negativos.'],
      ['Pele e condições basais', 'Escolha pele íntegra, sem urticas no local nas últimas 24 horas. Evite área em período refratário após provocação recente. Anote temperatura ambiente, local anatômico e condições do equipamento. Para colinérgica: pelo menos 24 horas sem sintomas e aclimatação antes do esforço.'],
      ['Quando adiar ou mudar o ambiente', 'Adie em asma não controlada, instabilidade cardiovascular, doença aguda importante, anafilaxia ainda não estabilizada ou impossibilidade de realizar o estímulo com segurança. Anafilaxia prévia ao gatilho, edema de orofaringe pelo frio ou suspeita de anafilaxia por exercício exigem planejamento em serviço experiente; não iniciar uma provocação extensa de consultório.'],
      ['Segurança e interrupção', 'Realizar por equipe treinada, com adrenalina, oxigênio, monitorização e suporte de emergência disponíveis. Interrompa diante de sintomas respiratórios, circulatórios, laríngeos ou reação generalizada. Se anafilaxia: adrenalina 1 mg/mL, 0,01 mg/kg IM na coxa (0,01 mL/kg), máximo 0,5 mg por dose; repetir em 5–15 minutos se necessário e acionar suporte. A observação após o teste depende do gatilho, dos sintomas e da reação ocorrida.']
    ],
    subtypes: [
      {
        id: 'dermografismo', group: 'fisicas', title: 'Dermografismo sintomático', icon: 'friction', trigger: 'Atrito / cisalhamento', quick: 'Leitura em 10 min',
        tests: [{
          name: 'FricTest 4.0 ou dermografômetro',
          material: 'FricTest 4.0 ou dermografômetro calibrado, régua milimetrada e cronômetro.',
          site: 'Face volar do antebraço; dorso superior é uma alternativa para dermografômetro.',
          steps: ['FricTest: apoiar perpendicularmente, com as quatro pontas tocando a pele por igual, e deslizar uma vez em linha reta por cerca de 6 cm.', 'Dermografômetro: produzir traços separados de aproximadamente 10 cm, com pressões de 20, 36 e 60 g/mm², sem lesar a pele. Registrar pressão e instrumento.'],
          reading: '10 minutos após o traço; medir a largura transversal da urtica e registrar prurido.',
          positive: 'Urtica linear palpável acompanhada de prurido. No FricTest, largura ≥3 mm é o critério usual. Eritema isolado ou dermografismo sem prurido não confirma o subtipo sintomático.',
          threshold: 'Menor estímulo/ponta ou pressão que produz urtica com prurido. As escalas de dispositivos diferentes não são intercambiáveis.',
          alternative: 'Objeto de ponta romba pode demonstrar a reação, mas não fornece limiar calibrado: passar suavemente no antebraço ou dorso e ler em 10 minutos, sem arranhar.',
          negative: 'Rever anti-H1, local em período refratário e força aplicada; se a história for convincente, repetir com instrumento calibrado em outra ocasião.',
          safety: 'Não usar ponta cortante nem interpretar marca traumática como urtica.', references: ['fric', 'consensus', 'asbai']
        }]
      },
      {
        id: 'pressao', group: 'fisicas', title: 'Urticária de pressão tardia', icon: 'pressure', trigger: 'Pressão sustentada', quick: 'Leitura principal em 6 h',
        tests: [{
          name: 'Pressão padronizada com dermografômetro ou peso',
          material: 'Dermografômetro calibrado ou dispositivo de haste/peso com massa e área de contato conhecidas; cronômetro, régua e marcação da área.',
          site: 'Dorso superior com dermografômetro; face volar do antebraço/coxa com haste, conforme o dispositivo.',
          steps: ['Dermografômetro: aplicar perpendicularmente 100 g/mm² durante 70 segundos na região escapular.', 'Alternativa com peso: aplicar verticalmente haste de 5 kg, com aplicador de 5,5 cm de diâmetro, durante 15 minutos, sustentada por estrutura própria. Registrar diâmetro e área do aplicador, além da massa; 5 kg isoladamente não define a pressão.', 'Outro método publicado utiliza 7 kg suspensos sobre o ombro por alça de 3 cm durante 15 minutos. Escolher um método e manter a mesma geometria nas reavaliações.'],
          reading: 'Programar leitura presencial principal em 6 horas; observar a partir de 4 horas. Se a história indicar latência maior, documentar também a evolução até 24 horas. Leitura imediata isolada não exclui este diagnóstico.',
          positive: 'Edema profundo palpável e eritema no local pressionado, frequentemente com dor ou queimação, surgindo tardiamente.',
          threshold: 'Menor pressão/carga efetiva, com área e duração registradas, que reproduz edema tardio. Não comparar limiares obtidos com alças ou hastes de áreas diferentes.',
          alternative: 'Técnica de Warin: 4 kg por 5 minutos, com alça de 3 cm e esfera de 1,5 cm; registrar o método e os parâmetros, sem misturar com o protocolo de 15 minutos.',
          negative: 'Confirmar que a leitura tardia foi realizada; rever período refratário e tratamento. Repetir em outro dia se a história e as fotografias forem típicas.',
          safety: 'Evitar lesão mecânica, carga improvisada e áreas com alterações vasculares, neuropatia ou fragilidade cutânea.', references: ['consensus', 'ucare', 'asbai']
        }]
      },
      {
        id: 'frio', group: 'fisicas', title: 'Urticária ao frio', icon: 'cold', trigger: 'Resfriamento / reaquecimento', quick: '5 min de estímulo + 10 min',
        tests: [{
          name: 'Cubo de gelo e TempTest',
          material: 'Gelo em derretimento dentro de saco plástico fino, seco externamente, ou luva sem látex; TempTest, cronômetro e régua.',
          site: 'Face volar do antebraço, sem lesão recente.',
          steps: ['Aplicar o cubo protegido na pele por 5 minutos, mantendo a água separada da pele. Retirar e permitir reaquecimento à temperatura ambiente.', 'TempTest: manter contato por 5 minutos; o gradiente do modelo 4.0 é de 4–44 °C. Ler a resposta às temperaturas frias após a retirada.'],
          reading: '10 minutos após retirar o estímulo. Registrar a reação durante o reaquecimento.',
          positive: 'Urtica palpável no local resfriado, com ou sem prurido/queimação. Vermelhidão isolada não basta.',
          threshold: 'TempTest: temperatura mais alta que ainda produz urtica (limiar crítico de temperatura). Gelo: menor tempo de contato que desencadeia urtica, usando áreas separadas e exposições graduadas, por exemplo 30 segundos a 5 minutos, após avaliação de risco.',
          alternative: 'Se disponível, usar os dois métodos em resultados discordantes; eles podem identificar pacientes diferentes.',
          negative: 'Teste padrão negativo não exclui forma atípica. Rever gatilho, medicamentos e fotografias; provocação modificada deve ser planejada em serviço experiente.',
          safety: 'Não usar banho frio, imersão corporal ou natação como teste de rotina. Anafilaxia prévia e edema orofaríngeo após bebidas/alimentos frios indicam maior risco; reduzir exposição inicial e definir estrutura de suporte.', references: ['cold', 'ucare', 'consensus']
        }]
      },
      {
        id: 'calor', group: 'fisicas', title: 'Urticária ao calor', icon: 'heat', trigger: 'Calor em contato local', quick: '5 min de estímulo + 10 min',
        tests: [{
          name: 'TempTest ou cilindro de água aquecida',
          material: 'TempTest; ou cilindro de vidro/metal com água a 45 °C e termômetro confiável. Cronômetro e régua.',
          site: 'Face volar do antebraço.',
          steps: ['Aplicar calor local durante 5 minutos, sem aquecer o corpo inteiro. No cilindro, verificar e manter a temperatura de 45 °C durante o contato.', 'Com TempTest 4.0, usar o setor quente disponível, até 44 °C; documentar modelo e temperatura efetivamente testada.'],
          reading: '10 minutos após retirar a fonte de calor.',
          positive: 'Urtica palpável e pruriginosa ou com queimação, restrita à área aquecida. Eritema térmico isolado não é positivo.',
          threshold: 'Menor temperatura que induz urtica, com duração fixa de 5 minutos. O limite do equipamento deve constar no laudo: teste até 44 °C não avalia temperaturas mais altas.',
          alternative: 'Diferenciar da urticária colinérgica: nesta, elevação da temperatura corporal/sudorese provoca múltiplas pápulas além da área de contato.',
          negative: 'Se a história sugerir calor local, rever temperatura real, duração e medicamentos; avaliar forma tardia ou limiar fora da faixa do equipamento.',
          safety: 'Não aumentar a temperatura sem controle ou usar água escaldante. Inspecionar sensibilidade cutânea e interromper se dor térmica ou lesão.', references: ['consensus', 'ucare', 'asbai']
        }]
      },
      {
        id: 'solar', group: 'fisicas', title: 'Urticária solar', icon: 'sun', trigger: 'UVA / UVB / luz visível', quick: 'Leitura imediata e em 10 min',
        tests: [{
          name: 'Fototeste e dose urticariante mínima',
          material: 'Fontes médicas calibradas de UVA, UVB e luz visível; radiômetro/dosimetria, proteção ocular e máscaras com pequenas janelas.',
          site: 'Nádegas ou dorso habitualmente cobertos, sem bronzeamento recente na área.',
          steps: ['Testar UVA, UVB e luz visível separadamente em áreas pequenas. Protocolos de referência utilizam UVA 6 J/cm² e UVB 60 mJ/cm² na investigação inicial; iniciar com dose inferior quando a história indicar alta sensibilidade.', 'Para limiar, irradiar janelas separadas com doses graduadas. Exemplo de série: UVA 2,4 / 3,3 / 4,2 / 5,1 / 6,0 J/cm²; UVB 24 / 33 / 42 / 51 / 60 mJ/cm², com ajuste ao equipamento e à sensibilidade.', 'Calcular tempo = dose ÷ irradiância, usando unidades compatíveis. Potência nominal da lâmpada ou distância de 10 cm, isoladamente, não determina a dose; luz visível exige fonte com emissão e aquecimento controlados.'],
          reading: 'Inspecionar durante e imediatamente após a exposição, com leitura em 10 minutos. Registrar leituras adicionais se houver suspeita de resposta tardia.',
          positive: 'Urtica palpável na janela irradiada, geralmente com prurido ou ardor. Apenas eritema não confirma urticária solar.',
          threshold: 'Dose urticariante mínima (DUM / MUD): menor dose que produz urtica, informada separadamente por espectro. Não confundir com dose eritematosa mínima (DEM).',
          alternative: 'Definir o espectro de ação. Se somente uma faixa foi testada, não registrar fototeste global negativo.',
          negative: 'Rever anti-H1, exposição solar recente, espectro não testado e equipamento. Diferenciar erupção polimorfa à luz, fototoxicidade e reação ao calor.',
          safety: 'Serviço de fotodiagnóstico, áreas pequenas e suporte para reação sistêmica. Não substituir por exposição solar extensa.', references: ['consensus', 'ucare', 'aaaai']
        }]
      },
      {
        id: 'vibratoria', group: 'fisicas', title: 'Urticária / angioedema vibratório', icon: 'vibration', trigger: 'Vibração', quick: 'Método de 5 min; ler até 15 min',
        tests: [{
          name: 'Provocação com vórtex',
          material: 'Misturador tipo vórtex com plataforma apropriada, ajuste de rotação, cronômetro e fita métrica.',
          site: 'Face volar do antebraço; marcar os pontos de medida antes de começar.',
          steps: ['Medir circunferência no punho, terço médio e próximo ao cotovelo, mantendo os mesmos pontos para comparação.', 'No método de 5 minutos: apoiar o antebraço na plataforma vibratória a 1.000 rpm. Evitar pressão excessiva e registrar aparelho, rotação e duração.'],
          reading: 'Avaliar ao final e entre 5 e 15 minutos após a provocação; repetir as medidas nos mesmos pontos.',
          positive: 'Edema e/ou urticas palpáveis com prurido ou queimação, reproduzindo a queixa. Registrar a mudança de circunferência; não há corte único universal em centímetros para todos os dispositivos.',
          threshold: 'Registrar tempo até a reação e intensidade do estímulo. Não converter rpm isoladamente em limiar equivalente entre aparelhos.',
          alternative: 'O UCARE4U também descreve contato com vórtex por 10 minutos. Trata-se de outra duração: identificá-la no laudo, sem somá-la automaticamente ao método de 5 minutos.',
          negative: 'Rever intensidade real, transmissão da vibração e tratamento; diferenciar dermografismo, reação à pressão e angioedema por outros mecanismos. História familiar pode justificar avaliação da forma hereditária.',
          safety: 'Interromper diante de edema importante, dor ou sintomas generalizados. Não usar equipamento com superfície inadequada ou contato com partes móveis.', references: ['ucare', 'consensus', 'asbai']
        }]
      },
      {
        id: 'colinergica', group: 'nao-fisicas', title: 'Urticária colinérgica', icon: 'exercise', trigger: 'Aquecimento corporal / sudorese', quick: 'Provocação até 30 min',
        tests: [{
          name: 'Ergometria controlada por frequência cardíaca',
          material: 'Bicicleta ergométrica ou esteira; monitor de frequência cardíaca, pressão arterial, temperatura, oximetria e suporte de emergência.',
          site: 'Observar tronco, pescoço e membros durante o esforço.',
          steps: ['Aclimatar por 20 minutos em ambiente de aproximadamente 20–23 °C. Registrar temperatura corporal, frequência cardíaca, pressão e saturação basais.', 'Incrementar a frequência cardíaca em 15 bpm a cada 5 minutos, até no máximo +90 bpm sobre o basal em 30 minutos, respeitando os limites clínicos do paciente.', 'Monitorar a cada 5 minutos. Interromper ao surgirem urticas típicas ou diante de qualquer sintoma de risco; não é necessário completar 30 minutos após positividade.'],
          reading: 'Durante o exercício e por 10 minutos após encerrá-lo; registrar tempo, frequência cardíaca, temperatura e sudorese no início da reação.',
          positive: 'Pápulas/urticas puntiformes, em geral de 1–4 mm, pruriginosas, com halo eritematoso e distribuição compatível. Sudorese ou eritema sem urticas não basta.',
          threshold: 'Tempo de exercício e frequência cardíaca no aparecimento das primeiras lesões, nas mesmas condições de teste. Aumento corporal ≥1 °C é critério do aquecimento passivo, não exigência adicional universal para considerar o exercício positivo.',
          alternative: 'Azizi-Valle: subir e descer escada supervisionada, usando a mesma progressão de +15 bpm a cada 5 minutos, até 30 minutos ou positividade. A escada deve permitir monitorização e interrupção segura.',
          negative: 'Rever intensidade, sudorese, anti-H1 e tratamento modificador. História de reação apenas com exercício, sobretudo com alimentos/cofatores ou sintomas sistêmicos, exige investigação de anafilaxia induzida por exercício.',
          safety: 'Não usar escada ou esforço sem supervisão em quem tem anafilaxia por exercício ou doença cardiopulmonar não controlada. Café/xantinas, álcool e simpaticomiméticos interferem no preparo; registrar exposições e não retirar broncodilatador necessário de forma insegura.', references: ['ergometry', 'stairs', 'ucare']
        }, {
          name: 'Aquecimento passivo para diagnóstico diferencial',
          material: 'Banho com temperatura controlada e medida da temperatura corporal, em estrutura de provocação supervisionada.',
          site: 'Observação corporal, com monitorização contínua.',
          steps: ['Se necessário após exercício positivo, realizar em outro dia, com intervalo mínimo de 24 horas e recuperação completa.', 'Protocolo clássico: banho a 42 °C por até 15 minutos, buscando aumento da temperatura corporal ≥1 °C; interromper antes se houver positividade ou sintomas.'],
          reading: 'Durante o aquecimento e logo após o término.',
          positive: 'Reprodução das urticas típicas por aquecimento sem exercício favorece urticária colinérgica.',
          threshold: 'Registrar temperatura basal, máxima, variação e tempo até a reação.',
          negative: 'Se houve exercício positivo e aquecimento passivo negativo, reavaliar anafilaxia induzida por exercício; o resultado isolado não define a etiologia.',
          safety: 'Este não é um teste para realizar em casa. Exposição corporal ao calor pode causar reação sistêmica; omitir quando o risco exceder o benefício.', references: ['consensus', 'aaaai']
        }]
      },
      {
        id: 'aquagenica', group: 'nao-fisicas', title: 'Urticária aquagênica', icon: 'water', trigger: 'Contato com água', quick: 'Compressa a 35–37 °C',
        tests: [{
          name: 'Compressa de água em temperatura neutra',
          material: 'Compressa ou toalha limpa, água a 35–37 °C, termômetro e cronômetro.',
          site: 'Tronco, preferencialmente dorso superior, ou local habitualmente afetado.',
          steps: ['Aplicar compressa embebida em água a 35–37 °C, sem fricção e sem exercer pressão significativa.', 'Método descrito no UCARE4U: contato por 5 minutos. Retirar antes se já surgirem urticas e registrar o tempo efetivo.'],
          reading: 'Durante a aplicação e até 10 minutos após a retirada.',
          positive: 'Urticas palpáveis pruriginosas, frequentemente pequenas e perifoliculares, na área exposta à água.',
          threshold: 'Tempo de contato até a reação, informando temperatura, tipo de água e área testada.',
          alternative: 'Se o método de 5 minutos for negativo e a suspeita persistir, há protocolo publicado de compressa por 20 minutos em temperatura corporal, com leitura durante e após. Identificar a duração efetiva no laudo, para permitir comparação entre avaliações.',
          negative: 'Prurido sem urticas sugere prurido aquagênico, que tem diagnóstico diferencial próprio. Rever urticária ao frio, ao calor, colinérgica e dermografismo provocado pela toalha.',
          safety: 'Evitar água fria ou muito quente, para não provocar outro subtipo. Não usar banho corporal como primeira provocação.', references: ['ucare', 'aquagenic', 'algorithm']
        }]
      },
      {
        id: 'contato', group: 'nao-fisicas', title: 'Urticária de contato', icon: 'contact', trigger: 'Agente em contato com a pele', quick: 'Teste aberto → investigação dirigida',
        introduction: 'Pode ser imunológica (IgE), não imunológica ou de mecanismo indefinido. Prick positivo demonstra sensibilização; a relação causal depende da história e da exposição. Reação isolada não estabelece cronicidade. Investigar a substância relevante e sua composição, evitando painéis indiscriminados.',
        flow: [
          ['1. História e risco', 'Reação imediata e localizada, sem história sistêmica: considerar teste aberto com composição conhecida. Anafilaxia, sintomas respiratórios ou urticária generalizada após contato: priorizar avaliação especializada, IgE específica quando disponível e planejamento de teste graduado; não aplicar produto puro como primeira etapa.'],
          ['2. Teste aberto', 'Positivo e compatível com a exposição: sustenta urticária de contato. Se negativo e persistir suspeita de mecanismo IgE, prosseguir com prick de extrato apropriado ou prick-to-prick. Eczema pode alterar a barreira; testar pele lesada não é uma etapa obrigatória.'],
          ['3. Puntura dirigida', 'Positivo com controles válidos e história compatível: sustenta sensibilização clinicamente relevante. Negativo não exclui mecanismo não IgE, extrato inadequado ou interferência de medicamento.'],
          ['4. Se a dúvida permanecer', 'Rever agente, concentração, veículo e contexto ocupacional. Scratch/scratch-chamber ficam restritos a situações selecionadas. Eczema tardio exige investigação de dermatite de contato; patch test com leitura tardia responde a outra pergunta.']
        ],
        tests: [{
          name: '1. Teste aberto e variante rub test',
          material: 'Agente de composição conhecida, em veículo e concentração não irritantes próprios da substância; material para marcar a área e cronômetro.',
          site: 'Pele íntegra na face volar do antebraço; evitar área eczematosa na avaliação inicial.',
          steps: ['Aplicar pequena quantidade em área delimitada, sem oclusão. A revisão de 2025 descreve 0,1 mL em área de 3 × 3 cm; começar com área/concentração menores se houver risco de reação.', 'Observar por 15–20 minutos. No rub test selecionado, friccionar suavemente o agente; incluir controle de fricção para não confundir dermografismo.'],
          reading: 'Durante o contato e em 15–20 minutos; se necessário, repetir a leitura em intervalos de 20 minutos até aproximadamente 60 minutos.',
          positive: 'Urtica palpável no local, usualmente com eritema e prurido. Eritema ou ardor isolados podem ser irritação e não confirmam urticária.',
          threshold: 'Registrar agente, fabricante/composição, concentração, veículo, quantidade, área e tempo de contato. Não existe uma diluição universal para cosméticos, alimentos, colas ou plantas.',
          negative: 'Se a história persistir, selecionar puntura/IgE específica para o suspeito. Não aumentar concentração nem lesar a pele automaticamente.',
          safety: 'Não testar produto de composição desconhecida, corrosivo ou em concentração irritante. História de anafilaxia exige estratégia individual com diluições e suporte.', references: ['contact', 'asbai', 'ucare']
        }, {
          name: '2. Teste de puntura — prick test',
          material: 'Extrato padronizado apropriado (ex.: látex), lancetas descartáveis; dicloridrato de histamina 10 mg/mL como controle positivo e o diluente do extrato como negativo. Solução salina 0,9% somente se for o veículo adequado.',
          site: 'Face volar do antebraço ou dorso íntegros.',
          steps: ['Identificar gotas separadas por pelo menos 2 cm (3–5 cm se necessário para evitar sobreposição). Incluir controles na mesma sessão.', 'Puncionar cada gota com lanceta própria, sem sangramento. Usar controle de histamina com concentração padronizada do produto; não confundir histamina-base e seus sais.', 'Medir o maior diâmetro da urtica e seu perpendicular; calcular a média (D + d) ÷ 2 para alérgeno e controles.'],
          reading: '15–20 minutos após a puntura.',
          positive: 'Diâmetro médio da urtica ≥3 mm maior que o controle negativo, com resposta adequada à histamina. Não exigir também que a urtica tenha metade do tamanho da histamina como regra universal.',
          threshold: 'Registrar diâmetros em mm, controles, extrato, concentração, lote e última tomada de anti-H1. Um resultado positivo não define gravidade futura.',
          negative: 'Histamina suprimida torna o negativo não interpretável. Reação importante ao controle negativo/dermografismo impede conclusão simples; repetir em condições válidas ou utilizar IgE específica.',
          safety: 'Risco sistêmico maior com alergia IgE grave: selecionar concentração e ambiente. Não fazer intradérmico com alimentos ou látex como continuação automática.', references: ['prick', 'contact', 'aaaai']
        }, {
          name: '3. Prick-to-prick / prick-by-prick',
          material: 'Alimento fresco suspeito, lancetas, dicloridrato de histamina 10 mg/mL e diluente/salina 0,9% como controles positivo e negativo; material de higiene. Registrar variedade, parte testada e estado cru/cozido.',
          site: 'Face volar do antebraço ou dorso íntegros.',
          steps: ['Indicar quando a história sugere reação a alimento fresco e o extrato comercial é ausente ou pouco sensível para alérgenos lábeis.', 'Puncionar o alimento e, em seguida, a pele com a mesma lanceta; usar outra lanceta para cada alimento e para os controles, evitando sangramento e contaminação.'],
          reading: '15–20 minutos, medindo os dois diâmetros como no prick test.',
          positive: 'Urtica com diâmetro médio ≥3 mm maior que o controle negativo, com histamina válida. Interpretar como sensibilização em conjunto com a reação de contato relatada.',
          threshold: 'Não é teste quantitativo padronizado entre alimentos, variedades ou preparações. Identificar precisamente o material usado.',
          negative: 'Rever alimento/parte/preparo, medicamentos e qualidade dos controles. Resultado isolado não libera ingestão nem exclui dermatite de contato à proteína.',
          safety: 'Pode ocorrer reação sistêmica; não reproduzir em casa. Não utilizar alimento contaminado ou agente desconhecido.', references: ['contact', 'contact2022', 'prick']
        }, {
          name: '4. Scratch e scratch-chamber — uso selecionado',
          material: 'Agente de composição conhecida e preparo não irritante, lanceta apropriada e controles; câmara de teste se houver indicação de scratch-chamber.',
          site: 'Antebraço ou dorso, conforme o protocolo especializado.',
          steps: ['Não é etapa obrigatória após teste aberto ou prick negativo: é menos padronizado e sujeito a resposta traumática/irritativa.', 'Quando escolhido por especialista, fazer escarificação superficial de aproximadamente 5 mm, sem sangramento, e aplicar pequena quantidade do agente.', 'Na variante scratch-chamber, manter o material em câmara por cerca de 15 minutos para reduzir evaporação; não confundir com patch test de leitura tardia.'],
          reading: '15–20 minutos; no método com câmara, registrar também o horário da retirada e da leitura.',
          positive: 'Urtica no local que excede a resposta ao controle de trauma/veículo, compatível com a história. Não transportar automaticamente o corte validado do prick para uma técnica não padronizada.',
          threshold: 'Não há concentração, quantidade ou critério universal validados para todos os agentes; registrar o protocolo efetivamente empregado e sua limitação.',
          negative: 'Não exclui urticária de contato. Reavaliar mecanismo, agente e diagnósticos alternativos.',
          safety: 'Não é alternativa mais segura por receio de infecção no prick-to-prick; há quebra de barreira, risco de irritação e reação sistêmica.', references: ['contact2022', 'contact']
        }]
      }
    ],
    reportTemplate: 'TESTE DE PROVOCAÇÃO — URTICÁRIA INDUZÍVEL\nPaciente: [nome / identificação] | Data e hora: [preencher]\nHipótese e gatilho: [preencher]\nHistória sistêmica e condições basais: [preencher]\nMedicações, última dose e finalidade (diagnóstico / resposta sob tratamento): [preencher]\nPele/local testado, ausência de lesões recentes e temperatura ambiente: [preencher]\nEquipamento, calibração, estímulo, intensidade/concentração, área e duração: [preencher]\nControles, quando aplicáveis: [preencher]\nHorário de retirada do estímulo e horários de leitura: [preencher]\nUrtica/edema, diâmetros em mm, prurido/dor e fotografias: [preencher]\nLimiar e unidade: [preencher / não determinado]\nIntercorrências, intervenções e observação: [preencher]\nConclusão: [positivo / negativo / inconclusivo], nas condições descritas.\nLimitações e próximo passo: [preencher]\n\nDr. Antônio Penido\nAlergia e Imunologia\nCRM-MG 59.766 | RQE 48.720'
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = UCI;
  if (typeof document === 'undefined') return;

  const icons = {
    friction: '<path d="m5 6 14 0M5 12h14M5 18h14"/><path d="m8 3-3 3 3 3m8 0 3 3-3 3m-8 0-3 3 3 3"/>',
    pressure: '<path d="M12 3v9m-4-4 4 4 4-4M4 17h16M6 21h12"/><rect x="5" y="14" width="14" height="3" rx="1"/>',
    cold: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M17 19l-1-4 4-1M4 14l4 1-1 4M17 5l-1 4 4 1"/>',
    heat: '<path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Z"/><path d="M12 8v10m7-12h2m-2 5h2"/><circle cx="12" cy="18" r="1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    vibration: '<path d="M4 6v12m4-15v18m4-13v8m4-13v18m4-15v12"/>',
    exercise: '<circle cx="15" cy="4" r="2"/><path d="m7 9 4-2 4 4 4 1m-8-5-1 7-5 6m5-6 5 2 1 5M3 5h5M2 12h4"/>',
    water: '<path d="M12 2C9 7 5 10 5 15a7 7 0 0 0 14 0c0-5-4-8-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
    contact: '<path d="M8 12V5a1.5 1.5 0 0 1 3 0v6-8a1.5 1.5 0 0 1 3 0v8-6a1.5 1.5 0 0 1 3 0v7-4a1.5 1.5 0 0 1 3 0v7c0 4-3 7-7 7-3 0-5-2-7-4l-3-4a1.5 1.5 0 0 1 2-2l3 2Z"/>'
  };
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function icon(name) {
    const holder = el('span', 'uci-icon');
    holder.setAttribute('aria-hidden', 'true');
    holder.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (icons[name] || icons.contact) + '</svg>';
    return holder;
  }
  function field(parent, label, value, kind) {
    const box = el('div', 'uci-field' + (kind ? ' uci-field-' + kind : ''));
    box.append(el('h5', 'uci-label', label), el('p', 'uci-value', value));
    parent.append(box);
  }
  function references(parent, ids) {
    const list = el('div', 'uci-sources');
    list.append(el('p', 'uci-label', 'Fontes deste método'));
    [...new Set(ids)].forEach(function (id) {
      const ref = UCI.references[id];
      const a = el('a', '', ref.label + ' ↗');
      a.href = ref.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const item = el('div', 'uci-source');
      item.append(a, el('span', '', ref.section)); list.append(item);
    });
    parent.append(list);
  }
  function testMethod(test) {
    const section = el('section', 'uci-method');
    section.append(el('h4', 'uci-method-title', test.name));
    field(section, 'Material', test.material);
    field(section, 'Local', test.site);
    const execution = el('div', 'uci-field');
    execution.append(el('h5', 'uci-label', 'Execução — passo a passo'));
    const steps = el('ol', 'uci-steps');
    test.steps.forEach(function (step) { steps.append(el('li', '', step)); });
    execution.append(steps); section.append(execution);
    field(section, 'Quando ler', test.reading, 'timing');
    field(section, 'Critério de positividade', test.positive, 'result');
    field(section, 'Como registrar o limiar', test.threshold);
    if (test.alternative) field(section, 'Alternativa / distinção entre métodos', test.alternative);
    field(section, 'Se o teste for negativo', test.negative);
    field(section, 'Cuidados específicos', test.safety, 'care');
    references(section, test.references);
    return section;
  }
  function subtypeCard(subtype) {
    const card = el('details', 'uci-card'); card.id = 'uci-' + subtype.id;
    const summary = el('summary', 'uci-summary');
    const text = el('span', 'uci-summary-text');
    text.append(el('span', 'uci-card-title', subtype.title), el('span', 'uci-card-trigger', subtype.trigger));
    summary.append(icon(subtype.icon), text, el('span', 'uci-expand', '+'));
    card.append(summary);
    const body = el('div', 'uci-card-body');
    body.append(el('p', 'uci-quick', subtype.quick));
    if (subtype.introduction) body.append(el('p', 'uci-introduction', subtype.introduction));
    if (subtype.flow) {
      const flow = el('ol', 'uci-decision');
      flow.setAttribute('aria-label', 'Fluxo de investigação da urticária de contato');
      subtype.flow.forEach(function (pair) {
        const li = el('li', ''); li.append(el('h4', '', pair[0]), el('p', '', pair[1])); flow.append(li);
      });
      body.append(flow);
    }
    subtype.tests.forEach(function (test) { body.append(testMethod(test)); });
    card.append(body);
    return card;
  }
  function render() {
    const root = document.getElementById('uci-root');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';
    root.replaceChildren();
    root.append(el('p', 'uci-review', 'Revisão do conteúdo: 18/11/2026 · UCARE como referência principal; ASBAI, EAACI e AAAAI/ACAAI como complementares.'));
    const lead = el('div', 'uci-lead');
    lead.append(el('p', '', 'Selecione o grupo e toque no subtipo. Material, execução, leitura, resultado e limiar abrem em páginas próprias.'), el('p', 'uci-care-lead', 'Provocações supervisionadas, com suporte para anafilaxia. Uma provocação negativa sob tratamento não exclui UCInd.'));
    root.append(lead);
    const prep = el('details', 'uci-preparation');
    prep.append(el('summary', '', 'Antes de começar — preparo, medicamentos e segurança'));
    const prepBody = el('div', 'uci-prep-body');
    UCI.preparation.forEach(function (pair) { field(prepBody, pair[0], pair[1]); });
    const emergency = el('button', 'uci-link-button', 'Abrir protocolo de anafilaxia'); emergency.type = 'button';
    emergency.addEventListener('click', function () { document.querySelector('.eaaci-q[data-ego="eaaci-0"]')?.click(); });
    prepBody.append(emergency); references(prepBody, ['algorithm', 'international', 'asbai', 'aaaai']);
    prep.append(prepBody); root.append(prep);
    const tabs = el('div', 'uci-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Grupos de urticárias induzíveis');
    const groups = [{ id: 'fisicas', title: 'Físicas', note: '6 subtipos' }, { id: 'nao-fisicas', title: 'Não físicas', note: '3 subtipos' }];
    const buttons = [], panels = [];
    groups.forEach(function (group, index) {
      const button = el('button', 'uci-tab'); button.type = 'button'; button.id = 'uci-tab-' + group.id;
      button.setAttribute('role', 'tab'); button.setAttribute('aria-controls', 'uci-panel-' + group.id);
      button.setAttribute('aria-selected', 'false'); button.tabIndex = 0;
      button.append(el('span', '', group.title), el('span', 'uci-tab-count', group.note));
      const panel = el('section', 'uci-panel'); panel.id = 'uci-panel-' + group.id;
      panel.setAttribute('role', 'tabpanel'); panel.setAttribute('aria-labelledby', button.id); panel.hidden = true;
      UCI.subtypes.filter(function (subtype) { return subtype.group === group.id; }).forEach(function (subtype) { panel.append(subtypeCard(subtype)); });
      buttons.push(button); panels.push(panel); tabs.append(button);
    });
    function select(index, focus) {
      buttons.forEach(function (button, i) { button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; panels[i].hidden = i !== index; });
      if (window.HubPages) window.HubPages.open(panels[index], groups[index].title, {kind: 'aba', key: panels[index].id});
      if (focus) buttons[index].focus();
    }
    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () { select(index, false); });
      button.addEventListener('keydown', function (event) {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 1;
        else return;
        event.preventDefault(); select(next, true);
      });
    });
    root.append(tabs, ...panels);
    const record = el('details', 'uci-preparation');
    record.append(el('summary', '', 'Modelo de registro do teste'));
    const recordBody = el('div', 'uci-prep-body');
    const template = el('pre', 'uci-template', UCI.reportTemplate);
    const copy = el('button', 'uci-link-button', 'Copiar modelo de laudo'); copy.type = 'button';
    const status = el('p', 'uci-copy-status'); status.setAttribute('role', 'status');
    copy.addEventListener('click', async function () {
      try { await navigator.clipboard.writeText(UCI.reportTemplate); status.textContent = 'Modelo copiado.'; }
      catch (_) {
        const range = document.createRange(); range.selectNodeContents(template);
        const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
        status.textContent = 'Modelo selecionado. Use a opção de copiar do seu dispositivo.';
      }
    });
    recordBody.append(template, copy, status); record.append(recordBody); root.append(record);
    const footer = el('footer', 'uci-footer');
    footer.append(el('p', '', 'Síntese clínica autoral a partir das fontes indicadas. As durações alternativas estão identificadas; resultados obtidos por métodos diferentes não são automaticamente equivalentes.'), el('p', 'uci-signature', 'Dr. Antônio Penido\nAlergia e Imunologia\nCRM-MG 59.766 | RQE 48.720'));
    root.append(footer);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render, { once: true });
  else render();
})();
