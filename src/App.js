import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [quizList, setQuizList] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);
  const [rating, setRating] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuiz, setNewQuiz] = useState([]);
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [quizId, setQuizId] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    quizList[currentQuiz].points = 0;

    for (let i = 0; i < quizList[currentQuiz].content.length; i++) {
      if (answers[i] === quizList[currentQuiz].content[i].answer) {
        quizList[currentQuiz].points += 1;
      }
    }

    setIsSubmited(true);

    setRating(quizList[currentQuiz].points)
  }

  const handleClose = () => {
    setIsSubmited(false);
    setCurrentQuiz(null);
    setIsCreating(false);
    setNewQuiz([]);
    setNewName("");
  }

  const handleChoose = (index) => {
    setCurrentQuiz(index); setIsSubmited(false); setAnswers({})
  }

  const handleChangeQuiz = (questionIndex, event, type, optionIndex) => {
    const updatedQuiz = [...newQuiz];

    if (type === "question") {
      updatedQuiz[questionIndex].question = event.target.value;
    } else if (type === "options") {
      updatedQuiz[questionIndex].options[optionIndex] = event.target.value;
    } else if (type === "option") {
      updatedQuiz[questionIndex].options.push(event);
    } else if (type === "removeOption") {
      updatedQuiz[questionIndex].options.splice(optionIndex, 1)
    } else if (type === "removeQuestion") {
      updatedQuiz.splice(questionIndex, 1)
    } else if (type === "answer") {
      updatedQuiz[questionIndex].answer = event;
    }

    setNewQuiz([...updatedQuiz])
  }

  const handleCreate = (event) => {
    event.preventDefault();

    const createdQuiz = {name: newName, points: 0, content: [...newQuiz]};

    if(!isEditing) {
      setQuizList([...quizList, createdQuiz]);

      localStorage.setItem("quizList", JSON.stringify([...quizList, createdQuiz]));
    } else {
      const updatedQuizList = [...quizList];
      updatedQuizList.splice(quizId, 1, createdQuiz);
      setQuizList([...updatedQuizList]);

      localStorage.setItem("quizList", JSON.stringify([...updatedQuizList]));
    }

    setIsCreating(false);
    setQuizId(null);
  }

  const handleDelete = (index) => {
    const updatedQuizList = [...quizList];
    updatedQuizList.splice(index, 1);

    setQuizList([...updatedQuizList]);

    localStorage.setItem("quizList", JSON.stringify([...updatedQuizList]));
  }

  const handleEdit = (quiz, id) => {
    setNewName(quiz.name);
    setNewQuiz(quiz.content);
    setIsCreating(true);
    setIsEditing(true);
    setQuizId(id)
  }

  useEffect(() => {
    const savedQuizList = JSON.parse(localStorage.getItem("quizList"));

    if (!!savedQuizList) {
      setQuizList([...savedQuizList]);
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-orange-200">
      <header className="flex justify-center items-center h-24 bg-orange-300">
        <h1 className="font-bold text-4xl">
          Quiz Selection
        </h1>
      </header>

      {currentQuiz === null && !isCreating &&
        <div className="mx-14 my-10 p-5 bg-orange-100 rounded-md">
          <ul className="flex flex-col gap-3">
            {quizList.map((quiz, index) => 
              <li className="flex justify-between rounded-md" key={index}>
                <button
                  className="flex justify-between items-center px-3 w-10/12 h-12 bg-orange-200 rounded-md hover:bg-orange-300 transition-all"
                  onClick={() => handleChoose(index)}
                >
                  <span>
                    {quiz.name} Questions: {quiz.content.length}
                  </span>

                  <span>
                    Last Results: {quiz.points} / {quiz.content.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(quiz, index)}
                  className="px-8 h-12 bg-orange-300 rounded-md hover:bg-orange-400 transition-all"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="px-4 h-12 bg-red-500 rounded-md hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </li>
            )}

            <li>
              <button
                className="flex items-center px-3 h-12 w-full bg-orange-200 rounded-md hover:bg-orange-300 transition-all"
                onClick={() => setIsCreating(true)}
              >
                Create a quiz
              </button>
            </li>
          </ul>
        </div>
      }

      {currentQuiz !== null &&
        <div className="mx-auto my-10 px-8 py-6 w-3/4 bg-orange-100 rounded-2xl">
          <h3 className="font-bold mb-8 text-3xl">
            {quizList[currentQuiz].name}
          </h3>

          <form onSubmit={handleSubmit}>
            {quizList[currentQuiz].content.map((element, elementIndex) =>
              <div key={quizList[currentQuiz].name + "_" + elementIndex}>
                <span className="text-2xl">
                  {element.question}
                </span>

                <ul>
                  {element.options.map((option, optionIndex) => 
                    <li key={"option_" + quizList[currentQuiz].name + "_" + optionIndex}>
                      <label className="flex items-center gap-4 px-2 text-xl rounded-md cursor-pointer hover:bg-orange-200 transition-all">
                        <input
                          type="radio"
                          value={option}
                          name={"question_" + quizList[currentQuiz].name + "_" + elementIndex}
                          onClick={() => setAnswers({...answers, [elementIndex]: optionIndex})}
                          className="w-4 h-4"
                        />
                        {option}
                      </label>
                    </li>
                  )}
                </ul>
              </div>
            )}
            <div className="flex justify-evenly items-center my-4">
              {!isSubmited &&
                <button
                  className="w-24 h-10 bg-lime-500 rounded-xl hover:bg-lime-600 transition-all"
                  type="submit"
                >
                  Submit
                </button>
              }

              {isSubmited &&
                <h3 className="text-4xl">
                  Results: {rating} / {quizList[currentQuiz].content.length}
                </h3>
              }

              <button
                className={`w-24 h-10 ${isSubmited ? 'bg-lime-500 hover:bg-lime-600' : 'bg-red-500 hover:bg-red-600'} rounded-xl transition-all`}
                onClick={handleClose}
              >
                {isSubmited ? "Close" : "Cancel"}
              </button>
            </div>
          </form>
        </div>
      }

      {isCreating && 
        <form
          className="mx-auto my-10 px-8 py-6 w-3/4 bg-orange-100 text-xl rounded-2xl"
          onSubmit={handleCreate}
        >
          Name:
          <input
            type="text"
            value={newName}
            onChange={(event) => {setNewName(event.target.value)}}
            required
            className="p-4 w-full h-10 border-2 border-orange-400 rounded-lg"
          />

          {newQuiz.map((question, questionIndex) => 
            <div key={questionIndex}>
              <span className="font-bold">
                Question {questionIndex + 1}:
              </span>

              <span className="flex justify-between">
                <input
                  type="text"
                  value={question.question}
                  onChange={(event) => handleChangeQuiz(questionIndex, event, "question")}
                  required
                  className="p-4 w-10/12 h-10 border-2 border-orange-400 rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => handleChangeQuiz(questionIndex, "", "removeQuestion")}
                  className="px-4 h-10 bg-red-500 rounded-md hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </span>
              

              {question.options.map((option, optionIndex) => 
                <div key={optionIndex}>
                  <label className="flex items-center my-2 p-2 w-10/12 cursor-pointer hover:bg-orange-200 rounded-lg">
                    <input
                      type="radio"
                      name={questionIndex}
                      required
                      onChange={() => handleChangeQuiz(questionIndex, optionIndex, "answer")}
                      checked={question.answer === optionIndex}
                      className="mr-4 w-6 h-6"
                    />

                    Option {optionIndex + 1}:
                  </label>

                  <span className="flex justify-between">
                    <input
                      type="text"
                      value={option}
                      onChange={(event) => handleChangeQuiz(questionIndex, event, "options", optionIndex)}
                      required
                      className="p-4 w-10/12 h-10 border-2 border-orange-400 rounded-lg"
                    />

                    <button
                      type="button"
                      onClick={() => handleChangeQuiz(questionIndex, "", "removeOption", optionIndex)}
                      disabled={!(question.options.length - 1) ? true : false}
                      className="px-4 h-10 bg-red-500 rounded-md hover:bg-red-600 transition-all"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleChangeQuiz(questionIndex, "", "option")}
                className="my-4 px-3 w-10/12 h-12 bg-orange-200 rounded-md hover:bg-orange-300 transition-all"
              >
                Add a new option
              </button>
            </div>
          )}
          <button
            type="button"
            className="my-4 px-3 w-full h-12 bg-orange-200 rounded-md hover:bg-orange-300 transition-all"
            onClick={() => setNewQuiz([...newQuiz, {question: "", answer: "", options: [""]}])}
          >
            Add a new question
          </button>

          <span className="flex justify-evenly w-full">
            <button
              type="submit"
              className="px-3 h-12 bg-lime-500 rounded-md hover:bg-lime-600 transition-all"
            >
              {isEditing ? "Save" : "Create"}
            </button>

            <button
              type="button"
              className="px-3 h-12 bg-red-500 rounded-md hover:bg-red-600 transition-all" onClick={() => handleClose()}
            >
              Cancel
            </button>
          </span>
        </form>
      }
    </div>
  );
}

export default App;
