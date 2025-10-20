import lume from "lume/mod.ts";
import base_path from "lume/plugins/base_path.ts";
import date from "lume/plugins/date.ts";

const site = lume({
  server: {
    debugBar: false, // disable the debug bar
  },
  src: "./src",
});

site.copy("assets");
site.copy("ultra3");
site.copy("sineswarm");

site.use(base_path());
site.use(date());

export default site;
