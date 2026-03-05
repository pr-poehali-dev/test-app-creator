import { useState } from "react";
import Icon from "@/components/ui/icon";

type Category = "Общее";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: Category;
  questions: Question[];
  createdAt: Date;
}

interface HistoryEntry {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  date: Date;
  category: Category;
}

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Основы математики",
    description: "Проверьте базовые знания арифметики и алгебры",
    category: "Общее",
    createdAt: new Date("2026-02-20"),
    questions: [
      {
        id: "q1",
        text: "Чему равно 7 × 8?",
        answers: [
          { text: "54", isCorrect: false },
          { text: "56", isCorrect: true },
          { text: "64", isCorrect: false },
          { text: "48", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Что такое квадратный корень из 144?",
        answers: [
          { text: "11", isCorrect: false },
          { text: "14", isCorrect: false },
          { text: "12", isCorrect: true },
          { text: "13", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "Сколько будет 15% от 200?",
        answers: [
          { text: "25", isCorrect: false },
          { text: "30", isCorrect: true },
          { text: "35", isCorrect: false },
          { text: "20", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "История России",
    description: "Ключевые события и даты отечественной истории",
    category: "Общее",
    createdAt: new Date("2026-02-25"),
    questions: [
      {
        id: "q1",
        text: "В каком году произошла Куликовская битва?",
        answers: [
          { text: "1380", isCorrect: true },
          { text: "1480", isCorrect: false },
          { text: "1240", isCorrect: false },
          { text: "1410", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Кто основал Санкт-Петербург?",
        answers: [
          { text: "Иван Грозный", isCorrect: false },
          { text: "Екатерина II", isCorrect: false },
          { text: "Пётр I", isCorrect: true },
          { text: "Александр I", isCorrect: false },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Элементы периодической таблицы",
    description: "Символы и свойства химических элементов",
    category: "Общее",
    createdAt: new Date("2026-03-01"),
    questions: [
      {
        id: "q1",
        text: "Какой символ у золота?",
        answers: [
          { text: "Go", isCorrect: false },
          { text: "Gd", isCorrect: false },
          { text: "Au", isCorrect: true },
          { text: "Ag", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Атомный номер кислорода?",
        answers: [
          { text: "6", isCorrect: false },
          { text: "8", isCorrect: true },
          { text: "16", isCorrect: false },
          { text: "7", isCorrect: false },
        ],
      },
    ],
  },
];

const INITIAL_HISTORY: HistoryEntry[] = [
  {
    id: "h1",
    quizId: "1",
    quizTitle: "Основы математики",
    score: 2,
    total: 3,
    date: new Date("2026-03-03"),
    category: "Математика",
  },
  {
    id: "h2",
    quizId: "3",
    quizTitle: "Элементы периодической таблицы",
    score: 2,
    total: 2,
    date: new Date("2026-03-04"),
    category: "Общее",
  },
];

type Page = "tests" | "editor" | "history" | "settings" | "quiz" | "results";

export default function Index() {
  const [page, setPage] = useState<Page>("tests");
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [filterCategory] = useState<Category | "Все">("Все");

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editorTitle, setEditorTitle] = useState("");
  const [editorDesc, setEditorDesc] = useState("");
  const [editorCategory] = useState<Category>("Общее");
  const [editorQuestions, setEditorQuestions] = useState<Question[]>([]);

  const [userName, setUserName] = useState("Пользователь");
  const [userEmail, setUserEmail] = useState("user@example.com");

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setPage("quiz");
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (activeQuiz?.questions[currentQ].answers[idx].isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    const isLastQuestion = currentQ + 1 >= activeQuiz.questions.length;
    const currentCorrect = activeQuiz.questions[currentQ].answers[selectedAnswer!]?.isCorrect;
    const finalScore = currentCorrect ? score + 1 : score;

    if (!isLastQuestion) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        score: finalScore,
        total: activeQuiz.questions.length,
        date: new Date(),
        category: activeQuiz.category,
      };
      setHistory((h) => [entry, ...h]);
      setScore(finalScore);
      setPage("results");
    }
  };

  const openEditor = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setEditorTitle(quiz.title);
      setEditorDesc(quiz.description);
      setEditorQuestions(JSON.parse(JSON.stringify(quiz.questions)));
    } else {
      setEditingQuiz(null);
      setEditorTitle("");
      setEditorDesc("");
      setEditorQuestions([]);
    }
    setPage("editor");
  };

  const addQuestion = () => {
    setEditorQuestions((q) => [
      ...q,
      {
        id: Date.now().toString(),
        text: "",
        answers: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const updateQuestion = (qIdx: number, text: string) => {
    setEditorQuestions((qs) =>
      qs.map((q, i) => (i === qIdx ? { ...q, text } : q))
    );
  };

  const updateAnswer = (qIdx: number, aIdx: number, text: string) => {
    setEditorQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, answers: q.answers.map((a, j) => (j === aIdx ? { ...a, text } : a)) }
          : q
      )
    );
  };

  const setCorrectAnswer = (qIdx: number, aIdx: number) => {
    setEditorQuestions((qs) =>
      qs.map((q, i) =>
        i === qIdx
          ? { ...q, answers: q.answers.map((a, j) => ({ ...a, isCorrect: j === aIdx })) }
          : q
      )
    );
  };

  const removeQuestion = (qIdx: number) => {
    setEditorQuestions((qs) => qs.filter((_, i) => i !== qIdx));
  };

  const saveQuiz = () => {
    if (!editorTitle.trim()) return;
    if (editingQuiz) {
      setQuizzes((qs) =>
        qs.map((q) =>
          q.id === editingQuiz.id
            ? { ...q, title: editorTitle, description: editorDesc, category: editorCategory, questions: editorQuestions }
            : q
        )
      );
    } else {
      const newQuiz: Quiz = {
        id: Date.now().toString(),
        title: editorTitle,
        description: editorDesc,
        category: editorCategory,
        questions: editorQuestions,
        createdAt: new Date(),
      };
      setQuizzes((qs) => [...qs, newQuiz]);
    }
    setPage("tests");
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((qs) => qs.filter((q) => q.id !== id));
  };

  const filteredQuizzes =
    filterCategory === "Все"
      ? quizzes
      : quizzes.filter((q) => q.category === filterCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {page !== "quiz" && page !== "results" && (
        <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm tracking-tight">Тесты</span>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { id: "tests", label: "Тесты", icon: "LayoutGrid" },
              { id: "editor", label: "Создать", icon: "PenLine" },
              { id: "history", label: "История", icon: "Clock" },
              { id: "settings", label: "Профиль", icon: "User" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.id === "editor" ? openEditor() : setPage(item.id as Page)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  page === item.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon name={item.icon} size={13} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </header>
      )}

      <main className="flex-1">
        {/* TESTS PAGE */}
        {page === "tests" && (
          <div className="max-w-3xl mx-auto px-6 py-10">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-display text-4xl text-gray-900 mb-1 italic">Доступные тесты</h1>
              <p className="text-gray-400 text-sm">{quizzes.length} тестов в библиотеке</p>
            </div>

            <div className="space-y-3">
              {filteredQuizzes.map((quiz, i) => (
                <div
                  key={quiz.id}
                  className="group border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${i * 0.06}s`, opacity: 0, animationFillMode: "forwards" }}
                  onClick={() => startQuiz(quiz)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">{quiz.questions.length} вопросов</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1">{quiz.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-1">{quiz.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditor(quiz); }}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        <Icon name="Pencil" size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                      <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-gray-900 flex items-center justify-center transition-all">
                        <Icon name="ChevronRight" size={13} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredQuizzes.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Нет тестов в этой категории</p>
                </div>
              )}
            </div>

            <button
              onClick={() => openEditor()}
              className="mt-8 w-full border border-dashed border-gray-200 rounded-2xl py-4 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={15} />
              Создать новый тест
            </button>
          </div>
        )}

        {/* QUIZ PAGE */}
        {page === "quiz" && activeQuiz && (
          <div className="min-h-screen flex flex-col">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-4">
              <button
                onClick={() => setPage("tests")}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all"
              >
                <Icon name="ArrowLeft" size={16} />
              </button>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-0.5">{activeQuiz.title}</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-900 rounded-full transition-all duration-500"
                      style={{ width: `${(currentQ / activeQuiz.questions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{currentQ + 1} / {activeQuiz.questions.length}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-start justify-center px-6 py-12">
              <div className="w-full max-w-lg animate-scale-in">
                <div className="mb-8">
                  <div className="text-xs text-gray-400 mb-3">Вопрос {currentQ + 1}</div>
                  <h2 className="font-display text-3xl text-gray-900 leading-snug italic">
                    {activeQuiz.questions[currentQ].text}
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {activeQuiz.questions[currentQ].answers.map((answer, idx) => {
                    let cls = "border-gray-100 bg-white text-gray-700 hover:border-gray-300";
                    if (answered) {
                      if (answer.isCorrect) {
                        cls = "border-green-200 bg-green-50 text-green-800";
                      } else if (selectedAnswer === idx && !answer.isCorrect) {
                        cls = "border-red-200 bg-red-50 text-red-700";
                      } else {
                        cls = "border-gray-100 bg-gray-50 text-gray-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full text-left px-5 py-4 rounded-xl border font-medium text-sm transition-all flex items-center gap-3 ${cls} ${!answered ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-semibold transition-all ${
                          answered && answer.isCorrect
                            ? "border-green-400 bg-green-400 text-white"
                            : answered && selectedAnswer === idx && !answer.isCorrect
                            ? "border-red-400 bg-red-400 text-white"
                            : "border-gray-200 text-gray-400"
                        }`}>
                          {answered && answer.isCorrect
                            ? <Icon name="Check" size={12} />
                            : answered && selectedAnswer === idx && !answer.isCorrect
                            ? <Icon name="X" size={12} />
                            : ["А", "Б", "В", "Г"][idx]}
                        </span>
                        {answer.text}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="mt-6 animate-fade-in">
                    <button
                      onClick={nextQuestion}
                      className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-medium text-sm hover:bg-gray-700 transition-all"
                    >
                      {currentQ + 1 < activeQuiz.questions.length ? "Следующий вопрос" : "Завершить тест"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS PAGE */}
        {page === "results" && activeQuiz && (
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-sm animate-scale-in">
              <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 border border-gray-100">
                <span className="font-display text-3xl text-gray-900 italic">
                  {score}/{activeQuiz.questions.length}
                </span>
              </div>
              <h2 className="font-display text-4xl text-gray-900 italic mb-2">
                {score === activeQuiz.questions.length
                  ? "Отлично!"
                  : score >= activeQuiz.questions.length / 2
                  ? "Хороший результат"
                  : "Попробуй снова"}
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Правильных ответов: {score} из {activeQuiz.questions.length}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium text-sm hover:border-gray-400 transition-all"
                >
                  Пройти снова
                </button>
                <button
                  onClick={() => setPage("tests")}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-all"
                >
                  К тестам
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDITOR PAGE */}
        {page === "editor" && (
          <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <button
                onClick={() => setPage("tests")}
                className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-all"
              >
                <Icon name="ArrowLeft" size={16} />
              </button>
              <h1 className="font-display text-3xl text-gray-900 italic">
                {editingQuiz ? "Редактировать тест" : "Новый тест"}
              </h1>
            </div>

            <div className="space-y-5 animate-fade-in stagger-1">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Название теста</label>
                <input
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Например: Основы физики"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Описание</label>
                <input
                  value={editorDesc}
                  onChange={(e) => setEditorDesc(e.target.value)}
                  placeholder="Краткое описание теста"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-all"
                />
              </div>

            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm">Вопросы</h2>
                <span className="text-xs text-gray-400">{editorQuestions.length} вопросов</span>
              </div>

              {editorQuestions.map((q, qIdx) => (
                <div key={q.id} className="border border-gray-100 rounded-2xl p-5 animate-fade-in">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-xs font-medium text-gray-400 mt-2 shrink-0">#{qIdx + 1}</span>
                    <input
                      value={q.text}
                      onChange={(e) => updateQuestion(qIdx, e.target.value)}
                      placeholder="Текст вопроса"
                      className="flex-1 text-sm text-gray-900 placeholder-gray-300 focus:outline-none border-b border-gray-100 pb-2 focus:border-gray-300 transition-all bg-transparent"
                    />
                    <button
                      onClick={() => removeQuestion(qIdx)}
                      className="p-1 rounded-lg text-gray-300 hover:text-red-400 transition-all mt-1"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>

                  <div className="space-y-2.5 ml-6">
                    {q.answers.map((answer, aIdx) => (
                      <div key={aIdx} className="flex items-center gap-2">
                        <button
                          onClick={() => setCorrectAnswer(qIdx, aIdx)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            answer.isCorrect
                              ? "border-green-400 bg-green-400"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          {answer.isCorrect && <Icon name="Check" size={10} className="text-white" />}
                        </button>
                        <input
                          value={answer.text}
                          onChange={(e) => updateAnswer(qIdx, aIdx, e.target.value)}
                          placeholder={`Вариант ${["А", "Б", "В", "Г"][aIdx]}`}
                          className="flex-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none border-b border-gray-100 pb-1 focus:border-gray-300 transition-all bg-transparent"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 mt-3 ml-6">Нажмите кружок, чтобы отметить правильный ответ</p>
                </div>
              ))}

              <button
                onClick={addQuestion}
                className="w-full border border-dashed border-gray-200 rounded-2xl py-3.5 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <Icon name="Plus" size={14} />
                Добавить вопрос
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setPage("tests")}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm hover:border-gray-400 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={saveQuiz}
                disabled={!editorTitle.trim()}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {editingQuiz ? "Сохранить" : "Создать тест"}
              </button>
            </div>
          </div>
        )}

        {/* HISTORY PAGE */}
        {page === "history" && (
          <div className="max-w-2xl mx-auto px-6 py-10">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-display text-4xl text-gray-900 italic mb-1">История</h1>
              <p className="text-gray-400 text-sm">{history.length} пройденных тестов</p>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Icon name="Clock" size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Вы ещё не проходили тесты</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, i) => {
                  const pct = Math.round((entry.score / entry.total) * 100);
                  return (
                    <div
                      key={entry.id}
                      className="border border-gray-100 rounded-2xl p-5 animate-slide-up"
                      style={{ animationDelay: `${i * 0.05}s`, opacity: 0, animationFillMode: "forwards" }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{entry.quizTitle}</h3>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${pct === 100 ? "text-green-600" : pct >= 50 ? "text-gray-900" : "text-red-500"}`}>
                            {pct}%
                          </div>
                          <div className="text-xs text-gray-400">{entry.score}/{entry.total}</div>
                        </div>
                      </div>
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct === 100 ? "bg-green-500" : pct >= 50 ? "bg-gray-900" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-300 mt-2">
                        {entry.date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS PAGE */}
        {page === "settings" && (
          <div className="max-w-lg mx-auto px-6 py-10">
            <div className="mb-8 animate-fade-in">
              <h1 className="font-display text-4xl text-gray-900 italic mb-1">Профиль</h1>
              <p className="text-gray-400 text-sm">Настройки аккаунта</p>
            </div>

            <div className="space-y-5 animate-fade-in stagger-1">
              <div className="flex items-center gap-4 p-5 border border-gray-100 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-lg">{userName[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{userName}</div>
                  <div className="text-xs text-gray-400">{userEmail}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Имя</label>
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Email</label>
                <input
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-all"
                />
              </div>

              <div className="border border-gray-100 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Статистика</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-display text-3xl text-gray-900 italic">{history.length}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Пройдено</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-gray-900 italic">{quizzes.length}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Тестов</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-gray-900 italic">
                      {history.length > 0
                        ? Math.round(history.reduce((acc, h) => acc + h.score / h.total, 0) / history.length * 100)
                        : 0}%
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">Успех</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-700 transition-all">
                Сохранить изменения
              </button>

              <button
                onClick={() => setHistory([])}
                className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl font-medium text-sm hover:border-red-200 hover:text-red-500 transition-all"
              >
                Очистить историю
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}