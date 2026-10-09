-- Dados de exemplo para testar a API.
-- Execute depois de schema.sql, conectado ao banco eevee.

INSERT INTO times (nome)
VALUES ('Flamengo (teste API)'), ('Fluminense (teste API)')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO estadios (nome)
VALUES ('Estadio de Teste API')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO jogadores (nome, data_nascimento, posicao, time_id)
SELECT 'Jogador Teste Flamengo', DATE '2000-01-15', 'Atacante', t.id
FROM times AS t
WHERE t.nome = 'Flamengo (teste API)'
  AND NOT EXISTS (
      SELECT 1
      FROM jogadores AS j
      WHERE j.nome = 'Jogador Teste Flamengo'
        AND j.time_id = t.id
  );

INSERT INTO jogadores (nome, data_nascimento, posicao, time_id)
SELECT 'Jogador Teste Fluminense', DATE '2001-06-20', 'Meio-campo', t.id
FROM times AS t
WHERE t.nome = 'Fluminense (teste API)'
  AND NOT EXISTS (
      SELECT 1
      FROM jogadores AS j
      WHERE j.nome = 'Jogador Teste Fluminense'
        AND j.time_id = t.id
  );

INSERT INTO jogos (mandante, visitante, estadio_id, data_hora)
SELECT mandante.id, visitante.id, e.id, TIMESTAMPTZ '2027-05-22 16:00:00-03'
FROM times AS mandante
CROSS JOIN times AS visitante
CROSS JOIN estadios AS e
WHERE mandante.nome = 'Flamengo (teste API)'
  AND visitante.nome = 'Fluminense (teste API)'
  AND e.nome = 'Estadio de Teste API'
ON CONFLICT (estadio_id, data_hora) DO NOTHING;
