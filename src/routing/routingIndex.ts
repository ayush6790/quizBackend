import userRouting from "./User";

const importRoutings = (app: any) => {
app.use("/api/auth", userRouting);
};

export default importRoutings;
