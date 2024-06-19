import express from "express";
import router from "./routes/router.js";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import expressFileUpload from "express-fileupload";
import methodOverride from "method-override";

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressFileUpload({
    limits: {
      fileSize: 4000000,
    },
    abortOnLimit: true,
    responseOnLimit: "File is too large",
  })
);
app.use(methodOverride("_method"));

//routes
app.use("/", router);

//motor de plantillas
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

//server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
