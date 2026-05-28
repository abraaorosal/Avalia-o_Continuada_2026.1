const DATA_URL = "./data/alunos.json";

const state = {
  students: [],
  isLoading: true,
  hasError: false,
};

const elements = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#search-input"),
  filter: document.querySelector("#room-filter"),
  clearButton: document.querySelector("#clear-button"),
  feedback: document.querySelector("#search-feedback"),
  results: document.querySelector("#results-container"),
};

function normalizeText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMatricula(value = "") {
  return value.replace(/\D/g, "");
}

function maskMatricula(matricula = "") {
  const digits = normalizeMatricula(matricula);
  const suffix = digits.slice(-4);
  return `********${suffix}`;
}

function formatName(name = "") {
  const lowerCaseWords = new Set(["da", "de", "do", "das", "dos", "e"]);

  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && lowerCaseWords.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

async function loadData() {
  state.isLoading = true;
  state.hasError = false;
  renderLoadingState();

  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Falha ao carregar a base (${response.status})`);
    }

    const data = await response.json();

    state.students = Array.isArray(data) ? data : [];
    state.isLoading = false;
    renderEmptyState();
  } catch (error) {
    state.isLoading = false;
    state.hasError = true;
    renderErrorState();
  }
}

function searchStudent(query, roomFilter) {
  const normalizedQuery = normalizeText(query);
  const normalizedRoom = roomFilter === "Todas" ? "" : roomFilter;
  const digitsQuery = normalizeMatricula(query);
  const hasLetters = /[a-z]/.test(normalizedQuery);

  if (!normalizedQuery) {
    return {
      type: "validation",
      message: "Digite uma matrícula ou nome para realizar a busca.",
      results: [],
    };
  }

  let matches = [];

  if (hasLetters) {
    if (normalizedQuery.length < 3) {
      return {
        type: "validation",
        message: "Para buscar por nome, informe pelo menos 3 caracteres.",
        results: [],
      };
    }

    matches = state.students.filter((student) => {
      const roomMatches = !normalizedRoom || student.sala === normalizedRoom;
      return roomMatches && normalizeText(student.nome).includes(normalizedQuery);
    });
  } else {
    matches = state.students.filter((student) => {
      const roomMatches = !normalizedRoom || student.sala === normalizedRoom;
      return roomMatches && normalizeMatricula(student.matricula) === digitsQuery;
    });
  }

  matches.sort((first, second) => first.nome.localeCompare(second.nome, "pt-BR"));

  return {
    type: matches.length > 0 ? "success" : "not-found",
    message:
      matches.length > 0
        ? `${matches.length} resultado${matches.length > 1 ? "s" : ""} encontrado${
            matches.length > 1 ? "s" : ""
          }.`
        : "Aluno não localizado. Verifique se a matrícula ou o nome foram digitados corretamente.",
    results: matches,
  };
}

function renderResults(results) {
  elements.results.innerHTML = "";

  if (!results.length) {
    return;
  }

  const fragment = document.createDocumentFragment();

  results.forEach((student) => {
    const article = document.createElement("article");
    article.className = "result-card";

    const title = document.createElement("h3");
    title.textContent = formatName(student.nome);

    const meta = document.createElement("div");
    meta.className = "result-card__meta";

    const matriculaBadge = document.createElement("span");
    matriculaBadge.className = "badge";
    matriculaBadge.innerHTML = `<strong>Matrícula:</strong> ${maskMatricula(student.matricula)}`;

    const roomBadge = document.createElement("span");
    roomBadge.className = "badge badge--room";
    roomBadge.innerHTML = `<strong>Sala:</strong> ${student.sala}`;

    const hint = document.createElement("p");
    hint.className = "result-card__hint";
    hint.textContent =
      "Compareça com antecedência e leve documento oficial com foto.";

    meta.append(matriculaBadge, roomBadge);
    article.append(title, meta, hint);
    fragment.appendChild(article);
  });

  elements.results.appendChild(fragment);
}

function renderEmptyState(feedbackMessage) {
  elements.feedback.textContent =
    feedbackMessage ||
    (state.isLoading
      ? "Carregando base de alunos..."
      : "A base foi carregada. Faça sua busca para visualizar o resultado.");
  elements.results.innerHTML = `
    <div class="state-card">
      <h3>Pronto para consultar</h3>
      <p>Digite sua matrícula ou nome e use o filtro de sala, se necessário.</p>
    </div>
  `;
}

function renderLoadingState() {
  elements.feedback.textContent = "Carregando base de alunos...";
  elements.results.innerHTML = `
    <div class="state-card">
      <h3>Carregando dados</h3>
      <p>Estamos preparando a consulta. Aguarde alguns instantes.</p>
    </div>
  `;
}

function renderErrorState() {
  elements.feedback.textContent = "Não foi possível carregar a base de alunos.";
  elements.results.innerHTML = `
    <div class="state-card">
      <h3>Erro ao carregar</h3>
      <p>Não foi possível carregar o arquivo de dados. Verifique se o projeto está sendo executado em um servidor local ou no GitHub Pages.</p>
    </div>
  `;
}

function handleSearch(event) {
  event.preventDefault();

  if (state.isLoading || state.hasError) {
    return;
  }

  const query = elements.input.value;
  const room = elements.filter.value;
  const search = searchStudent(query, room);

  elements.feedback.textContent = search.message;

  if (search.type === "success") {
    renderResults(search.results);
    return;
  }

  if (search.type === "validation" || search.type === "not-found") {
    elements.results.innerHTML = `
      <div class="state-card">
        <h3>${search.type === "validation" ? "Busca incompleta" : "Aluno não localizado"}</h3>
        <p>${search.message}</p>
      </div>
    `;
  }
}

function clearSearch() {
  elements.form.reset();
  renderEmptyState("Busca limpa. Faça uma nova consulta.");
  elements.input.focus();
}

function bindEvents() {
  elements.form.addEventListener("submit", handleSearch);
  elements.clearButton.addEventListener("click", clearSearch);
}

bindEvents();
loadData();
