import userRouting from "./User";
import QuizRouting from "../routing/Quiz";

const importRoutings = (app: any) => {
  app.use("/api/auth", userRouting);
  app.use("/api/quiz", QuizRouting);
};

export default importRoutings;
