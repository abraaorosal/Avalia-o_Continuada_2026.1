# Avaliação Continuada 2026.1 | Consulta de Salas

Aplicação web estática para consulta de sala da **Avaliação Continuada 2026.1** da Estácio, pronta para publicação no GitHub Pages.

## Objetivo

Permitir que o aluno informe sua matrícula ou nome e descubra em qual sala realizará a prova, com interface responsiva, acessível e publicada sem backend.

## Como usar

1. Abra a aplicação em um navegador.
2. Digite a matrícula ou parte do nome do aluno.
3. Opcionalmente, selecione uma sala no filtro.
4. Clique em **Buscar** ou pressione **Enter**.
5. Consulte o card com nome, matrícula mascarada e sala.

## Estrutura do projeto

- `index.html`: página principal
- `styles.css`: estilos da interface
- `app.js`: lógica de carregamento e busca
- `data/alunos.json`: base sanitizada publicada
- `assets/logo-estacio.png`: logo usada no topo e no favicon
- `.nojekyll`: compatibilidade com GitHub Pages

## Base de alunos

A planilha original **não deve ser publicada**. O arquivo público usado pela aplicação é `data/alunos.json`, contendo apenas:

- `nome`
- `matricula`
- `sala`

Colunas sensíveis e desnecessárias foram descartadas.

## Relatório de salas

A planilha já continha a coluna `SALA`, então a distribuição não precisou ser recalculada. Quantidade de alunos por sala:

- `E101`: 128
- `E102`: 128
- `E103`: 129
- `E104`: 131

Total sanitizado: **516 alunos**.

## Como atualizar a base de alunos

1. Substitua a planilha local pela versão mais recente.
2. Gere novamente `data/alunos.json` mantendo apenas `nome`, `matricula` e `sala`.
3. Valide se as salas continuam corretas.
4. Teste a aplicação localmente antes de publicar.
5. Confirme que a planilha `.xlsx` continua ignorada pelo Git.

## Como publicar no GitHub Pages

1. Inicialize o repositório Git, se ainda não existir.
2. Faça o commit dos arquivos estáticos.
3. Envie para o branch `main`.
4. No GitHub, ative o **Pages** em `Settings > Pages`.
5. Selecione a origem em `Deploy from a branch`, branch `main`, pasta `/root`.

Como os assets usam caminhos relativos, a aplicação funciona corretamente no GitHub Pages.

## LGPD e dados mínimos

- A planilha Excel original deve permanecer fora do repositório público.
- O projeto publica apenas dados mínimos necessários para a consulta.
- A matrícula é mascarada na interface, exibindo somente os últimos 4 dígitos.
- Nenhum dado como CPF, telefone, e-mail ou endereço deve ser incluído no JSON final.
